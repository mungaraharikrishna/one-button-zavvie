import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  @Output() showLogin:any = new EventEmitter<any>();
  @Output() sendForgotPassword: any = new EventEmitter<any>();
  @Output() loginSuccess:any = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    private data: LoginDataService,
    private apiService: LoginApiService) { }

  waiting_for_response:boolean = false;
  form_submitted:boolean = false;
  logo:string = this.data.getData('logo');
  forgotPasswordError = '';
  persona:string = 'agent';

  // https://stackoverflow.com/questions/48350506/how-to-validate-password-strength-with-angular-5-validator-pattern
  // TODO: Might refactor these custom validators into a service instead of component.
  atLeastOneLetter(control: AbstractControl): ValidationErrors | null {
    return /^(?=[^A-Za-z]*[A-Za-z]).*$/.test(control.value)
      ? null
      : { noLetter: { value: control.value }};
  }

  atLeastOneDigit(control: AbstractControl): ValidationErrors | null {
    return /^(?=[^\d]*\d).*$/.test(control.value)
      ? null
      : { noDigit: { value: control.value }};
  }

  atLeastSpecialCharacter(control: AbstractControl): ValidationErrors | null {
    return /^(?=[\w]*[^\w]).*$/.test(control.value)
      ? null
      : { noSpecialCharacter: { value: control.value }};
  }

  signupForm = this.fb.group({
    FirstName: ['', [Validators.required, Validators.minLength(1)]],
    LastName: ['', [Validators.required, Validators.minLength(1)]],
    PhoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    MLS_ID: [''],
    NMLS_ID: [''],
    EmailAddress: ['', [Validators.required, Validators.email, Validators.pattern(this.data.emailRegexp())]],
    Password: ['', [
      Validators.required,
      Validators.minLength(8),
      this.atLeastOneLetter,
      this.atLeastOneDigit,
      this.atLeastSpecialCharacter
    ]],
    AgreeTerms: ['', [Validators.required]]
  });

  get Password(): AbstractControl | null {
    return this.signupForm.get('Password');
  }

  resetSignupForm(): void {
    this.form_submitted = false;
    this.signupResponseError = false;
  }

  showLoginForm(): void {
    this.showLogin.emit();
  }

  async sendTemporaryPassword(): Promise<void> {
    this.forgotPasswordError = '';
    this.waiting_for_response = true;
    // ## Trigger forgot password
    const forgotPasswordResult = await this.apiService.forgotPassword(this.signupForm.value.EmailAddress);
    const forgotPasswordCode = forgotPasswordResult.status;
    const forgotPasswordBody = await forgotPasswordResult.json();
    switch (('' + forgotPasswordCode)[0]) {
      case '2': // 200's
        // success response
        break;
      case '4': // 400's
        this.forgotPasswordError = forgotPasswordBody.message
          ? `We tried sending a temporary password and encountered the following error:` + forgotPasswordBody.message
          : `We tried sending a temporary password and encountered an error.`;
        break;
      case '5': // 500's
        this.forgotPasswordError = `We tried sending a temporary password and encountered a server error.`;
        break;
      default:
        // assume failure
        this.forgotPasswordError = `We tried sending a temporary password and encountered an unexpected error.`;
    }
    // ## End Trigger forgot password

    this.waiting_for_response = false;
    if (!this.forgotPasswordError) {
      this.data.setData('EmailAddress', this.signupForm.value.EmailAddress);
      this.sendForgotPassword.emit();
    }
  }

  personaForm = this.fb.group({
    persona: ['']
  });

  agentPersonaEl:any;
  loanOfficerPersonaEl:any;
  togglePersona = (persona:string) => {
    this.persona = persona;
    this.personaForm.setValue({ persona: this.persona });
    this.agentPersonaEl = document.getElementsByClassName('persona-agent')[0];
    this.loanOfficerPersonaEl = document.getElementsByClassName('persona-lo')[0];
    this.setSignupFieldValidation();
  }

  setSignupFieldValidation = () => {
    const NMLS_ID = this.signupForm.get('NMLS_ID');
    this.personaForm.get('persona')!.valueChanges.subscribe(persona => {
      if (persona == 'agent') {
        // persona === 'agent'
        NMLS_ID!.setValidators(null);
        this.loanOfficerPersonaEl.classList.remove('active');
        this.agentPersonaEl.classList.add('active');
      } else {
        // persona === 'loan-officer'
        NMLS_ID!.setValidators([Validators.required, Validators.minLength(1)]);
        this.agentPersonaEl.classList.remove('active');
        this.loanOfficerPersonaEl.classList.add('active');
      }
    });
    NMLS_ID!.updateValueAndValidity();
  }

  formValueChanged(name: string, e: any): void {
    let newval = e.target.value;
    if (name === 'PhoneNumber') {
      newval = newval.replace('(', '').replace(')', '').replace('-', '');
    }
    if (name === 'EmailAddress') {
      this.emailChecked = false;
      this.emailExistsCustomError = this.NO_CUSTOM_ERROR;
      this.checkEmailProblem = false;
      this.emailForbidden = false;
      this.waiting_for_email_check = true;
    }
    this.data.setData(name, newval);

    if (!this.emailChecked && this.signupForm.get('EmailAddress')!.valid) {
      this.waiting_for_email_check = true;
      const wait: ReturnType<typeof setTimeout> = setTimeout(() => this.checkEmail(), 2000 );
    }
  }

  findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.signupForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  signupResponse:any;
  showResponse = async (response:any) => {
    this.signupResponse = response;
    this.data.LoginUser(response.data); // Update the agent obj
    this.loginSuccess.emit('signup-form'); // Emit which success screen to show
    this.data.clearLoginModal(2000); // make modal go away after 2 secs
  }

  signupResponseError:boolean = false;
  showError(error:any) {
    this.signupResponseError = true;
    this.signupResponse = error;
  }

  NO_CUSTOM_ERROR = 0;
  EMAIL_EXISTS = 1;
  EMAIL_EXISTS_NO_PASSWORD = 2;
  emailExistsCustomError = this.NO_CUSTOM_ERROR;

  emailChecked:boolean = false;
  checkEmailProblem:any;
  emailForbidden:boolean = false;
  waiting_for_email_check:boolean = false;

  async checkEmail() {
    // Reset defaults
    this.emailExistsCustomError = this.NO_CUSTOM_ERROR;
    this.emailChecked = false;
    this.checkEmailProblem = '';
    this.waiting_for_email_check = true;
    this.forgotPasswordError = '';
    // Perform check-user API call
    const EmailAddress = this.data.getData('EmailAddress') || '';
    const result = await this.apiService.checkEmail(EmailAddress);
    const resultCode = result.status;
    const resultBody = await result.json().catch((e) => {
      return {};
    });
    switch (resultCode) {
      case 200: // email taken, password is set
        this.checkEmailProblem = ''; // use special error message with interactivity in template
        this.emailExistsCustomError = this.EMAIL_EXISTS;
        break;
      case 206: // email taken, missing password
        this.checkEmailProblem = ''; // use special error message with interactivity in template
        this.emailExistsCustomError = this.EMAIL_EXISTS_NO_PASSWORD;
        break;
      case 400: // bad request
        this.checkEmailProblem = resultBody?.message
          ?? 'There was an issue while requesting the email validation';
        break;
      case 403: // forbidden
        this.checkEmailProblem = 'This email address is associated with a different company';
        break;
      case 404: // email available
        // no action
        break;
      default: // unexpected response
        this.checkEmailProblem = 'An unexpected error occured while we were validating your email address. Sorry about that!';
    }
    this.emailChecked = true;
    this.waiting_for_email_check = false;
  }

  emailGood() {
    return this.emailChecked
      && this.signupForm.get('EmailAddress')?.valid
      && !this.waiting_for_email_check
      && !this.emailExistsCustomError
      && !this.checkEmailProblem
      && !this.emailForbidden;
  }

  showPassword: boolean = false;
  submitForm() {
    // reset defaults
    this.forgotPasswordError = '';
    if (this.signupForm.valid) {
      this.signupResponseError = false;
      this.form_submitted = true;
      this.waiting_for_response = true;
      this.apiService.sendSignupFormData().subscribe({
        next: (response) => ( this.showResponse(response), this.waiting_for_response = false ),
        error: (error) => ( this.showError(error), this.waiting_for_response = false )
      })
    } else {
      this.signupResponseError = true;
      this.signupResponse = {message: 'manual error', problem: 'Agree to zavvie\'s Terms to continue'};
      this.showError(this.signupResponse);
    }
  }

  ngOnInit(): void {
    // DEV DEV DEV
    // DEV DEV DEV
    // DEV DEV DEV
    // this.data.setData('FirstName', 'Robert');
    // this.data.setData('LastName', 'Jones');
    // this.data.setData('PhoneNumber', '3035550494'),
    // this.data.setData('MLS_ID', '12345_laksd');
    // this.data.setData('EmailAddress', 'robertjones001@aol.or');
    // this.data.setData('Password', 'pa$$w0rd');
    // DEV DEV DEV
    // DEV DEV DEV
    // DEV DEV DEV
    this.togglePersona('agent');
    this.setSignupFieldValidation();

    this.signupForm.patchValue({
      FirstName: this.data.getData('FirstName') || '',
      LastName: this.data.getData('LastName') || '',
      PhoneNumber: this.data.getData('PhoneNumber') || '',
      MLS_ID: this.data.getData('MLS_ID') || '',
      EmailAddress: this.data.getData('EmailAddress') || '',
      Password: this.data.getData('Password') || '',
    })
  }

}

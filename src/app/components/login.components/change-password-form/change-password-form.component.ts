import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { LoginDataService } from 'src/app/services/login-data.service';
import { LoginApiService } from 'src/app/services/login-api.service';

@Component({
  selector: 'change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent {

  @Input() isSubmitting = false;
  @Output() changePasswordSuccess: any = new EventEmitter<any>();
  @Output() showMyAccount: any = new EventEmitter<any>();
  @Output() continue: any = new EventEmitter<any>();

  showCurrentPassword = false;
  showNewPassword = false;
  errorMessage = '';
  showConfirmation = false;
  email:string = '';

  constructor(
    private fb: FormBuilder,
    public data: LoginDataService,
    private apiService: LoginApiService) {
    this.email = this.data.getData('EmailAddress');
  }

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

  changePasswordForm = this.fb.group({
    CurrentPassword: ['', [Validators.required]],
    NewPassword: ['', [
      Validators.required,
      Validators.minLength(8),
      this.atLeastOneLetter,
      this.atLeastOneDigit,
      this.atLeastSpecialCharacter
    ]]
  });

  get Password(): AbstractControl | null {
    return this.changePasswordForm.get('NewPassword');
  }

  async submitForm(): Promise<void> {
    this.isSubmitting = true;
    this.errorMessage = '';

    const value = this.changePasswordForm.value;
    const changePasswordResult = await this.apiService.changePassword(this.email, value.CurrentPassword, value.NewPassword);
    const changePasswordCode = changePasswordResult.status;
    const changePasswordBody = await changePasswordResult.json();
    switch (('' + changePasswordCode)[0]) {
      case '2': // 200's
        // success response
        break;
      case '4': // 400's
        // TODO: Should message contain some sort of "please contact customer service at xxx-xxx-xxxx"?
        this.errorMessage = changePasswordBody.message || 'An issue occurred trying to log in.';
        break;
      case '5': // 500's
        this.errorMessage = 'A server error occurred while trying to log in.';
        break;
      default:
        // assume failure
        this.errorMessage = 'Unexpected response while trying to log in.';
    }

    this.isSubmitting = false;
    if (!this.errorMessage) {
      this.showConfirmation = true;
    }
  }
}

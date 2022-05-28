import { Component, Output, EventEmitter } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';
import { ConfigService } from 'src/app/services/config.service';
import { FormBuilder, Validators } from '@angular/forms';
import { LoginApiService } from 'src/app/services/login-api.service';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  @Output() showSignup: any = new EventEmitter<any>();
  @Output() showForgotPassword: any = new EventEmitter<any>();
  @Output() showChangePassword: any = new EventEmitter<any>();
  @Output() loginSuccess: any = new EventEmitter<any>();

  showPassword:boolean = false;
  errorMessage:string = '';
  isSubmitting:boolean = false;

  constructor(
    private fb: FormBuilder,
    public configService: ConfigService,
    public data: LoginDataService,
    private apiService: LoginApiService) {
    // DEV DEV DEV DEV DEV DEV
    // DEV DEV DEV DEV DEV DEV
    // this.data.setData('EmailAddress', 'bobjones@aol.com');
    // this.data.setData('Password', 'pa$$w0rd');
    // this.loginForm.patchValue({ EmailAddress: this.data.getData('EmailAddress') || '' });
    // this.loginForm.patchValue({ Password: this.data.getData('Password') || '' });
    // DEV DEV DEV DEV DEV DEV
    // DEV DEV DEV DEV DEV DEV
  }

  loginForm = this.fb.group({
    EmailAddress: ['', [Validators.required, Validators.email, Validators.pattern(this.data.emailRegexp())]],
    Password: ['', [Validators.required]]
  });

  logo: string = this.data.getData('logo');
  id: string = this.data.getData('id');
  apikey: string = this.data.getData('api_key');

  showCreateAccount = () => this.showSignup.emit();

  // TODO: Can I chain promises together instead of using short-circuiting?

  // ## First, log in user
  // https://angular.io/guide/reactive-forms see "save form data"
  async submitForm(): Promise<void> {
    this.isSubmitting = true;
    this.errorMessage = '';
    const value = this.loginForm.value;
    const loginResult = await this.apiService.login(value.EmailAddress, value.Password);
    const loginCode = loginResult.status;
    const loginBody = await loginResult.json();
    switch (loginCode) {
      case 200:
        // success response. Perform additional check to ensure we have data we need.
        if (!loginBody.access_token) {
          this.errorMessage = 'Login successful but missing session id';
        }
        break;
      case 400:
      case 401:
      case 403:
      case 404:
      case 405:
        this.errorMessage = loginBody?.message || 'An issue occurred trying to log in.';
        break;
      case 422:
        // ## Trigger forgot password
        const forgotPasswordResult = await this.apiService.forgotPassword(value.EmailAddress);
        const forgotPasswordCode = forgotPasswordResult.status;
        const forgotPasswordBody = await forgotPasswordResult.json();
        switch (('' + forgotPasswordCode)[0]) {
          case '2': // 200's
            // success response
            this.errorMessage = `Your account password has not been set.
              We just sent a temporary password to your email.
              Please use it to log in and set your password.`;
            break;
          case '4': // 400's
            this.errorMessage = forgotPasswordBody.message
              ? `The password on your account has not been set.
                We tried sending a temporary password and encountered the following error:` + forgotPasswordBody.message
              : `The password on your account has not been set.
                We tried sending a temporary password and encountered an error.`;
            break;
          case '5': // 500's
            this.errorMessage = `The password on your account has not been set.
              We tried sending a temporary password and encountered a server error.`;
            break;
          default:
            // assume failure
            this.errorMessage = `The password on your account has not been set.
              We tried sending a temporary password and encountered an unexpected error.`;
        }
        // ## End Trigger forgot password
        break;
      case 500:
        this.errorMessage = 'A server error occurred while trying to log in.';
        break;
      default:
        // assume failure
        this.errorMessage = loginBody?.message || 'Unexpected response while trying to log in.';
    }

    // If anything went wrong, short-circuit for user to address issue
    if (this.errorMessage) {
      this.isSubmitting = false;
      return;
    }

    // Store our session for later use
    this.apiService.storeJwtToken(loginBody.access_token);

    // ## Second, verify user is logged in and get their info
    const userProfileResult = await this.apiService.userProfile(loginBody.access_token);
    const userProfileCode = userProfileResult.status;
    const userProfileBody = await userProfileResult.json();

    this.isSubmitting = false;
    if (!this.errorMessage) {
      this.data.LoginUser(userProfileBody.data); // update the agent obj
      loginBody.temp_password_login && loginBody.temp_password_login === true
        ? this.showChangePassword.emit() // show the change password form if temp password used
        : this.loginSuccess.emit('login-form'); // emit which success screen to show + make modal go away after 2 secs;
      if (!loginBody.temp_password_login || loginBody.temp_password_login !== true) {
        this.data.clearLoginModal(2000);
      }
    }
  }
}


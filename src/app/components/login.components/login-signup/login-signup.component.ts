import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';
import { LoginApiService } from "src/app/services/login-api.service";

@Component({
  selector: 'login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent {

  LOGIN_FORM = 'login-form';
  SIGNUP_FORM = 'signup-form';
  FORGOT_PASSWORD_FORM = 'forgot-password-form';
  FORGOT_PASSWORD_SUCCESS = 'forgot-password-success';
  USER_PROFILE = 'user-profile';
  CHANGE_PASSWORD_FORM = 'change-password-form';

  @Output() close_login = new EventEmitter<boolean>();
  @Input() show_login:boolean = false;
  @Input() show_profile:boolean = false;
  @Input() logout:boolean = false;
  @Input() activeForm:string = '';

  isLoggedIn:boolean = false;
  constructor(
    private data: LoginDataService) {
      this.data.isLoggedIn.subscribe(agent => this.isLoggedIn = agent);
  }

  showProfile = () => {
    this.displayUserProfile();
  }

  displaySignupForm = () => {
    this.activeForm = this.SIGNUP_FORM;
  }

  displayLoginForm = () => {
    this.activeForm = this.LOGIN_FORM;
  }

  displayForgotPasswordForm = () => {
    this.activeForm = this.FORGOT_PASSWORD_FORM;
  }

  displayForgotPasswordSuccess(): void {
    this.activeForm = this.FORGOT_PASSWORD_SUCCESS;
  }

  displayUserProfile = () => this.isLoggedIn
    ? this.activeForm = this.USER_PROFILE
    : this.displayLoginForm();

  displayChangePasswordForm = () => {
    this.activeForm = this.CHANGE_PASSWORD_FORM;
  }

  closeApp = () => {
    this.activeForm = '';
    document.body.style.position = '';
    document.body.style.overflow = '';
    this.close_login.emit();
  }

  formCompleted:boolean = false;
  onLoginSuccess(form:string): void {
    this.formCompleted = true;
    this.activeForm = form;
  }
}

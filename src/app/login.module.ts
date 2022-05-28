import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';
import { LoginComponent } from './components/login.components/login-start/login-start.component';
import { LoginSignupComponent } from './components/login.components/login-signup/login-signup.component';
import { LoginFormComponent } from './components/login.components/login-form/login-form.component';
import { LoginLinkComponent } from './components/login.components/login-link/login-link.component';
import { LoginDataService } from './services/login-data.service';
import { LoginApiService } from './services/login-api.service';
import { SignupFormComponent } from './components/login.components/signup-form/signup-form.component';
import { SuccessComponent } from './components/login.components/success/success.component';
import { ProfileComponent } from './components/login.components/profile/profile.component';
import { ForgotPasswordFormComponent } from './components/login.components/forgot-password-form/forgot-password-form.component';
import { ForgotPasswordSuccessComponent } from './components/login.components/forgot-password-success/forgot-password-success.component';
import { ChangePasswordFormComponent } from './components/login.components/change-password-form/change-password-form.component';
import { TermsAndPrivacyComponent } from './components/login.components/terms-and-privacy/terms-and-privacy.component';
import { ButtonComponent } from './components/login.components/button/button.component';

@NgModule({
  declarations: [
    LoginComponent,
    LoginLinkComponent,
    LoginFormComponent,
    LoginSignupComponent,
    SignupFormComponent,
    SuccessComponent,
    ProfileComponent,
    ForgotPasswordFormComponent,
    ForgotPasswordSuccessComponent,
    ChangePasswordFormComponent,
    TermsAndPrivacyComponent,
    ButtonComponent
  ],
  imports: [
    SharedModule,
    AppRoutingModule
  ],
  exports: [
    LoginComponent,
    LoginLinkComponent,
    LoginFormComponent,
    LoginSignupComponent,
    SignupFormComponent,
    SuccessComponent,
    ProfileComponent,
    ForgotPasswordFormComponent,
    ForgotPasswordSuccessComponent,
    ChangePasswordFormComponent,
    TermsAndPrivacyComponent,
    ButtonComponent
  ],
  providers: [LoginDataService, LoginApiService],
  bootstrap: [LoginComponent]
})
export class LoginModule { }

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { LoginDataService } from "src/app/services/login-data.service";
import { LoginApiService } from "src/app/services/login-api.service";

@Component({
  selector: 'forgot-password-form',
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss']
})
export class ForgotPasswordFormComponent implements OnInit {

  @Input() isSubmitting = false;
  @Output() showLogin: any = new EventEmitter<any>();
  @Output() showForgotPasswordSuccess: any = new EventEmitter<any>();

  errorMessage = '';
  emailAddress = '';

  constructor(
    private fb: FormBuilder,
    public data: LoginDataService,
    private apiService: LoginApiService) {
    // DEV DEV DEV DEV DEV DEV
    // DEV DEV DEV DEV DEV DEV
    // this.data.setData('EmailAddress', 'chuck.dietz@zavvie.com');
    // DEV DEV DEV DEV DEV DEV
    // DEV DEV DEV DEV DEV DEV
  }

  forgotPasswordForm = this.fb.group({
    EmailAddress: ['', [Validators.required, Validators.email, Validators.pattern(this.data.emailRegexp())]]
  });

  ngOnInit(): void {
  }

  async submitForm(): Promise<void> {
    this.isSubmitting = true;
    this.errorMessage = '';
    const value = this.forgotPasswordForm.value;
    const forgotPasswordResult = await this.apiService.forgotPassword(value.EmailAddress);
    const forgotPasswordCode = forgotPasswordResult.status;
    const forgotPasswordBody = await forgotPasswordResult.json();
    switch (('' + forgotPasswordCode)[0]) {
      case '2': // 200's
        // success response
        break;
      case '4': // 400's
        // TODO: Should message contain some sort of "please contact customer service at xxx-xxx-xxxx"?
        this.errorMessage = forgotPasswordBody.message || 'An issue occurred trying to log in.';
        break;
      case '5': // 500's
        this.errorMessage = 'A server error occurred while trying to log in.';
        break;
      default:
        // assume failure
        this.errorMessage = 'Unexpected response while trying to log in.';
    }

    // If anything went wrong, short-circuit for user to address issue
    if (this.errorMessage) {
      this.isSubmitting = false;
      return;
    }

    // Finally, emit successful forgot password submission
    this.isSubmitting = false;
    if (!this.errorMessage) {
      this.data.setData('EmailAddress', value.EmailAddress);
      this.showForgotPasswordSuccess.emit();
    }
  }

}

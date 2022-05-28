import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'forgot-password-success',
  templateUrl: './forgot-password-success.component.html',
  styleUrls: ['./forgot-password-success.component.scss']
})
export class ForgotPasswordSuccessComponent implements OnInit {

  @Output() showLogin: any = new EventEmitter<any>();

  constructor(
    public data: LoginDataService
  ) {}

  ngOnInit(): void {
  }

}

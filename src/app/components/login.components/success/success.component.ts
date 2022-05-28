import { Component, Input } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'success-comp',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent {

  @Input() form:string = '';

  userFirstName:any;
  agent:any;
  logo:string = '';
  id:string = '';
  apikey:string = '';
  LOGIN_FORM:string = 'login-form';
  SIGNUP_FORM:string = 'signup-form';

  constructor(public data: LoginDataService) {
      this.data.currentAgent.subscribe(agent => this.agent = agent);
      this.logo = this.data.getData('logo');
  }
}

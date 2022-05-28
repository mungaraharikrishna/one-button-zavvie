import { Component } from '@angular/core';
import { LoginApiService } from 'src/app/services/login-api.service';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'login-start',
  templateUrl: './login-start.component.html',
  styleUrls: ['./login-start.component.scss']
})
export class LoginComponent {

  constructor(private login: LoginDataService,
    private api: LoginApiService) {
    this.login.isLoggedIn.subscribe(agent => this.isLoggedIn = agent);
    this.login.currentActiveForm.subscribe(newform => this.activeForm = newform);
  }

  user_is_guest:boolean = true;
  show_login:boolean = true;
  show_profile:boolean = false;
  logout:boolean = false;
  isLoggedIn:boolean = false;
  LOGIN_FORM:string = 'login-form';
  USER_PROFILE:string = 'user-profile';
  activeForm:string = '';
  login_success:boolean = false;

  openApp() {
    this.user_is_guest = false;
    this.show_login = true;
    this.login.showApp();
  }

  showProfile() {
    this.show_profile = true;
    this.login.changeActiveForm(this.USER_PROFILE);
  }

  closeProfile() {
    this.show_profile = false;
    this.login.changeActiveForm('');
  }

  onLogout(): void {
    this.logout = true;
    this.login.LogoutUser();
    this.api.removeJwtToken();
  }

}

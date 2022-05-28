import { Component, Output, EventEmitter, OnInit } from "@angular/core";
import { LoginDataService } from "src/app/services/login-data.service";
import { PlatformDataService } from "src/app/services/platform-data.service";

@Component({
  selector: 'login-link',
  templateUrl: './login-link.component.html',
  styleUrls: ['./login-link.component.scss']
})
export class LoginLinkComponent implements OnInit {

  @Output() loginShow = new EventEmitter<boolean>();
  @Output() showProfile = new EventEmitter<boolean>();
  @Output() logout = new EventEmitter<boolean>();

  constructor(private data: LoginDataService,
    public pds: PlatformDataService) {
    this.data.currentAgent.subscribe(agent => this.agent = agent);
    this.data.isLoggedIn.subscribe(status => this.isLoggedIn = status);
    this.pcontact = <HTMLElement>document.getElementsByClassName('pContact')[0];
  }

  ngOnInit(): void {
    this.login_func = <HTMLElement>document.getElementsByClassName('obz-login-menu')[0];
    this.pcontact.append(this.login_func);
  }

  login_func:any;
  pcontact:HTMLElement;
  agent:any;

  isLoggedIn:boolean = false;
  loginUser() {
    this.isLoggedIn ? this.showMenu() : this.loginShow.emit();
  }

  show_menu:boolean = false;
  showMenu() {
    this.show_menu = !this.show_menu;
  }

  logOut() {
    this.show_menu = false;
    this.logout.emit();
  }

  displayProfile() {
    this.show_menu = false;
    this.showProfile.emit();
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { LoginDataService } from 'src/app/services/login-data.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { NavService } from '../../services/nav.service';

@Component({
  selector: 'left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent implements OnInit {

  @Input() showoo: boolean = false;
  @Input() showpp: boolean = false;
  @Input() oo_configured: boolean = false;
  @Input() can_use_cor: boolean = false;
  @Input() showcor: boolean = false;
  @Output() change_showoo = new EventEmitter<boolean>();
  @Output() change_showpp = new EventEmitter<boolean>();
  @Output() change_showcor = new EventEmitter<boolean>();

  constructor(
    public router: Router,
    public nav: NavService,
    private pds: PlatformDataService,
    private login: LoginDataService) {

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  currentRoute: string = this.router.url;
  ppVisible: boolean = false;
  ooVisible: boolean = false;
  corVisible: boolean = false;
  isLoanOfficer: boolean = false;
  isSeller: boolean = false;
  isBuyer: boolean = false;

  goToOO(e: any) {
    e.preventDefault();
    this.pds.changeVisibilityOO(true);
    this.pds.changeVisibilityPP(false);
    this.pds.changeVisibilityCOR(false);
    this.ooVisible = true;
    this.change_showoo.emit(true);
    this.nav.goto.home();
  }

  local4200: boolean = window.location.origin == 'http://localhost:4200';
  goToPP(e: any) {
    e.preventDefault();
    if (this.loggedIn || window.location.origin == 'http://localhost:4200') {
      this.pds.changeVisibilityPP(true);
      this.pds.changeVisibilityOO(false);
      this.pds.changeVisibilityCOR(false);
      this.ppVisible = true;
      this.ooVisible = false;
      this.change_showpp.emit(true);
      this.nav.goto.ppstart();
    } else {
      this.login.setGoToPP(true);
      this.login.showApp();
    }
  }

  goToCOR(e: any) {
    e.preventDefault();
    this.pds.changeVisibilityCOR(true);
    this.pds.changeVisibilityPP(false);
    this.pds.changeVisibilityOO(false);
    this.ooVisible = false;
    this.ppVisible = false;
    this.change_showcor.emit(true);
    this.nav.goto.home();
  }

  userType: boolean = false;
  loggedIn: boolean = false;

  express: boolean = false;
  ngOnInit(): void {
    this.pds.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
    this.login.isLoggedIn.subscribe(agent => this.loggedIn = agent);
    this.login.userPersona.subscribe((persona:string) => {
      this.isLoanOfficer = persona === 'loan-officer';
    });
    this.pds.currentAddressStatus.subscribe(newstatus => this.ppVisible = newstatus);
    this.pds.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);

    // We need to know the userType before we can show them the PP
    this.userType = !this.isSeller && !this.isBuyer ? false : true;
  }

}

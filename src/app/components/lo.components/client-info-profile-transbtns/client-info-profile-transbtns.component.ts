import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformDataService } from '../../../services/platform-data.service';

@Component({
  selector: 'app-client-info-profile-transbtns',
  templateUrl: './client-info-profile-transbtns.component.html',
  styleUrls: ['./client-info-profile-transbtns.component.scss']
})
export class ClientInfoProfileTransbtnsComponent implements OnInit {
  origin: string = window.location.origin;
  pageloadPath: string = window.location.pathname;
  initailLad: any;
  currentUrl: any;
  currentUrl2: any;
  parentUrl: any;
  previousUrl: any;
  checkPBSubmitted: any;
  transBtnDisabled: boolean = true;
  transBtnDisabled2: boolean = true;
  transBtnDisabled3: boolean = true;
  transBtnDisabled4: boolean = true;
  transBtnDisabled5: boolean = true;
  firstRouteDone: boolean = false;
  secondRouteDone: boolean = false;
  thirdRouteDone: boolean = false;
  fourthRouteDone: boolean = false;
  fifthRouteDone: boolean = false;
  isLoanOfficer: boolean = false;

  BASEPATH: string = this.platformDataService.getData('home');
  contactInfo = () => this.router.navigate([this.BASEPATH + '/client-contact-info'], { queryParamsHandling: 'preserve' });
  mortGageInfo = () => this.router.navigate([this.BASEPATH + '/mortgage-info'], { queryParamsHandling: 'preserve' });
  financialInfo = () => this.router.navigate([this.BASEPATH + '/financial-info'], { queryParamsHandling: 'preserve' });

  constructor(public platformDataService: PlatformDataService,
    private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let origin: string = window.location.origin;
        let path: string = window.location.pathname;
        this.pageloadPath = '';
        this.previousUrl = this.currentUrl;

        if (origin == 'http://localhost:4200') {
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[1];

        } else if (origin == 'http://localhost:8888') {
          path = (path.charAt(0) == '/') ? path.substring(1) : path;
          path = (path.charAt(path.length - 1) == '/') ? path.substring(0, path.length - 1) : path;
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[3];
          // console.log('current url: ', this.currentUrl)
          // console.log('pageload path: ', this.pageloadPath)
        } else { // staging or production
          path = (path.charAt(0) == '/') ? path.substring(1) : path;
          path = (path.charAt(path.length - 1) == '/') ? path.substring(0, path.length - 1) : path;
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[2];
        }
        // Make previously visited button clickable
        this.previousUrl === 'client-contact-info'|| this.previousUrl === '' || !this.previousUrl ? this.transBtnDisabled = false
            : this.previousUrl === 'mortgage-info' ? this.transBtnDisabled2 = false
              : this.previousUrl === 'financial-info' ? this.transBtnDisabled3 = false
                : this.previousUrl === 'interior' ? this.transBtnDisabled4 = false 
                : this.previousUrl === 'photos' || this.previousUrl === 'success'

        //  display checkmark
        this.currentUrl == 'client-contact-info' ? this.firstRouteDone = true && !this.transBtnDisabled
          : this.currentUrl == 'mortgage-info' ? this.secondRouteDone = true && !this.transBtnDisabled2
            : (this.currentUrl) == 'financial-info' ? this.thirdRouteDone = this.secondRouteDone = true
              : this.currentUrl == 'interior' ? this.fourthRouteDone = true && !this.transBtnDisabled4
                : this.currentUrl == 'exterior' ? this.fifthRouteDone = true && !this.transBtnDisabled5 : null

        // Make Transbtns NOT clickable AFTER PP submitted
        // let checkPBSubmitted = this.platformDataService.getAllUserData().submittedToPB;
        // let buyerOnlyEmailSent = this.platformDataService.getUserData('buyerOnlyEmailSent')
        // let optionOneClick = this.platformDataService.getUserData('optionOneClick')
        // if (checkPBSubmitted || buyerOnlyEmailSent || optionOneClick) {
        //   this.transBtnDisabled = true;
        //   this.transBtnDisabled2 = true;
        //   this.transBtnDisabled3 = true;
        //   this.transBtnDisabled4 = true;
        //   this.transBtnDisabled5 = true;
        //   this.transBtnDisabled6 = true;
        //   this.transBtnDisabled7 = true;
        //   this.transBtnDisabled8 = true;
        //   this.thirdRouteDone = true;
        //   this.fifthRouteDone = true;
        //   this.sixthRouteDone = true;
        //   this.fourthRouteDone = true;
        //   this.seventhRouteDone = true;
        //   this.eigthRouteDone = true;
        // }
      }
    });
  }

  express: boolean = false;
  ngOnInit(): void {
    this.platformDataService.currentVisibilityStatusLO.subscribe(newstatus => this.isLoanOfficer = newstatus);
    this.platformDataService.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
  }

}

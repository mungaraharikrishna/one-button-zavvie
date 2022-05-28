import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformDataService } from '../../../services/platform-data.service';

@Component({
  selector: 'app-transbtns',
  templateUrl: './transbtns.component.html',
  styleUrls: ['./transbtns.component.scss']
})
export class TransbtnsComponent implements OnInit {
  origin:string = window.location.origin;
  pageloadPath:string = window.location.pathname;
  initailLad:any;

  currentUrl:any;
  currentUrl2:any;
  parentUrl:any;
  previousUrl: any;
  checkPBSubmitted:any;
  isSeller:boolean = false;
  isBuyer:boolean = false;

  transBtnDisabled: boolean = true;
  transBtnDisabled2: boolean = true;
  transBtnDisabled3: boolean = true;
  transBtnDisabled4: boolean = true;
  transBtnDisabled5: boolean = true;
  transBtnDisabled6: boolean = true;
  transBtnDisabled7: boolean = true;
  transBtnDisabled8: boolean = true;
  firstRouteDone: boolean = false; 
  secondRouteDone: boolean = false;
  thirdRouteDone: boolean = false;
  fourthRouteDone: boolean = false;
  fifthRouteDone: boolean = false;
  sixthRouteDone: boolean = false;
  seventhRouteDone: boolean = false;
  eigthRouteDone: boolean = false;

  BASEPATH:string = this.platformDataService.getData('home');
  confirmAddress = () => this.router.navigate([this.BASEPATH + '/confirm-address']);

  sellersollutions = () => (this.isBuyer)
    ? this.router.navigate([this.BASEPATH + '/solutions/1'], { queryParamsHandling: 'preserve' })
    : this.router.navigate([this.BASEPATH + '/solutions/2'], { queryParamsHandling: 'preserve' })
    
  generalInfo = () => this.router.navigate([this.BASEPATH + '/general-info'], { queryParamsHandling: 'preserve' });
  buyerInfo = () => this.router.navigate([this.BASEPATH + '/buyer-info/1'], { queryParamsHandling: 'preserve' });
  property = () => this.router.navigate([this.BASEPATH + '/property/1'], { queryParamsHandling: 'preserve' });
  interior = () => this.router.navigate([this.BASEPATH + '/interior/1'], { queryParamsHandling: 'preserve' });
  exterior = () => this.router.navigate([this.BASEPATH + '/exterior/1'], { queryParamsHandling: 'preserve' });
  homeowners = () => this.router.navigate([this.BASEPATH + '/seller-info/1'], { queryParamsHandling: 'preserve' });
  photos = () => this.router.navigate([this.BASEPATH + '/photos/1'], { queryParamsHandling: 'preserve' });

  constructor(public platformDataService: PlatformDataService,
    private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let origin:string = window.location.origin;
        let path:string = window.location.pathname;
        this.pageloadPath = '';
        this.previousUrl = this.currentUrl;
  
        if (origin == 'http://localhost:4200') {
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[1];

        } else if (origin == 'http://localhost:8888') {
          path = (path.charAt(0) == '/') ? path.substring(1) : path;
          path = (path.charAt(path.length-1) == '/') ? path.substring(0, path.length-1) : path;
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[3];
          // console.log('current url: ', this.currentUrl)
          // console.log('pageload path: ', this.pageloadPath)
        } else { // staging or production
          path = (path.charAt(0) == '/') ? path.substring(1) : path;
          path = (path.charAt(path.length-1) == '/') ? path.substring(0, path.length-1) : path;
          this.parentUrl = (path).split('/');
          this.currentUrl = this.parentUrl[2];
        }

        // Make previously visited button clickable
        this.previousUrl === 'solutions' || this.previousUrl === '' || !this.previousUrl ? this.transBtnDisabled = false 
          : this.previousUrl === 'general-info' ? this.transBtnDisabled2 = false 
            : this.previousUrl === 'buyer-info' ? this.transBtnDisabled3 = false
              : this.previousUrl === 'property' ? this.transBtnDisabled4 = false
                : this.previousUrl === 'interior' ? this.transBtnDisabled5 = false
                  : this.previousUrl === 'exterior' ? this.transBtnDisabled6 = false
                    : this.previousUrl === 'seller-info' ? this.transBtnDisabled7 = false
                      : this.previousUrl === 'photos' || this.previousUrl === 'success'

        //  display checkmark
        this.currentUrl == 'general-info' ? this.firstRouteDone = true && !this.transBtnDisabled 
        : this.currentUrl == 'buyer-info' ? this.secondRouteDone = true && !this.transBtnDisabled2
        : (this.currentUrl) == 'property' ? this.thirdRouteDone = this.secondRouteDone = true
        : this.currentUrl == 'interior' ? this.fourthRouteDone = true && !this.transBtnDisabled4
        : this.currentUrl == 'exterior' ? this.fifthRouteDone = true && !this.transBtnDisabled5
        : this.currentUrl == 'seller-info' ? this.sixthRouteDone = true && !this.transBtnDisabled6
        : this.currentUrl == 'photos' || this.currentUrl == 'success' ? this.seventhRouteDone && !this.transBtnDisabled7
        : null

        // Make Transbtns NOT clickable AFTER PP submitted
        let checkPBSubmitted = this.platformDataService.getAllUserData().submittedToPB;
        let buyerOnlyEmailSent = this.platformDataService.getUserData('buyerOnlyEmailSent')
        let optionOneClick = this.platformDataService.getUserData('optionOneClick')
        if (checkPBSubmitted || buyerOnlyEmailSent || optionOneClick) {
          this.transBtnDisabled = true;
          this.transBtnDisabled2 = true;
          this.transBtnDisabled3 = true;
          this.transBtnDisabled4 = true;
          this.transBtnDisabled5 = true;
          this.transBtnDisabled6 = true;
          this.transBtnDisabled7 = true;
          this.transBtnDisabled8 = true;
          this.thirdRouteDone = true;
          this.fifthRouteDone = true;
          this.sixthRouteDone = true;
          this.fourthRouteDone = true;
          this.seventhRouteDone = true;
          this.eigthRouteDone = true;
        }
      }
    });
  }

  express:boolean = false;
  ngOnInit(): void {
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
  }
}
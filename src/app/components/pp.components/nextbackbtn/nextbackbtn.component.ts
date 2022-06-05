import { Component, Input } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { WpApiService } from '../../../services/wp-api.service';
import { Router } from '@angular/router';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-nextbackbtn',
  templateUrl: './nextbackbtn.component.html',
  styleUrls: ['./nextbackbtn.component.scss']
})
export class NextbackbtnComponent {
  show_lo: boolean = false;
  userPersona:string = '';
  constructor(
    private wpApiService: WpApiService,
    private platformDataService: PlatformDataService,
    private login: LoginDataService,
    private router: Router) {
      this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
      this.platformDataService.currentPPId.subscribe(currentPPId => this.ppvalue = currentPPId);
      this.login.userPersona.subscribe(officer => this.userPersona = officer);
      if (this.userPersona === 'loan-officer') {
        this.show_lo = true;
      }
    }

  @Input() buttonConfig: any;
  @Input() disabled:any;
  @Input() ppvalue:any;

  isSeller:boolean = false;
  express:boolean = false;

  // if buttonConfig.sendUpdate && buttonConfig.sendToPB are true
  // we need to update first then sendToPB
  sendUpdate = () => {
    // Find out if EK is a VB -- config.component.ts adds this to the PDS
    let do_ek = this.platformDataService.getMarketData('easyknock') || false;
    console.log('do_ek', this.platformDataService.getMarketData('easyknock'));
    // Only do EasyKnock if user has NOT delected Bridge as a Seller Solution
    let ss = this.isSeller ? this.platformDataService.getUserData('SellerSolutions') : [];
    console.log('SellerSolutions', this.platformDataService.getUserData('SellerSolutions'));
    let show_bridge = ss ? ss.indexOf('Bridge') > -1 : false;
    console.log('show_bridge', show_bridge);
    // if (show_bridge) {
    //   do_ek = true;
    // }

    if (this.buttonConfig.sendUpdate) {
      this.wpApiService.updatePP(this.platformDataService.getData('ppid')).subscribe(() => {
        if (this.buttonConfig.sendToPB) {
          if (do_ek && show_bridge) { // if we hit the EasyKnock API first
            console.log('Do EK and showBridge');
            console.log('checking EasyKnock Eligibility:...');
            this.wpApiService.checkEasyKnockEligibility().subscribe(() => {
              console.log('getting Eligibility:...');
              this.wpApiService.getEligibility().subscribe((elig_response:any) => {
                console.log(elig_response);
                console.log('updating PB:...');
                this.wpApiService.sendToPb().subscribe((pb_response:any) => {
                  console.log(pb_response);
                  this.platformDataService.addUserData('pbConfirmation', pb_response.confirmation_number);
                  this.router.navigate([this.platformDataService.getData('home') + '/success']);
                });
              });
            });
          } else { // skip the EasyKnock API
            console.log('getting Eligibility:...skip EK...');
            this.wpApiService.getEligibility().subscribe((elig_response:any) => {
              console.log(elig_response);
              console.log('updating PB:...');
              this.wpApiService.sendToPb().subscribe((pb_response:any) => {
                console.log(pb_response);
                this.platformDataService.addUserData('pbConfirmation', pb_response.confirmation_number);
                this.router.navigate([this.platformDataService.getData('home') + '/success'], { queryParamsHandling: 'preserve' });
              });
            });
          }
        }
      });
    }
  }
}
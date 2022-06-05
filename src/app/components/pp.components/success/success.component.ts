import { Component, OnInit } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  BASEPATH:string = '';
  isSeller:boolean = false;
  isBuyer:boolean = false;
  verified_buyers:any = { cash_vbs: [], lease_vbs: [] };

  constructor(public pds: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) { }

  currentSuccessMessage:any;
  thankYouMessage:boolean = false;
  emailToClientMsg:boolean = false;
  buyerEmailToClientMsg: boolean = false
  success:boolean = true;
  confirmation:string = '';
  showCloseBtn:boolean = true;
  formattedAddress:string = this.pds.getAddressData('formattedAddress');
  ioPlatformName:any = this.pds.getData('ioPlatformName');

  setSuccessMessage = () => {
    (this.express || this.currentSuccessMessage == 'success')
      ? (this.success = true, this.thankYouMessage = false, this.emailToClientMsg = false, this.buyerEmailToClientMsg = false)
      : this.currentSuccessMessage == 'emailToClient'
        ? (this.emailToClientMsg = true, this.success = false, this.thankYouMessage = false,this.buyerEmailToClientMsg = false)
        : this.currentSuccessMessage == 'buyerEmailToClient'
          ? (this.buyerEmailToClientMsg = true, this.success = false, this.thankYouMessage = false, this.emailToClientMsg = false)
          : (this.success = false, this.thankYouMessage = true, this.emailToClientMsg = false,this.buyerEmailToClientMsg = false);    
  }
  
  closeCard() {
    this.thankYouMessage = !this.thankYouMessage;
    this.success = !this.success;
  }

  photos = () => this.nav.goto.photos();
  express:boolean = false;

  show_mortgage_financing:boolean = false;
  show_cash_vbs:boolean = false;
  show_lease_vbs:boolean = false;
  labels:any = this.pds.getData('labels');
  filteredVbNames:any = {
    cash: [],
    lease: [],
    mortgage: []
  };
  filteredVBs:any = {
    cash: [],
    lease: [],
    mortgage: []
  };

  showMortgage:boolean = false;
  mortgage_link:string = '';
  mortgage_text:string = '';
  client_name:string = '';

  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_buy:boolean = false;
  sp_affinity_sell:boolean = true;
  sp_affinity_name:string = '';
  sp_affinity_nextsteps = '';

  ngOnInit(): void {

    this.pds.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
    this.pds.currentSuccessMessage.subscribe(currentSuccessMessage => this.currentSuccessMessage = currentSuccessMessage);
    this.setSuccessMessage();
    this.confirmation = this.pds.getUserData('pbConfirmation') || '';
    this.showCloseBtn = this.pds.getUserData('emailToClient') && this.pds.getUserData('emailToClient') == true ? false : true;
    this.client_name = this.pds.getUserData('AgentClientFirstName') + ' ' + this.pds.getUserData('AgentClientLastName');
    this.emailToClientMsg = !this.showCloseBtn;
    this.scrollDownService.doScroll(350, false);
    this.pds.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);

    // Solution Provider Affinity
    this.sp_affinity = this.pds.getData('sp_affinity');
    this.sp_affinity_type = this.pds.getData('sp_affinity_type');
    this.sp_affinity_buy = this.sp_affinity_type === "cash" || this.sp_affinity_type === "lease";
    this.sp_affinity_sell = this.sp_affinity_type === "bridge" || this.sp_affinity_type === "ibuyer";
    this.sp_affinity_name = this.pds.getData('sp_affinity_name');
    this.sp_affinity_nextsteps = this.pds.getData('sp_affinity_nextsteps');

    if (this.isBuyer) {
      let checkBuyerLinks = this.pds.getMarketData('Verified Buyer Links');
      this.verified_buyers = this.pds.hasJsonStructure(checkBuyerLinks) && JSON.parse(checkBuyerLinks);
      let buyerSolutions = this.pds.getUserData('BuyerSolutions') || '';
      this.show_mortgage_financing = buyerSolutions.indexOf('Open Market') > -1;
      this.show_cash_vbs = buyerSolutions.indexOf('Cash Offer') > -1;
      this.show_lease_vbs = buyerSolutions.indexOf('Lease to Own') > -1;

      // console.log('this.verified_buyers', this.verified_buyers);
      // console.log('buyerSolutions', buyerSolutions);
      // console.log('this.show_cash_vbs', this.show_cash_vbs);
      // console.log('this.show_lease_vbs', this.show_lease_vbs);

      this.showMortgage = this.pds.getData('showMortgageLogo');
      if (this.showMortgage) {
        this.mortgage_link = this.pds.getData('mortgageLink');
        this.mortgage_text = this.pds.getData('mortgageText');
      }

      if (this.pds.hasJsonStructure(checkBuyerLinks)) {
        for (let verified_buyer of this.verified_buyers) {
          for (let lvb of verified_buyer.buyers.lease_vbs) {
            if (!this.filteredVbNames.lease.includes(lvb.name)) {
              this.filteredVbNames.lease.push(lvb.name);
              this.filteredVBs.lease.push(lvb);
            }
          }
          for (let cvb of verified_buyer.buyers.cash_vbs) {
            if (!this.filteredVbNames.cash.includes(cvb.name)) {
              this.filteredVbNames.cash.push(cvb.name);
              this.filteredVBs.cash.push(cvb);
            }
          }
        }
      }
    }
    console.log('success message', this.currentSuccessMessage)
  }

  // Start Over Button
  nextBtnConfig = {
    text: 'Start over'
  }

  startOver = () => window.location.href = this.pds.getData('origin');

}
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from '@angular/forms';
import { WpApiService } from '../../../services/wp-api.service';
import { NavService } from '../../../services/nav.service';
import { LoginDataService } from '../../../services/login-data.service';


@Component({
  selector: 'buyer-result',
  templateUrl: './result-buyer.component.html',
  styleUrls: ['./result-buyer.component.scss']
})
export class ResultBuyerComponent implements OnInit {

  @Input() buyersolution: any;

  labels:any = {};

  values:any = this.pds.getHomeValueData('values');
  buyervalues = this.pds.getHomeValueData('buyervalues');

  cta:any = this.pds.getData('cta');

  constructor(public pds: PlatformDataService,
    public sds: ScrollDownService,
    public fb: FormBuilder,
    private wpApiService: WpApiService,
    private cd: ChangeDetectorRef,
    private nav: NavService,
    private login: LoginDataService) { }

  aaForm = this.fb.group({
    'lowPrice': [],
    'highPrice': [],
    'lowMortgage': [],
    'highMortgage': []
  });
  cashForm = this.fb.group({
    'lowPrice': [],
    'highPrice': [],
    'lowMortgage': [],
    'highMortgage': []
  });
  leaseToOwnForm = this.fb.group({
    'lowPrice': [],
    'highPrice': [],
    'lowLease': [],
    'highLease': []
  });

  collapseContentId:string = '';
  collapseContentEl:string = '';

  showMortgageLogo:boolean = this.pds.getData('showMortgageLogo') || false;
  mortgageLink:string = this.pds.getData('mortgageLink') || '';
  mortgageText:string = this.pds.getData('mortgageText') || '';
  mortgageImage:any = this.pds.getData('mortgageImage');

  showCashLogo:boolean = this.pds.getData('showCashOffersLogo') || false;
  cashLink:string = this.pds.getData('cashLogoLink') || '';
  cashText:string = this.pds.getData('cashLogoText') || '';
  cashImage:any = this.pds.getData('cashLogoImage');

  showWarranty:any = this.pds.getData('showWarranty') || false;
  showHomeWarranty:boolean = this.pds.getData('showHomeWarranty') || false;
  homeWarrantyLink:string = this.pds.getData('homeWarrantyLink') || '';
  homeWarrantyText:string = this.pds.getData('homeWarrantyText') || '';
  homeWarrantyImage:any = this.pds.getData('homeWarrantyImage');
  homeWarrantyLink_two:string = this.pds.getData('homeWarrantyLink_two') || '';
  homeWarrantyText_two:string = this.pds.getData('homeWarrantyText_two') || '';
  homeWarrantyImage_two:any = this.pds.getData('homeWarrantyImage_two');
  text:any = this.pds.getData('oo_text');

  explainerText = () => {
    let explainertext:string = '';
    if (this.buyersolution.con_buyer_type == 'aa') {
      explainertext = this.text.text_open_market;
    } else if (this.buyersolution.con_buyer_type == 'cash') {
      explainertext = this.text.text_cash_offer;
    } else {
      explainertext = this.text.text_lease_to_own;
    }
    return explainertext;
  }

  isBuyer:boolean = false;
  isSeller:boolean = false;

  showPP = (e:any) => {
    e.preventDefault();
    
    if (this.loggedIn) {
      this.nav.goto.ppstart();
      this.pds.changeVisibilityPP(true);
      this.pds.changeVisibilityOO(false);
      this.sds.doScroll(250, false);
    } else {
      this.login.setGoToPP(true);
      this.login.showApp();
    }
  }

  collapseFunc = (el:any) => {
    let collapseContentOpen = document.querySelector('#collapseContent_' + el + '.show');
    let contentCollapsing = document.querySelector('#collapseContent_' + el + '.collapsing');
    let changeArrow = (el:any) => {
      if (contentCollapsing) { return; }
      let chev:any = document.querySelector('.chevron-' + el);
      let mobileChev:any = document.querySelector('.chevron-' + el + ' + .fa-m');
      (chev.classList.contains('fa-chevron-down') || mobileChev.classList.contains('fa-chevron-down'))
        ? (chev.classList.replace('fa-chevron-down', 'fa-chevron-up'), mobileChev.classList.replace('fa-chevron-down', 'fa-chevron-up'))
        : (chev.classList.replace('fa-chevron-up', 'fa-chevron-down'), mobileChev.classList.replace('fa-chevron-up', 'fa-chevron-down'));
    };

    let handleBodyClasslist = () => (document.querySelectorAll('.offer-bar.open').length == 0) && document.body.classList.remove('open');
    
    let addRemoveClasses = (element:any) => {
      if (contentCollapsing) { return; }
        (collapseContentOpen == null)
          ? (element.classList.add('open'), document.body.classList.add('open'))
          : (element.classList.remove('open'), handleBodyClasslist());
    };
    addRemoveClasses(document.querySelector('.offer-bar.offer-bar-' + el));
    changeArrow(el);
  };

  formNamer = () => {
    if (this.buyersolution.con_buyer_type == "aa") {
      return this.aaForm;
    } else if (this.buyersolution.con_buyer_type == "cash") {
      return this.cashForm;
    } else {
      return this.leaseToOwnForm;
    }
  }

  aaLowPrice:any = '';
  aaHighPrice:any = '';
  aaLowMortgage:any = '';
  aaHighMortgage:any = '';
  cashLowPrice:any = '';
  cashHighPrice:any = '';
  cashLowMortgage:any = '';
  cashHighMortgage:any = '';
  leaseToOwnLowPrice:any = '';
  leaseToOwnHighPrice:any = '';
  leaseToOwnLowLease:any = '';
  leaseToOwnHighLease:any = '';

  warranty_om:boolean = false;
  warranty_cash:boolean = false;

  toggleOpenMarketWarranty = (buyer:any) => {
    this.warranty_om = !this.warranty_om;
    this.pds.changeOpenMarketWarrantyStatus(this.warranty_om);
    this.showMonthlyCosts(buyer);
  }

  toggleCashWarranty = (buyer:any) => {
    this.warranty_cash = !this.warranty_cash;
    this.pds.changeCashWarrantyStatus(this.warranty_cash);
    this.showMonthlyCosts(buyer);
  }

  updateComponentValue = (io_type:string, itemname:string, val:any) => {
    this.buyervalues[(io_type)][(itemname)] = val;
    if (itemname === 'down_payment_low') {
      let formname = io_type == 'aa'
        ? this.aaForm
        : io_type == 'cash'
          ? this.cashForm
          : this.leaseToOwnForm;

      if (io_type == 'lease_to_own') {
        formname.patchValue({
          lowLease: this.setLease(this.buyersolution, this.getBuyerHomeValue('low'), val, true)
        }, {emitEvent:false})
      } else {
        formname.patchValue({
          lowMortgage: this.setMortgage(this.buyersolution, this.getBuyerHomeValue('low'), val, true)
        }, {emitEvent:false})
      }
      
    }
    if (itemname === 'down_payment_high') {
      let formname = io_type == 'aa'
        ? this.aaForm
        : io_type == 'cash'
          ? this.cashForm
          : this.leaseToOwnForm;

      if (io_type == 'lease_to_own') {
        formname.patchValue({
          highLease: this.setLease(this.buyersolution, this.getBuyerHomeValue('high'), val, false)
        }, {emitEvent:false})
      } else {
        formname.patchValue({
          highMortgage: this.setMortgage(this.buyersolution, this.getBuyerHomeValue('high'), val, false)
        }, {emitEvent:false})
      }
    }
    this.showMonthlyCosts(this.buyersolution);
  }

  updateResultPrice = (io_type:string, val:any, low:boolean) => {
    if (low) {
      if (io_type == 'aa') {
        this.pds.changeLowAaPrice(val);
        let mortgage = this.setMortgage(this.buyersolution, val, this.buyervalues.aa.down_payment_low, true);
        this.aaForm.patchValue({
          lowMortgage: mortgage
        }, {emitEvent:false});
        this.buyervalues.aa.buyer_low_price = val;
      }
      if (io_type == 'cash') {
        this.pds.changeLowCashPrice(val);
        let mortgage = this.setMortgage(this.buyersolution, val, this.buyervalues.cash.down_payment_low, true);
        this.cashForm.patchValue({
          lowMortgage: mortgage
        }, {emitEvent:false});
        this.buyervalues.cash.buyer_low_price = val;
      }
      if (io_type == 'lease_to_own') {
        this.pds.changeLowLeaseToOwnPrice(val);
        let lease = this.setLease( this.buyersolution, val, this.buyervalues.lease_to_own.down_payment_low, true );
        this.leaseToOwnForm.patchValue({
          lowLease: lease
        }, {emitEvent:false});
        this.pds.changeLowLeaseToOwnLease(this.leaseToOwnForm.get('lowLease')!.value);
        this.buyervalues.lease_to_own.buyer_low_price = val;
      }
    } else {
      if (io_type == 'aa') {
        this.pds.changeHighAaPrice(val);
        let mortgage = this.setMortgage(this.buyersolution, val, this.buyervalues.aa.down_payment_high, false);
        this.aaForm.patchValue({
          highMortgage: mortgage
        }, {emitEvent:false});
        this.buyervalues.aa.buyer_high_price = val;
      }
      if (io_type == 'cash') {
        this.pds.changeHighCashPrice(val);
        let mortgage = this.setMortgage(this.buyersolution, val, this.buyervalues.cash.down_payment_high, false);
        this.cashForm.patchValue({
          highMortgage: mortgage
        }, {emitEvent:false});
        this.buyervalues.cash.buyer_high_price = val;
      }
      if (io_type == 'lease_to_own') {
        this.pds.changeHighLeaseToOwnPrice(val);
        let lease = this.setLease( this.buyersolution, val, this.buyervalues.lease_to_own.down_payment_high, false );
        this.leaseToOwnForm.patchValue({
          highLease: this.setLease( this.buyersolution, val, this.buyervalues.lease_to_own.down_payment_high, false )
        }, {emitEvent:false});
        this.pds.changeHighLeaseToOwnLease(this.leaseToOwnForm.get('highLease')!.value);
        this.pds.getHomeValueData('buyervalues').lease_to_own.buyer_high_price = val;
      }
    }
  }

  homeValueLow:string = '';
  homeValueHigh:string = '';

  getBuyerHomeValue = (type:string) => type === 'low' ? parseInt(this.homeValueLow) : parseInt(this.homeValueHigh);

  setPrice = (cv:any) => {
    // you could calculate the Price differently for different io_types
    return Math.round(cv); // Standard iBuyers & Bridge Price
  }

  setMortgage = (buyer:any, cv:any, dp:any, low:boolean) => {

    let M; //monthly mortgage payment
    let P = parseInt(cv) - parseInt(dp); //principle / initial amount borrowed
    let rate = low ? parseFloat(buyer.con_mortgage_low) : parseFloat(buyer.con_mortgage_high);
    let I = rate / 100 / 12; //monthly interest rate
    let N = 30 * 12; //number of payments months

    //monthly mortgage payment
    M = monthlyPayment(P, N, I);

    function monthlyPayment(p:number, n:number, i:number) {
      return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    }

    low ? this.buyervalues[buyer.con_buyer_type].mortgage_low = Math.round(M)
      : this.buyervalues[buyer.con_buyer_type].mortgage_high = Math.round(M);

    return Math.round(M);
  }

  setLease = (buyer:any, cv:any, dp:number, low:boolean) => {
    let platformMod = low ? parseFloat(buyer.con_lease_low)/100 : parseFloat(buyer.con_lease_high)/100;
    let P = parseInt(cv) - dp;
    let Lease = P * platformMod / 12;

    low ? this.buyervalues[buyer.con_buyer_type].lease_low = Math.round( Lease )
      : this.buyervalues[buyer.con_buyer_type].lease_high = Math.round( Lease );
    
    return Math.round( Lease );
  }

  buyingCost = (ibuyer:any, low:boolean) => {
    // determine correct values to use based on low/high situation
    //
    // TODO clean up args
    //
    let sflow = this.buyervalues[ibuyer.con_buyer_type].buyer_low_servicefee === '' ? 0 : this.buyervalues[ibuyer.con_buyer_type].buyer_low_servicefee;
    let sfhigh = this.buyervalues[ibuyer.con_buyer_type].buyer_high_servicefee === '' ? 0 : this.buyervalues[ibuyer.con_buyer_type].buyer_high_servicefee;
    let service_fee_low = ibuyer.con_buyer_type === 'aa' ? 0 : parseInt(sflow);
    let service_fee_high = ibuyer.con_buyer_type === 'aa' ? 0 : parseInt(sfhigh);
  
    let down_payment_low = parseInt(this.buyervalues[ibuyer.con_buyer_type].down_payment_low) || 0;
    let down_payment_high = parseInt(this.buyervalues[ibuyer.con_buyer_type].down_payment_high) || 0;

    let closing_costs_low = parseInt(this.buyervalues[ibuyer.con_buyer_type].buyer_low_closing_costs) || 0;
    let closing_costs_high = parseInt(this.buyervalues[ibuyer.con_buyer_type].buyer_high_closing_costs) || 0;

    let costs = low ? down_payment_low + closing_costs_low + service_fee_low
      : down_payment_high + closing_costs_high + service_fee_high;

    low
      ? this.buyervalues[ibuyer.con_buyer_type].costs_low = costs
      : this.buyervalues[ibuyer.con_buyer_type].costs_high = costs;
  
    return Math.round(costs);
  }

  showRangedValues = (ibuyer:any) => {
    let lowRangeVal = this.buyingCost( ibuyer, true );
    let highRangeVal = this.buyingCost( ibuyer, false );

    let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
    let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;

    return this.formatted(realLowVal) + ' - ' + this.formatted(realHighVal);
  }

  showMonthlyCosts = (ibuyer:any) => {

    let buyer = this.buyervalues[ibuyer.con_buyer_type];

    let mortgage_low:number = parseInt(buyer.mortgage_low) || 0;
    let mortgage_high:number = parseInt(buyer.mortgage_high) || 0;
    let lease_low:number = parseInt(buyer.lease_low) || 0;
    let lease_high:number = parseInt(buyer.lease_high) || 0;

    let taxes_low:number = parseInt(buyer.taxes_low) || 0;
    let taxes_high:number = parseInt(buyer.taxes_high) || 0;
    let ins_low:number = parseInt(buyer.ins_low) || 0;
    let ins_high:number = parseInt(buyer.ins_high) || 0;
    let utils_low:number = parseInt(buyer.utils_low) || 0;
    let utils_high:number = parseInt(buyer.utils_high) || 0;
    let maintenance_low:number = parseInt(buyer.maintenance_low) || 0;
    let maintenance_high:number = parseInt(buyer.maintenance_high) || 0;
    let warranty_low:number = ibuyer.con_buyer_type == 'aa' // is it aa?
      ? this.warranty_om // is warranty true?
        ? parseInt(buyer.warranty_low) : 0 // use warranty low else use 0
      : ibuyer.con_buyer_type == 'cash' // is it cash?
        ? this.warranty_cash // is warranty true?
          ? parseInt(buyer.warranty_low) : 0 // use warranty low else use 0
        : 0;
    let warranty_high:number = ibuyer.con_buyer_type == 'aa'
      ? this.warranty_om
        ? parseInt(buyer.warranty_high) : 0
      : ibuyer.con_buyer_type == 'cash'
        ? this.warranty_cash
          ? parseInt(buyer.warranty_high) : 0
        : 0;

    let rent_low = ibuyer.con_buyer_type == 'lease_to_own' ? lease_low : mortgage_low;
    let lowRangeVal = rent_low + taxes_low + ins_low + utils_low + maintenance_low + warranty_low;
    
    let rent_high = ibuyer.con_buyer_type == 'lease_to_own' ? lease_high : mortgage_high;
    let highRangeVal = rent_high + taxes_high + ins_high + utils_high + maintenance_high + warranty_high;

    let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
    let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;

    this.buyervalues[ibuyer.con_buyer_type].monthly_costs_low = realLowVal;
    this.buyervalues[ibuyer.con_buyer_type].monthly_costs_high = realHighVal;

    return this.formatted(realLowVal) + ' - ' + this.formatted(realHighVal);
  }

  showIbuyerModal:boolean = false;
  showHideIbuyerModal = (e:any) => {
    e.preventDefault();
    this.showIbuyerModal = !this.showIbuyerModal;
  }

  active_form:any = 1;
  show_hw_form:boolean = false;
  showHWForm = (form:any) => {
    this.active_form = form;
    this.show_hw_form = true;
  }
  closeHWModal = () => this.show_hw_form = false;

  agentFirstNameDefault:any = this.pds.getUserData('AgentFirstName');
  agentFirstNameQuestionConfig = {
    inputlabel: "Agent first name",
    controlname: "AgentFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentLastNameDefault:any = this.pds.getUserData('AgentLastName');
  agentLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentLastName",
    placeholder: "Last name",
    required: "true"
  }

  agentClientFirstNameDefault:any = this.pds.getUserData('AgentClientFirstName');
  agentClientFirstNameQuestionConfig = {
    inputlabel: "Client first name",
    controlname: "AgentClientFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentClientLastNameDefault:any = this.pds.getUserData('AgentClientLastName');
  agentClientLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentClientLastName",
    placeholder: "Last name",
    required: "true"
  }

  // General Info input fields
  warrantyForm = this.fb.group({
    'AgentFirstName': ['', Validators.required],
    'AgentLastName': ['', Validators.required],
    'AgentEmail': ['', [Validators.required, Validators.email]],
    'AgentClientFirstName': ['', Validators.required],
    'AgentClientLastName': ['', Validators.required],
    'AgentClientEmail': ['', [Validators.required, Validators.email]]
  });

  newval:any;
  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.pds.addUserData(name, e);
    if (name === 'AgentFirstName') {
      this.agentFirstNameDefault = e;
    } else if (name === 'AgentLastName') {
      this.agentLastNameDefault = e;
    } else if (name === 'AgentClientFirstName') {
      this.agentClientFirstNameDefault = e;
    } else if (name === 'AgentClientLastName') {
      this.agentClientLastNameDefault = e;
    }
    this.checkValidity();
  }

  warrantyBtnDisabled:boolean = true;
  // manually check validity of our required component inputs
  get = (name:any) => this.pds.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined;
  checkValidity = () => this.warrantyBtnDisabled = this.notAnswered('AgentFirstName')
    || this.notAnswered('AgentLastName')
    || this.notAnswered('AgentEmail')
    || this.notAnswered('AgentClientEmail')
    || this.notAnswered('AgentClientFirstName')
    || this.notAnswered('AgentClientLastName')
      ? true : false;

  pb_wait:boolean = false;
  warranty_form_submitted:boolean = false;
  submitWarrantyForm = (form:any, e:any) => {
    this.pb_wait = true;
    e.preventDefault();
    e.stopPropagation();
    if (form == 1) {
      this.wpApiService.hwConciergeSend(true, false, this.homeWarrantyLink).subscribe((pb_response:any) => {
        // console.log(pb_response);
        this.pds.addUserData('hw1Confirmation', pb_response.confirmation_number);
        this.pb_wait = false;
        this.warranty_form_submitted = true;
        setTimeout(() => {
          window.open(this.homeWarrantyLink, '_blank');
          this.warranty_form_submitted = false;
          this.show_hw_form = false;
        }, 3000);
      });
    } else {
      this.wpApiService.hwConciergeSend(true, false, this.homeWarrantyLink_two).subscribe((pb_response:any) => {
        // console.log(pb_response);
        this.pds.addUserData('hw2Confirmation', pb_response.confirmation_number);
        this.pb_wait = false;
        this.warranty_form_submitted = true;
        setTimeout(() => {
          window.open(this.homeWarrantyLink_two, '_blank');
          this.warranty_form_submitted = false;
          this.show_hw_form = false;
        }, 3000);
      });
    }
  }

  getPriceVal = (buyer_type:string, low:boolean) => {
    if (low) {
      return buyer_type === 'lease_to_own'
        ? this.leaseToOwnForm.get('lowLease')!.value
        : buyer_type === 'aa'
          ? this.aaForm.get('lowPrice')!.value
          : this.cashForm.get('lowMortgage')!.value;
    } else {
      return buyer_type === 'lease_to_own'
        ? this.leaseToOwnForm.get('highLease')!.value
        : buyer_type === 'aa'
          ? this.aaForm.get('highPrice')!.value
          : this.cashForm.get('highMortgage')!.value;
    }
  }

  formatted = (x:any) => '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  verified_buyers:any;
  buyerVisited:boolean = false;

  loggedIn:boolean = false;
  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_id:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_description:string = '';
  use_sp_content:boolean = false;
  sp_affinity_features:any = '';
  sp_features:Array<any> = [];
  sp_features_1:Array<any> = [];
  sp_features_2:Array<any> = [];

  spanHeading() {
    return this.buyersolution.id == 99 ? this.use_sp_content ? this.sp_affinity_name : this.labels.aaTerm
      : this.buyersolution.id == 88 ? this.use_sp_content ? this.sp_affinity_name : this.labels.asIsTerm
        : this.buyersolution.id == 77 ? this.use_sp_content ? this.sp_affinity_name : this.labels.bridgeTerm
          : this.use_sp_content ? this.sp_affinity_name : this.labels.ioTerm;
  }

  ngOnInit(): void {
    this.login.isLoggedIn.subscribe(agent => this.loggedIn = agent);

    this.pds.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);

    this.pds.currentVerifiedBuyers.subscribe(newbuyers => this.verified_buyers = newbuyers);

    this.homeValueLow = this.pds.getHomeValueData('homeValueLow');
    this.homeValueHigh = this.pds.getHomeValueData('homeValueHigh');

    this.buyerVisited = true;
    this.pds.currentBuyerVisitedStatus.subscribe(newstatus => this.buyerVisited = newstatus);
    this.pds.changeBuyerVisitedStatus(true);
    
    this.sp_affinity = this.pds.getData('sp_affinity');
    if (this.sp_affinity === "1") {
      this.sp_affinity_type = this.pds.getData('sp_affinity_type');
      this.sp_affinity_name = this.pds.getData('sp_affinity_name');
      this.sp_affinity_logo = this.pds.getData('sp_affinity_logo');
      this.sp_affinity_description = this.pds.getData('sp_affinity_description');
      const sp_affinity_features = this.pds.getData('sp_affinity_features');

      this.use_sp_content = this.sp_affinity
        ? this.buyersolution.con_buyer_type === "cash" && this.sp_affinity_type === "cash" || this.buyersolution.con_buyer_type === "lease_to_own" && this.sp_affinity_type === "lease"
          ? true : false
        : false;

      if (this.pds.hasJsonStructure(sp_affinity_features)) {
        let parsed_features = JSON.parse(sp_affinity_features);
        let sp_index:number = 0;
        for (let feature of parsed_features) {
          if (sp_index < 3) {
            this.sp_features_1.push(feature.feature_item)
          } else if (sp_index < 6) {
            this.sp_features_2.push(feature.feature_item);
          }
          sp_index++;
        }
      }
    }

    // Tab label headings
    this.labels = this.pds.getData('labels');

    this.collapseContentId = 'collapseContent_' + this.buyersolution.id;
    this.collapseContentEl = '#collapseContent_' + this.buyersolution.id;

    this.warrantyForm.patchValue({
      AgentEmail: this.pds.getUserData('AgentEmail'),
      AgentClientEmail: this.pds.getUserData('AgentClientEmail')
    });

    this.checkValidity();

    // Open Market/AA FORM
    if (this.buyersolution.con_buyer_type == "aa") {
      this.aaForm = this.fb.group({
        'lowPrice': [this.setPrice( this.getBuyerHomeValue('low') )],
        'highPrice': [this.setPrice( this.getBuyerHomeValue('high') )],
        'lowMortgage': [this.setMortgage( this.buyersolution, this.getBuyerHomeValue('low'), this.buyervalues.aa.down_payment_low, true )],
        'highMortgage': [this.setMortgage( this.buyersolution, this.getBuyerHomeValue('high'), this.buyervalues.aa.down_payment_high, false )]
      });
      this.aaLowPrice = this.aaForm.get('lowPrice')!.value;
      this.aaHighPrice = this.aaForm.get('highPrice')!.value;
      this.aaLowMortgage = this.aaForm.get('lowMortgage')!.value;
      this.aaHighMortgage = this.aaForm.get('highMortgage')!.value;
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.aaLowPrice, true);
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.aaHighPrice, false);
      this.pds.currentLowAAPrice.subscribe(newprice => this.aaLowPrice = newprice);
      this.pds.currentHighAAPrice.subscribe(newprice => this.aaHighPrice = newprice);
      this.aaForm.valueChanges.subscribe(val => {
        if (val.lowPrice) {
          this.aaForm.patchValue({
            lowMortgage: this.setMortgage( this.buyersolution, val.lowPrice, this.buyervalues.aa.down_payment_low, true )
          }, {emitEvent:false})
        }
        if (val.highPrice) {
          this.aaForm.patchValue({
            highMortgage: this.setMortgage( this.buyersolution, val.highPrice, this.buyervalues.aa.down_payment_high, false )
          }, {emitEvent:false})
        }
      });
    } else if (this.buyersolution.con_buyer_type == "cash") {
      this.cashForm = this.fb.group({
        'lowPrice': [this.setPrice( this.getBuyerHomeValue('low') )],
        'highPrice': [this.setPrice( this.getBuyerHomeValue('high') )],
        'lowMortgage': [this.setMortgage( this.buyersolution, this.getBuyerHomeValue('low'), this.buyervalues.cash.down_payment_low, true )],
        'highMortgage': [this.setMortgage( this.buyersolution, this.getBuyerHomeValue('high'), this.buyervalues.cash.down_payment_high, false )]
      });
      this.cashLowPrice = this.cashForm.get('lowPrice')!.value;
      this.cashHighPrice = this.cashForm.get('highPrice')!.value;
      this.cashLowMortgage = this.cashForm.get('lowMortgage')!.value;
      this.cashHighMortgage = this.cashForm.get('highMortgage')!.value;
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.cashLowPrice, true);
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.cashHighPrice, false);
      this.pds.currentLowCashPrice.subscribe(newprice => this.cashLowPrice = newprice);
      this.pds.currentHighCashPrice.subscribe(newprice => this.cashHighPrice = newprice);
      this.cashForm.valueChanges.subscribe(val => {
        if (val.lowPrice) {
          this.cashForm.patchValue({
            lowMortgage: this.setMortgage( this.buyersolution, val.lowPrice, this.buyervalues.cash.down_payment_low, true )
          }, {emitEvent:false})
        }
        if (val.highPrice) {
          this.cashForm.patchValue({
            highMortgage: this.setMortgage( this.buyersolution, val.highPrice, this.buyervalues.cash.down_payment_high, false )
          }, {emitEvent:false})
        }
      });
    } else {
      this.leaseToOwnForm = this.fb.group({
        'lowPrice': [this.setPrice( this.getBuyerHomeValue('low') )],
        'highPrice': [this.setPrice( this.getBuyerHomeValue('high') )],
        'lowLease': [this.setLease( this.buyersolution, this.getBuyerHomeValue('low'), this.buyervalues.lease_to_own.down_payment_low, true )],
        'highLease': [this.setLease( this.buyersolution, this.getBuyerHomeValue('high'), this.buyervalues.lease_to_own.down_payment_high, false )]
      });
      this.leaseToOwnLowPrice = this.leaseToOwnForm.get('lowPrice')!.value;
      this.leaseToOwnHighPrice = this.leaseToOwnForm.get('highPrice')!.value;
      this.leaseToOwnLowLease = this.leaseToOwnForm.get('lowLease')!.value;
      this.leaseToOwnHighLease = this.leaseToOwnForm.get('highLease')!.value;
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.leaseToOwnLowPrice, true);
      this.updateResultPrice(this.buyersolution.con_buyer_type, this.leaseToOwnHighPrice, false);
      this.pds.currentLowLeaseToOwnPrice.subscribe(newprice => this.leaseToOwnLowPrice = newprice);
      this.pds.currentHighLeaseToOwnPrice.subscribe(newprice => this.leaseToOwnHighPrice = newprice);
      this.pds.currentLowLeaseToOwnLease.subscribe(newprice => this.leaseToOwnLowLease = newprice);
      this.pds.currentHighLeaseToOwnLease.subscribe(newprice => this.leaseToOwnHighLease = newprice);
      this.leaseToOwnForm.valueChanges.subscribe(val => {
        if (val.lowPrice) {
          this.leaseToOwnForm.patchValue({
            lowLease: this.setLease( this.buyersolution, val.lowPrice, this.buyervalues.lease_to_own.down_payment_low, true )
          }, {emitEvent:false})
        }
        if (val.highPrice) {
          this.leaseToOwnForm.patchValue({
            highLease: this.setLease( this.buyersolution, val.highPrice, this.buyervalues.lease_to_own.down_payment_high, false )
          }, {emitEvent:false})
        }
      });
    }
    
  }

  ngAfterViewInit():void {
    this.cd.detectChanges();
  }

  // if user is Buyer+Seller and hasn't viewed Buyer Solutions
  // we have to set the Buyer values without init
  public runBuyer(): void {
    let priceMin = this.pds.getHomeValueData('homeValueLow');
    let priceMax = this.pds.getHomeValueData('homeValueHigh');
    let buyers = this.pds.getMarketData('buyersolutions');
    let values = this.pds.getHomeValueData('buyervalues');

    let setMortgage = (buyer:any, cv:any, dp:any, low:boolean) => {

      let M; //monthly mortgage payment
      let P = parseInt(cv) - parseInt(dp); //principle / initial amount borrowed
      let rate = low ? parseFloat(buyer.con_mortgage_low) : parseFloat(buyer.con_mortgage_high);
      let I = rate / 100 / 12; //monthly interest rate
      let N = 30 * 12; //number of payments months
  
      //monthly mortgage payment
      M = monthlyPayment(P, N, I);
  
      function monthlyPayment(p:number, n:number, i:number) {
        return p * i * (Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
      }
  
      return Math.round(M);
    }
  
    let setLease = (buyer:any, cv:any, dp:number, low:boolean) => {
      let platformMod = low ? parseFloat(buyer.con_lease_low)/100 : parseFloat(buyer.con_lease_high)/100;
      let P = parseInt(cv) - dp;
      let Lease = P * platformMod / 12;
      
      return Math.round( Lease );
    }

    for (let buyer of buyers) {
      if (buyer) {
        let buyerVals = values[buyer.con_buyer_type];
  
        buyerVals.buyer_low_price = this.setPrice(priceMin);
        buyerVals.buyer_high_price = this.setPrice(priceMax);
        buyerVals.down_payment_low = ((parseInt(priceMin) * parseFloat(buyer.con_down_payment_low)) / 100).toFixed(0);
        buyerVals.down_payment_low_percent = parseFloat(buyer.con_down_payment_low);
        buyerVals.down_payment_high = ((parseInt(priceMax) * parseFloat(buyer.con_down_payment_high)) / 100).toFixed(0);
        buyerVals.down_payment_high_percent = parseFloat(buyer.con_down_payment_high);

        buyerVals.buyer_low_closing_costs = (parseInt(priceMin) * (parseFloat(buyer.con_buyer_cc_low) / 100)).toFixed(0);
        buyerVals.buyer_high_closing_costs = (parseInt(priceMax) * (parseFloat(buyer.con_buyer_cc_high) / 100)).toFixed(0);
        
        buyerVals.buyer_low_servicefee = (buyer.con_buyer_type != 'aa')
          ? (parseInt(priceMin) * parseFloat(buyer.con_buyer_servicefee_low) / 100).toFixed(0)
          : 0;
        buyerVals.buyer_high_servicefee = (buyer.con_buyer_type != 'aa')
          ? (parseInt(priceMax) * parseFloat(buyer.con_buyer_servicefee_high) / 100).toFixed(0)
          : 0;

        if (buyer.con_buyer_type != "lease_to_own") {
          buyerVals.mortgage_low = setMortgage(buyer, priceMin, buyerVals.down_payment_low, true);
          buyerVals.mortgage_high = setMortgage(buyer, priceMax, buyerVals.down_payment_high, false);

          buyerVals.taxes_low = (parseInt(priceMin) * parseFloat(buyer.con_taxes_low)/100 / 12).toFixed(0);
          buyerVals.taxes_high = (parseInt(priceMax) * parseFloat(buyer.con_taxes_high)/100 / 12).toFixed(0);

          buyerVals.ins_low = (parseInt(priceMin) * parseFloat(buyer.con_ins_low)/100 / 12).toFixed(0);
          buyerVals.ins_high = (parseInt(priceMax) * parseFloat(buyer.con_ins_high)/100 / 12).toFixed(0);

          buyerVals.utils_low = (parseInt(priceMin) * parseFloat(buyer.con_utils_low) / 100).toFixed(0);
          buyerVals.utils_high = (parseInt(priceMax) * parseFloat(buyer.con_utils_high) / 100).toFixed(0);

          buyerVals.maintenance_low = (parseInt(priceMin) * parseFloat(buyer.con_maintenance_low) / 100).toFixed(0);
          buyerVals.maintenance_high = (parseInt(priceMax) * parseFloat(buyer.con_maintenance_high) / 100).toFixed(0);

          buyerVals.warranty_low = (buyer.con_buyer_type == 'aa')
            ? (parseInt(priceMin) * parseFloat(buyer.con_home_warranty_low) / 100).toFixed(0)
            : (parseInt(buyerVals.mortgage_low) * parseFloat(buyer.con_home_warranty_low) / 100).toFixed(0);
          buyerVals.warranty_high = (buyer.con_buyer_type == 'aa')
            ? (parseInt(priceMax) * parseFloat(buyer.con_home_warranty_high) / 100).toFixed(0)
            : (parseInt(buyerVals.mortgage_high) * parseFloat(buyer.con_home_warranty_high) / 100).toFixed(0);

        } else {
          buyerVals.lease_low = setLease(buyer, priceMin, buyerVals.down_payment_low, true);
          buyerVals.lease_high = setLease(buyer, priceMax, buyerVals.down_payment_high, false);

          buyerVals.high_premiumequity = (parseInt(buyerVals.lease_low) * parseFloat(buyer.con_premiumequity_low) / 100).toFixed(0);
          buyerVals.low_premiumequity = (parseInt(buyerVals.lease_high) * parseFloat(buyer.con_premiumequity_high) / 100).toFixed(0);

          buyerVals.taxes_low = (parseInt(buyerVals.lease_low) * parseFloat(buyer.con_taxes_low)/100 / 12).toFixed(0);
          buyerVals.taxes_high = (parseInt(buyerVals.lease_high) * parseFloat(buyer.con_taxes_high)/100 / 12).toFixed(0);
      
          buyerVals.ins_low = (parseInt(buyerVals.lease_low) * parseFloat(buyer.con_ins_low)/100).toFixed(0);
          buyerVals.ins_high = (parseInt(buyerVals.lease_high) * parseFloat(buyer.con_ins_high)/100).toFixed(0);

          buyerVals.maintenance_low = (parseInt(buyerVals.lease_low) * parseFloat(buyer.con_maintenance_low) / 100).toFixed(0);
          buyerVals.maintenance_high = (parseInt(buyerVals.lease_high) * parseFloat(buyer.con_maintenance_high) / 100).toFixed(0);

          buyerVals.utils_low = (parseInt(buyerVals.lease_low) * parseFloat(buyer.con_utils_low) / 100).toFixed(0);
          buyerVals.utils_high = (parseInt(buyerVals.lease_high) * parseFloat(buyer.con_utils_high) / 100).toFixed(0);

          buyerVals.warranty_low = 0;
          buyerVals.warranty_high = 0;
        }


        let costs_low:number = parseInt(buyerVals.down_payment_low) + parseInt(buyerVals.buyer_low_closing_costs) + parseInt(buyerVals.buyer_low_servicefee);
        let costs_high:number = parseInt(buyerVals.down_payment_high) + parseInt(buyerVals.buyer_high_closing_costs) + parseInt(buyerVals.buyer_high_servicefee);
        buyerVals.costs_low = costs_low;
        buyerVals.costs_high = costs_high;

        buyerVals.monthly_costs_low = (buyer.con_buyer_type == "lease_to_own")
          ? parseInt(buyerVals.lease_low) + parseInt(buyerVals.taxes_low) + parseInt(buyerVals.ins_low) + parseInt(buyerVals.maintenance_low) + parseInt(buyerVals.utils_low)
          : parseInt(buyerVals.mortgage_low) + parseInt(buyerVals.taxes_low) + parseInt(buyerVals.ins_low) + parseInt(buyerVals.maintenance_low) + parseInt(buyerVals.utils_low);

        buyerVals.monthly_costs_high = (buyer.con_buyer_type == "lease_to_own")
          ? parseInt(buyerVals.lease_high) + parseInt(buyerVals.taxes_high) + parseInt(buyerVals.ins_high) + parseInt(buyerVals.maintenance_high) + parseInt(buyerVals.utils_high)
          : parseInt(buyerVals.mortgage_high) + parseInt(buyerVals.taxes_high) + parseInt(buyerVals.ins_high) + parseInt(buyerVals.maintenance_high) + parseInt(buyerVals.utils_high);
      } 
    }    
  }

}
import { Component, OnInit, Input,
  AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FieldNameService } from '../../../services/field-name.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from '@angular/forms';
import { WpApiService } from '../../../services/wp-api.service';
import { NavService } from '../../../services/nav.service';
import { LoginDataService } from '../../../services/login-data.service';

@Component({
  selector: 'seller-result',
  templateUrl: './result-seller.component.html',
  styleUrls: ['./result-seller.component.scss']
})
export class ResultSellerComponent implements OnInit, AfterViewInit {
  constructor(
    public platformDataService: PlatformDataService,
    public fns: FieldNameService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private wpApiService: WpApiService,
    private cd: ChangeDetectorRef,
    private nav: NavService,
    private login: LoginDataService ) { }

  @Input() ibuyer: any;
  @Input() market: any;
  @Input() name: any;

  labels:any = {};

  sellingcost:any = '';
  values:any = this.platformDataService.getHomeValueData('values');
  homeValue:string = this.platformDataService.getHomeValueData('homeValue');
  ioHomeVal:any;
  homeCondition:any = this.platformDataService.getHomeValueData('homeCondition');
  cta:any = this.platformDataService.getData('cta');

  showConcierge:boolean = this.platformDataService.getData('showConcierge');
  useConcierge:boolean = false;
  conciergeServiceFee:any = this.platformDataService.getData('conciergeServiceFee');
  conciergeMultiplier:any = this.platformDataService.getData('conciergeMultiplier');
  conciergePlatformName:any = this.platformDataService.getData('conciergePlatformName');
  showConciergeImage:boolean = this.platformDataService.getData('showConciergeImage');
  conciergeLink:any = this.platformDataService.getData('conciergeLink');
  conciergeImage:any = this.platformDataService.getData('conciergeImage');

  aaImgSrc:string = this.platformDataService.getData('aa_program_img_src') && this.platformDataService.getData('aa_program_img_src');
  aaImgAlt:string = this.platformDataService.getData('aa_program_img_alt') && this.platformDataService.getData('aa_program_img_alt');
  ioImgSrc:string = this.platformDataService.getData('io_program_img_src') && this.platformDataService.getData('io_program_img_src');
  ioImgAlt:string = this.platformDataService.getData('io_program_img_alt') && this.platformDataService.getData('io_program_img_alt');

  lowhpc:any;
  highhpc:any;

  isBuyer:boolean = false;

  arv_mod = this.platformDataService.getHomeValueData('arv_mod');
  arv_alt = this.platformDataService.getHomeValueData('arv_alt');

  cta_suffix:string = this.platformDataService.getAddressData('cta_suffix');

  collapseContentId:string = '';
  collapseContentEl:string = '';

  showIbuyerModal:boolean = false;
  showHideIbuyerModal = (e:any) => {
    e.preventDefault();
    this.showIbuyerModal = !this.showIbuyerModal;
  }

  show_concierge_form:boolean = false;
  concierge_form_submitted:boolean = false;
  showConciergeForm = () => this.show_concierge_form = true;
  closeConciergeModal = () => this.show_concierge_form = false;

  agentFirstNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
  agentFirstNameQuestionConfig = {
    inputlabel: "Agent first name",
    controlname: "AgentFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentLastNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
  agentLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentLastName",
    placeholder: "Last name",
    required: "true"
  }

  agentClientFirstNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);
  agentClientFirstNameQuestionConfig = {
    inputlabel: "Client first name",
    controlname: "AgentClientFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentClientLastNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName);
  agentClientLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentClientLastName",
    placeholder: "Last name",
    required: "true"
  }

  // General Info input fields
  conciergeForm = this.fb.group({
    'AgentFirstName': [''],
    'AgentLastName': [''],
    'AgentEmail': ['', [Validators.required, Validators.email]],
    'AgentClientFirstName': [''],
    'AgentClientLastName': [''],
    'AgentClientEmail': ['', [Validators.required, Validators.email]]
  });

  newval:any;
  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
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

  conciergeBtnDisabled:boolean = true;
  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined;
  checkValidity = () => this.conciergeBtnDisabled = this.notAnswered('AgentFirstName')
    || this.notAnswered('AgentLastName')
    || this.notAnswered('AgentEmail')
    || this.notAnswered('AgentClientEmail')
    || this.notAnswered('AgentClientFirstName')
    || this.notAnswered('AgentClientLastName')
      ? true : false;

  pb_wait:boolean = false;
  submitConciergeForm = (e:any) => {
    this.pb_wait = true;
    e.preventDefault();
    e.stopPropagation();
    
    this.wpApiService.hwConciergeSend(false, true, this.conciergeLink).subscribe((pb_response:any) => {
      // console.log(pb_response);
      this.platformDataService.addUserData('conciergeConfirmation', pb_response.confirmation_number);
      this.concierge_form_submitted = true;
      this.pb_wait = false;
      setTimeout(() => {
        window.open(this.conciergeLink, '_blank');
        this.concierge_form_submitted = false;
        this.show_concierge_form = false;
      }, 3000);
    });
  }

  setNewIoHomeVal = (val:any) => this.ioHomeVal = val;
  getHomeValue = () => parseInt(this.homeValue);
  asIsSituation = () => this.homeCondition && this.homeCondition.id == 3 ? true : false;

  setPrice = (cv:any, modifier:any, aa:any, arv:any) => {
    // calculate the Price differently for aa / arv / no modifier
    return aa
      ? Math.round(cv) // Open Market Price
      : arv // if ARV is not null, use the ARV calculation
        ? Math.round( ( cv * arv / 100 ) * ( 100 - modifier ) / 100 ) // Major Repairs Price
        // For AA and Bridge, the ARV is factored in with their p&r value...
        // so here we just make the standard calculation as with Standard iBuyers
        : Math.round( cv * ( 100 - modifier ) / 100 ); // Standard iBuyers & Bridge Price
  };

  // alt-input-percent component
  // when Concierge is turned on/off we multiply the P&R by the
  // conciergeMultiplier and add that to the Est Open Market Price
  // But not in Asis Situation
  resetPrice = (pr_val:any) => {
    if (!this.asIsSituation()) {
      let cv = this.aaForm.get('openMarketPrice')!.value;
      let newPrice = parseInt(cv) + parseFloat(this.conciergeMultiplier)*parseInt(pr_val);
      this.platformDataService.changeAaPrice(newPrice);
      this.platformDataService.getHomeValueData('values').aa.open_mkt_price = newPrice;
      this.aaForm.patchValue({ openMarketPrice: newPrice }, { emitEvent:false });
      this.aaPrice = newPrice;
    }
  }

  getIoType = () => this.ibuyer.id === 99 ? this.values.trash : this.values[this.ibuyer.con_io_type];

  lowContractVal = () => this.ibuyer.id == 77 ? this.getIoType().bridge_mkt_price : this.getIoType().low_open_mkt_price;
  highContractVal = () => this.ibuyer.id == 77 ? this.getIoType().bridge_mkt_price : this.getIoType().high_open_mkt_price;
  
  isDouble = () => this.ibuyer.id != 99;
  isStandardIbuyer = () => this.ibuyer.id != 77 && this.ibuyer.id != 88 && this.ibuyer.id != 99 ? true : false;
  asIsAgentAssisted = () => (this.ibuyer.id == 99 && this.asIsSituation()) ? true : false;

  getLikelihoodPercent = (lklihd:any, prc:any) => ((100*lklihd)*prc).toFixed() + '%';

  likelihoodStyle:any = "";
  text:any = this.platformDataService.getData('oo_text');

  explainerText = () => {
    let explainertext:string = '';
    if (this.isDouble()) {
      if (this.isStandardIbuyer()) { // Standard iBuyer
        explainertext = this.text.text_standard;
      } else if (this.ibuyer.id == 88) { // Major Reno iBuyer
        explainertext = this.text.text_major_repairs;
      } else if (this.ibuyer.id == 77) { // Bridge
        explainertext = this.text.text_bridge;
      }
    }
    return explainertext;
  }

  // For Major Reno we want to add the high market modifier to the contractValue
  // In all other situations we subtract it
  lowHighMod = () => this.ibuyer.id == 88 ? -1 : 1;

  getARV = () => this.asIsSituation() ? this.ibuyer.con_arv : this.arv_alt;

  showPP = (e:any) => {
    e.preventDefault();
    if (this.loggedIn) {
      this.nav.goto.ppstart();
      this.platformDataService.changeVisibilityPP(true);
      this.platformDataService.changeVisibilityOO(false);
      this.scrollDownService.doScroll(250, false);
    } else {
      this.login.setGoToPP(true);
      this.login.showApp();
    }
  }

  sellingCost = (ibuyer:any, low:boolean, high:boolean) => {
    // determine correct values to use based on low/high situation
    //
    // TODO clean up args
    //

    let serviceFee = low
        ? this.values[ibuyer.con_io_type].low_service_fee || 0
        : high
          ? this.values[ibuyer.con_io_type].high_service_fee || 0
          : this.values.aa.service_fee || 0.0;
    
    if (!high && !low) {
      this.values.aa.service_fee = serviceFee;
    }

    let sellerFee = low
      ? this.values[ibuyer.con_io_type].low_seller_agent || 0
      : high
        ? this.values[ibuyer.con_io_type].high_seller_agent || 0
        : this.values.aa.seller_agent || 0.0;

    let buyerFee = low
      ? this.values[ibuyer.con_io_type].low_buyer_agent || 0
      : high
        ? this.values[ibuyer.con_io_type].high_buyer_agent || 0
        : this.values.aa.buyer_agent || 0.0;

    let prepandrepairs = low
      ? this.values[ibuyer.con_io_type].low_prep_repairs || 0
      : high
        ? this.values[ibuyer.con_io_type].high_prep_repairs || 0
        : this.values.aa.prep_repairs || 0.0;

    let closingCosts = low
      ? this.values[ibuyer.con_io_type].low_closing_costs || 0
      : high
        ? this.values[ibuyer.con_io_type].high_closing_costs || 0
        : this.values.aa.closing_costs || 0.0;

    let costs = parseInt(serviceFee) + parseInt(sellerFee) + parseInt(buyerFee) + parseInt(prepandrepairs) + parseInt(closingCosts);

    if (ibuyer.id == 99) {
      this.values.aa.cos = Math.round(costs);
    }

    return Math.round(costs);
  }

  showRangedValues = (ibuyer:any) => {
    let lowRangeVal = this.sellingCost( ibuyer, true, false );
    let highRangeVal = this.sellingCost( ibuyer, false, true );

    let ibuyertype = ibuyer.id == 99
      ? 'aa'
      : ibuyer.id == 88
        ? 'asis'
        : ibuyer.id == 77
          ? 'bridge'
          : 'standard';

    // set Values High/Low Cost of Selling
    if (ibuyertype != 'aa') {
      this.values[ibuyertype].low_cos = lowRangeVal;
      this.values[ibuyertype].high_cos = highRangeVal;
    } else {
      this.values.trash.low_cos = lowRangeVal;
      this.values.trash.high_cos = highRangeVal;
    }

    let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
    let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;

    return this.formatted(realLowVal) + ' - ' + this.formatted(realHighVal);
  }

  estimatedNet = (cv:any, ibuyer:any, low:boolean, high:boolean) => {
    // set Value for AA Net
    let calc_value = Math.round(cv - this.sellingCost(ibuyer, low, high));
    
    if (ibuyer.id == 99) {
      this.values.aa.net = calc_value;
    }
    return calc_value;
  }

  showRangedEstimatedNet = (cv_1:any, cv_2:any, ibuyer:any) => {

    let lowRangeVal = Math.round(cv_1 - this.sellingCost(ibuyer, true, false));
    let highRangeVal = Math.round(cv_2 - this.sellingCost(ibuyer, false, true));

    let ibuyertype = ibuyer.id == 99
      ? 'aa'
      : ibuyer.id == 88
        ? 'asis'
        : ibuyer.id == 77
          ? 'bridge'
          : 'standard';

    // set Values High/Low Net
    if (ibuyertype != 'aa') {
      this.values[ibuyertype].low_net = lowRangeVal;
      this.values[ibuyertype].high_net = highRangeVal;
    } else {
      this.values.trash.low_net = lowRangeVal;
      this.values.trash.high_net = highRangeVal;
    }

    let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
    let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;

    return this.formatted(realLowVal) + ' - ' + this.formatted(realHighVal);
  }

  getMlotLow = () => {
    if (this.market.con_offers) {
      this.getIoType().mlot_low = (this.estimatedNet(this.values.aa.open_mkt_price, this.market.con_aa_offer, false, false ) -
          this.estimatedNet(this.lowContractVal(), this.ibuyer, true, false ));
      return Math.abs(this.getIoType().mlot_low);
    } else {
      return;
    }
  };

  getMlotHigh = () => {
    if (this.market.con_offers) {
      this.getIoType().mlot_high = (this.estimatedNet(this.values.aa.open_mkt_price, this.market.con_aa_offer, false, false ) -
          this.estimatedNet(this.highContractVal(), this.ibuyer, false, true ));
      return Math.abs(this.getIoType().mlot_high);
    } else {
      return;
    }
  };

  showRangedMlot = () => {
    let lowRangeVal = this.getMlotLow();
    let highRangeVal = this.getMlotHigh();
    let realLowVal = lowRangeVal! < highRangeVal! ? lowRangeVal : highRangeVal;
    let realHighVal = lowRangeVal! < highRangeVal! ? highRangeVal : lowRangeVal;
    return this.formatted(realLowVal) + ' - ' + this.formatted(realHighVal);
  };

  formatted = (x:any) => '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

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
  
  int = (string:string) => parseInt(string);
  decimal = (string:string) => parseFloat(string);

  getIbuyer = () => this.ibuyer;

  updateComponentValue = (io_type:string, itemname:string, val:any) => this.platformDataService.getHomeValueData('values')[(io_type)][(itemname)] = val;
  
  updateResultPrice = (io_type:string, val:any, low:boolean) => {
    if (io_type == 'aa') {
      this.platformDataService.changeAaPrice(val);
      this.platformDataService.getHomeValueData('values').aa.open_mkt_price = val;
    }
    if (io_type == 'bridge') {
      this.platformDataService.changeBridgePrice(val);
      this.platformDataService.getHomeValueData('values').bridge.bridge_mkt_price = val;
      this.setLowHpcVal(this.ibuyer, false);
      this.setHighHpcVal(this.ibuyer, false);
    } 
    if (io_type == 'standard') {
      low
        ? (this.platformDataService.changeLowStandardPrice(val),
          this.platformDataService.getHomeValueData('values').standard.low_open_mkt_price = val)
        : (this.platformDataService.changeHighStandardPrice(val),
          this.platformDataService.getHomeValueData('values').standard.high_open_mkt_price = val);
    }
    if (io_type == 'asis') {
      low
        ? (this.platformDataService.changeLowAsisPrice(val),
          this.platformDataService.getHomeValueData('values').asis.low_open_mkt_price = val)
        : (this.platformDataService.changeHighAsisPrice(val),
          this.platformDataService.getHomeValueData('values').asis.high_open_mkt_price = val);
    }
  }

  setLowHpcVal = (ibuyer:any, isbuyer:boolean) => {
    let minHPC = isbuyer ? this.platformDataService.getHomeValueData('homeValueLow') : '';
    let lowCalc = (parseInt(this.bridgePrice) - (parseInt(this.bridgePrice) * parseFloat(ibuyer.con_low_hpv_modifier))).toFixed(0);
    this.bridgePrice = this.bridgeForm.get('bridgePrice')!.value;
    this.lowhpc = isbuyer ? minHPC : lowCalc;
    this.platformDataService.changeLowHomePurchasePrice(this.lowhpc);
    this.platformDataService.getHomeValueData('values').bridge.low_home_purchase_cost = this.lowhpc;
    this.bridgeForm.patchValue({ 'lowhpc': this.lowhpc });
  }

  updateLowHpcVal = () => {
    this.lowhpc = this.bridgeForm.get('lowhpc')!.value;
    this.platformDataService.changeLowHomePurchasePrice(this.lowhpc);
    this.platformDataService.getHomeValueData('values').bridge.low_home_purchase_cost = this.lowhpc;
    this.bridgeForm.patchValue({ 'lowhpc': this.lowhpc });
  }

  setHighHpcVal = (ibuyer:any, isbuyer:boolean) => {
    let maxHPC = isbuyer ? this.platformDataService.getHomeValueData('homeValueHigh') : '';
    let highCalc = (parseInt(this.bridgePrice) - (parseInt(this.bridgePrice) * parseFloat(ibuyer.con_high_hpv_modifier))).toFixed(0);
    this.bridgePrice = this.bridgeForm.get('bridgePrice')!.value;
    this.highhpc = isbuyer ? maxHPC : highCalc;
    this.platformDataService.changeHighHomePurchasePrice(this.highhpc);
    this.platformDataService.getHomeValueData('values').bridge.high_home_purchase_cost = this.highhpc;
    this.bridgeForm.patchValue({ 'highhpc': this.highhpc });
  }

  updateHighHpcVal = () => {
    this.highhpc = this.bridgeForm.get('highhpc')!.value;
    this.platformDataService.changeHighHomePurchasePrice(this.highhpc);
    this.platformDataService.getHomeValueData('values').bridge.high_home_purchase_cost = this.highhpc;
    this.bridgeForm.patchValue({ 'highhpc': this.highhpc });
  }

  aaForm = this.fb.group({});
  aaPrice:any = '';

  standardForm = this.fb.group({});
  standardPriceLow:any = '';
  standardPriceHigh:any = '';

  bridgeForm = this.fb.group({});
  bridgePrice:any = '';
  
  asisForm = this.fb.group({});
  asisPriceLow:any = '';
  asisPriceHigh:any = '';

  asisMod:any;

  formNamer = () => {
    if (this.ibuyer.con_io_type == "aa") {
      return this.aaForm;
    } else if (this.ibuyer.con_io_type == "standard") {
      return this.standardForm;
    } else if (this.ibuyer.con_io_type == "bridge") {
      return this.bridgeForm;
    } else {
      return this.asisForm;
    }
  }

  info_items:any;
  best_fit:string = '';
  ibuyer_vbs:any = [];

  loggedIn:boolean = false;
  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_id:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_description:string = '';
  use_sp_content:boolean = false;
  sp_features_1:Array<any> = [];
  sp_features_2:Array<any> = [];
  spanHeading() {
    return this.ibuyer.id == 99 ? this.use_sp_content ? this.sp_affinity_name : this.labels.aaTerm
      : this.ibuyer.id == 88 ? this.use_sp_content ? this.sp_affinity_name : this.labels.asIsTerm
        : this.ibuyer.id == 77 ? this.use_sp_content ? this.sp_affinity_name : this.labels.bridgeTerm
          : this.use_sp_content ? this.sp_affinity_name : this.labels.ioTerm;
  }

  ngOnInit(): void {
    this.login.isLoggedIn.subscribe((agent: boolean) => this.loggedIn = agent);

    this.sp_affinity = this.platformDataService.getData('sp_affinity');
    
    if (this.sp_affinity === "1") {
      this.sp_affinity_type = this.platformDataService.getData('sp_affinity_type');
      this.sp_affinity_id = this.platformDataService.getData('sp_affinity_id');
      this.sp_affinity_name = this.platformDataService.getData('sp_affinity_name');
      this.sp_affinity_logo = this.platformDataService.getData('sp_affinity_logo');
      this.sp_affinity_description = this.platformDataService.getData('sp_affinity_description');
      const sp_affinity_features = this.platformDataService.getData('sp_affinity_features');

      this.use_sp_content = this.sp_affinity
        ? this.ibuyer.con_io_type === "bridge" && this.sp_affinity_type === "bridge" || this.ibuyer.con_io_type === "standard" && this.sp_affinity_type === "ibuyer"
          ? true : false
        : false;

      if (this.platformDataService.hasJsonStructure(sp_affinity_features)) {
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

    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.currentConciergeStatus.subscribe(newstatus => this.useConcierge = newstatus);

    this.conciergeForm.patchValue({
      AgentEmail: this.platformDataService.getUserData('AgentEmail'),
      AgentClientEmail: this.platformDataService.getUserData('AgentClientEmail')
    });

    this.checkValidity();

    // Open Market/AA FORM
    if (this.ibuyer.con_io_type == "aa") {

      this.info_items = this.platformDataService.getMarketData('info_items_aa');
      this.best_fit = this.platformDataService.getMarketData('best_fit_aa');

      this.aaForm = this.fb.group({
        'openMarketPrice': [this.setPrice(this.getHomeValue(), this.homeCondition.mod, true, null )]
      });
      this.aaPrice = this.aaForm.get('openMarketPrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.aaPrice, false);
      this.platformDataService.currentAAPrice.subscribe(newprice => this.aaPrice = newprice);
      this.aaForm.valueChanges.subscribe(val => {
        console.log(val);
        if (val.openMarketPrice) {
          this.aaForm.patchValue({
            openMarketPrice: val.openMarketPrice
          }, {emitEvent:false})
        }
      });
    }

    this.asisMod = parseInt(this.aaPrice)*parseFloat(this.homeCondition.mod);

    if (this.ibuyer.con_io_type == "bridge") {

      this.info_items = this.platformDataService.getMarketData('info_items_bridge');
      this.best_fit = this.platformDataService.getMarketData('best_fit_bridge');
      this.ibuyer_vbs = this.platformDataService.getMarketData('bridge_vbs');

      // Bridge FORM
      this.bridgeForm = this.fb.group({
        'bridgePrice': [this.setPrice(this.getHomeValue(), this.ibuyer.con_low_market_modifier, false, false)],
        'lowhpc': [],
        'highhpc': []
      });

      this.bridgePrice = this.bridgeForm.get('bridgePrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.bridgePrice, false);
      this.platformDataService.currentBridgePrice.subscribe(newprice => this.bridgePrice = newprice);
      
      this.bridgeForm.valueChanges.subscribe(val => {
        if (val.bridgePrice) {
          this.bridgeForm.patchValue({
            bridgePrice: val.bridgePrice
          }, {emitEvent:false})
        }
      });

      this.lowhpc = this.bridgeForm.get('lowhpc')!.value;
      this.setLowHpcVal(this.ibuyer, this.isBuyer);
      this.platformDataService.currentLowHomePurchasePrice.subscribe(newprice => this.lowhpc = newprice);

      this.highhpc = this.bridgeForm.get('highhpc')!.value;
      this.setHighHpcVal(this.ibuyer, this.isBuyer);
      this.platformDataService.currentHighHomePurchasePrice.subscribe(newprice => this.highhpc = newprice);
    }

    if (this.ibuyer.con_io_type == "standard") {

      this.info_items = this.platformDataService.getMarketData('info_items_standard');
      this.best_fit = this.platformDataService.getMarketData('best_fit_standard');
      this.ibuyer_vbs = this.platformDataService.getMarketData('ibuyer_vbs');

      // Standard FORM
      this.standardForm = this.fb.group({
        'lowPrice': [ this.setPrice(this.getHomeValue(), this.decimal(this.ibuyer.con_low_market_modifier), false, null) ],
        'highPrice': [ this.setPrice(this.getHomeValue(), this.decimal(this.ibuyer.con_high_market_modifier), false, null) ]
      });

      this.standardPriceLow = this.standardForm.get('lowPrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.standardPriceLow, true);
      this.platformDataService.currentLowStandardPrice.subscribe(newprice => this.standardPriceLow = newprice);
      
      this.standardForm.valueChanges.subscribe(val => {
        if (val.lowPrice) {
          this.standardForm.patchValue({
            lowPrice: val.lowPrice
          }, {emitEvent:false})
        }
      });

      this.standardPriceHigh = this.standardForm.get('highPrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.standardPriceHigh, false);
      this.platformDataService.currentHighStandardPrice.subscribe(newprice => this.standardPriceHigh = newprice);

      this.standardForm.valueChanges.subscribe(val => {
        if (val.highPrice) {
          this.standardForm.patchValue({
            highPrice: val.highPrice
          }, {emitEvent:false})
        }
      });
    }
    
    if (this.ibuyer.con_io_type == "asis") {

      this.info_items = this.platformDataService.getMarketData('info_items_asis');
      this.best_fit = this.platformDataService.getMarketData('best_fit_asis');
      this.ibuyer_vbs = this.platformDataService.getMarketData('reno_vbs');

      // Major Repairs FORM
      this.asisForm = this.fb.group({
        'lowPrice': [ this.setPrice(this.getHomeValue(), this.decimal(this.ibuyer.con_low_market_modifier), false, this.getARV()) ],
        'highPrice': [ this.setPrice(this.getHomeValue(), this.decimal(this.ibuyer.con_high_market_modifier), false, this.getARV()) ]
      });
      
      this.asisPriceLow = this.asisForm.get('lowPrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.asisPriceLow, true);
      this.platformDataService.currentLowAsisPrice.subscribe(newprice => this.asisPriceLow = newprice);

      this.asisForm.valueChanges.subscribe(val => {
        if (val.lowPrice) {
          this.asisForm.patchValue({
            lowPrice: val.lowPrice
          }, {emitEvent:false})
        }
      });

      this.asisPriceHigh = this.asisForm.get('highPrice')!.value;
      this.updateResultPrice(this.ibuyer.con_io_type, this.asisPriceHigh, false);
      this.platformDataService.currentHighAsisPrice.subscribe(newprice => this.asisPriceHigh = newprice);

      this.asisForm.valueChanges.subscribe(val => {
        if (val.highPrice) {
          this.asisForm.patchValue({
            highPrice: val.highPrice
          }, {emitEvent:false})
        }
      });
    }

    // console.log('ibuyers', this.ibuyer_vbs);
    this.collapseContentId = 'collapseContent_' + this.ibuyer.id;
    this.collapseContentEl = '#collapseContent_' + this.ibuyer.id;
    // this.svgStyle = 'left: calc(' + this.ibuyer.con_eligible + '% - 34.5px - .333rem)';
    // this.eligibleWidth = 'width: ' + this.ibuyer.con_eligible + '%';
    // Tab label headings
    this.labels = this.platformDataService.getData('labels');
  }

  ngAfterViewInit():void {
    this.cd.detectChanges();
  }

  public runSeller(): void {

    let ibuyers = this.platformDataService.getHomeValueData('market');
    let homeCondition:any = this.platformDataService.getHomeValueData('homeCondition');
    let asisSituation = homeCondition.id == 3 ? true : false;
    let homeValue = this.platformDataService.getHomeValueData('homeValue');

    let low_service_fee:any = 0;
    let lowBuyer:any = 0;
    let lowSeller:any = 0;
    let lowPandR:any = 0;
    let lowCC:any = 0;
    let high_service_fee:any = 0;
    let highBuyer:any = 0;
    let highSeller:any = 0;
    let highPandR:any = 0;
    let highCC:any = 0;

    this.aaPrice = this.setPrice(parseInt(homeValue), homeCondition.mod, true, null );
    this.asisMod = parseInt(this.aaPrice)*parseInt(homeCondition.mod);

    this.platformDataService.getHomeValueData('values').aa.open_mkt_price = this.aaPrice;

    let aaServiceFee = ((parseInt(this.aaPrice) * parseFloat(ibuyers.con_aa_offer.con_service_fee)) / 100).toFixed(0);
    this.platformDataService.getHomeValueData('values').aa.service_fee = aaServiceFee;

    let aaSellerAgent = ((parseInt(this.aaPrice) * parseFloat(ibuyers.con_aa_offer.con_seller_commission)) / 100).toFixed(0);
    this.platformDataService.getHomeValueData('values').aa.seller_agent = aaSellerAgent;

    let aaBuyerAgent = ((parseInt(this.aaPrice) * parseFloat(ibuyers.con_aa_offer.con_buyer_commission)) / 100).toFixed(0);
    this.platformDataService.getHomeValueData('values').aa.buyer_agent = aaBuyerAgent;

    let aaPandR:any = (asisSituation) // if this is the AA and as-is situation
      ? (parseInt(this.asisMod) / 100).toFixed(0) // modify the AA p&r to be equal to Home Condition Modifier
      : (parseInt(this.aaPrice) * (parseInt(ibuyers.con_aa_offer.con_prep_repairs) / 100) * parseInt(homeCondition.mod)).toFixed(0); // all the other IOs (or non-As-is AA)

    this.platformDataService.getHomeValueData('values').aa.prep_repairs = aaPandR;

    let aaClosingCosts = ((parseInt(this.aaPrice) * parseFloat(ibuyers.con_aa_offer.con_closing_costs)) / 100).toFixed(0);
    this.platformDataService.getHomeValueData('values').aa.closing_costs = aaClosingCosts;

    let aaCOS:number = parseInt(aaServiceFee) + parseInt(aaSellerAgent) + parseInt(aaBuyerAgent) + parseInt(aaPandR) + parseInt(aaClosingCosts);
    this.platformDataService.getHomeValueData('values').aa.cos = aaCOS;

    let aaNet:number = Math.round(parseInt(this.aaPrice) - aaCOS);
    this.platformDataService.getHomeValueData('values').aa.net = aaNet;

    // loop through our con_offers
    for (let ibuyer of ibuyers.con_offers) {

      let buyer_type = ibuyer.con_io_type;
      let buyerVals = this.platformDataService.getHomeValueData('values')[buyer_type];

      let priceLow:any;
      let priceHigh:any;

      // Bridge is special case
      if (buyer_type == "bridge") {

        // Set Bridge Price / low & high Home Purchase Cost
        this.bridgePrice = this.setPrice(parseInt(homeValue), ibuyer.con_low_market_modifier, false, false);
        buyerVals.bridge_mkt_price = this.bridgePrice;

        this.lowhpc = (parseInt(this.bridgePrice) - (parseInt(this.bridgePrice) * parseFloat(ibuyer.con_low_hpv_modifier))).toFixed(0);
        buyerVals.low_home_purchase_cost = this.lowhpc;

        this.highhpc = (parseInt(this.bridgePrice) - (parseInt(this.bridgePrice) * parseFloat(ibuyer.con_high_hpv_modifier))).toFixed(0);
        buyerVals.high_home_purchase_cost = this.highhpc;

        // Service Fee
        // standard calc is bridgePrice * service_fee (low/high)
        // alt calc is Home Purchase Cost (low/high) * service_fee (low/high)
        // hybrid calc is lowest of 2 low calcs and highest of 2 high calcs
        let std_sf_low = () => ((parseInt(this.bridgePrice) * parseFloat(ibuyer.con_low_service_fee)) / 100).toFixed(0);
        let alt_sf_low = () => ((parseInt(this.lowhpc) * parseFloat(ibuyer.con_low_service_fee)) / 100).toFixed(0);
        let low_service_fee = ibuyer.con_bridge_sf_type == 'bridge_standard'
          ? std_sf_low()
          : ibuyer.con_bridge_sf_type == 'bridge_alt'
            ? alt_sf_low()
              : std_sf_low() < alt_sf_low() ? std_sf_low() : alt_sf_low();
    
        let std_sf_high = () => ((parseInt(this.bridgePrice) * parseFloat(ibuyer.con_high_service_fee)) / 100).toFixed(0);
        let alt_sf_high = () => ((parseInt(this.highhpc) * parseFloat(ibuyer.con_high_service_fee)) / 100).toFixed(0);
        let high_service_fee = ibuyer.con_bridge_sf_type == 'bridge_standard'
          ? std_sf_high()
          : ibuyer.con_bridge_sf_type == 'bridge_alt'
            ? alt_sf_high()
              : std_sf_high() > alt_sf_high() ? std_sf_high() : alt_sf_high();

        buyerVals.low_service_fee = low_service_fee;
        buyerVals.high_service_fee = high_service_fee;

        // P & R
        let lowPandR:any = asisSituation
          // asisBridge works like asisAA, instead of using the low/high modifiers
          // we just multiply the cv by the homeCondition mod (which is the ARV)
          ? (parseInt(this.bridgePrice) * (homeCondition.mod / 100)).toFixed(0) // don't factor in PR mod for Bridge
          : (parseInt(this.bridgePrice) * (parseFloat(ibuyer.con_prep_repairs) / 100) * homeCondition.mod).toFixed(0); // normal calculation

        let highPandR:any = asisSituation
          // asisBridge works like asisAA, instead of using the low/high modifiers
          // we just multiply the cv by the homeCondition mod (which is the ARV)
          ? (parseInt(this.bridgePrice) * (homeCondition.mod / 100)).toFixed(0) // don't factor in PR mod for Bridge
          : (parseInt(this.bridgePrice) * (parseFloat(ibuyer.con_prep_repairs) / 100) * homeCondition.mod).toFixed(0); // normal calculation

        buyerVals.low_prep_repairs = parseInt(lowPandR);
        buyerVals.high_prep_repairs = parseInt(highPandR);

        // Buyer Fee
        let lowBuyer = (parseInt(this.bridgePrice) * ibuyer.con_buyer_commission / 100).toFixed(0);
        let highBuyer = (parseInt(this.bridgePrice) * ibuyer.con_buyer_commission / 100).toFixed(0);
        buyerVals.low_buyer_agent = lowBuyer;
        buyerVals.high_buyer_agent = highBuyer;

        // Seller Fee
        let lowSeller = (parseInt(this.bridgePrice) * ibuyer.con_seller_commission / 100).toFixed(0);
        let highSeller = (parseInt(this.bridgePrice) * ibuyer.con_seller_commission / 100).toFixed(0);
        buyerVals.low_seller_agent = lowSeller;
        buyerVals.high_seller_agent = highSeller;

        let lowCC = (parseInt(this.bridgePrice) * (parseFloat(ibuyer.cc_low) / 100)).toFixed(0);
        let highCC = (parseInt(this.bridgePrice) * (parseFloat(ibuyer.cc_high) / 100)).toFixed(0);
        buyerVals.low_closing_costs = parseInt(lowCC);
        buyerVals.high_closing_costs = parseInt(highCC);

        let cos_low:number = parseInt(low_service_fee) + parseInt(lowBuyer) + parseInt(lowSeller) + parseInt(lowPandR) + parseInt(lowCC);
        let cos_high:number = parseInt(high_service_fee) + parseInt(highBuyer) + parseInt(highSeller) + parseInt(highPandR) + parseInt(highCC);
        buyerVals.low_cos = cos_low;
        buyerVals.high_cos = cos_high;

        let net_low:number = Math.round(parseInt(this.bridgePrice) - cos_low);
        let net_high:number = Math.round(parseInt(this.bridgePrice) - cos_high);
        buyerVals.low_net = net_low;
        buyerVals.high_net = net_high;

        buyerVals.mlot_low = Math.abs(aaNet - net_low);
        buyerVals.mlot_high = Math.abs(aaNet - net_high);
      }

      // Our other iBuyer is gonna be Standard or Asis
      if (asisSituation) { // Major Repairs

        if (buyer_type == "asis") {
          let arv = ibuyer.con_arv;
          priceLow = this.setPrice(homeValue, this.decimal(ibuyer.con_low_market_modifier), false, arv);
          priceHigh = this.setPrice(homeValue, this.decimal(ibuyer.con_high_market_modifier), false, arv);
          buyerVals.low_open_mkt_price = priceLow;
          buyerVals.high_open_mkt_price = priceHigh;
        }

      } else { // Standard iBuyers

        if (buyer_type == "standard") {
          priceLow = this.setPrice(homeValue, this.decimal(ibuyer.con_low_market_modifier), false, null);
          priceHigh = this.setPrice(homeValue, this.decimal(ibuyer.con_high_market_modifier), false, null);
          buyerVals.low_open_mkt_price = priceLow;
          buyerVals.high_open_mkt_price = priceHigh;
        }

      }

      // Special case Bridge already did all this for itself
      if (buyer_type !== 'bridge') {
        // Service Fee
        low_service_fee = ((parseInt(priceLow) * parseFloat(ibuyer.con_low_service_fee)) / 100).toFixed(0); 
        high_service_fee = ((parseInt(priceHigh) * parseFloat(ibuyer.con_high_service_fee)) / 100).toFixed(0);
        buyerVals.low_service_fee = low_service_fee;
        buyerVals.high_service_fee = high_service_fee;
        
        // Buyer Fee
        lowBuyer = (parseInt(priceLow) * ibuyer.con_buyer_commission / 100).toFixed(0);
        highBuyer = (parseInt(priceHigh) * ibuyer.con_buyer_commission / 100).toFixed(0);
        buyerVals.low_buyer_agent = lowBuyer;
        buyerVals.high_buyer_agent = highBuyer;

        // Seller Fee
        lowSeller = (parseInt(priceLow) * ibuyer.con_seller_commission / 100).toFixed(0);
        highSeller = (parseInt(priceHigh) * ibuyer.con_seller_commission / 100).toFixed(0);
        buyerVals.low_seller_agent = lowSeller;
        buyerVals.high_seller_agent = highSeller;
        
        // P & R
        lowPandR = (parseInt(priceLow) * (parseFloat(ibuyer.con_prep_repairs) / 100) * homeCondition.mod).toFixed(0); // normal calculation
        highPandR = (parseInt(priceHigh) * (parseFloat(ibuyer.con_prep_repairs) / 100) * homeCondition.mod).toFixed(0); // normal calculation
        buyerVals.low_prep_repairs = parseInt(lowPandR);
        buyerVals.high_prep_repairs = parseInt(highPandR);

        lowCC = (parseInt(priceLow) * (parseFloat(ibuyer.cc_low) / 100)).toFixed(0);
        highCC = (parseInt(priceHigh) * (parseFloat(ibuyer.cc_high) / 100)).toFixed(0);
        buyerVals.low_closing_costs = parseInt(lowCC);
        buyerVals.high_closing_costs = parseInt(highCC);

        let cos_low:number = parseInt(low_service_fee) + parseInt(lowBuyer) + parseInt(lowSeller) + parseInt(lowPandR) + parseInt(lowCC);
        let cos_high:number = parseInt(high_service_fee) + parseInt(highBuyer) + parseInt(highSeller) + parseInt(highPandR) + parseInt(highCC);
        buyerVals.low_cos = cos_low;
        buyerVals.high_cos = cos_high;

        let net_low:number = Math.round(parseInt(priceLow) - cos_low);
        let net_high:number = Math.round(parseInt(priceHigh) - cos_high);
        buyerVals.low_net = net_low;
        buyerVals.high_net = net_high;

        buyerVals.mlot_low = Math.abs(aaNet - net_low);
        buyerVals.mlot_high = Math.abs(aaNet - net_high);
      }
    }
  }
}

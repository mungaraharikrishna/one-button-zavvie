import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../services/config.service';
import { PlatformDataService } from '../../services/platform-data.service';
import { FieldNameService } from 'src/app/services/field-name.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { BuyerMarketService } from 'src/app/services/buyer-market.service';
import { ActivatedRoute } from '@angular/router';
import { ConfigComponent } from '../oo.components/config/config.component';
import { NavService } from 'src/app/services/nav.service';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  providers: [ConfigComponent],
  selector: 'app-one-button',
  templateUrl: './one-button.component.html',
  styleUrls: ['./one-button.component.scss']
})

export class OneButtonComponent implements OnInit {
  officerType!: string;
  show_lo: boolean = false;

  constructor(
    private configService: ConfigService,
    private scrollDownService: ScrollDownService,
    private nav: NavService,
    private pds: PlatformDataService,
    private fns: FieldNameService,
    private buyerMarketService: BuyerMarketService,
    private route: ActivatedRoute,
    private config: ConfigComponent,
    private login: LoginDataService) {
      this.configService.setPath();
  }

  post_meta: any;
  platform_meta: any;

  ooconfigured:boolean = false;
  url_params:any;
  have_params:boolean = false;
  show_oo:boolean = true;
  show_pp:boolean = false;
  show_cor:boolean = false;

  offerData:object = this.pds.getHomeValueData('offerData');
  values:object = this.pds.getHomeValueData('values');
  homeValue:string = this.pds.getHomeValueData('homeValue');

  // Initial variables
  formLoaded:boolean = false;
  isDisabled:boolean = true;
  disabled:string = 'disabled';

  pId:any = this.configService.getPlatformIds().partnerId;
  platformType:string = 'broker';

  partnerId:any = this.pId;
  pbPartnerId:string = '';
  logo:any;
  agent_logo:any;
  aa_logo:any;

  partner:string = '';
  partnerName:string = '';
  locales:any = [];
  mkt_locales:any = [];
  text_standard:string = '';
  text_major_repairs:string = '';
  text_bridge:string = '';
  text_open_market:string = '';
  text_cash_offer:string = '';
  text_lease_to_own:string = '';
  oo_text:any;

  arv_mod:any = 0.2;
  arv_alt:any = 0.2;

  showPoweredByZavvie:boolean = false;
  enable_cash_buyer:boolean = false;
  enable_lease_buyer:boolean = false;
  hideBridge:any;

  showBuyerOBZ:boolean = false;

  hideEmailToClient:any;
  showConcierge:any;
  showConciergeImage:boolean = false;
  showMortgageLogo:boolean = false;
  showCashOffersLogo:boolean = false;
  showHomeWarranty:boolean = false;
  showHomeWarrantyImage:boolean = false;
  showHomeWarrantyImage_two:boolean = false;
  conciergePlatformName:string = '';
  conciergeServiceFee:any;
  conciergeMultiplier:any;
  res_links:string = '';
  offers_link:string = '';
  pp_link:string = '';
  cta:object = {};

  labels:any = {
    aaHeading: '',
    aaTerm: '',
    ioHeading: '',
    ioTerm: '',
    asIsTerm: '',
    bridgeHeading: '',
    bridgeTerm: '',
  }

  national_aa:any;
  national_bridge:any;
  national_standard:any;
  national_asis:any;
  default_market:any;
  default_aa:any;

  mkt_location_counties:any;
  mkt_states:any;
  mkt_counties:any;
  userAddress:any = null;

  homeCondition:any;

  response_waiting:boolean = false;

  info_items_aa:any;
  info_items_bridge:any;
  info_items_standard:any;
  info_items_asis:any;
  best_fit_aa:any;
  best_fit_bridge:any;
  best_fit_standard:any;
  best_fit_asis:any;

  best_fit_open_market:any;
  best_fit_cash_offer:any;
  best_fit_lease:any;
  info_items_open_market:any;
  info_items_cash_offer:any;
  info_items_lease:any;

  isSeller:boolean = false;
  isBuyer:boolean = false;
  userPersona:string = '';
  configuredStatus = () => this.ooconfigured;

  changeConfigured = (status:boolean) => {
    this.ooconfigured = status;
  }

  next = (e:any) => {
    e.preventDefault();
    if (this.loggedIn) {
      this.pds.changeVisibilityPP(true);
      this.pds.changeVisibilityCOR(false);
      this.changeShowPP(true);
      this.nav.goto.ppstart();
      this.scrollDownService.doScroll(250, false);
    } else {
      this.login.setGoToPP(true);
      this.login.showApp();
    }
  }

  back = (e:any) => {
    e.preventDefault();

    this.pds.changeAddress(false);
    this.pds.changeReconfigured(true);

    // empty out oldAddress and formattedAddress
    // so their values stay equal
    this.pds.changeOldAddress('');
    this.pds.setAddressData('formattedAddress', '');
    this.pds.addUserData(this.fns.FieldNames.confirmAddress.Address, '');

    let user_type = <HTMLInputElement>document.getElementById('choose-user');
    user_type.value = '';

    this.config.resetUserTypeForm();
    this.nav.goto.home();
  }

  ppaddress:string = '';
  changeShowOO = (status:boolean) => {
    this.show_oo = status;
    this.show_pp = !status;
    this.show_cor = this.can_use_cor ? !status : false;
    this.ppaddress = this.pds.getAddressData('formattedAddress');
  }

  changeShowPP = (status:boolean) => {
    this.show_pp = status;
    this.show_oo = !status;
    this.show_cor = this.can_use_cor ? !status : false;
  }

  changeShowCOR = (status:boolean) => {
    this.show_cor = this.can_use_cor ? status : false;
    this.show_pp = !status;
    this.show_oo = !status;
  }

  can_use_cor:boolean = false;
  loggedIn:boolean = false;
  ngOnInit(): void {

    let origin:string = window.location.origin;
    (origin == 'http://localhost:4200')
      ? document.documentElement.style.setProperty('--top-position', '0')
      : document.documentElement.style.setProperty('--top-position', '-20vh');

    let body:any = document.getElementsByTagName('body')[0];
    let user_id:string = body.dataset.user;

    this.login.isLoggedIn.subscribe(agent => this.loggedIn = agent);

    this.login.userPersona.subscribe(officer => this.userPersona = officer);
    console.log('userPersona obs:', this.userPersona);

    this.pds.canUseCor.subscribe(newstatus => this.can_use_cor = newstatus);
    // so OO can become not configured if Change Address from PP
    this.pds.currentAddressStatus.subscribe(newstatus => this.ooconfigured = newstatus);
    this.pds.currentHomeCondition.subscribe(newhomecondition => this.homeCondition = newhomecondition);
    this.pds.currentVisibilityStatusPP.subscribe(newstatus => this.show_pp = newstatus);
    this.pds.currentVisibilityStatusOO.subscribe(newstatus => this.show_oo = newstatus);
    this.pds.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);

    if (this.userPersona === 'loan-officer') {
      this.changeShowOO(false);
      this.show_lo = true;
    }

    this.route.queryParamMap.subscribe((ParamMap => {
      if (ParamMap) {
        this.url_params = ParamMap;

        if (this.url_params.params.addressa) {
          this.have_params = true;
          this.show_oo = false;
          this.pds.changeVisibilityOO(this.show_oo);
          this.show_pp = true;
          this.pds.changeVisibilityPP(this.show_pp);
          this.pds.addUserData('paramMap', true);
          let urlAddressA = this.url_params.params.addressa;
          let urlAddressB = this.url_params.params.addressb;
          const urlAddress = urlAddressA + ', ' + urlAddressB;

          if (this.url_params.params.unit) {
            const unitNumber = this.url_params.params.unit;
            this.pds.setAddressData('addressb', this.url_params.params.unitNumber);
            this.pds.addUserData(this.fns.FieldNames.confirmAddress.UnitNumber, this.url_params.params.unitNumber)
          }

          this.pds.addUserData(this.fns.FieldNames.confirmAddress.Address, urlAddress);
          this.pds.setAddressData('formattedAddress', urlAddress);
          this.pds.setData('Address', urlAddress);
          this.pds.setAddressData('addressa', this.url_params.params.addressa);
          this.pds.setAddressData('addressb', this.url_params.params.addressb);
          this.pds.setAddressData('zipcode', this.url_params.params.zipcode);
          this.pds.setAddressData('latitude', +this.url_params.params.latitude);
          this.pds.setAddressData('longitude', +this.url_params.params.longitude);

          // if user clicked link from 1Button these fields should be in URI
          let client_first_name = this.url_params.params.client_first_name;
          client_first_name !== '' && this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName, client_first_name);

          let client_last_name = this.url_params.params.client_last_name;
          client_last_name !== '' && this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentClientLastName, client_last_name);

          let client_email = this.url_params.params.client_email;
          client_email !== '' && this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentClientEmail, client_email);

          let agent_first_name = this.url_params.params.agent_first_name;
          agent_first_name !== '' && this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentFirstName, agent_first_name);

          let agent_last_name = this.url_params.params.agent_last_name;
          agent_last_name !== '' && this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentLastName, agent_last_name);

          let agent_email = this.url_params.params.agent_email;
          this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentEmail, agent_email);
          this.pds.addUserData('OneBtnAgentEmail', agent_email);

          let agent_phone = this.url_params.params.agent_phone;
          this.pds.addUserData(this.fns.FieldNames.generalInfo.AgentPhone, agent_phone);

          let sla:boolean = this.url_params.params.listing_agreement == 'true' ? true : false;
          this.pds.addUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement, sla);

          // console.log('url params: ', this.url_params);
          // console.log('paramMap:', this.pds.getUserData('paramMap'));

          // console.log(this.pds.getAllUserData());
          // console.log(this.pds.getAllAddressData());

        }

        if (this.pds.getUserData('paramMap')) {
          this.pds.changeActivateExpressRouteStatus(true);
          // hide .pContact in the WP template (zp-header.php)
          const pcontact = <HTMLElement>document.getElementsByClassName('pContact')[0];
          pcontact.style.display = 'none';
          this.pds.changeSellerStatus(true);
          this.pds.changeBuyerStatus(false);
          this.ooconfigured = true;
          this.show_oo = false;
          this.pds.changeVisibilityOO(this.show_oo);
          this.show_pp = true;
          this.pds.changeVisibilityPP(this.show_pp);
          this.nav.goto.ppstart();
        }

      } else {
        this.have_params = false;
        this.show_oo = true;
        this.pds.changeVisibilityOO(this.show_oo);
        this.show_pp = false;
        this.pds.changeVisibilityPP(this.show_pp);
      }

    }));

    this.response_waiting = true;
    // this.nav.goto.home();

    //
    // zavvie.com has a 301 redirect to chop off anything in the URL
    // after /offer-optimizer and redirect to the base URL + /offer-optimizer
    //

    this.pds.setData('platformType', this.platformType);

    this.configService.getPlatforms(user_id).subscribe((data:any) => {
      // console.log('data: ', data);

      let bar:any = document.querySelector('.progress-bar');
      let msg:any = document.querySelector('.progress-msg');

      if (bar && msg) {
        bar.style.display = 'none';
        msg.style.display = 'none';
      }

      this.response_waiting = false;

      const platform_meta = data.post_meta;
      // console.log('can use cor: ', data.use_cor);
      data.use_cor && this.pds.changeCanUseCor(data.use_cor);

      // Decide if we should show Buyer OBZ (new) or just Sellers (old version)
      this.showBuyerOBZ = platform_meta.enable_buyer_solutions_obz && platform_meta.enable_buyer_solutions_obz[0] == 1 ? true : false;
      let status_seller = !this.showBuyerOBZ;
      this.pds.changeShowBuyerOneBtnStatus(this.showBuyerOBZ);
      this.pds.changeSellerStatus(status_seller);

      let do_ribbon:boolean = platform_meta.ribbon_active && platform_meta.ribbon_active[0] == 1 ? true : false;
      this.pds.setData('do_ribbon', do_ribbon);

      // Enable Cash and/or Lease Buyer
      this.enable_cash_buyer = platform_meta.show_cash_buyer_obz && platform_meta.show_cash_buyer_obz[0] == 1 ? true : false;
      this.enable_lease_buyer = platform_meta.show_lease_buyer_obz && platform_meta.show_lease_buyer_obz[0] == 1 ? true : false;
      this.pds.changeShowCashBuyerStatus(this.enable_cash_buyer);
      this.pds.changeShowLeaseBuyerStatus(this.enable_lease_buyer);

      this.showPoweredByZavvie = platform_meta.show_powered_by_zavvie && platform_meta.show_powered_by_zavvie[0] === '0' ? false : true;

      // Decide which Best Fit For text and Info Items to use (NSS or Platform)
      // Sellers
      this.info_items_aa = data.platform_info_items.aa;
      this.info_items_bridge = data.platform_info_items.bridge;
      this.info_items_standard = data.platform_info_items.standard;
      this.info_items_asis = data.platform_info_items.asis;
      this.pds.setMarketData('info_items_standard', this.info_items_standard);
      this.pds.setMarketData('info_items_bridge', this.info_items_bridge);
      this.pds.setMarketData('info_items_asis', this.info_items_asis);
      this.pds.setMarketData('info_items_aa', this.info_items_aa);

      // Buyers
      this.info_items_open_market = data.platform_info_items.open_market;
      this.info_items_cash_offer = data.platform_info_items.cash;
      this.info_items_lease = data.platform_info_items.lease;
      this.pds.setMarketData('info_items_open_market', this.info_items_open_market);
      this.pds.setMarketData('info_items_cash_offer', this.info_items_cash_offer);
      this.pds.setMarketData('info_items_lease', this.info_items_lease);

      // Sellers
      this.best_fit_aa = platform_meta.best_fit_for_aa && platform_meta.best_fit_for_aa[0] || '';
      this.best_fit_bridge = platform_meta.best_fit_for_bridge && platform_meta.best_fit_for_bridge[0] || '';
      this.best_fit_standard = platform_meta.best_fit_for_ibuyer && platform_meta.best_fit_for_ibuyer[0] || '';
      this.best_fit_asis = platform_meta.best_fit_for_asis && platform_meta.best_fit_for_asis[0] || '';
      this.pds.setMarketData('best_fit_standard', this.best_fit_standard);
      this.pds.setMarketData('best_fit_bridge', this.best_fit_bridge);
      this.pds.setMarketData('best_fit_asis', this.best_fit_asis);
      this.pds.setMarketData('best_fit_aa', this.best_fit_aa);

      // Buyers
      this.best_fit_open_market = platform_meta.best_fit_for_open_market && platform_meta.best_fit_for_open_market[0] || '';
      this.best_fit_cash_offer = platform_meta.best_fit_for_cash_offer && platform_meta.best_fit_for_cash_offer[0] || '';
      this.best_fit_lease = platform_meta.best_fit_for_lease_to_own && platform_meta.best_fit_for_lease_to_own[0] || '';
      this.pds.setMarketData('best_fit_open_market', this.best_fit_open_market);
      this.pds.setMarketData('best_fit_cash_offer', this.best_fit_cash_offer);
      this.pds.setMarketData('best_fit_lease', this.best_fit_lease);

      this.buyerMarketService.processBuyerMarket(data.national_buyer_solutions);

      this.pds.setData('platform_meta', platform_meta);

      this.pds.setData('pbPartnerId', platform_meta.pb_partner_id);

      this.pds.setHomeValueData('arv_mod', this.arv_mod);
      this.pds.setHomeValueData('arv_alt', this.arv_alt);

      this.partner = data.post_id;
      this.partnerName = data.post_title;

      // Tab label headings
      this.labels = {
        aaHeading: platform_meta.aa_heading[0],
        aaTerm: platform_meta.aa_term[0],
        ioHeading: platform_meta.io_heading[0],
        ioTerm: platform_meta.io_term[0],
        asIsTerm: platform_meta.io_term[0],
        bridgeHeading: platform_meta.bridge_heading[0],
        bridgeTerm: platform_meta.bridge_term[0],
        openMarketBuyerHeading: platform_meta.buyer_open_market_heading && platform_meta.buyer_open_market_heading[0] || 'Mortgage Financing',
        openMarketBuyerTerm: platform_meta.buyer_open_market_term && platform_meta.buyer_open_market_term[0] || 'Mortgage Financing',
        cashHeading: platform_meta.cash_buyer_heading && platform_meta.cash_buyer_heading[0] || 'Cash Offer',
        cashTerm: platform_meta.cash_buyer_term && platform_meta.cash_buyer_term[0] || 'Cash Offer',
        leaseToOwnHeading: platform_meta.lease_buyer_heading && platform_meta.lease_buyer_heading[0] || 'Homeownership Accelerator',
        leaseToOwnTerm: platform_meta.lease_buyer_term && platform_meta.lease_buyer_term[0] || 'Homeownership Accelerator'
      }

      let aaPlatformName = platform_meta.aa_heading && platform_meta.aa_heading[0] || 'Open Market';
      let ioPlatformName = platform_meta.io_heading && platform_meta.io_heading[0] || 'Instant Offers';
      this.pds.setData('aaPlatformName', aaPlatformName);
      this.pds.setData('ioPlatformName', ioPlatformName);

      this.pds.setData('programName', platform_meta.program_name && platform_meta.program_name[0] || 'Verified Buyers');

      this.pds.setData('labels', this.labels);

      this.pbPartnerId = platform_meta.pb_partner_id[0];

      this.pds.setData('partner', this.partner);
      this.pds.setData('partnerName', this.partnerName);
      this.pds.setData('pptype', this.pbPartnerId);
      console.log('partner', this.partner);
      console.log('partnerName', this.partnerName);

      let pptype = 'broker';
      this.pds.setData('pptype', pptype);

      this.cta = { // CTA links and labels
        aaCtaLabel: platform_meta.aa_cta_label[0],
        aaCtaLink: this.pp_link,
        ioCtaLabel: platform_meta.io_cta_label[0],
        ioCtaLink: this.pp_link,
        allCtaLabel: platform_meta.all_cta_label[0],
        allCtaLink: this.pp_link
      };

      this.pds.setData('cta', this.cta);

      this.text_standard = data.details.details_standard;
      this.text_bridge = data.details.details_bridge;
      this.text_major_repairs = data.details.details_major_reno;

      let om_explainer_default_txt = 'Traditional open market purchase with a mortgage lender.';
      let cash_explainer_default_txt = 'Turn your offer into a non-contingent cash offer.';
      let lease_explainer_default_txt = 'Use your rent payment as a way to build towards owning your home.';
      this.text_open_market = data.details.details_open_market || om_explainer_default_txt;
      this.text_cash_offer = data.details.details_cash_offer || cash_explainer_default_txt;
      this.text_lease_to_own = data.details.details_lease_to_own || lease_explainer_default_txt;

      this.oo_text = {
        text_standard: this.text_standard,
        text_bridge: this.text_bridge,
        text_major_repairs: this.text_major_repairs,
        text_open_market: this.text_open_market,
        text_cash_offer: this.text_cash_offer,
        text_lease_to_own: this.text_lease_to_own
      }

      this.pds.setData('oo_text', this.oo_text);
      this.hideBridge = platform_meta.hide_bridge && platform_meta.hide_bridge[0] == '1';
      this.pds.setData('hideBridge', this.hideBridge);

      this.hideEmailToClient = platform_meta.hide_email_client_option && platform_meta.hide_email_client_option[0] == '1';
      this.pds.setData('hideEmailToClient', this.hideEmailToClient);

      // Bridge can be hidden by WP admin
      if (!this.hideBridge) {
        let bridgePlatformName = platform_meta.bridge_heading && platform_meta.bridge_heading[0] || 'Bridge';
        this.pds.setData('bridgePlatformName', bridgePlatformName);
      }

      // Concierge & Home Warranty are shown/hidden by WP admin
      this.showConcierge = platform_meta.show_concierge && platform_meta.show_concierge[0] == '1';
      this.showConciergeImage = data.concierge_image ? true : false;
      this.showHomeWarranty = platform_meta.show_home_warranty_ad_oo && platform_meta.show_home_warranty_ad_oo[0] == '1' ? true : false;

      this.pds.setData('showConcierge', this.showConcierge);
      this.pds.setData('showConciergeImage', this.showConciergeImage);
      this.pds.setData('showHomeWarranty', this.showHomeWarranty);

      if (this.showConcierge) {
        this.conciergePlatformName = platform_meta.concierge_term && platform_meta.concierge_term[0] || 'Concierge';
        this.pds.setData('conciergePlatformName', this.conciergePlatformName);
        this.conciergeServiceFee = platform_meta.concierge_service_fee && platform_meta.concierge_service_fee[0] || 0.0;
        this.pds.setData('conciergeServiceFee', this.conciergeServiceFee);
        this.conciergeMultiplier = platform_meta.concierge_multiplier && platform_meta.concierge_multiplier[0] || 0.0;
        this.pds.setData('conciergeMultiplier', this.conciergeMultiplier);

        if (this.showConciergeImage) {
          let conciergeLink = platform_meta.concierge_link ? platform_meta.concierge_link[0] : false;
          this.pds.setData('conciergeLink', conciergeLink);
          let conciergeImage = data.concierge_image ? data.concierge_image : false;
          this.pds.setData('conciergeImage', conciergeImage);
        }
      }

      this.showMortgageLogo = platform_meta.show_mortgage_logo_obz && platform_meta.show_mortgage_logo_obz[0] == '1';
      this.pds.setData('showMortgageLogo', this.showMortgageLogo);

      if (this.showMortgageLogo) {
        let mortgageLink = platform_meta.mortgage_link ? platform_meta.mortgage_link[0] : '';
        let mortgageText = platform_meta.mortgage_text ? platform_meta.mortgage_text[0] : '';
        let mortgageEmail = platform_meta.mortgage_email ? platform_meta.mortgage_email[0] : '';
        let mortgageImage = data.mortgage_logo_image ? data.mortgage_logo_image : false;
        this.pds.setData('mortgageLink', mortgageLink);
        this.pds.setData('mortgageText', mortgageText);
        this.pds.setData('mortgageImage', mortgageImage);
        this.pds.setData('mortgageEmail', mortgageEmail);
      }

      this.showCashOffersLogo = platform_meta.show_cash_offers_logo_obz && platform_meta.show_cash_offers_logo_obz[0] == '1';
      this.pds.setData('showCashOffersLogo', this.showCashOffersLogo);

      if (this.showCashOffersLogo) {
        let cashLogoLink = platform_meta.cash_offers_link ? platform_meta.cash_offers_link[0] : '';
        let cashLogoText = platform_meta.cash_offers_text ? platform_meta.cash_offers_text[0] : '';
        let cashEmail = platform_meta.cash_offers_email ? platform_meta.cash_offers_email[0] : '';
        let cashLogoImage = data.cash_offers_image ? data.cash_offers_image : false;
        this.pds.setData('cashLogoLink', cashLogoLink);
        this.pds.setData('cashLogoText', cashLogoText);
        this.pds.setData('cashLogoImage', cashLogoImage);
        this.pds.setData('cashEmail', cashEmail);
      }

      if (this.showHomeWarranty) {
        let homeWarrantyLink = platform_meta.home_warranty_link ? platform_meta.home_warranty_link[0] : '';
        let homeWarrantyText = platform_meta.home_warranty_text ? platform_meta.home_warranty_text[0] : '';
        let homeWarrantyImage = data.home_warranty_image ? data.home_warranty_image : false;
        this.showHomeWarrantyImage = homeWarrantyImage ? true : false;
        this.pds.setData('showHomeWarrantyImage', this.showHomeWarrantyImage);
        this.pds.setData('homeWarrantyLink', homeWarrantyLink);
        this.pds.setData('homeWarrantyText', homeWarrantyText);
        this.pds.setData('homeWarrantyImage', homeWarrantyImage);
        let homeWarrantyLink_two = platform_meta.home_warranty_link_second ? platform_meta.home_warranty_link_second[0] : '';
        let homeWarrantyText_two = platform_meta.home_warranty_text_second ? platform_meta.home_warranty_text_second[0] : '';
        let homeWarrantyImage_two = data.second_home_warranty_img ? data.second_home_warranty_img : false;
        this.showHomeWarrantyImage_two = homeWarrantyImage_two ? true : false;
        this.pds.setData('showHomeWarrantyImage_two', this.showHomeWarrantyImage_two);
        this.pds.setData('homeWarrantyLink_two', homeWarrantyLink_two);
        this.pds.setData('homeWarrantyText_two', homeWarrantyText_two);
        this.pds.setData('homeWarrantyImage_two', homeWarrantyImage_two);
      }

      // get platform links from response
      this.res_links = data.platform_links;
      for (let link of this.res_links) {
        for (const [key, value] of Object.entries(link)) {
          if (key == 'offers') {
            this.offers_link = value;
            this.pds.setData('offers_link', this.offers_link);
          }
          if (key == 'property_profiler') {
            this.pp_link = value;
            this.pds.setData('pp_link', this.pp_link);
          }
        }
      }

      this.pds.setData('highlight', platform_meta.highlight_color[0]);


      // override css variables with partner specific ones
      document.documentElement.style.setProperty('--partner', platform_meta.text_color[0]);
      document.documentElement.style.setProperty('--highlight', this.pds.getData('highlight'));
      document.documentElement.style.setProperty('--slider_top', platform_meta.likelihood_fg[0]);
      document.documentElement.style.setProperty('--slider_bottom', platform_meta.likelihood_bg[0]);
      document.documentElement.style.setProperty('--bg-position', platform_meta.align_partner_bg[0]);

      // PDF needs this
      this.logo = data.logo;
      this.agent_logo = data.agent_photo && data.agent_photo;
      this.pds.setData('logo', this.logo);
      this.pds.setData('agent_logo', this.agent_logo);

      this.pds.setData('aa_program_img_src', data.aa_program_img.url);
      this.pds.setData('aa_program_img_alt', data.aa_program_img.alt);
      this.pds.setData('io_program_img_src', data.io_program_img.url);
      this.pds.setData('io_program_img_alt', data.io_program_img.alt);

      this.values = {
        aa: {
          open_mkt_price: '',
          service_fee: '',
          service_fee_percent: '',
          special_service_fee: parseFloat(this.conciergeServiceFee),
          seller_agent: '',
          seller_agent_percent: '',
          buyer_agent: '',
          buyer_agent_percent: '',
          prep_repairs: '',
          closing_costs: '',
          cos: '',
          net: '',
          use_concierge: false
        },
        trash: {}
      };

      this.pds.setMarketData('values', this.values);

      let assignNssAaValues = (val:any) => {
        val['con_io_type'] = this.national_aa['nss_io_type'];
        val['con_buyer_commission'] = this.national_aa['nss_aa_buyer_commission'];
        val['con_closing_costs'] = this.national_aa['nss_aa_closing_costs'];
        val['con_days_to_close'] = this.national_aa['nss_aa_days_to_close'];
        val['con_eligible'] = this.national_aa['nss_aa_eligible'];
        val['con_info_items'] = this.national_aa['nss_aa_info'];
        val['con_inspections'] = this.national_aa['nss_aa_inspections'];
        val['con_showings'] = this.national_aa['nss_aa_showings'];
        val['con_prep_repairs'] = this.national_aa['nss_aa_prep_repairs'];
        val['con_seller_commission'] = this.national_aa['nss_aa_seller_commission'];
        val['con_service_fee'] = this.national_aa['nss_aa_service_fee'];
      }

      let assignNssValues = (val:any, nss:any) => {
        val['con_io_type'] = nss['nss_io_type'];
        val['con_arv'] = nss['nss_arv'];
        val['con_arv_alt'] = nss['nss_arv_alt'];
        val['con_buyer_commission'] = nss['nss_buyer_commission'];
        val['con_closing_costs'] = nss['nss_closing_costs'];
        val['con_days_to_close'] = nss['nss_days_to_close'];
        val['con_eligible'] = nss['nss_eligible'];
        val['con_info_items'] = this.national_aa['nss_info'];
        val['con_high_market_modifier'] = nss['nss_high_market_modifier'];
        val['con_low_market_modifier'] = nss['nss_low_market_modifier'];
        val['con_high_hpv_modifier'] = nss['nss_high_hpv_modifier'];
        val['con_low_hpv_modifier'] = nss['nss_low_hpv_modifier'];
        val['con_high_service_fee'] = nss['nss_high_service_fee'];
        val['con_ibuyers'] = nss['nss_ibuyers'];
        val['con_inspections'] = nss['nss_inspections'];
        val['con_low_service_fee'] = nss['nss_low_service_fee'];
        val['con_prep_repairs'] = nss['nss_prep_repairs'];
        val['con_seller_commission'] = nss['nss_seller_commission'];
        val['con_showings'] = nss['nss_showings'];
        val['con_single_service_fee'] = nss['nss_single_service_fee'];

        // Set Bridge Service Fee Type based on Bridge SS Company
        // EasyKnock uses the standard calculation for sf: sf% x this.contractVal
        // Knock, Homeward, and Ribbon use the alt calculation for sf: sf% x this.values['bridge'].low/high_home_purchase_cost
        // in case both types of SS Co. exist, we'll call it bridge_hybrid,
        // and make both calculations using the lowest for low and highest for high
        if (val['con_io_type'] == 'bridge') {
          if (val["con_ibuyers"] ) {
            let bridge_sf_type = ( val["con_ibuyers"].indexOf('EasyKnock') > -1 && val["con_ibuyers"].length == 1 ) // Only EasyKnock
              ? 'bridge_std'
              : ( val["con_ibuyers"].indexOf('EasyKnock') == -1 // No EasyKnock AND
                && ( val["con_ibuyers"].indexOf('Knock') > -1 // Knock
                  || val["con_ibuyers"].indexOf('Homeward') > -1 // or Homeward
                  || val["con_ibuyers"].indexOf('Ribbon') > -1 ) ) // or Ribbon
                ? 'bridge_alt'
                : ( val["con_ibuyers"].indexOf('EasyKnock') > -1 // EasyKnock AND
                  && ( val["con_ibuyers"].indexOf('Knock') > -1 // Knock
                    || val["con_ibuyers"].indexOf('Homeward') > -1 // or Homeward
                    || val["con_ibuyers"].indexOf('Ribbon') > -1 ) ) // or Ribbon
                  ? 'bridge_hybrid'
                  : '';

            val['con_bridge_sf_type'] = bridge_sf_type;
          }
        }

        val['values_from_nss'] = true;
      };

      if (data.national_seller_solutions) {

        for (let nss of data.national_seller_solutions) {
          if (nss.nss_io_type === "aa") {
            this.national_aa = nss;
            this.best_fit_aa == '' && this.pds.setMarketData('best_fit_aa', nss.nss_best_fit_for);
            this.info_items_aa && this.info_items_aa.length < 1 && this.pds.setMarketData('info_items_aa', nss.nss_info);
          }
          if (nss.nss_io_type === "bridge") {
            this.national_bridge = nss;
            this.best_fit_bridge == '' && this.pds.setMarketData('best_fit_bridge', nss.nss_best_fit_for);
            this.info_items_bridge && this.info_items_bridge.length < 1 && this.pds.setMarketData('info_items_bridge', nss.nss_info);
          }
          if (nss.nss_io_type === "asis") {
            this.national_asis = nss;
            this.best_fit_asis == '' && this.pds.setMarketData('best_fit_asis', nss.nss_best_fit_for);
            this.info_items_asis && this.info_items_asis.length < 1 && this.pds.setMarketData('info_items_asis', nss.nss_info);
          }
          if (nss.nss_io_type === "standard") {
            this.national_standard = nss;
            this.best_fit_standard == '' && this.pds.setMarketData('best_fit_standard', nss.nss_best_fit_for);
            this.info_items_standard && this.info_items_standard.length < 1 && this.pds.setMarketData('info_items_standard', nss.nss_info);
          }
        }
      }

      if (this.national_aa) {
        assignNssAaValues(this.national_aa);
        this.national_aa.id = 99;
      }

      this.default_market = {
        con_offers: [],
        con_aa_offer: this.national_aa && this.national_aa
      };

      if (this.national_bridge) {
        assignNssValues(this.national_bridge, this.national_bridge);
        this.default_market.con_offers.push(this.national_bridge);
      }

      if (this.national_asis) {
        assignNssValues(this.national_asis, this.national_asis);
        this.default_market.con_offers.push(this.national_asis);
      }

      if (this.national_standard) {
        assignNssValues(this.national_standard, this.national_standard);
        this.default_market.con_offers.push(this.national_standard);
      }

      if (this.national_aa) {
        this.default_aa = this.national_aa;
      }

      for (let offer of this.default_market.con_offers) {
        if (offer) {
          // add an id to each offer
          offer.id = offer.con_io_type == 'standard'
            ? 12
            : offer.con_io_type == 'asis' ? 88 : 77;

          if (offer.con_io_type == 'asis') {
            this.arv_mod = offer.con_arv && (100-offer.con_arv);
            this.arv_alt = offer.con_arv_alt && offer.con_arv_alt;
            this.pds.setHomeValueData('arv_mod', this.arv_mod);
            this.pds.setHomeValueData('arv_alt', this.arv_alt);
          }
        }
      }

      this.pds.setMarketData('default_market', this.default_market);
      this.pds.setMarketData('default_aa', this.default_aa);
    });
  }
}

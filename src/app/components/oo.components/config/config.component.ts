import { Component, EventEmitter, OnInit,
  Input, Output } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FormBuilder, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FieldNameService } from '../../../services/field-name.service';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';

@Component({
  providers: [ConfigComponent],
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})

export class ConfigComponent implements OnInit {
  @Input() showPoweredByZavvie:boolean = false;
  @Input() showBuyerOBZ:any;
  @Input() aaTerm:string = '';
  @Input() aaHeading:string = '';
  @Input() ioHeading:string = '';
  @Input() ioTerm:string = '';
  @Input() asIsTerm:string = '';
  @Input() bridgeHeading:string = '';
  @Input() bridgeTerm:string = '';
  @Input() openMarketBuyerHeading:string = '';
  @Input() cashHeading:string = '';
  @Input() leaseToOwnHeading:string = '';
  @Input() res_wait:any;
  @Input() hideBridge:any;
  @Input() ppaddress:string = '';

  @Output() configured = new EventEmitter<boolean>();

  showBuyerOO = () => this.showBuyerOBZ;

  isbuyer:any;
  isseller:any;
  isSellerChecked:boolean = false;
  isBuyerChecked:boolean = false;

  alsoSelling:boolean = false;

  address_changed:boolean = false;
  cnfgrd:boolean = false;
  reconfigured:boolean = false;
  buyerFormConfigured:boolean = false;

  pId:any = this.configService.getPlatformIds().partnerId;
  partnerId:any = this.pId;

  location:string = '';
  addressChosenFromList:boolean = false;
  offerData:any;
  altIbuyers:any = [];
  altIbuyerInMarket:boolean = false;
  isMajorReno:boolean = false;
  isBridge:boolean = false;
  altIbuyerExists:any;
  asIsSituation: any;

  haveIos:any = null;
  homeValue: any;
  homeCondition: any;

  national_market:any = [];
  aa_overrides = [];
  standard_overrides = [];
  bridge_overrides = [];
  asis_overrides = [];

  national_aa:any;
  national_bridge:any;
  national_standard:any;
  national_asis:any;

  arv_mod:any = 0.2;
  arv_alt:any = 0.2;

  values: any;
  buyervalues: any;
  market:any;
  aa:any;
  buyer_aa:any;

  conditions:any = [ 
    { id: 1, name: 'Pristine', mod: .25 },
    { id: 2, name: 'Needs minor repairs', mod: 1 },
    { id: 3, name: 'Needs major repairs', mod: this.arv_mod }
  ];

  goBtnClass:any;

  pdfImagesFinished:boolean = false;

  minval:number = 0;
  maxval:number = 0;

  BASEPATH:string = this.platformDataService.getData('home');

  constructor(
    private configService: ConfigService,
    private fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private nav: NavService) {
  }

  showSellerDummies:boolean = true;
  showBuyerDummies:boolean = false;

  public changeBuyer = (isBuyer:boolean) => {
    this.isbuyer = isBuyer;
    this.platformDataService.changeBuyerStatus(this.isbuyer);
    this.showSellerDummies = false;
    this.showBuyerDummies = true;
  }
  public changeSeller = (isSeller:boolean) => {
    this.isseller = isSeller;
    this.platformDataService.changeSellerStatus(this.isseller);
    this.showSellerDummies = true;
    this.showBuyerDummies = false;
  }

  statusBuyer = () => this.isbuyer;
  statusSeller = () => this.isseller;

  public toggleResults = () => {
    this.showSellerDummies = !this.showSellerDummies;
    this.showBuyerDummies = !this.showBuyerDummies;
  }

  public changeUserType = (e:any) => {
    e.target.value == ''
      ? (this.ooConfigForm.reset(),
        this.changeBuyer(false), this.changeSeller(false))
      : e.target.value == 'Buyer'
        ? (this.changeBuyer(true), this.changeSeller(false),
            this.showSellerDummies = false, this.showBuyerDummies = true)
        : e.target.value == 'Seller'
          ? (this.changeBuyer(false), this.changeSeller(true),
              this.showSellerDummies = true, this.showBuyerDummies = false)
          : (this.changeBuyer(true), this.changeSeller(true),
              this.showSellerDummies = true, this.showBuyerDummies = false);
  }

  public resetUserTypeForm(): void {
    let item = {
      target: {
        value: ''
      }
    }
    this.changeUserType(item);
  }

  userTypes:any = [
    'Seller',
    'Buyer',
    'Both'
  ];
  
  userTypeChanged = () => {
    if (this.isbuyer && this.isseller) {
      this.userTypeForm.get('userType')!.patchValue('Both', {
        onlySelf: true
      })
    }
  }

  toggleAlsoSellingCheckbox = () => {
    this.changeSeller(true);
    this.userTypeChanged();
  }

  formattedAddress:string = '';
  address:string = '';

  userTypeForm = this.fb.group({
    'userType': ['', [Validators.required]],
    'alsoSellingCheckbox': []
  });
  ooConfigForm = this.fb.group({
    'minPrice': ['', [Validators.minLength(4), Validators.maxLength(11)]],
    'maxPrice': ['', [Validators.minLength(4), Validators.maxLength(11)]],
    'homeAddress': [this.ppaddress],
    'homeValue': ['', [Validators.minLength(4)]],
    'homeCondition': [this.conditions[1]]
  });

  setConfigFormValidator() {
    const minPrice = this.ooConfigForm.get('minPrice');
    const maxPrice = this.ooConfigForm.get('maxPrice');

    const homeAddress = this.ooConfigForm.get('homeAddress');
    const homeValue = this.ooConfigForm.get('homeValue');

    this.userTypeForm.get('userType')!.valueChanges.subscribe(userType => {
      if (userType === 'Seller') {
        // Seller stuff is required
        // Buyer stuff not required
        homeAddress!.setValidators([Validators.required]);
        homeValue!.setValidators([Validators.required]);
        minPrice!.setValidators(null);
        maxPrice!.setValidators(null);
      }
      if (userType === 'Buyer') {
        // Buyer stuff is required
        // Seller stuff not required
        minPrice!.setValidators([Validators.required]);
        maxPrice!.setValidators([Validators.required]);
        homeAddress!.setValidators(null);
        homeValue!.setValidators(null);
      }
      if (userType === 'Both') {
        // Buyer stuff is required
        // Seller stuff is required
        minPrice!.setValidators([Validators.required]);
        maxPrice!.setValidators([Validators.required]);
        homeAddress!.setValidators([Validators.required]);
        homeValue!.setValidators([Validators.required]);
      }
    })
  }

  addressa = '';
  addressb = "";
  cityName = '';
  stateName = '';
  zipCode = '';
  county = '';
  lng = "";
  lat = "";

  pbz_logo = {
    url: '//zavvie.com/wp-content/uploads/2020/02/powered-by-zavvie.png',
    alt: 'Powered by zavvie'
  }
  
  // google auto fill
  options = {
    componentRestrictions: { 
      country: [ 'US' ]
    }
  }

  environment:string = (window.location.hostname === 'localhost')
    ? 'local'
    : window.location.hostname === 'zavvie.com'
      ? 'production'
      : 'staging';

  addressInputValue:string = '';
  public addressChanged = (e:any) => {
    this.addressChosenFromList = false;
    this.addressInputValue = e.target.value;
    this.platformDataService.setAddressData('formattedAddress', this.addressInputValue);
    this.platformDataService.setHomeValueData('homeValue', '');
    this.ooConfigForm.patchValue({ homeValue: '' }, { emitEvent:false })
    this.ooConfigForm.patchValue({ 'homeCondition': this.conditions[1] });
  }

  buyersolutions:any = [];

  public handleAddressChange(address: any) {

    let origin:string = window.location.origin;
    let home:string = (origin == 'http://localhost:4200')
      ? '/' : this.platformDataService.getData('home');

    this.platformDataService.changeAddress(false);
    this.platformDataService.changeReconfigured(true);
    this.platformDataService.setData('ppid', null); // make sure we make a new PP for this new address

    this.router.navigate([home], { queryParamsHandling: 'preserve' });
    this.address_changed = true; // turn on loading spinner
    this.configured.emit(false);
    this.cnfgrd = false;
    this.reconfigured = false;
    this.formattedAddress = address.formatted_address;
    this.platformDataService.changeAppAddress(this.formattedAddress);
    this.addressa = address.name;
    // console.log('address:', address);

    let AddressArray = address.address_components;

    if (address.geometry === undefined || address.geometry === null) {
      return;
    }

    for (let comp of AddressArray) {
      if (comp.types[0] === 'locality') {
        this.cityName = comp.long_name;
      }
      if (comp.types[0] === 'administrative_area_level_1') {
        this.stateName = comp.short_name;
      }
      if (comp.types[0] === 'administrative_area_level_2') {
        this.county = comp.short_name;
      }
      if (comp.types[0] === 'postal_code') {
        this.zipCode = comp.short_name;
      }
    }

    this.configService.getVerifiedBuyersByZip(this.zipCode).subscribe((data:any) => {
      // console.log('vb data', data);
      let easyknock:boolean = false;
      this.platformDataService.setMarketData('bridge_vbs', data.bridge_vbs);
      this.platformDataService.setMarketData('ibuyer_vbs', data.ibuyer_vbs);
      this.platformDataService.setMarketData('reno_vbs', data.reno_vbs);
      if (data.bridge_vbs && data.bridge_vbs.indexOf('EasyKnock') >= 0) {
        easyknock = true;
      }
      this.platformDataService.setMarketData('easyknock', easyknock);
    });

    this.lng = address.geometry.location.lng();
    this.lat = address.geometry.location.lat();
    this.addressb = `${this.cityName} ${this.stateName}, ${this.zipCode}`;
    let addyFieldName = this.fns.FieldNames.confirmAddress.Address;
    this.platformDataService.changeOldAddress(this.platformDataService.getAddressData(addyFieldName) || null);
    this.platformDataService.setAddressData('formattedAddress', this.formattedAddress);
    this.platformDataService.setAddressData('addressa', this.addressa);
    this.platformDataService.setAddressData('addressb', this.addressb);
    this.platformDataService.setAddressData('city', this.cityName);
    this.platformDataService.setAddressData('state', this.stateName);
    this.platformDataService.setAddressData('zipcode', this.zipCode);
    this.platformDataService.setAddressData('county', this.county);
    this.platformDataService.setAddressData('latitude', this.lat);
    this.platformDataService.setAddressData('longitude', this.lng);
    let cta_suffix = '?addressa=' + encodeURIComponent(this.addressa) + '&addressb=' + encodeURIComponent(this.addressb);
    this.platformDataService.setAddressData('cta_suffix', cta_suffix);

    let assignNssAaValues = (val:any) => {
      val['con_io_type'] = this.national_aa['nss_io_type'];
      val['con_buyer_commission'] = this.national_aa['nss_aa_buyer_commission'];
      val['con_closing_costs'] = this.national_aa['nss_aa_closing_costs'];
      val['con_days_to_close'] = this.national_aa['nss_aa_days_to_close'];
      val['con_eligible'] = this.national_aa['nss_aa_eligible'];
      val['con_inspections'] = this.national_aa['nss_aa_inspections'];
      val['con_showings'] = this.national_aa['nss_aa_showings'];
      val['con_prep_repairs'] = this.national_aa['nss_aa_prep_repairs'];
      val['con_seller_commission'] = this.national_aa['nss_aa_seller_commission'];
      val['con_service_fee'] = this.national_aa['nss_aa_service_fee'];
    }
  
    // assigns vals to con_
    let assignMarketValues = (val:any, origin:any) => {
      val['con_io_type'] = origin['market_io_type'];
      val['con_arv'] = origin['market_arv'];
      val['con_arv_alt'] = origin['market_arv_alt'];
      val['con_buyer_commission'] = origin['market_buyer_commission'];
      val['con_closing_costs'] = origin['market_closing_costs'];
      val['con_days_to_close'] = origin['market_days_to_close'];
      val['con_eligible'] = origin['market_eligible'];
      val['con_high_market_modifier'] = origin['market_high_market_modifier'];
      val['con_low_market_modifier'] = origin['market_low_market_modifier'];
      val['con_high_hpv_modifier'] = origin['market_high_hpv_modifier'];
      val['con_low_hpv_modifier'] = origin['market_low_hpv_modifier'];
      val['con_high_service_fee'] = origin['market_high_service_fee'];
      val['con_ibuyers'] = origin['market_ibuyers'];
      val['con_inspections'] = origin['market_inspections'];
      val['con_low_service_fee'] = origin['market_low_service_fee'];
      val['con_prep_repairs'] = origin['market_prep_repairs'];
      val['con_seller_commission'] = origin['market_seller_commission'];
      val['con_showings'] = origin['market_showings'];
      val['con_single_service_fee'] = origin['market_single_service_fee'];
  
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
    };
  
    // assign Default Market AA
    let assignAaDefaultValues = (val:any, origin:any) => {
      val['con_io_type'] = 'aa';
      val['con_buyer_commission'] = origin['buyer_commission'];
      val['con_closing_costs'] = origin['closing_costs'];
      val['con_days_to_close'] = origin['days_to_close'];
      val['con_eligible'] = origin['eligible'];
      val['con_inspections'] = origin['inspections'];
      val['con_showings'] = origin['showings'];
      val['con_prep_repairs'] = origin['prep_repairs'];
      val['con_seller_commission'] = origin['seller_commission'];
      val['con_service_fee'] = origin['service_fee'];
      val['values_from_market_default'] = true;
    };

    this.configService.getMarket(this.stateName, this.county).subscribe((data:any)=> {

      // Set up the National Market
      if (data.market.length > 0) {
        for (let resmkt of data.market) {
          // reorganize to fit app schema
          resmkt.con_offers = [];
          resmkt.all_overrides = resmkt.mkt_ibuyers;

          // make sure our Market Defaults have a market_io_type
          let no_defaults = !resmkt.mkt_defaults || resmkt.mkt_defaults.length == 0;

          if (no_defaults) { // no Mkt Defaults found -- use NSS
            resmkt.mkt_defaults = {
              mkt_default_aa: {},
              mkt_default_bridge: {},
              mkt_default_std: {},
              mkt_default_major_repairs: {}
            };
          }
          if (resmkt.mkt_defaults.mkt_default_aa) {
            resmkt.mkt_defaults.mkt_default_aa.market_io_type = 'aa';
          } 
          if (resmkt.mkt_defaults.mkt_default_bridge) {
            resmkt.mkt_defaults.mkt_default_bridge.market_io_type = 'bridge';
          }
          if (resmkt.mkt_defaults.mkt_default_std) {
            resmkt.mkt_defaults.mkt_default_std.market_io_type = 'standard';
          }
          if (resmkt.mkt_defaults.mkt_default_major_repairs) {
            resmkt.mkt_defaults.mkt_default_major_repairs.market_io_type = 'asis';
          }

          if (resmkt.mkt_ibuyers) {
            let ibuyers = [];
            for (let ss of resmkt.mkt_ibuyers) {
              ibuyers.push(ss.market_io_type);
            }
            ibuyers.indexOf('aa') === -1 && resmkt.mkt_ibuyers.push(resmkt.mkt_defaults.mkt_default_aa);
            ibuyers.indexOf('bridge') === -1 && resmkt.mkt_ibuyers.push(resmkt.mkt_defaults.mkt_default_bridge);
            ibuyers.indexOf('asis') === -1 && resmkt.mkt_ibuyers.push(resmkt.mkt_defaults.mkt_default_major_repairs);
            ibuyers.indexOf('standard') === -1 && resmkt.mkt_ibuyers.push(resmkt.mkt_defaults.mkt_default_std);
          }

          let found_aa = false;
          let found_bridge = false;
          let found_asis = false;
          let found_std = false;

          // build national_market from all of our markets
          this.national_market = [];
          this.national_market.push(resmkt);

          let findOverride = (mkt:any, ss:any, ssType:any, id:any) => {
            let market_override = 'market_override_' + ssType;
            if ( ss['market_io_type'] === ssType && ss[market_override]) {
              // override IDs -- there can be multiple, need to loop through them
              for ( let mkt_override of ss[market_override] ) {
                if (mkt_override[id] == this.partnerId) {
                  // Assign OVERRIDE values
                  assignMarketValues(ss, ss);
                  ss['values_from_market_default'] = false;
                  ss['values_from_market_override'] = true;
                  mkt.con_offers.push(ss);
                  console.log(mkt.market, '[' + ssType + '][OVERRIDE] USE OVERRIDE VALUES');
                  ssType == 'aa' ? found_aa = true
                    : ssType == 'standard' ? found_std = true
                      : ssType == 'asis' ? found_asis = true
                        : found_bridge = true;
                  break;
                }
              }
            }
          };

          // duplicate key/value pairs and change name to "con_..."
          // format markets to flow through the app
          // if no Market Override, we just set the market variables to the Market Defaults
          if (resmkt.mkt_ibuyers) {
            for (let value of resmkt.mkt_ibuyers) { // loop through Seller Solutions
              if (value) {
                // Look for SS overrides
                if (value['market_io_type'] === 'aa' && value['market_override_aa']) {
                  // override IDs -- there can be multiple, need to loop through them
                  for ( let mkt_override of value['market_override_aa'] ) {
                    if (mkt_override.market_aa_override_id == this.partnerId) {
                      // our override Id matches our partnerId
                      // so use the market override values
                      value['con_io_type'] = value['market_io_type'];
                      value['con_buyer_commission'] = value.market_override_aa_offer['market_buyer_commission'];
                      value['con_closing_costs'] = value.market_override_aa_offer['market_closing_costs'];
                      value['con_days_to_close'] = value.market_override_aa_offer['market_days_to_close'];
                      value['con_eligible'] = value.market_override_aa_offer['market_eligible'];
                      value['con_inspections'] = value.market_override_aa_offer['market_inspections'];
                      value['con_showings'] = value.market_override_aa_offer['market_showings'];
                      value['con_prep_repairs'] = value.market_override_aa_offer['market_prep_repairs'];
                      value['con_seller_commission'] = value.market_override_aa_offer['market_seller_commission'];
                      value['con_service_fee'] = value.market_override_aa_offer['market_service_fee'];
                      value['values_from_market_default'] = false;
                      value['values_from_market_override'] = true;
                      resmkt['con_aa_offer'] = value;
                      console.log(resmkt.market, '[OPEN MARKET][OVERRIDE] USE OVERRIDE VALUES');
                      found_aa = true;
                      break;
                    }
                  }
                }

                findOverride(resmkt, value, 'bridge', 'market_bridge_override_id');
                findOverride(resmkt, value, 'asis', 'market_asis_override_id');
                findOverride(resmkt, value, 'standard', 'market_standard_override_id');

                // set the arv if asis
                if (value.market_io_type == 'asis') {
                  this.arv_mod = value.market_arv && (100-value.market_arv);
                  this.arv_alt = value.market_arv_alt && value.market_arv_alt;
                  this.platformDataService.setHomeValueData('arv_mod', this.arv_mod);
                  this.platformDataService.setHomeValueData('arv_alt', this.arv_alt);
                }
              }
            }
          }

          if (!found_aa) {
            // there will always be an Open Market SS
            resmkt.con_aa_offer = resmkt.mkt_defaults.mkt_default_aa;
            no_defaults // if no defaults were found assign nss vals
              ? assignNssAaValues(resmkt.mkt_defaults.mkt_default_aa)
              : assignAaDefaultValues(resmkt.mkt_defaults.mkt_default_aa, resmkt.mkt_defaults.mkt_default_aa);
            resmkt.con_aa_offer = resmkt.mkt_defaults.mkt_default_aa;
            resmkt.con_aa_offer['values_from_market_default'] = true;
            resmkt['values_from_market_default_aa'] = true;
            console.log(resmkt.market, '[Open Market] Market Default Values 200');
          }
          if (!found_bridge) {
            // ACF Show Bridge
            resmkt.con_offers.push(resmkt.mkt_defaults.mkt_default_bridge);
            assignMarketValues(resmkt.mkt_defaults.mkt_default_bridge, resmkt.mkt_defaults.mkt_default_bridge);
            resmkt.mkt_defaults.mkt_default_bridge['values_from_market_default'] = true;
            console.log(resmkt.market, '[Bridge] Market Default Values 300');
          }
          if (!found_asis) {
            // ACF Show Major Reno
            resmkt.con_offers.push(resmkt.mkt_defaults.mkt_default_major_repairs);
            assignMarketValues(resmkt.mkt_defaults.mkt_default_major_repairs, resmkt.mkt_defaults.mkt_default_major_repairs);
            resmkt.mkt_defaults.mkt_default_major_repairs['values_from_market_default'] = true;
            console.log(resmkt.market, '[Major Repairs] Market Default Values 200');
          }
          if (!found_std) {
            // ACF show Standard
            resmkt.con_offers.push(resmkt.mkt_defaults.mkt_default_std);
            assignMarketValues(resmkt.mkt_defaults.mkt_default_std, resmkt.mkt_defaults.mkt_default_std);
            resmkt.mkt_defaults.mkt_default_std['values_from_market_default'] = true;
            console.log(resmkt.market, '[Standard] Market Default Values 200');
          }

          // make sure Std offer is in last position
          for (let offer of resmkt.con_offers) {
            if (offer.market_io_type == 'standard') {
              resmkt.con_offers.push(resmkt.con_offers.splice(resmkt.con_offers.indexOf(offer), 1)[0]);
            }
          }

          for (let offer of resmkt.con_offers) {
            if (offer) {
              // make sure everything has an id
              offer.id = offer.market_io_type == 'standard'
              ? 12 // standard
              : offer.market_io_type == 'asis'
                ? 88 // asis
                : offer.market_io_type == 'aa'
                  ? 99 // aa
                  : 77; // bridge
            }
          }
        }
      } else {
        // No markets configured. Use National Default Mkt
        this.national_market = [];
        this.national_market.push(this.platformDataService.getMarketData('default_market'));
      }

      // Send the market data to the Market Service
      this.platformDataService.setMarketData('national_market', this.national_market);

      //
      // add the NatMark to the window
      //
      window.zavvie_national_market = this.national_market;
      // console.log('config comp national_market:', this.national_market);

      this.offerData = this.national_market[0]; // now we know which locale is The One
      // console.log('got it:', this.offerData);

      this.altIbuyers = [];
      if (this.offerData.con_offers) {
        for (let offer of this.offerData.con_offers) {
          if (offer.con_io_type === 'asis') {
            this.isMajorReno = true;
            this.altIbuyerInMarket = true;
            this.altIbuyerExists = () => true;
            this.altIbuyers.push(offer);
          }

          if (offer.con_io_type === 'bridge') {
            this.isBridge = true;
            this.altIbuyerInMarket = true;
            this.altIbuyerExists = () => true;
            this.altIbuyers.push(offer);
          }
        }
      }

      // we do have IOs now
      this.haveIos = true;
      // update the arv_mod now that we have a real number
      this.conditions[2].mod = this.platformDataService.getHomeValueData('arv_mod');
      this.address_changed = false; // turn off loading spinner
      return;
    });

    this.addressChosenFromList = true;
  }

  resetForm = () => {
    this.configured.emit(false);
    this.cnfgrd = false;
    this.reconfigured = false;
  }

  resetBuyerForm:boolean = false;

  changeBuyerMin = (e:any) => {
    this.resetForm();
    this.minval = e.target.value.replace("$", "").replaceAll(",", "");
    this.platformDataService.changeBuyerMinPrice(this.minval);
  }

  changeBuyerMax = (e:any) => {
    this.resetForm();
    this.maxval = e.target.value.replace("$", "").replaceAll(",", "");
    this.platformDataService.changeBuyerMaxPrice(this.maxval);
  }

  getHomeValue = () => this.homeValue;

  disablePdfButton = () => (this.configured && this.haveIos) ? false : true;
  pdfDisabledClass = () => (this.configured && this.haveIos) ? '' : 'disabled';

  // make sure any whole numbers have a .0 after
  addDecimal = (val:any) => {
    return (val.indexOf('.') !== -1)
      ? val : val + '.0';
  }

  buyerFormValid = () => {
    let min = this.ooConfigForm.get('minPrice')!.value
      ? this.ooConfigForm.get('minPrice')!.value.replace("$", "").replaceAll(",", "") : 0;
    let max = this.ooConfigForm.get('maxPrice')!.value
      ? this.ooConfigForm.get('maxPrice')!.value.replace("$", "").replaceAll(",", "") : 0;

    return min.length >= 4 && max.length >= 4 || this.cnfgrd || this.reconfigured;
  }

  sellerFormInvalid = () => {
    return this.isbuyer
      ? !this.buyerFormValid() || !this.ooConfigForm.get('homeAddress')!.valid
        || !this.ooConfigForm.get('homeValue')!.valid
        || !this.ooConfigForm.get('homeCondition')!.valid
        || this.cnfgrd || this.reconfigured || !this.addressChosenFromList
      : !this.ooConfigForm.get('homeAddress')!.valid
        || !this.ooConfigForm.get('homeValue')!.valid
        || !this.ooConfigForm.get('homeCondition')!.valid
        || this.cnfgrd || this.reconfigured || !this.addressChosenFromList;
  }

  configureBuyerForm = () => {
    this.buyerFormConfigured = true;
    // this.resetBuyerForm = false;
  }
  
  verified_buyers:any;

  configureOO = () => {
    const platform_meta = this.platformDataService.getData('platform_meta');

    let pbPartnerId = platform_meta.pb_partner_id[0];

    this.values = this.platformDataService.getMarketData('values');

    if (this.isseller) {
      const hideBridge = platform_meta.hide_bridge && platform_meta.hide_bridge[0] == '1';
  
      if (this.offerData) {
        // create objects as containers for our AA and IO data
        // This can be updated by the user and then reset to defaults upon re-configuring
        // IO data container.
        if (this.offerData.con_offers) {
          for (let offer of this.offerData.con_offers) {
            if (offer) {
              offer.con_prep_repairs = offer.con_prep_repairs === "" ? '0.0' : offer.con_prep_repairs;
              let pr_copy = JSON.parse( JSON.stringify( offer.con_prep_repairs ) );
              offer.pr_low = pr_copy;
              offer.pr_high = pr_copy;
              offer.alt_pr_low = '0.0';
              offer.alt_pr_high = '0.0';
              offer.con_closing_costs = offer.con_closing_costs === "" ? '0.0' : offer.con_closing_costs;
              let cc_copy = JSON.parse( JSON.stringify( offer.con_closing_costs ) );
              offer.cc_low = cc_copy;
              offer.cc_high = cc_copy;
            }
          }
        }
  
        // create our AA offer
        // make any empty strings 0
        for (let item in this.offerData.con_aa_offer) item = item === "" ? '0' : item;
        this.market = JSON.parse( JSON.stringify( this.offerData ) );
        if (hideBridge) { // remove the bridge SS if hideBridge
          for (let [index, value] of this.market.con_offers.entries()) {
            value.con_io_type == 'bridge' && this.market.con_offers.splice(index, 1);
          }
        }
  
        this.aa = JSON.parse( JSON.stringify( this.offerData.con_aa_offer ) );
        // add other necessary info
        this.aa.io_name = 'Agent-Assisted';
        this.aa.con_io_type = 'aa';
        this.aa.id = 99;
        this.aa.alt_prep_repairs = '0.0';
        this.aa.use_concierge = false;
        this.values.aa.service_fee_percent = this.aa.con_service_fee;
        this.values.aa.seller_agent_percent = this.aa.con_seller_commission;
        this.values.aa.buyer_agent_percent = this.aa.con_buyer_commission;
        this.platformDataService.setHomeValueData('aa', this.aa);
      }
  
      if (this.market && this.market.con_offers) {
  
        for (let offer of this.market.con_offers) {
          let newIoTypeName = offer.con_io_type;
          
          if ( newIoTypeName != 'aa' ) {
            this.values[newIoTypeName] = {
              low_open_mkt_price: '',
              high_open_mkt_price: '',
              bridge_mkt_price: '',
              low_home_purchase_cost: '',
              high_home_purchase_cost: '',
              low_service_fee: '',
              low_service_fee_percent: offer.con_low_service_fee,
              high_service_fee: '',
              high_service_fee_percent: offer.con_high_service_fee,
              seller_agent_percent: offer.con_seller_commission,
              low_seller_agent: '',
              high_seller_agent: '',
              buyer_agent_percent: offer.con_buyer_commission,
              low_buyer_agent: '',
              high_buyer_agent: '',
              low_prep_repairs: '',
              high_prep_repairs: '',
              low_closing_costs: '',
              high_closing_costs: '',
              low_cos: '',
              high_cos: '',
              low_net: '',
              high_net: '',
              mlot_low: '',
              mlot_high: ''
            }
          }
        }
      }

      this.platformDataService.setHomeValueData('market', this.market);
      this.platformDataService.setHomeValueData('values', this.values);
  
      this.homeValue = this.ooConfigForm.get('homeValue')!.value;
      this.platformDataService.setHomeValueData('homeValue', this.homeValue.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,''));
      this.platformDataService.addUserData(this.fns.FieldNames.property1.ApproximateHomeVal, this.homeValue.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,''));
  
      this.homeCondition = this.ooConfigForm.get('homeCondition')!.value;
      this.platformDataService.setHomeValueData('homeCondition', this.homeCondition);
      this.platformDataService.addUserData('HomeCondition', this.homeCondition.name);
  
      // this.addressChosenFromList = false;

      window.dataLayer && window.dataLayer.push({
        'event': 'oo.submit',
        'platformId': pbPartnerId,
        'addressEntered': this.formattedAddress,
        'homeValue': this.getHomeValue()
      });
    }

    this.configService.getVerifiedBuyersByZip('').subscribe((data:any) => {
      this.platformDataService.changeVerifiedBuyers(data);
      this.configService.getBuyerLinks([]).subscribe((links_data:any) => {
        this.platformDataService.setMarketData('Verified Buyers', links_data);
        // console.log('VBS:', this.platformDataService.getMarketData('Verified Buyers'));
      });
    });

    if (this.isbuyer) {

      this.configureBuyerForm();

      let min = this.ooConfigForm.get('minPrice')!.value.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,'');
      let max = this.ooConfigForm.get('maxPrice')!.value.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,'');
    
      let homeValueLow = parseInt(min) < parseInt(max) ? min : max;
      let homeValueHigh = parseInt(max) > parseInt(min) ? max : min;

      this.platformDataService.setHomeValueData('homeValueLow', homeValueLow);
      this.platformDataService.setHomeValueData('homeValueHigh', homeValueHigh);

      this.buyersolutions = this.platformDataService.getMarketData('buyersolutions');
      this.buyervalues = this.platformDataService.getHomeValueData('buyervalues');
    }

    let buttons = document.querySelector('.config-buttons');
    this.haveIos
      // show our filter and PDF download buttons
      ? buttons && buttons.classList.remove('ng-hide')
      : buttons && buttons.classList.add('ng-hide');

    this.configured.emit(true);
    this.cnfgrd = true;
    this.reconfigured = false;

    this.ppVisible && this.platformDataService.changeVisibilityPP(false);
    this.generatePdfImgs();
  }

  sp_affinity:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_nextsteps:any = '';

  embed_pdf_img = (img_url:string, img_alt:string, img_txt:string) => {
    let env = this.configService.getEnv();
    let pdfImg = document.createElement("img");
    env === 'production' || window.location.origin === 'http://localhost:8888' // Production or Local MAMP
      ? pdfImg.setAttribute('src', img_url)
      : env === 'staging' // Staging
        ? pdfImg.setAttribute('src', img_url.replace('//zavvie.com/', '//staging.zavvie.com/'))
        : pdfImg.setAttribute('src', 'assets/img/BHHS-Perrie-Mundie-Cab-NO-SEAL-1.png'); // Local non-MAMP
    pdfImg.setAttribute('id', img_txt);
    pdfImg.setAttribute('alt', img_alt);
    pdfImg.setAttribute('style', 'display: none');
    document.body.appendChild(pdfImg);
  }

  generatePdfImgs = () => {

    let showMortgageImg = this.platformDataService.getData('showMortgageLogo');
    let showConciergeImage = this.platformDataService.getData('showConciergeImage');
    let showHomeWarrantyImage = this.platformDataService.getData('showHomeWarrantyImage');
    let showHomeWarrantyImage_two = this.platformDataService.getData('showHomeWarrantyImage_two');
    this.sp_affinity = this.platformDataService.getData('sp_affinity');

    if (!this.pdfImagesFinished) {
      this.embed_pdf_img(this.platformDataService.getData('logo').url, this.platformDataService.getData('logo').alt, 'hidden');

      if (this.sp_affinity === "1") {
        this.sp_affinity_name = this.platformDataService.getData('sp_affinity_name');
        this.sp_affinity_logo = this.platformDataService.getData('sp_affinity_logo');
        this.embed_pdf_img(this.sp_affinity_logo, this.sp_affinity_name, 'hidden_sp_affinity_img');
      }

      if (showMortgageImg) {
        let mortgage_img:any = this.platformDataService.getData('mortgageImage');
        this.embed_pdf_img(mortgage_img.url, mortgage_img.alt, 'mortgage_img');
      }

      if (showHomeWarrantyImage) {
        let homewarranty_image:any = this.platformDataService.getData('homeWarrantyImage');
        this.embed_pdf_img(homewarranty_image.url, homewarranty_image.alt, 'hidden_home_warranty_1');
      }

      if (showHomeWarrantyImage_two) {
        let homewarranty_image_two:any = this.platformDataService.getData('homeWarrantyImage_two');
        this.embed_pdf_img(homewarranty_image_two.url, homewarranty_image_two.alt, 'hidden_home_warranty_2');
      }

      if (showConciergeImage) {
        let concierge_img = this.platformDataService.getData('conciergeImage');
        this.embed_pdf_img(concierge_img.url, concierge_img.alt, 'hidden_concierge');
      }
  
      if (this.market) {
  
        let aaImgSrc = this.platformDataService.getData('aa_program_img_src') && this.platformDataService.getData('aa_program_img_src');
        let aaImgAlt = this.platformDataService.getData('aa_program_img_alt') && this.platformDataService.getData('aa_program_img_alt');
        let ioImgSrc = this.platformDataService.getData('io_program_img_src') && this.platformDataService.getData('io_program_img_src');
        let ioImgAlt = this.platformDataService.getData('io_program_img_alt') && this.platformDataService.getData('io_program_img_alt');
  
        if (aaImgSrc) {
          this.embed_pdf_img(aaImgSrc, aaImgAlt, 'open_mkt_img');
        }
  
        if (ioImgSrc) {
          this.embed_pdf_img(ioImgSrc, ioImgAlt, 'io_mkt_img');
        }
      }
    }

    this.pdfImagesFinished = true;
  }

  ppVisible:boolean = false;
  ooVisible:boolean = true;
  showCashBuyer:boolean = false;
  showLeaseBuyer:boolean = false;

  ngOnInit(): void {

    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isbuyer = newstatus);
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isseller = newstatus);

    this.platformDataService.currentShowCashBuyerStatus.subscribe(newstatus => this.showCashBuyer = newstatus);
    this.platformDataService.currentShowLeaseBuyerStatus.subscribe(newstatus => this.showLeaseBuyer = newstatus);

    this.platformDataService.currentVisibilityStatusPP.subscribe(newstatus => this.ppVisible = newstatus);
    this.platformDataService.currentVisibilityStatusOO.subscribe(newstatus => this.ooVisible = newstatus);

    this.platformDataService.currentAppAddress.subscribe(newstatus => this.address = newstatus);

    // make OO be not configured (show dummies) if Change Address from PP
    this.platformDataService.currentAddressStatus.subscribe(newstatus => this.cnfgrd = newstatus);
    // make GO btn disabled if Change Address from PP
    this.platformDataService.isReconfigured.subscribe(newstatus => this.reconfigured = newstatus);

    // use currency pipe to display currency
    this.ooConfigForm.valueChanges.subscribe(val => {
      if (val.homeValue) {
        this.ooConfigForm.patchValue({
          homeValue: this.currencyPipe.transform(val.homeValue.replace(/\D/g,'').replace(/^0+/,''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false})
      }
    });
    this.ooConfigForm.valueChanges.subscribe(val => {
      if (val.minPrice) {
        this.ooConfigForm.patchValue({
          minPrice: this.currencyPipe.transform(val.minPrice.replace(/\D/g,'').replace(/^0+/,''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false})
      }
      if (val.maxPrice) {
        this.ooConfigForm.patchValue({
          maxPrice: this.currencyPipe.transform(val.maxPrice.replace(/\D/g,'').replace(/^0+/,''), 'USD', 'symbol', '1.0-0')
        }, {emitEvent:false})
      }
    });
    this.setConfigFormValidator();

    this.configService.getVerifiedBuyersByZip('').subscribe((data:any) => {
      this.platformDataService.changeVerifiedBuyers(data);
      this.configService.getBuyerLinks([]).subscribe((links_data:any) => {
        this.platformDataService.setMarketData('Verified Buyers', links_data);
      });
    });
  }

}
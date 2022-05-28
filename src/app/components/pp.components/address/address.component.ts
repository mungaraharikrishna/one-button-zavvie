import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { AVMService } from "../../../services/avm.service";
import { WpApiService } from 'src/app/services/wp-api.service';
import { MapsAPILoader } from '@agm/core';
import { NavService } from 'src/app/services/nav.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {

  constructor(
    public fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    public avmService: AVMService,
    private wpApiService: WpApiService,
    private fns: FieldNameService,
    public configService: ConfigService,
    public platformDataService: PlatformDataService,
    private nav: NavService) {}

  latitude: any;
  longitude: any;
  zoom: any;
  geoCoder: any;
  addressa:string = "";
  formattedAddress:string = "";
  oldAddress:string = "";
  addressb:string = "";

  started:boolean = false;
  confirmed:boolean = false;
  got_avm:boolean = false;
  got_address:boolean = false;
  avm_done:boolean = false;
  avm_searching:boolean = false;
  no_address:boolean = true;
  buttonDisabled = false;
  showConfirmedAddress = false
  showLoader = false;
  checkConfirmedAddress:any;

  changeaddress:boolean = false;

  cityName = '';
  stateName = '';
  zipCode = '';
  county = '';

  isSeller:boolean = false;
  isBuyer:boolean = false;

  express:boolean = false;
  ppid:any = '';
  ppidSet:boolean = false;

  skip_oo:boolean = false;
  oo_configured:boolean = false;
  skip_and_change:boolean = false;

  addressForm = this.fb.group({
    'homeAddress': [this.formattedAddress, [Validators.required]]
  });

  public handleAddressChange(address: any) {
    this.skip_and_change = false;
    this.buttonDisabled = false;
    this.formattedAddress = address.formatted_address;
    this.addressa = address.name;
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
    this.longitude = address.geometry.location.lng();
    this.latitude = address.geometry.location.lat();
    this.addressb = `${this.cityName} ${this.stateName}, ${this.zipCode}`;

    //send data to platform data service
    this.platformDataService.setAddressData('formattedAddress', this.formattedAddress);
    this.platformDataService.setAddressData('addressa', this.addressa);
    this.platformDataService.setAddressData('addressb', this.addressb);
    this.platformDataService.setAddressData('city', this.cityName);
    this.platformDataService.setAddressData('state', this.stateName);
    this.platformDataService.setAddressData('zipcode', this.zipCode);
    this.platformDataService.setAddressData('county', this.county);
    this.platformDataService.setAddressData('latitude', this.latitude);
    this.platformDataService.setAddressData('longitude', this.longitude);
    let cta_suffix = '?addressa=' + encodeURIComponent(this.addressa) + '&addressb=' + encodeURIComponent(this.addressb);
    this.platformDataService.setAddressData('cta_suffix', cta_suffix);
    this.platformDataService.changeSellerStatus(true);
    this.haveAddress = true;
    this.platformDataService.changeAppAddress(this.formattedAddress);

    this.configService.getVerifiedBuyersByZip(this.zipCode).subscribe((data:any) => {
      let easyknock:boolean = false; 
      this.platformDataService.setMarketData('bridge_vbs', data.bridge_vbs);
      this.platformDataService.setMarketData('ibuyer_vbs', data.ibuyer_vbs);
      this.platformDataService.setMarketData('reno_vbs', data.reno_vbs);
      if (data.bridge_vbs && data.bridge_vbs.indexOf('EasyKnock') >= 0) {
        easyknock = true;
      }
      this.platformDataService.setMarketData('easyknock', easyknock);
    });
    console.log(this.platformDataService.getAllAddressData());
  }

  // user clicked CHANGE ADDRESS link
  changeAddress = () => {
    this.ppid = '';
    this.platformDataService.setData('ppid', this.ppid);
    this.platformDataService.setAddressData('formattedAddress', '');
    this.platformDataService.setAddressData('addressa', '');
    this.platformDataService.setAddressData('addressb', '');
    this.platformDataService.setAddressData('city', '');
    this.platformDataService.setAddressData('state', '');
    this.platformDataService.setAddressData('zipcode', '');
    this.platformDataService.setAddressData('county', '');
    this.platformDataService.setAddressData('latitude', '');
    this.platformDataService.setAddressData('longitude', '');
    this.platformDataService.setAddressData('cta_suffix', '');
    this.skip_and_change = true;
    let addy_el = <HTMLInputElement>document.getElementById('confirm-address');
    this.platformDataService.changeAppAddress('');
    this.addressForm.patchValue({ homeAddress: '' });
    addy_el.focus();
  }

  showSellerEmailPopup:boolean = false;
  // CONFIRM ADDRESS
  confirmAddressClicked(e:any) {
    e.preventDefault();
    this.submitMapData();
    this.showLoader = true;
    let address = this.addressa == undefined ? this.formattedAddress : this.addressa + ', ' + this.addressb;
    this.platformDataService.setAddressData('formattedAddress', address);
    this.platformDataService.addUserData(this.fns.FieldNames.confirmAddress.Address, address);
    this.platformDataService.changeOldAddress(address);
    this.showSellerEmailPopup = true;
  }

  submitMapData = () => {
    this.showLoader = true;
    this.avmService.submitMapData(this.addressa, this.addressb).subscribe((response:any) => {
      this.showLoader = false;
      console.log(response);
      response.status == 'SuccessWithResult' && this.setPropertyValuesFromAvm(response);
      response.status == 'Error' && console.log('AVM error', response);
    });
  }

  haveAddress:boolean = false;
  building:any;
  apartment:boolean = false;
  property:any = {
    type: '',
    bedrooms: '',
    full_baths: '',
    three_qtr_baths: '',
    one_qtr_baths: '',
    year_built: '',
    below_sq_feet: '',
    above_sq_feet: '',
    total_sq_feet: '',
    basement_type: '',
    garage_spaces: '',
    garage_type: ''
  };

  setPropertyValuesFromAvm = (res:any) => {
    console.log('res', res);

    // First determine Property Type / House/Townhome/Condo/etc
    const propType = res.avm.summary.proptype;
    switch (propType) {
      case 'SFR': // AVM calls Houses AND Townhouses SFR
        this.property.type = res.avm.building.summary.archStyle != "TOWNHOUSE"
          ? 'House'
          : 'Townhome';
        break;
      case 'TOWNHOUSE/ROWHOUSE':
        this.property.type = 'Townhome';
        break;
      case 'CONDOMINIUM':
        this.property.type = 'Condo';
        break;
      case 'APARTMENT':
        this.apartment = true;
        this.property.type = 'Other';
        break;
      default:
        this.property.type = 'Other';
    }

    if (!this.apartment) {

      // Set the handful of relevant AVM datapoints that we now have
      this.platformDataService.addUserData(this.fns.FieldNames.property1.PropertyType, this.property.type);

      this.property.bedrooms = res.avm.building.rooms.beds || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property2.Number_Bedrooms, this.property.bedrooms);
      
      this.property.full_baths = res.avm.building.rooms.bathsfull || res.avm.building.rooms.bathstotal || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property2.Number_FullBathrooms, this.property.full_baths);
  
      this.property.three_qtr_baths = res.avm.building.rooms.baths3qtr || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property2.Number_3QtrBathrooms, this.property.three_qtr_baths);
  
      this.property.half_baths = res.avm.building.rooms.bathshalf || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property2.Number_HalfBathrooms, this.property.half_baths);
  
      this.property.one_qtr_baths = res.avm.building.rooms.bathshalf || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property2.Number_QtrBathrooms, this.property.one_qtr_baths);
      
      this.property.year_built = res.avm.summary.yearbuilt > 0 ? res.avm.summary.yearbuilt : '';
      this.platformDataService.addUserData(this.fns.FieldNames.property3.YearBuilt, this.property.year_built);

      this.property.below_sq_feet = res.avm.building.interior.bsmtsize >= 0 ? res.avm.building.interior.bsmtsize : 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property3.BelowGroundSqFt, this.property.below_sq_feet);

      this.property.above_sq_feet = res.avm.building.size.universalsize || '';
      this.platformDataService.addUserData(this.fns.FieldNames.property3.AboveGroundSqFt, this.property.above_sq_feet);

      this.property.total_sq_feet = this.property.below_sq_feet + this.property.above_sq_feet || 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property3.TotalSqFt, this.property.total_sq_feet);

      if (res.avm.building.interior.bsmtsize > 0) {
        const basementType = res.avm.building.interior.bsmttype;
        switch (basementType) {
          case 'FINISHED': // AVM calls Houses AND Townhouses SFR
            this.property.basement_type = 'Finished';
            break;
          case 'UNFINISHED':
            this.property.basement_type = 'Unfinished';
            break;
          case 'PARTIAL':
            this.property.basement_type = 'Partially Finished';
            break;
          default:
            this.property.basement_type = '';
        }
        this.property.basement_type != '' && this.platformDataService.addUserData(this.fns.FieldNames.property4.BasementType, this.property.basement_type);
      }

      this.property.garage_spaces = res.avm.building.parking.prkgSpaces
        ? res.avm.building.parking.prkgSpaces
        : res.avm.building.parking.prkgSize
          ? Math.round(res.avm.building.parking.prkgSize / 210)
          : 0;
      this.platformDataService.addUserData(this.fns.FieldNames.property3.Number_GarageSpaces, this.property.garage_spaces);

      if (res.avm.building.parking.prkgSize > 0) {
        const regex_a = /\b(\w*attached\w*)\b/ig;
        const regex_d = /\b(\w*detached\w*)\b/ig;
        const regex_c = /\b(\w*carport\w*)\b/ig;
        const parkingType = res.avm.building.parking.prkgType;
        this.property.garage_type = regex_a.test(parkingType)
          ? 'Attached'
          : regex_d.test(parkingType)
            ? 'Detached'
            : regex_c.test(parkingType)
              ? 'Carport'
              : '';
        this.platformDataService.addUserData(this.fns.FieldNames.property3.GarageType, this.property.garage_type);
      }

      if (res.avm.lot.pooltype != "NONE" && res.avm.lot.poolind == "YES") {
        this.platformDataService.addUserData(this.fns.FieldNames.exterior1.Swimming_Pool, true);
      }
    }
    console.log(this.platformDataService.getAllUserData());
  };

  ngOnInit(): void {

    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
    this.platformDataService.currentAddressStatus.subscribe(newstatus => this.oo_configured = newstatus);

    if (!this.oo_configured) {
      this.skip_oo = true;
    }

    // keep track of previous address
    this.platformDataService.currentOldAddress.subscribe(newoldaddress => this.oldAddress = newoldaddress);
    // Gets Address Information from Config Component and updates the map
    this.longitude = this.platformDataService.getAllAddressData().longitude;
    this.latitude = this.platformDataService.getAllAddressData().latitude;
    this.zoom = 18;
    this.addressa = this.platformDataService.getAllAddressData().addressa;
    this.addressb = this.platformDataService.getAllAddressData().addressb;
    this.formattedAddress = this.platformDataService.getAllAddressData().formattedAddress;
    if (this.latitude && this.longitude && this.addressa && this.addressb && this.formattedAddress) {
      this.haveAddress = true;
      this.mapsAPILoader.load().then(() => {
        this.geoCoder = new google.maps.Geocoder();
      }).then(() => {
        // For skip OO and load PP from query params
        if (this.express) {
          this.showLoader = true;
          this.ppid = this.platformDataService.getData('ppid');
          this.ppidSet = this.ppid == undefined || this.ppid == '' ? false : true;

          this.avmService.submitMapData(this.addressa, this.addressb).subscribe((response:any) => {
            response.status == 'SuccessWithResult' && this.setPropertyValuesFromAvm(response);
            response.status == 'Error' && console.log('AVM error', response);

            if (!this.ppidSet) {
              this.wpApiService.makePropertyProfile().subscribe((response:any) => {
                // console.log(response && response.id);
                this.platformDataService.setData('ppid', response.id);
                this.ppid = this.platformDataService.getData('ppid');
                this.ppidSet = this.ppid == undefined || this.ppid == '' ? false : true;
                this.ppidSet
                  ? this.nav.goto.confirmAddress.next()
                  : console.log('Something went wrong...oops');
              });
            } else {
              // console.log('this.ppid', this.ppid);
              this.nav.goto.confirmAddress.next();
            }
          });
        }
      });
    }
    
    // disable the confirm button
    // as long as formattedAddress and oldAddress are equal
    //
    // user can make formattedAddress and oldAddress unequal
    // by manually changing the OO address input after they
    // have confirmed an address...confusing i know
    this.checkConfirmedAddress = this.platformDataService.getUserData('Address');
    this.buttonDisabled = (this.checkConfirmedAddress && this.checkConfirmedAddress.length > 0
      && this.checkConfirmedAddress == this.oldAddress) ? true : false;

    let existing_addy = this.platformDataService.getAllAddressData().formattedAddress
      ? this.platformDataService.getAllAddressData().formattedAddress
      : '';
    this.addressForm.patchValue({ homeAddress: existing_addy });
  }

  // Next and Back button
  nextBtnConfig = {
    text: 'START',
    sendUpdate: false
  }
  backBtnConfig = {
    backtext: 'BACK'
  }

  next = () => this.nav.goto.confirmAddress.next();
  back = () => this.nav.goto.confirmAddress.back();

}
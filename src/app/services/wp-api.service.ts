import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FieldNameService } from '../services/field-name.service';
import { PlatformDataService } from '../services/platform-data.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root'
})
export class WpApiService {
  REST_API_SERVER:string = '';
  REST_API_UPDATE_SERVER:string = '';
  REST_API_UPDATE_BUYER_SERVER:string = '';
  REST_API_SENDTOPB_SERVER:string = '';
  RIBBON_API_ENDPOINT:string = '';
  params:string = '';
  address:any = '';
  unitNum:string = '';
  Source_Broker:string = '';
  Agent_Source_Broker:string = '';
  pptype = this.platformDataService.getData('pptype');
  platform_id = this.configService.getPlatformIds().partnerId;
  vbs:any;
  min:any;
  max:any;
  isseller:boolean = false;
  isbuyer:boolean = false;
  verified_buyers:any;
  ppIdvalue:any

  ngOnInit(): void {}

  constructor(
    private httpClient: HttpClient,
    public fns: FieldNameService,
    private configService: ConfigService,
    private platformDataService: PlatformDataService) {

      this.platformDataService.currentBuyerMinPrice.subscribe(newprice => this.min = newprice);
      this.platformDataService.currentBuyerMaxPrice.subscribe(newprice => this.max = newprice);
      this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isbuyer = newstatus);
      this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isseller = newstatus);
      this.platformDataService.currentVerifiedBuyers.subscribe(newbuyers => this.verified_buyers = newbuyers);
  }

  getCookie = (name:any) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match
      ? match[2]
      : '';
  };

  setLeadType = () => {
    let leadType = 'Website';

    if (this.getCookie('za_utm_source') === 'pr' ) {
      leadType = 'PR';
    } else if ( this.getCookie('za_orig_ref') === 'https://www.google.com/' ) {
      leadType = 'Google';
      if ( !this.getCookie('za_gclid') ) {
        leadType = 'Google Organic';
      }
    } else if ( this.getCookie('za_orig_ref') === 'https://www.bing.com/' ) {
      leadType = 'Bing Organic';
    } else if ( this.getCookie('za_fbclid')
      || this.getCookie('za_orig_ref') === 'https://m.facebook.com/'
      || this.getCookie('za_orig_ref') === 'http://m.facebook.com/') {
      leadType = 'Facebook';
    } else {
      leadType = 'Website';
    }

    return leadType;
  };

  setUtmMeta = () => {
    var utmCookies = [
      'za_utm_campaign',
      'za_utm_content',
      'za_utm_medium',
      'za_utm_source'
    ];
    var utmMeta = [];

    for (var i=0; i < utmCookies.length; i++) {
      if ( this.getCookie(utmCookies[i]) ) {
        utmMeta.push([utmCookies[i].substring(3) + '=' + this.getCookie(utmCookies[i])]);
      }
    }
    return utmMeta;
  };

  source:any = this.setLeadType();
  utm:any = this.setUtmMeta();
  clientid:any = this.getCookie('za_client_id') || null;
  referrer:any = this.getCookie('za_orig_ref') || null;

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  getResponse = (id:string) => this.platformDataService.getUserData(id);

  encodeResponse = (res:string) => encodeURIComponent(this.getResponse(res));

  isAnswered = (id:any) => (this.getResponse(id) !== undefined && this.getResponse(id) !== ''
    && this.getResponse(id) !== [] && this.getResponse(id) !== {});

  agentFirstName = () => window.btoa( this.getResponse(this.fns.FieldNames.generalInfo.AgentFirstName) );
  agentLastName = () => window.btoa( this.getResponse(this.fns.FieldNames.generalInfo.AgentLastName) );

  getParams = (pp:any) => {

    let updated_pp_data = '?id=' + pp;

    const addParamTrueFalse = (name:any, key:any, trueval:any, falseval:any) => {
      if (this.isAnswered(name)) {
        updated_pp_data += '&' + key + '=' + (this.encodeResponse(name));
      }
    }

    const altAddParamTrueFalse = (name:any, key:any, trueval:any, falseval:any) => {
      if (this.isAnswered(name)) {
        updated_pp_data += '&' + key + '=' + (this.encodeResponse(name) == 'true' ? trueval : falseval);
      }
    }

    const addParam = (name:string, key:any) => {
      if (this.isAnswered(name)) {
        updated_pp_data += '&' + key + '=' + this.encodeResponse(name);
      }
    }

    const addListParams = (name:string, key:any) => {
      let getArray = () => this.getResponse(name);
      if (this.isAnswered(name)) {
        updated_pp_data += '&' + key + '=' + encodeURIComponent(getArray());
      }
    }

    addListParams(this.fns.FieldNames.sellerSolutions.SellerSolutions, 'Seller_Solutions');
    addListParams(this.fns.FieldNames.buyerSolutions.BuyerSolutions, 'Buyer_Solutions');

    if (this.isAnswered(this.fns.FieldNames.generalInfo.AgentFirstName)) {
      updated_pp_data += '&Agent_First_Name=' + encodeURIComponent( this.agentFirstName() );
    }

    if (this.isAnswered(this.fns.FieldNames.generalInfo.AgentLastName)) {
      updated_pp_data += '&Agent_Last_Name=' + encodeURIComponent( this.agentLastName() );
    }

    addParam(this.fns.FieldNames.generalInfo.AgentEmail, 'Agent_Email');// pb check
    addParam(this.fns.FieldNames.generalInfo.AgentPhone, 'Agent_Phone');// pb check

    addParam(this.fns.FieldNames.generalInfo.AgentClientFirstName, 'Agent_Client_First_Name');
    addParam(this.fns.FieldNames.generalInfo.AgentClientLastName, 'Agent_Client_Last_Name');
    addParam(this.fns.FieldNames.generalInfo.AgentClientEmail, 'Agent_Client_Email');// pb check
    addParam(this.fns.FieldNames.generalInfo.AgentID, 'Agent_ID_Number');// pb check
    addParam(this.fns.FieldNames.generalInfo.ClientPhone, 'Phone');
    addParamTrueFalse(this.fns.FieldNames.generalInfo.SignedListingAgreement, 'SignedListingAgreement', 'true', 'false');

    addParam(this.fns.FieldNames.property1.HomeCondition, 'HomeCondition');
    addParam(this.fns.FieldNames.property1.ApproximateHomeVal, 'ApproximateHomeVal');
    addParam(this.fns.FieldNames.property1.HomeType, 'Is_this_a');// pb check
    addParam(this.fns.FieldNames.property1.InvPropRented, 'Is_it_currently_rented');// pb check
    addParam(this.fns.FieldNames.property1.PropertyType, 'Property_Type');
    addParam(this.fns.FieldNames.property1.LeaseEnd, 'Lease_End');// pb check

    addParam(this.fns.FieldNames.property2.Number_Bedrooms, 'Bedrooms');// pb check
    addParam(this.fns.FieldNames.property2.Number_FullBathrooms, 'Full_Bathrooms');// pb check
    addParam(this.fns.FieldNames.property2.Number_3QtrBathrooms, '3Qtr_Bathrooms');// pb check
    addParam(this.fns.FieldNames.property2.Number_HalfBathrooms, 'Half_Bathrooms');// pb check
    addParam(this.fns.FieldNames.property2.Number_QtrBathrooms, 'Qtr_Bathrooms');// pb check

    if (this.getResponse(this.fns.FieldNames.property3.GarageType) && this.getResponse(this.fns.FieldNames.property3.GarageType) !== '') {// pb check
      updated_pp_data += (this.getResponse(this.fns.FieldNames.property3.GarageType) == "Carport") ? '&Carport=true' : '&Carport=false';
      updated_pp_data += (this.getResponse(this.fns.FieldNames.property3.GarageType) == "Attached") ? '&Attached_Garage=true' : '&Attached_Garage=false';
      updated_pp_data += (this.getResponse(this.fns.FieldNames.property3.GarageType) == "Detached") ? '&Detached_Garage=true' : '&Detached_Garage=false';
    }// pb check
    addParam(this.fns.FieldNames.property3.TotalSqFt, 'Total_Square_Footage');// pb check
    addParam(this.fns.FieldNames.property3.AboveGroundSqFt, 'Above_Ground_Square_Footage');// pb check
    addParam(this.fns.FieldNames.property3.BelowGroundSqFt, 'Below_Ground_Square_Footage');// pb check
    addParam(this.fns.FieldNames.property3.YearBuilt, 'Year_Built');// pb check
    addParam(this.fns.FieldNames.property3.YearPurchased, 'Year_Purchased');// pb check
    addParam(this.fns.FieldNames.property3.Number_Floors, 'Number_of_Floors');// pb check
    addParam(this.fns.FieldNames.property3.Number_GarageSpaces, 'Number_of_Garage_Spaces');// pb check

    addParam(this.fns.FieldNames.property4.MasterBedroomLocation, 'MasterBedroomLocation');// pb check
    altAddParamTrueFalse(this.fns.FieldNames.property4.Additions, 'Are_there_any_additions', 'Yes', 'No');// pb check
    addParam(this.fns.FieldNames.property4.AdditionsType, 'Permitted_Unpermitted_Additions');// pb check
    addParam(this.fns.FieldNames.property4.AdditionsLocations, 'What_part_of_the_home');// pb check
    addParam(this.fns.FieldNames.property4.BasementType, 'Basement');// pb check

    addParam(this.fns.FieldNames.interior1.Interior_Paint, 'Interior_Paint');// pb check
    addParam(this.fns.FieldNames.interior1.Neutral_Interior_Paint_Colors, 'Neutral_Interior_Paint_Colors');// pb check

    addParam(this.fns.FieldNames.interior2.Kitchen_Counter_Tops, 'Kitchen_Counter_Tops');// pb check
    addParam(this.fns.FieldNames.interior2.Kitchen_Appliances, 'Kitchen_Appliances');// pb check

    addParam(this.fns.FieldNames.interior3.Kitchen_Special_Features, 'Kitchen_Special_Features');// pb check
    addParam(this.fns.FieldNames.interior3.Remodeled_Kitchen, 'Remodeled_Kitchen');// pb check
    addParam(this.fns.FieldNames.interior3.Overall_Condition_of_Kitchen, 'Overall_Condition_of_Kitchen');// pb check

    addParam(this.fns.FieldNames.interior4.Bathroom_Special_Features, 'Bathroom_Special_Features');// pb check
    addParam(this.fns.FieldNames.interior4.Remodeled_Master_Bathroom, 'Remodeled_Master_Bathroom');// pb check
    addParam(this.fns.FieldNames.interior4.Overall_Condition_of_Master_Bathroom, 'Overall_Condition_of_Master_Bathroom');// pb check

    addListParams(this.fns.FieldNames.interior5.Kitchen_Flooring_Types, 'Kitchen_Flooring_Types');// pb check
    addParam(this.fns.FieldNames.interior5.Kitchen_Flooring_Condition, 'Kitchen_Flooring_Condition');// pb check
    addListParams(this.fns.FieldNames.interior5.Main_Flooring_Types, 'Main_Flooring_Types');// pb check
    addParam(this.fns.FieldNames.interior5.Main_Flooring_Condition, 'Main_Flooring_Condition');// pb check

    addListParams(this.fns.FieldNames.interior6.Bedroom_Flooring_Types, 'Bedroom_Flooring_Types');// pb check
    addParam(this.fns.FieldNames.interior6.Bedroom_Flooring_Condition, 'Bedroom_Flooring_Condition');// pb check
    addListParams(this.fns.FieldNames.interior6.Bathroom_Flooring_Types, 'Bathroom_Flooring_Types');// pb check
    addParam(this.fns.FieldNames.interior6.Bathroom_Flooring_Condition, 'Bathroom_Flooring_Condition');// pb check

    addParam(this.fns.FieldNames.interior7.Needs_Major_Repairs, 'Needs_Major_Repairs');
    addParam(this.fns.FieldNames.interior7.Needs_Major_Updating, 'Needs_Major_Updating');
    addListParams(this.fns.FieldNames.interior7.Known_Issues_with_the_Following, 'Known_Issues_with_the_Following');// pb check
    addListParams(this.fns.FieldNames.interior7.Appliances_that_need_to_be_replaced, 'Appliances_that_need_to_be_replaced');// pb check

    addParamTrueFalse(this.fns.FieldNames.exterior1.Shared_Well, 'Shared_Well', 'true', 'false');// pb check
    addParam(this.fns.FieldNames.exterior1.Solar_Company, 'Solar_Company');// pb check
    addListParams(this.fns.FieldNames.exterior1.Home_Features, 'Home_Features');// pb check
    addParamTrueFalse(this.fns.FieldNames.exterior1.Solar_Panels, 'Solar_Panels', 'true', 'false');// pb check
    altAddParamTrueFalse(this.fns.FieldNames.exterior1.Solar_Own_Lease, 'Solar_Own_Lease', 'Own', 'Lease');// pb check
    addParam(this.fns.FieldNames.exterior1.Swimming_Pool, 'Swimming_Pool');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.exterior1.Pool_Type, 'Pool_Type');// pb check
    addParam(this.fns.FieldNames.exterior1.Spa, 'Spa');// pb check

    addParam(this.fns.FieldNames.exterior2.Front_Yard_Landscaping, 'Front_Yard_Landscaping');// pb check
    addParam(this.fns.FieldNames.exterior2.Back_Yard_Landscaping, 'Back_Yard_Landscaping');// pb check

    addParam(this.fns.FieldNames.exterior3.Exterior_Paint, 'Exterior_Paint');// pb check
    addParam(this.fns.FieldNames.exterior3.Roof_Condition, 'Roof_Condition');// pb check
    addParam(this.fns.FieldNames.exterior3.Backyard_Fence, 'Backyard_Fence');// pb check
    addListParams(this.fns.FieldNames.exterior3.Property_Backs_up_to, 'Property_Backs_up_to');// pb check

    addParam(this.fns.FieldNames.homeownerinfo1.WhenReadyToSell, 'WhenReadyToSell');// pb check
    addParam(this.fns.FieldNames.homeownerinfo1.Message, 'Message');// pb check

    // BRIDGE NEW NEW
    addParam(this.fns.FieldNames.homeownerinfo2.Mortgage_Balance, 'Mortgage_Balance');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo2.Monthly_HOA_Fees, 'Monthly_HOA_Fees');
    addParamTrueFalse(this.fns.FieldNames.homeownerinfo2.Use_Equity, 'Use_Equity', 'true', 'false');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo2.Money_Needed, 'Money_Needed');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo2.Additional_Debt, 'Additional_Debt');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo1.Repair_Cost, 'Repair_Cost');// wp check !!!!!!!!!!!!!!

    addParam(this.fns.FieldNames.homeownerinfo3.Buying_Replacement_Home, 'Buying_Replacement_Home'); // wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo3.Buying_In_City, 'Buying_In_City'); // wp check !!!!!!!!!!!!!!
    if (this.isAnswered(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow) || this.isAnswered(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh)) {
      updated_pp_data += '&Buying_Price_Range=' + this.encodeResponse(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow) + '-' + this.encodeResponse(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh);
    }
    altAddParamTrueFalse(this.fns.FieldNames.homeownerinfo3.Ready_To_Make_Offer, 'Ready_To_Make_Offer', 'true', 'false');// wp check !!!!!!!!!!!!!!
    addParam(this.fns.FieldNames.homeownerinfo3.Prequalify_Me, 'Prequalify_Me');// wp check !!!!!!!!!!!!!!

    if (this.isAnswered(this.fns.FieldNames.homeownerinfo3.Monthly_Income)) {
      updated_pp_data += '&Monthly_Income=' + this.encodeResponse(this.fns.FieldNames.homeownerinfo3.Monthly_Income);
    }
    if (this.isAnswered(this.fns.FieldNames.homeownerinfo3.Additional_Income)) {
      updated_pp_data += '&Additional_Income=' + this.encodeResponse(this.fns.FieldNames.homeownerinfo3.Additional_Income);
    }

    // console.log('updated_pp_data', updated_pp_data);
    return updated_pp_data;
  }

  private nullResponse = new BehaviorSubject<object>({id: 0});
  NullResponse = this.nullResponse.asObservable();

  public makePropertyProfile = () => {
    console.log('formattedAddress', this.platformDataService.getAddressData('formattedAddress'));
    this.address = this.platformDataService.getAddressData('formattedAddress') || '';
    console.log('this.address', this.address);
    this.unitNum = this.platformDataService.getAddressData(this.fns.FieldNames.confirmAddress.UnitNumber) || '';
    let zip = this.platformDataService.getAddressData('zipcode');
    let condish = this.platformDataService.getHomeValueData('homeCondition');
    let home_condition = condish && condish.name ? condish.name : '';
    let homevalue = this.platformDataService.getHomeValueData('homeValue');

    this.Source_Broker = this.platformDataService.getData('pbPartnerId') || '';

    let params = '?Address=' + encodeURIComponent(this.address) +
      '&Unit_Number=' + encodeURIComponent(this.unitNum) +
      '&Zip_Code=' + encodeURIComponent(zip) +
      '&Source_Broker=' + encodeURIComponent(this.Source_Broker) +
      '&HomeCondition=' + encodeURIComponent(home_condition) +
      '&HomeValue=' + encodeURIComponent(homevalue);

    if (this.address) {
      this.REST_API_SERVER = this.configService.getServer() + "/wp-json/pps/v2/new/" + params;
      return this.httpClient.get(this.REST_API_SERVER).pipe(catchError(this.handleError));
    } else {
      return this.nullResponse;
    }
  }

  public updatePP = (pp:any) => {
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/pps/v2/update/" + this.getParams(pp);
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  public makeBuyerPropertyProfile = () => {
    let agent_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) || '';
    let agent_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName) || '';
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone) || '';
    let agent_id = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentID) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail) || '';
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone) || '';

    this.Source_Broker = this.platformDataService.getData('pbPartnerId') || '';

    let buysell = this.isseller && this.isbuyer
      ? 'Buy and Sell'
      : this.isseller
        ? 'Sell'
        : 'Buy';

    let params = '?Source_Broker=' + encodeURIComponent(this.Source_Broker) +
      '&Agent_First_Name=' + encodeURIComponent(agent_first) +
      '&Agent_Last_Name=' + encodeURIComponent(agent_last) +
      '&Agent_Email=' + encodeURIComponent(agent_email) +
      '&Agent_Phone=' + encodeURIComponent(agent_phone) +
      '&Agent_ID_Number=' + encodeURIComponent(agent_id) +
      '&Agent_Client_First_Name=' + encodeURIComponent(client_first) +
      '&Agent_Client_Last_Name=' + encodeURIComponent(client_last) +
      '&Agent_Client_Email=' + encodeURIComponent(client_email) +
      '&buysell=' + encodeURIComponent(buysell) +
      '&Phone=' + encodeURIComponent(client_phone) +
      '&minPrice=' + encodeURIComponent(this.min) +
      '&maxPrice=' + encodeURIComponent(this.max);

    if (client_first && client_last) {
      this.REST_API_SERVER = this.configService.getServer() + "/wp-json/buyerpp/v1/new/" + params;
      return this.httpClient.get(this.REST_API_SERVER).pipe(catchError(this.handleError));
    } else {
      return this.nullResponse;
    }
  }

  public updateBuyerPP = (pp:any) => {
    let maxRange = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.MaxRange);
    let buyerLocation = this.platformDataService.getUserData('buyerLocationText');
    let prequal = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.Prequalified);
    let loanFirstName = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.LoanFirstName) || '';
    let loanLastName = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.LoanLastName) || '';
    let loanEmail = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.LoanEmail) || '';
    let loanPhone = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.LoanPhone) || '';
    let loanType = this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.LoanType) || '';
    let homeToSell = this.isseller ? 'Yes' : 'No';

    let buyerSolutions = this.platformDataService.getUserData('BuyerSolutions') || '';
    let show_cash_vbs:boolean = buyerSolutions.indexOf('Cash Offer') > -1;
    let show_lease_vbs:boolean = buyerSolutions.indexOf('Lease to Own') > -1;

    let buyers = this.platformDataService.getMarketData('Verified Buyers');
    let vbs:string = '';
    let index:number = 0;
    for (let buyer of buyers) {
      vbs += index == 0
      ? buyer.state + ' - '
      : '; ' + buyer.state + ' - ';
      if (show_lease_vbs) {
        for (let vb of buyer.buyers.lease_vbs) {
          (vb) ? vbs += vb + ', ' : 'No buyers';
        }
      }
      if (show_cash_vbs) {
        for (let vb of buyer.buyers.cash_vbs) {
          (vb) ? vbs += vb + ', ' : 'No buyers';
        }
      }
      index++;
    }

    let buyer_solutions = '';
    let getResponse = (id:string) => this.platformDataService.getUserData(id);
    let isAnswered = (id:any) => (getResponse(id) !== undefined && getResponse(id) !== ''
      && getResponse(id) !== [] && getResponse(id) !== {});
    const addListParams = (name:string) => {
      let getArray = () => getResponse(name);
      if (isAnswered(name)) {
        buyer_solutions += getArray();
      }
    }
    addListParams(this.fns.FieldNames.buyerSolutions.BuyerSolutions);

    let buyerParams = '?id=' + encodeURIComponent(pp) +
      '&Buying_Price_Range_Max=' + encodeURIComponent(maxRange) +
      '&Buyer_Location=' + encodeURIComponent(buyerLocation) +
      '&Buyer_Solutions=' + encodeURIComponent(buyer_solutions) +
      '&Buyers=' + encodeURIComponent(vbs) +
      '&Prequalify_Me=' + encodeURIComponent(prequal) +
      '&LoanFirstName=' + encodeURIComponent(loanFirstName) +
      '&LoanLastName=' + encodeURIComponent(loanLastName) +
      '&LoanEmail=' + encodeURIComponent(loanEmail) +
      '&LoanPhone=' + encodeURIComponent(loanPhone) +
      '&LoanType=' + encodeURIComponent(loanType) +
      '&HomeToSell=' + encodeURIComponent(homeToSell);
    this.REST_API_UPDATE_BUYER_SERVER = this.configService.getServer() + "/wp-json/pps/v2/update_buyer/" + buyerParams;
    return this.httpClient.get(this.REST_API_UPDATE_BUYER_SERVER).pipe(catchError(this.handleError));
  }

  public updateClientContactLO = (lo: any) => {
    console.log(lo);
    let agent_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) || '';
    let agent_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName) || '';
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone) || '';
    let agent_id = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentID) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientEmail) || '';
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientPhone) || '';
    let lo_first = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerFirstName) || '';
    let lo_last = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerLastName) || '';
    let lo_email = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerEmail) || '';
    let lo_phone = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerPhone) || '';
    let lo_NMLS_ID = this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerID) || '';
  }

  public buyerSendToPb = (pp:any) => {
    let buysell = this.isseller && this.isbuyer
      ? 'Buy and Sell'
      : this.isseller
        ? 'Sell'
        : 'Buy';
    let buyer_pb_data = 'id=' + encodeURIComponent(pp);
    buyer_pb_data += '&form=obz';
    buyer_pb_data += '&buysell=' + encodeURIComponent(buysell);
    buyer_pb_data += '&sendToAgentEmail=' + encodeURIComponent(this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail));
    buyer_pb_data += '&platform_id=' + encodeURIComponent(this.platform_id);
    buyer_pb_data += '&Source=' + this.source + '&UtmMeta=' + encodeURIComponent(this.utm);
    buyer_pb_data += '&ClientId=' + this.clientid + '&Referrer=' + encodeURIComponent(this.referrer);

    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/pps/v2/send_buyer?" + buyer_pb_data;
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  public getEligibility = () => {
    let ppid = this.platformDataService.getData('ppid');
    // let platform_id = this.configService.getPlatformIds().partnerId;
    let platform_id = 15777;
    let homeval = this.platformDataService.getHomeValueData('homeValue');
    let params = 'platform_id=' + encodeURIComponent(platform_id) +
      '&ppid=' + encodeURIComponent(ppid) + '&homeval=' + encodeURIComponent(homeval);
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/marketplace-matrix/v1/get_vb_eligibility/?" + params;
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  //// Offer Collector /////
  // Get all pps per platform_id
  public getPPs = () => {
    this.REST_API_SERVER = this.configService.getServer() + "/wp-json/pps/all/id?platform_id=" + this.platform_id;
    return this.httpClient.get(this.REST_API_SERVER).pipe(catchError(this.handleError));
  }

  // Get all pp by Id
  public getPPbyId = (ppid:any, platformid:any) => {
    let params = 'id=' + encodeURIComponent(ppid) + '&platform_id=' + encodeURIComponent(platformid);
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/pps/id/?" + params;
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  // Do eligibility by passing in the ppid of the PP Selected for the COR
  public doEligibility = () => {
    this.platformDataService.currentPPId.subscribe(currentPPId => this.ppIdvalue = currentPPId);
    let homeval = this.platformDataService.getData('homeValue');
    let platform_id = this.platformDataService.getData('partner')
    let params = 'platform_id=' + encodeURIComponent(platform_id) +
      '&ppid=' + encodeURIComponent(this.ppIdvalue ) + '&homeval=' + encodeURIComponent(homeval);
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/marketplace-matrix/v1/get_vb_eligibility/?" + params;
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  // Get eligibility iBuyer by Id
  public getEligibleVB = (ppid: any) => {
    let params = 'id=' + encodeURIComponent(ppid)
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/pps/eligible/id/?" + params
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  // Get all eligible iBuyers
  public getvbs = () => {
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/vbs/all/get"
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  // Get all platforms
  public getPlatforms = () => {
    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/getplatforms/all/id";
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  //////////////////////
  checkEasyKnockEligibility = () => {
    let street = this.platformDataService.getAddressData('addressa');
    let city = this.platformDataService.getAddressData('city');
    let state = this.platformDataService.getAddressData('state');
    let zip = this.platformDataService.getAddressData('zipcode');
    let home_value = this.platformDataService.getHomeValueData('homeValue') || 0;
    let mortgage_balance = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Mortgage_Balance) || 0;
    let liens_balance = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Additional_Debt) || 0;
    let agent_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) || '';
    let agent_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName) || '';
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail) || '';
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone) || '';
    let brokerage = this.platformDataService.getData('partnerName');

    let params = 'ppid=' + encodeURIComponent(this.platformDataService.getData('ppid'))+
      '&street=' + encodeURIComponent(street) +
      '&city=' + encodeURIComponent(city) +
      '&state=' + encodeURIComponent(state) +
      '&zip=' + encodeURIComponent(zip) +
      '&mortgage_balance=' + encodeURIComponent(mortgage_balance) +
      '&liens_balance=' + encodeURIComponent(liens_balance) +
      '&home_value=' + encodeURIComponent(home_value) +
      '&agent_first=' + encodeURIComponent(agent_first) +
      '&agent_last=' + encodeURIComponent(agent_last) +
      '&agent_email=' + encodeURIComponent(agent_email) +
      '&agent_phone=' + encodeURIComponent(agent_phone) +
      '&client_first=' + encodeURIComponent(client_first) +
      '&client_last=' + encodeURIComponent(client_last) +
      '&client_email=' + encodeURIComponent(client_email) +
      '&client_phone=' + encodeURIComponent(client_phone) +
      '&brokerage=' + encodeURIComponent(brokerage);

    this.REST_API_SERVER = this.configService.getServer() + "/wp-json/eligibility/get/easyknock?" + params;
    return this.httpClient.get(this.REST_API_SERVER).pipe(catchError(this.handleError));
  }

  addRibbonAccount = () => {
    let agent_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) || '';
    let agent_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName) || '';
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail) || '';
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone) || '';

    let street = this.platformDataService.getAddressData('addressa') || '';
    let city = this.platformDataService.getAddressData('city') || '';
    let state = this.platformDataService.getAddressData('state') || '';
    let zip = this.platformDataService.getAddressData('zipcode') || '';

    let params = 'agent_first=' + encodeURIComponent(agent_first) +
      '&agent_last=' + encodeURIComponent(agent_last) +
      '&agent_email=' + encodeURIComponent(agent_email) +
      '&agent_phone=' + encodeURIComponent(agent_phone) +
      '&client_first=' + encodeURIComponent(client_first) +
      '&client_last=' + encodeURIComponent(client_last) +
      '&client_email=' + encodeURIComponent(client_email) +
      '&client_phone=' + encodeURIComponent(client_phone) +
      '&street=' + encodeURIComponent(street) +
      '&city=' + encodeURIComponent(city) +
      '&state=' + encodeURIComponent(state) +
      '&zip=' + encodeURIComponent(zip);

    this.RIBBON_API_ENDPOINT = this.configService.getServer() + "/wp-json/ribbon/add_lead?" + params;
    return this.httpClient.get(this.RIBBON_API_ENDPOINT).pipe(catchError(this.handleError));
  }

  updateRibbonAccount = () => {
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail) || '';
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone) || '';
    let street = this.platformDataService.getAddressData('addressa') || '';
    let city = this.platformDataService.getAddressData('city') || '';
    let state = this.platformDataService.getAddressData('state') || '';
    let zip = this.platformDataService.getAddressData('zipcode') || '';

    let params = 'agent_email=' + encodeURIComponent(agent_email) +
      '&client_first=' + encodeURIComponent(client_first) +
      '&client_last=' + encodeURIComponent(client_last) +
      '&client_email=' + encodeURIComponent(client_email) +
      '&client_phone=' + encodeURIComponent(client_phone) +
      '&street=' + encodeURIComponent(street) +
      '&city=' + encodeURIComponent(city) +
      '&state=' + encodeURIComponent(state) +
      '&zip=' + encodeURIComponent(zip);

    this.RIBBON_API_ENDPOINT = this.configService.getServer() + "/wp-json/ribbon/add_existing?" + params;
    return this.httpClient.get(this.RIBBON_API_ENDPOINT).pipe(catchError(this.handleError));
  }

  public sendToPb = () => {
    let ppid = this.platformDataService.getData('ppid');

    let buysell = this.isseller && this.isbuyer
      ? 'Buy and Sell'
      : this.isseller
        ? 'Sell'
        : 'Buy';

    let updated_pb_data = 'id=' + ppid;
    updated_pb_data += '&form=obz';
    updated_pb_data += '&buysell=' + encodeURIComponent(buysell);
    // this needs to be here, but blank for now...
    // pp2020 uses if email-to-client link clicked
    updated_pb_data += '&oneBtnEmail=';

    updated_pb_data += '&sendToAgentEmail=' + encodeURIComponent(this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail));

    updated_pb_data += '&platform_id=' + encodeURIComponent(this.platform_id);

    updated_pb_data += '&Source=' + this.source + '&UtmMeta=' + encodeURIComponent(this.utm);
    updated_pb_data += '&ClientId=' + this.clientid + '&Referrer=' + encodeURIComponent(this.referrer);

    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/pps/v2/send?" + updated_pb_data;

    this.doTheGoogles();
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  public hwConciergeSend = (buyer:boolean, seller:boolean, link:string) => {
    let agent_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) || '';
    let agent_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName) || '';
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail) || '';
    let client_first = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName) || '';
    let client_last = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName) || '';
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail) || '';
    let address = '';
    let condish:any;
    let home_condition = '';
    let homevalue = '';

    let buyer_vbs:string = '';
    let seller_vbs:string = '';

    let pds_buyers = this.platformDataService.getMarketData('Verified Buyers');
    if (buyer && this.platformDataService.hasJsonStructure(pds_buyers)) {
      let buyers = JSON.parse(pds_buyers);
      for (let vb of buyers.lease_vbs) {
        buyer_vbs += vb.name + ', ';
      }
      for (let vb of buyers.cash_vbs) {
        buyer_vbs += vb.name + ', ';
      }
    }

    if (seller) {

      address = this.platformDataService.getAddressData('formattedAddress') || '';
      condish = this.platformDataService.getHomeValueData('homeCondition');
      home_condition = condish && condish.name ? condish.name : '';
      homevalue = this.platformDataService.getHomeValueData('homeValue');
      let ibuyer_vbs = this.platformDataService.getMarketData('ibuyer_vbs');
      let bridge_vbs = this.platformDataService.getMarketData('bridge_vbs');
      let reno_vbs = this.platformDataService.getMarketData('reno_vbs');

      if (ibuyer_vbs) {
        for (let buyer of ibuyer_vbs) {
          seller_vbs += buyer + ', ';
        }
      }
      if (bridge_vbs) {
        for (let buyer of bridge_vbs) {
          seller_vbs += buyer + ', ';
        }
      }
      if (reno_vbs) {
        for (let buyer of reno_vbs) {
          seller_vbs += buyer + ', ';
        }
      }
    }

    this.Source_Broker = this.platformDataService.getData('pbPartnerId') || '';

    let params = '?Source_Broker=' + encodeURIComponent(this.Source_Broker) +
      '&Buyers=' + encodeURIComponent(buyer_vbs) +
      '&Sellers=' + encodeURIComponent(seller_vbs) +
      '&Agent_First_Name=' + encodeURIComponent(agent_first) +
      '&Agent_Last_Name=' + encodeURIComponent(agent_last) +
      '&Agent_Email=' + encodeURIComponent(agent_email) +
      '&Agent_Client_First_Name=' + encodeURIComponent(client_first) +
      '&Agent_Client_Last_Name=' + encodeURIComponent(client_last) +
      '&Agent_Client_Email=' + encodeURIComponent(client_email) +
      '&minPrice=' + encodeURIComponent(this.min) +
      '&maxPrice=' + encodeURIComponent(this.max) +
      '&Address=' + encodeURIComponent(address) +
      '&HomeCondition=' + encodeURIComponent(home_condition) +
      '&HomeValue=' + encodeURIComponent(homevalue) +
      '&Link=' + encodeURIComponent(link) +
      '&Source=' + this.source + '&UtmMeta=' + encodeURIComponent(this.utm) +
      '&ClientId=' + this.clientid + '&Referrer=' + encodeURIComponent(this.referrer);

    this.REST_API_UPDATE_SERVER = this.configService.getServer() + "/wp-json/hw_concierge/v1/send" + params;
    return this.httpClient.get(this.REST_API_UPDATE_SERVER).pipe(catchError(this.handleError));
  }

  doTheGoogles = () => {
    const addItem = (item:any) => {
      if (this.isAnswered(item)) {
        return this.getResponse(item)
      }
    }

    const addListItems = (item:any) => {
      let getArray = () => this.getResponse(item);
      if (this.isAnswered(item)) {
        return getArray();
      }
    }

    const addItemTrueFalse = (name:any, trueval:any, falseval:any) => {
      if (this.isAnswered(name)) {
        return (this.getResponse(name) === true ? trueval : falseval);
      }
    }

    window.dataLayer && window.dataLayer.push({
      'event': 'pp.submit',
      'platformId': this.pptype == 'zpro' ? this.Agent_Source_Broker : this.Source_Broker,
      '.25_Bath': addItem('Number_QtrBathrooms'),
      '.5_Bath': addItem('Number_HalfBathrooms'),
      '.75_Bath': addItem('Number_3QtrBathrooms'),
      'fullBath': addItem('Number_FullBathrooms'),
      'aboveGroundSquareFootage': addItem('AboveGroundSqFt'),
      'additionalIncome': addItem('AdditionalIncome'),
      'additionsLocation': addItem('AdditionsLocations'),
      'additionsPermission': addItem('AdditionsType'),
      'addressEntered': addItem('Address'),
      'agentEmail': addItem('AgentEmail'),
      'agentName': addItem('AgentFirstName') + ' ' + addItem('AgentLastName'),
      'agentPhone': addItem('AgentPhone'),
      'anythingElse': addItem('Message'),
      'appxHomeValue': addItem('HomeValue'),
      'appxMonthlyIncome': addItem('MonthlyIncome'),
      'backYard': addItem('LandscapingBack'),
      'backyardFence': addItem('BackyardFence'),
      'basement': addItem('BasementType'),
      'bathroomCondition': addItem('MasterBathCondition'),
      'bathroomFlooringTypes': addListItems('BathroomFlooringTypes'),
      'bathroomFlooringCondition': addItem('BathroomFlooringCondition'),
      'bedroomFlooring': addListItems('BedroomFlooringTypes'),
      'bedroomFlooringCondition': addItem('BedroomFlooringCondition'),
      'bedrooms': addItem('Number_Bedrooms'),
      'belowGroundSquareFootage': addItem('BelowGroundSqFt'),
      'buyingReplacementHome': addItemTrueFalse('BuyingReplacementHome', 'true', 'false'),
      'clientEmail': addItem('AgentClientEmail'),
      'clientName': addItem('AgentClientFirstName') + ' ' + addItem('AgentClientLastName'),
      'equityMoneyNeeded': addItem('MoneyNeeded'),
      'exteriorPaint': addItem('ExteriorPaintCondition'),
      'flooringKitchen': addListItems('KitchenFlooringTypes'),
      'flooringKitchenCondition': addItem('KitchenFlooringCondition'),
      'frontYard': addItem('LandscapingFront'),
      'garageSpaces': addItem('Number_GarageSpaces'),
      'homeAdditions': addItem('Additions'),
      'homeFeatures': addListItems('HomeFeatures'),
      'homeownerEmail': addItem('AgentClientEmail'),
      'homeOwnerName': addItem('AgentClientFirstName') + ' ' + addItem('AgentClientLastName'),
      'homeownerPhone': addItem('Phone'),
      'inGroundSpa': addItemTrueFalse('Spa', 'true', 'false'),
      'interiorPaintCondition': addItem('InteriorPaintCondition'),
      'isRented': addItemTrueFalse('InvPropRented', 'true', 'false'),
      'kitchenAppliances': addItem('KitchenAppliances'),
      'kitchenCondition': addItem('KitchenCondition'),
      'kitchenCounterTops': addItem('KitchenCounterTops'),
      'kitchenFeatures': addItem('KitchenFeatures'),
      'knownIssues': addListItems('KnownIssues'),
      'leaseEnd': addItem('LeaseEnd'),
      'leasingAgreement': addItemTrueFalse('SignedListingAgreement', 'true', 'false'),
      'liensOwed': addItem('AdditionalDebt'),
      'mainAreaFlooring': addListItems('MainFlooringTypes'),
      'mainAreaFlooringCondition': addItem('MainFlooringCondition'),
      'masterBathroom': addItem('MasterBathFeatures'),
      'masterBedroomLocation': addItem('MasterBedroomLocation'),
      'mortgageBalance': addItem('MortgageBalance'),
      'neutralInteriorPaint': addItem('InteriorPaintColors'),
      'numberOfFloors': addItem('Number_Floors'),
      'preApproved': addItem('PrequalifyMe'),
      'priceRange': addItem('BuyingPriceRange'),
      'primaryOrInvestment': addItem('HomeType'),
      'propertyBacksUp': addListItems('PropertyBacksUpTo'),
      'readyForOffer': addItemTrueFalse('ReadyToMakeOffer', 'true', 'false'),
      'readyToSell': addItem('ReadyToSell'),
      'remodeledBathroom': addItem('MasterBathRemodeled'),
      'remodeledKitchen': addItem('KitchenRemodeled'),
      'repairCosts': addItem('RepairCost'),
      'replaceAppliances': addListItems('Appliances'),
      'replacementHomeCity': addItem('BuyingInCity'),
      'roofCondition': addItem('RoofCondition'),
      'Selling Solutions': addListItems('SellerSolutions'),
      'sharedWell': addItem('SharedWell'),
      'solarCompany': addItem('SolarCompany'),
      'solarOwnership': addItemTrueFalse('SolarType', 'true', 'false'),
      'solarPanels': addItemTrueFalse('SolarPanels', 'true', 'false'),
      'submittedBy': addItemTrueFalse('Homeowner', 'Homeowner', 'Agent'),
      'substantiaUpdates': addItem('Needs_Major_Repairs'),
      'needsUpdating': addItem('Needs_Major_Updating'),
      'swimmingPool': addItem('SwimmingPool'),
      'totalSquareFootage': addItem('TotalSqFt'),
      'Unit Number': addItem('UnitNumber'),
      'seHomeEquity': addItemTrueFalse('Equity', 'true', 'false'),
      'yearBuilt': addItem('YearBuilt'),
      'yearPurchased': addItem('YearPurchased'),
      'monthlyHOAFees': addItem('MonthlyHOAFees')
    });
  }
}

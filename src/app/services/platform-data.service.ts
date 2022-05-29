import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class PlatformDataService {

  //////////////////////
  // COR Data
  //////////////////////
  CORData:any = {
    data: []
  }
  
  setCORData = (id:any, newdata:any) => {
    this.CORData.data[id] = '';
    this.CORData.data[id] = newdata;
  }
  getAllCORData = () => this.CORData.data;
  getCORData = (id:any) => this.CORData.data[id];

  //////////////////////
  // COR Configured
  //////////////////////
  private CORconfigured = new BehaviorSubject<boolean>(false);
  CORisConfigured = this.CORconfigured.asObservable();
  changeCORConfiguredStatus(newstatus:boolean) {
    this.CORconfigured.next(newstatus);
  }

  ///////////////////////////
  // COR PP ID Number
  ///////////////////////////
  private oldPPId = new BehaviorSubject<string>("");
  currentPPId = this.oldPPId.asObservable()
  changePPId = (newPPid:string) => {
    this.oldPPId.next(newPPid);
  }

  /////////////////////////////////////
  // COR Eligible Verified Buyers Array
  /////////////////////////////////////
  private elig = new BehaviorSubject<any>([]);
  eligibleVerifiedBuyers = this.elig.asObservable()
  changeEligible = (newEligible:any) => {
    this.elig.next(newEligible);
  }
  
  ///////////////////////////////////////
  // COR Ineligible Verified Buyers Array
  ///////////////////////////////////////
  private inelig = new BehaviorSubject<any>([]);
  inEligibleVerifiedBuyers = this.inelig.asObservable()
  changeIneligible = (newIneligible:any) => {
    this.inelig.next(newIneligible);
  }

  /////////////////////////////////////////////
  // COR All Eligible & Ineligible Verified Buyers
  ////////////////////////////////////////////
  private all = new BehaviorSubject<any>([]);
  allVerifiedBuyers = this.all.asObservable()
  changeAllVerifiedBuyers = (newAll:any) => {
    this.all.next(newAll);
  }

  //////////////////////
  // COR User Data
  //////////////////////
  userCORData:any = {
    data: []
  }
  
  addCORUserData = (id:any, newdata:any) => {
    this.userCORData.data[id] = '';
    this.userCORData.data[id] = newdata;  
  }
  getAllCORUserData = () => this.userCORData.data;
  getUserCORData = (id:any) => this.userCORData.data[id];
  clearUserCORData = () => this.userCORData.data = [];

  //////////////////////////
  // Show Powered by zavvie
  //////////////////////////
  private poweredByZavvie = new BehaviorSubject<boolean>(false);
  showPoweredByZavvie = this.poweredByZavvie.asObservable();
  changeShowPoweredByZavvieStatus(newstatus:boolean) {
    this.poweredByZavvie.next(newstatus);
  }

  ///////////////////////////
  // Buyer/Seller Observable
  ///////////////////////////
  private showBuyerOneBtn = new BehaviorSubject<boolean>(false);
  currentShowBuyerOneBtnStatus = this.showBuyerOneBtn.asObservable();
  changeShowBuyerOneBtnStatus(newstatus:boolean) {
    this.showBuyerOneBtn.next(newstatus);
  }

  private isBuyer = new BehaviorSubject<boolean>(false);
  currentBuyerStatus = this.isBuyer.asObservable();
  changeBuyerStatus(newstatus:boolean) {
    this.isBuyer.next(newstatus);
  }

  private isSeller = new BehaviorSubject<boolean>(false);
  currentSellerStatus = this.isSeller.asObservable();
  changeSellerStatus(newstatus:boolean) {
    this.isSeller.next(newstatus);
  }

  private isloanOfficer = new BehaviorSubject<boolean>(false);
  currentLoanOfficerStatus = this.isloanOfficer.asObservable();
  changeLoanOfficerStatus(newstatus:boolean) {
    this.isloanOfficer.next(newstatus);
  }

  private prevSellerOnly = new BehaviorSubject<boolean>(false);
  currentPrevSellerOnly = this.prevSellerOnly.asObservable();
  changePrevSellerOnlyStatus(newstatus:boolean) {
    this.prevSellerOnly.next(newstatus);
  }

  private prevBuyerOnly = new BehaviorSubject<boolean>(false);
  currentPrevBuyerOnly = this.prevBuyerOnly.asObservable();
  changePrevBuyerOnlyStatus(newstatus:boolean) {
    this.prevBuyerOnly.next(newstatus);
  }

  private buyerMinPrice = new BehaviorSubject<any>(1);
  currentBuyerMinPrice = this.buyerMinPrice.asObservable();
  changeBuyerMinPrice(newprice:any) {
    this.buyerMinPrice.next(newprice);
  }
  
  private buyerMaxPrice = new BehaviorSubject<any>(1);
  currentBuyerMaxPrice = this.buyerMaxPrice.asObservable();
  changeBuyerMaxPrice(newprice:any) {
    this.buyerMaxPrice.next(newprice);
  }

  private showCashBuyer = new BehaviorSubject<boolean>(false);
  currentShowCashBuyerStatus = this.showCashBuyer.asObservable();
  changeShowCashBuyerStatus(newstatus:boolean) {
    this.showCashBuyer.next(newstatus);
  }

  private showLeaseBuyer = new BehaviorSubject<boolean>(false);
  currentShowLeaseBuyerStatus = this.showLeaseBuyer.asObservable();
  changeShowLeaseBuyerStatus(newstatus:boolean) {
    this.showLeaseBuyer.next(newstatus);
  }

  ////////////////////
  // Verified Buyers
  //////////////////////
  private verifiedBuyers = new BehaviorSubject<object>({});
  currentVerifiedBuyers = this.verifiedBuyers.asObservable();
  changeVerifiedBuyers(newbuyers:any) {
    this.verifiedBuyers.next(newbuyers);
  }
  


  //////////////////////
  // Platform Data
  //////////////////////
  platformData:any = {
    data: []
  }
  
  setData = (id:any, newdata:any) => {
    this.platformData.data[id] = '';
    this.platformData.data[id] = newdata;
  }
  
  getAllData = () => this.platformData.data;
  getData = (id:any) => this.platformData.data[id];



  //////////////////////
  // Address Data
  //////////////////////
  addressData:any = {
    data: []
  }
  
  setAddressData = (id:any, newdata:any) => {
    this.addressData.data[id] = '';
    this.addressData.data[id] = newdata;  
  }
  
  getAllAddressData = () => this.addressData.data;
  getAddressData = (id:any) => this.addressData.data[id];



  //////////////////////
  // Market Data
  //////////////////////
  marketData:any = {
    data: []
  }
  
  setMarketData = (id:any, newdata:any) => {
    this.marketData.data[id] = '';
    this.marketData.data[id] = newdata;
  }
  
  getAllMarketData = () => this.marketData.data;
  getMarketData = (id:any) => this.marketData.data[id];


  //////////////////////
  // Home Value Data
  //////////////////////
  homeValueData:any = {
    data: []
  }
  
  setHomeValueData = (id:any, newdata:any) => {
    this.homeValueData.data[id] = '';
    this.homeValueData.data[id] = newdata;
  }
  
  getAllHomeValueData = () => this.homeValueData.data;
  getHomeValueData = (id:any) => this.homeValueData.data[id];


  //////////////////////
  // PP User Data
  //////////////////////
  userData:any = {
    data: []
  }
  
  addUserData = (id:any, newdata:any) => {
    this.userData.data[id] = '';
    this.userData.data[id] = newdata;  
  }
  
  getAllUserData = () => this.userData.data;
  getUserData = (id:any) => this.userData.data[id];
  clearUserData = () => this.userData.data = [];

  //////////////////////////////////////
  // Use Query Params to Skip OO and go
  // straight to Address component
  //////////////////////////////////////
  private activateExpressRoute = new BehaviorSubject<boolean>(false);
  activateExpressRouteStatus = this.activateExpressRoute.asObservable();
  changeActivateExpressRouteStatus(newstatus:boolean) {
    this.activateExpressRoute.next(newstatus);
  }

  /////////////////////////////////////////////////
  // Hold value of whether user can see/use the COR
  /////////////////////////////////////////////////
  private corUser = new BehaviorSubject<boolean>(false);
  canUseCor = this.corUser.asObservable();
  changeCanUseCor(newstatus:boolean) {
    this.corUser.next(newstatus);
  }

  ////////////////////
  // Price Observables
  ////////////////////
  private estAAPrice = new BehaviorSubject<any>(1);
  currentAAPrice = this.estAAPrice.asObservable();
  changeAaPrice(newprice:any) {
    this.estAAPrice.next(newprice);
  }
  
  private estBridgePrice = new BehaviorSubject<any>(1);
  currentBridgePrice = this.estBridgePrice.asObservable();
  changeBridgePrice(newprice:any) {
    this.estBridgePrice.next(newprice);
  }

  private estLowStandardPrice = new BehaviorSubject<any>(1);
  currentLowStandardPrice = this.estLowStandardPrice.asObservable();
  changeLowStandardPrice(newprice:any) {
    this.estLowStandardPrice.next(newprice);
  }
  
  private estHighStandardPrice = new BehaviorSubject<any>(1);
  currentHighStandardPrice = this.estHighStandardPrice.asObservable();
  changeHighStandardPrice(newprice:any) {
    this.estHighStandardPrice.next(newprice);
  }

  private estLowAsisPrice = new BehaviorSubject<any>(1);
  currentLowAsisPrice = this.estLowAsisPrice.asObservable();
  changeLowAsisPrice(newprice:any) {
    this.estLowAsisPrice.next(newprice);
  }
  
  private estHighAsisPrice = new BehaviorSubject<any>(1);
  currentHighAsisPrice = this.estHighAsisPrice.asObservable();
  changeHighAsisPrice(newprice:any) {
    this.estHighAsisPrice.next(newprice);
  }

  // Bridge Price of Home Being Purchased -- LOW
  private estLowHomePurchasePrice = new BehaviorSubject<any>(1);
  currentLowHomePurchasePrice = this.estLowHomePurchasePrice.asObservable();
  changeLowHomePurchasePrice(newprice:any) {
    this.estLowHomePurchasePrice.next(newprice);
  }
  // Bridge Price of Home Being Purchased -- HIGH
  private estHighHomePurchasePrice = new BehaviorSubject<any>(1);
  currentHighHomePurchasePrice = this.estHighHomePurchasePrice.asObservable();
  changeHighHomePurchasePrice(newprice:any) {
    this.estHighHomePurchasePrice.next(newprice);
  }

  ////////////////////
  // Buyer Observables
  ////////////////////
  private estLowAAPrice = new BehaviorSubject<any>(1);
  currentLowAAPrice = this.estLowAAPrice.asObservable();
  changeLowAaPrice(newprice:any) {
    this.estLowAAPrice.next(newprice);
  }
  private estHighAAPrice = new BehaviorSubject<any>(1);
  currentHighAAPrice = this.estHighAAPrice.asObservable();
  changeHighAaPrice(newprice:any) {
    this.estHighAAPrice.next(newprice);
  }
  private estLowCashPrice = new BehaviorSubject<any>(1);
  currentLowCashPrice = this.estLowCashPrice.asObservable();
  changeLowCashPrice(newprice:any) {
    this.estLowCashPrice.next(newprice);
  }
  private estHighCashPrice = new BehaviorSubject<any>(1);
  currentHighCashPrice = this.estHighCashPrice.asObservable();
  changeHighCashPrice(newprice:any) {
    this.estHighCashPrice.next(newprice);
  }
  private estLowLeaseToOwnPrice = new BehaviorSubject<any>(1);
  currentLowLeaseToOwnPrice = this.estLowLeaseToOwnPrice.asObservable();
  changeLowLeaseToOwnPrice(newprice:any) {
    this.estLowLeaseToOwnPrice.next(newprice);
  }
  private estHighLeaseToOwnPrice = new BehaviorSubject<any>(1);
  currentHighLeaseToOwnPrice = this.estHighLeaseToOwnPrice.asObservable();
  changeHighLeaseToOwnPrice(newprice:any) {
    this.estHighLeaseToOwnPrice.next(newprice);
  }
  private estLowLeaseToOwnLease = new BehaviorSubject<any>(1);
  currentLowLeaseToOwnLease = this.estLowLeaseToOwnLease.asObservable();
  changeLowLeaseToOwnLease(newprice:any) {
    this.estLowLeaseToOwnLease.next(newprice);
  }
  private estHighLeaseToOwnLease = new BehaviorSubject<any>(1);
  currentHighLeaseToOwnLease = this.estHighLeaseToOwnLease.asObservable();
  changeHighLeaseToOwnLease(newprice:any) {
    this.estHighLeaseToOwnLease.next(newprice);
  }
  private openMarketWarrantyOption = new BehaviorSubject<boolean>(false);
  currentOpenMarketWarrantyStatus = this.openMarketWarrantyOption.asObservable();
  changeOpenMarketWarrantyStatus(newstatus:boolean) {
    this.openMarketWarrantyOption.next(newstatus);
  }
  private cashWarrantyOption = new BehaviorSubject<boolean>(false);
  currentCashWarrantyStatus = this.cashWarrantyOption.asObservable();
  changeCashWarrantyStatus(newstatus:boolean) {
    this.cashWarrantyOption.next(newstatus);
  }

  private buyerVisited = new BehaviorSubject<boolean>(false);
  currentBuyerVisitedStatus = this.buyerVisited.asObservable();
  changeBuyerVisitedStatus(newstatus:boolean) {
    this.buyerVisited.next(newstatus);
  }

  ///////////////////////
  // Concierge Observable
  ///////////////////////
  private useConcierge = new BehaviorSubject<boolean>(false);
  currentConciergeStatus = this.useConcierge.asObservable();
  changeConciergeStatus(newstatus:boolean) {
    this.useConcierge.next(newstatus);
  }

  //////////////////////////////////////
  // AA Prep & Repairs Value Observable
  //////////////////////////////////////
  private prepAndRepairs = new BehaviorSubject<any>(0);
  currentPrepRepairsValue = this.prepAndRepairs.asObservable();
  changePrepRepairsValue(newvalue:any) {
    this.prepAndRepairs.next(newvalue);
  }

  /////////////////////////////////////
  // HomeOwners success page Observable
  ////////////////////////////////////
  private successMessage = new BehaviorSubject<string>("success");
  currentSuccessMessage = this.successMessage.asObservable()
  changeSuccessMessage(newmessage:string) {
    this.successMessage.next(newmessage)
  }

  ///////////////////////////
  // Old Address Observable
  ///////////////////////////
  private oldAddress = new BehaviorSubject<string>("");
  currentOldAddress = this.oldAddress.asObservable()
  changeOldAddress = (newoldaddress:string) => {
    this.oldAddress.next(newoldaddress);
  }

  ///////////////////////////
  // HomeCondition Observable
  ///////////////////////////
  private homeCondition = new BehaviorSubject<object>({});
  currentHomeCondition = this.homeCondition.asObservable();
  changeHomeCondition(newhomecondition:any) {
    this.homeCondition.next(newhomecondition);
  }

  /////////////////////
  // PP Visible
  /////////////////////
  private ppVisible = new BehaviorSubject<boolean>(false);
  currentVisibilityStatusPP = this.ppVisible.asObservable();
  changeVisibilityPP(newstatus:boolean) {
    this.ppVisible.next(newstatus);
  }

  /////////////////////
  // LO Visible
  /////////////////////
  private loVisible = new BehaviorSubject<boolean>(false);
  currentVisibilityStatusLO = this.loVisible.asObservable();
  changeVisibilityLO(newstatus:boolean) {
    this.loVisible.next(newstatus);
  }

  /////////////////////
  // OO Visible
  /////////////////////
  private ooVisible = new BehaviorSubject<boolean>(true);
  currentVisibilityStatusOO = this.ooVisible.asObservable();
  changeVisibilityOO(newstatus:boolean) {
    this.ooVisible.next(newstatus);
  }

  /////////////////////
  // COR Visible
  /////////////////////
  private corVisible = new BehaviorSubject<boolean>(false);
  currentVisibilityStatusCOR = this.corVisible.asObservable();
  changeVisibilityCOR(newstatus:boolean) {
    this.corVisible.next(newstatus);
  }

  /////////////////////
  // PP Change Have Address Status
  /////////////////////
  private haveAddress = new BehaviorSubject<boolean>(false);
  currentAddressStatus = this.haveAddress.asObservable();
  changeAddress(newstatus:boolean) {
    this.haveAddress.next(newstatus);
  }

  /////////////////////
  // PP Change Address
  /////////////////////
  private appAddress = new BehaviorSubject<string>('');
  currentAppAddress = this.appAddress.asObservable();
  changeAppAddress(newstatus:string) {
    this.appAddress.next(newstatus);
  }

  private reconfigureOO = new BehaviorSubject<boolean>(false);
  isReconfigured = this.reconfigureOO.asObservable();
  changeReconfigured(newstatus:boolean) {
    this.reconfigureOO.next(newstatus);
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { PlatformDataService } from '../../../services/platform-data.service';
import { FieldNameService } from '../../../services/field-name.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-buyer-solutions',
  templateUrl: './buyer-solutions.component.html',
  styleUrls: ['./buyer-solutions.component.scss']
})
export class BuyerSolutionsComponent implements OnInit {
  isSeller:boolean = false;
  isBuyer:boolean = false;
  isBuyerChecked = false;
  isSellerChecked= false;
  prevSellerOnly: boolean = false

  userBuyervalue = "isbuyer"
  userSellervalue = "isseller"
  buyerSolutions:Array<any> = [];
  buyerSolutionsSelection:any = [];
  oldBS:any;

  showCashBuyer:boolean = false;
  showLeaseBuyer:boolean = false;
  warrantySelected:boolean = true;

  aaPlatformName:any = this.platformDataService.getData('aaPlatformName');
  showWarranty:any = this.platformDataService.getData('showWarranty');

  BASEPATH:string = '';
  path_next:string = '';

  // Start Button
  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }

  next = () => this.nav.goto.buyerSolutions.next();
  back = () => this.nav.goto.buyerSolutions.back();

  constructor(
    private fb: FormBuilder,
    public fns: FieldNameService,
    private nav: NavService,
    public platformDataService: PlatformDataService) {

  }
  buyerSolutionsForm = this.fb.group({
    homeToSell:['', [Validators.required]],
  });

  sellerCheckbox = (e:any) => {
    this.isSeller = true;
    this.platformDataService.changeVisibilityOO(true);
    this.platformDataService.changeSellerStatus(this.isSeller);
    this.platformDataService.changeAddress(false);
    this.platformDataService.changeReconfigured(true);
    this.nav.goto.home();
    setTimeout(() => {
      let addy_el = <HTMLInputElement>document.getElementById('enter-address');
      addy_el!.focus()}, 500);
  }

  toggleBuyerSolutionsSelection = (e:any) => {
    let idx = this.buyerSolutionsSelection.indexOf(e.target.value);
    (idx > -1)
      ? this.buyerSolutionsSelection.splice(idx, 1)
      : this.buyerSolutionsSelection.push(e.target.value);
    this.platformDataService.addUserData(this.fns.FieldNames.buyerSolutions.BuyerSolutions, this.buyerSolutionsSelection);
  }

  labels:any;
  warranty_om:boolean = false;
  warranty_cash:boolean = false;

  homeToSellDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.buyerSolutions.HomeToSell)
  homeToSellQuestionConfig = {
    inputlabel: "Is your client also selling a home?",
    type: "radio",
    controlname: "homeToSell",
    truelabel: "Yes",
    trueval: "Yes",
    falselabel: "No",
    falseval: "No",
    required: "true"
  }

  newval:any;
  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    if (!this.isSeller && e == this.homeToSellQuestionConfig.trueval && name == "HomeToSell") {
      this.platformDataService.changeSellerStatus(true);
      this.platformDataService.changePrevBuyerOnlyStatus(true)
    }else if(name == "HomeToSell" && e == this.homeToSellQuestionConfig.falseval){
      this.platformDataService.changeSellerStatus(false);
    }
    this.checkValidity();
  }

  checkValidity = () => {
    let hasHomeTosell = this.fns.FieldNames.buyerSolutions.HomeToSell;
    this.nextBtnConfig.disabledBtn = this.isBuyer && this.isSeller ? false : this.platformDataService.getUserData(hasHomeTosell) != undefined ? false : true;
  }

  ngOnInit(): void {
    this.platformDataService.currentShowCashBuyerStatus.subscribe(newstatus => this.showCashBuyer = newstatus);
    this.platformDataService.currentShowLeaseBuyerStatus.subscribe(newstatus => this.showLeaseBuyer = newstatus);
    this.platformDataService.currentOpenMarketWarrantyStatus.subscribe(newstatus => this.warranty_om = newstatus);
    this.platformDataService.currentCashWarrantyStatus.subscribe(newstatus => this.warranty_cash = newstatus);
    this.oldBS = this.platformDataService.getUserData(this.fns.FieldNames.buyerSolutions.BuyerSolutions);

    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.currentPrevSellerOnly.subscribe(newstatus => this.prevSellerOnly = newstatus);

    this.homeToSellDefault = this.platformDataService.getUserData(this.fns.FieldNames.buyerSolutions.HomeToSell)
      ? this.platformDataService.getUserData(this.fns.FieldNames.buyerSolutions.HomeToSell)
      : this.isBuyer && this.isSeller ? 'Yes' : undefined;

    this.labels = this.platformDataService.getData('labels');
  
    this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 1,
      value: "Open Market",
      heading: this.labels.openMarketBuyerHeading,
      subHeading: "Open Market/Home Warranty - Covered maintenance and repairs for new home."
    });
    // Home warranty as an BS and push optionally with conditions
    this.showWarranty && this.buyerSolutions.push({
      id: 5,
      value: "Open Market Warranty",
      heading: 'Open Market Home warranty',
      subHeading: ""
    });
    this.showCashBuyer && this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 2,
      value: "Cash Offer",
      heading: this.labels.cashHeading,
      subHeading: "Turn an offer into a non-contingent cash offer"
    });
    // Home warranty as an BS and push optionally with conditions
    this.showCashBuyer && this.showWarranty && this.buyerSolutions.push({
      id: 6,
      value: "Cash Warranty",
      heading: 'Cash Offers Home warranty',
      subHeading: ""
    });
    this.showLeaseBuyer && this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 3,
      value: "Lease to Own",
      heading: this.labels.leaseToOwnHeading,
      subHeading: "Use rent payments to build towards owning a home"
    });

      // An option will be checked if the corresponding 
      // Buyer Solution exists in the Array...
      // so just add everything except Open Market Home Warranty
      // into this.buyerSolutions onInit
      // (but first check for existing this.buyerSolutions)
      if (this.buyerSolutions.length) {
        if (this.oldBS) { // There's an existing value, use it
          this.buyerSolutionsSelection = this.oldBS;
        } else {
          for (let buyerSolution of this.buyerSolutions) {
            if (buyerSolution.id != 5) {
              this.buyerSolutionsSelection.push( buyerSolution.value );
            } 
          }
          this.platformDataService.addUserData(this.fns.FieldNames.buyerSolutions.BuyerSolutions, this.buyerSolutionsSelection);
        }
      }
    this.checkValidity()
  }

}
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

  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_description:string = '';
  sp_affinity_features:any = '';
  sp_features_1:Array<any> = [];
  sp_features_2:Array<any> = [];

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

    // Solution Provider Affinity
    this.sp_affinity = this.platformDataService.getData('sp_affinity');
    if (this.sp_affinity == "1") {
      this.sp_affinity_type = this.platformDataService.getData('sp_affinity_type');
      this.sp_affinity_name = this.platformDataService.getData('sp_affinity_name');
      this.sp_affinity_logo = this.platformDataService.getData('sp_affinity_logo');
      this.sp_affinity_description = this.platformDataService.getData('sp_affinity_description');
      const sp_affinity_features = this.platformDataService.getData('sp_affinity_features');
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
  
    this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 1,
      value: "Open Market",
      heading: this.labels.openMarketBuyerHeading,
      subHeading: "Open Market/Home Warranty - Covered maintenance and repairs for new home.",
      sp_affinity: false
    });
    // Home warranty as an BS and push optionally with conditions
    this.showWarranty && this.buyerSolutions.push({
      id: 5,
      value: "Open Market Warranty",
      heading: 'Open Market Home warranty',
      subHeading: "",
      sp_affinity: false
    });
    this.showCashBuyer && this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 2,
      value: "Cash Offer",
      heading: this.sp_affinity === "1" && this.sp_affinity_type === "cash" ? this.sp_affinity_name : this.labels.cashHeading,
      subHeading: this.sp_affinity === "1" && this.sp_affinity_type === "cash" ? this.sp_affinity_description : "Turn an offer into a non-contingent cash offer",
      sp_affinity: this.sp_affinity === "1" && this.sp_affinity_type === "cash",
      logo: this.sp_affinity === "1" && this.sp_affinity_type === "cash" ? this.sp_affinity_logo : null,
      features_1: this.sp_affinity === "1" && this.sp_affinity_type === "cash" ? this.sp_features_1 : null,
      features_2: this.sp_affinity === "1" && this.sp_affinity_type === "cash" ? this.sp_features_2 : null
    });
    // Home warranty as an BS and push optionally with conditions
    this.showCashBuyer && this.showWarranty && this.buyerSolutions.push({
      id: 6,
      value: "Cash Warranty",
      heading: 'Cash Offers Home warranty',
      subHeading: "",
      sp_affinity: false
    });
    this.showLeaseBuyer && this.buyerSolutions.push({ // push each BS optionally with conditions
      id: 3,
      value: "Lease to Own",
      heading: this.sp_affinity === "1" && this.sp_affinity_type === "lease" ? this.sp_affinity_name : this.labels.leaseToOwnHeading,
      subHeading: this.sp_affinity === "1" && this.sp_affinity_type === "lease" ? this.sp_affinity_description : "Use rent payments to build towards owning a home",
      sp_affinity: this.sp_affinity === "1" && this.sp_affinity_type === "lease",
      logo: this.sp_affinity === "1" && this.sp_affinity_type === "lease" ? this.sp_affinity_logo : null,
      features_1: this.sp_affinity === "1" && this.sp_affinity_type === "lease" ? this.sp_features_1 : null,
      features_2: this.sp_affinity === "1" && this.sp_affinity_type === "lease" ? this.sp_features_2 : null
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
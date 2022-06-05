import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-seller-solutions',
  templateUrl: './seller-solutions.component.html',
  styleUrls: ['./seller-solutions.component.scss']
})
export class SellerSolutionsComponent implements OnInit {

  BASEPATH:string = '';
  path_next:string = '';

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
  
  showBuyerOBZ:any;
  aaPlatformName:any = this.platformDataService.getData('aaPlatformName');
  showConcierge:any = this.platformDataService.getData('showConcierge');
  conciergePlatformName:any = this.platformDataService.getData('conciergePlatformName');
  hideBridge:any = this.platformDataService.getData('hideBridge');
  bridgePlatformName:any = this.platformDataService.getData('bridgePlatformName');
  ioPlatformName:any = this.platformDataService.getData('ioPlatformName');
  sellerSolutions:Array<any> = [];
  sellerSolutionsSelection:Array<any> = [];
  disableConcierge:boolean = false;
  conciergeSelected:boolean = true;

  sellerSolutionsForm: FormGroup;
  oldSS:any;

  isSeller:any;
  isBuyer:any;
  isBuyerChecked = false;
  isSellerChecked= false;
  userBuyervalue = "isbuyer"
  prevSellerOnly:boolean = false
  prevBuyerOnly:boolean = false

  constructor(
    private fb: FormBuilder,
    public fns: FieldNameService,
    private nav: NavService,
    public platformDataService: PlatformDataService) {
      this.sellerSolutionsForm = this.fb.group({
        homeToBuy:['', [Validators.required]],
      });
      this.platformDataService.currentShowBuyerOneBtnStatus.subscribe(newstatus => this.showBuyerOBZ = newstatus);
  }

  toggleSellerSolutionsSelection = (e:any) => {
    let idx = this.sellerSolutionsSelection.indexOf(e.target.value);
    let isOM = e.target.value === 'Open Market' ? true : false;
    if (e.target.value === 'Concierge') { // make sure Concierge input works independently of OM
      this.conciergeSelected = !this.conciergeSelected;
    }
    let concierge_idx = this.sellerSolutionsSelection.indexOf('Concierge');

    if (isOM && concierge_idx > -1) { // remove Concierge too if OM is unchecked
      this.sellerSolutionsSelection.splice(concierge_idx, 1);
    }

    if (idx > -1) {
      this.sellerSolutionsSelection.splice(idx, 1);
    } else {
      if (isOM && this.conciergeSelected) { // Add back Concierge if it was checked before
        this.sellerSolutionsSelection.push('Concierge');
      }
      this.sellerSolutionsSelection.push(e.target.value);
    }
    this.platformDataService.addUserData(this.fns.FieldNames.sellerSolutions.SellerSolutions, this.sellerSolutionsSelection);
  }

  next = () => this.nav.goto.sellerSolutions.next();
  back = () => this.nav.goto.sellerSolutions.back();

  buyerCheckbox = (e:any) => {
    e.preventDefault();
    this.isBuyer = true;
    this.platformDataService.changeVisibilityOO(true);
    this.platformDataService.changeBuyerStatus(this.isBuyer);
    this.platformDataService.changeAddress(false);
    this.platformDataService.changeReconfigured(true);
    this.nav.goto.home();
    setTimeout(() => {
      let minPrice_el = <HTMLInputElement>document.getElementById('min-price');
      minPrice_el.focus()
    }, 500);
  }

  homeToBuyDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.sellerSolutions.HomeToBuy);
  homeToBuyQuestionConfig = {
    inputlabel: "Is your client also buying a home?",
    type: "radio",
    controlname: "homeToBuy",
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
    console.log(this.platformDataService.getAllUserData());
    if (name == "HomeToBuy" && !this.isBuyer && e == this.homeToBuyQuestionConfig.trueval) {
      this.platformDataService.changeBuyerStatus(true);
      this.platformDataService.changePrevSellerOnlyStatus(true)
    } else if (name == "HomeToBuy" && e == this.homeToBuyQuestionConfig.falseval) {
      this.platformDataService.changeBuyerStatus(false);
    }
    this.checkValidity();
  }

  checkValidity = () => {
    let hasHomeTobuy = this.fns.FieldNames.sellerSolutions.HomeToBuy;
    this.nextBtnConfig.disabledBtn = !this.showBuyerOBZ || this.isBuyer && this.isSeller ? false : this.platformDataService.getUserData(hasHomeTobuy) != undefined ? false : true;
  }

  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_description:string = '';
  sp_affinity_features:any = '';
  sp_features_1:Array<any> = [];
  sp_features_2:Array<any> = [];

  ngOnInit(): void {
    //Check for either seller, buyer, or both is sellected form the OO
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.currentPrevSellerOnly.subscribe(newstatus => this.prevSellerOnly = newstatus)
    this.platformDataService.currentPrevBuyerOnly.subscribe(newstatus => this.prevBuyerOnly = newstatus)
    
    this.homeToBuyDefault = this.platformDataService.getUserData(this.fns.FieldNames.sellerSolutions.HomeToBuy)
    ? this.platformDataService.getUserData(this.fns.FieldNames.sellerSolutions.HomeToBuy)
    : this.isBuyer && this.isSeller ? 'Yes': undefined;

    this.platformDataService.currentConciergeStatus.subscribe(newstatus => this.conciergeSelected = newstatus);
    this.oldSS = this.platformDataService.getUserData(this.fns.FieldNames.sellerSolutions.SellerSolutions);

    // Solution Provider Affinity
    this.sp_affinity = this.platformDataService.getData('sp_affinity');
    if (this.sp_affinity === "1") {
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

    this.sellerSolutions.push({ // push each SS optionally with conditions
      id: 1,
      value: "Open Market",
      heading: this.aaPlatformName,
      subHeading: "Sell for maximum market value - Expose your home to the greatest number of buyers.",
      sp_affinity: false
    });
    if (this.showConcierge) { // Treat concierge as an SS and push optionally with conditions
      this.sellerSolutions.push({
        id: 99,
        value: "Concierge",
        heading: this.conciergePlatformName || 'Concierge',
        subHeading: "",
        sp_affinity: false
      });
    }
    if (!this.hideBridge) { // push each SS optionally with conditions
      this.sellerSolutions.push({
        id: 2,
        value: "Bridge",
        heading: this.sp_affinity === "1" && this.sp_affinity_type === "bridge" ? this.sp_affinity_name : this.bridgePlatformName || "Bridge",
        subHeading: this.sp_affinity === "1" && this.sp_affinity_type === "bridge" ? this.sp_affinity_description : "Enables a homeowner to buy their next house before selling and moving out of their current home.",
        sp_affinity: this.sp_affinity === "1" && this.sp_affinity_type === "bridge",
        logo: this.sp_affinity === "1" && this.sp_affinity_type === "bridge" ? this.sp_affinity_logo : null,
        features_1: this.sp_affinity === "1" && this.sp_affinity_type === "bridge" ? this.sp_features_1 : null,
        features_2: this.sp_affinity === "1" && this.sp_affinity_type === "bridge" ? this.sp_features_2 : null
      });
    }
    this.sellerSolutions.push({ // push each SS optionally with conditions
      id: 3,
      value: "Instant Offers",
      heading: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer" ? this.sp_affinity_name : this.ioPlatformName,
      subHeading: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer" ? this.sp_affinity_description : "Sell quickly, with minimal hassle. Receive cash offers close to market value, but with a higher service fee.",
      sp_affinity: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer",
      logo: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer" ? this.sp_affinity_logo : null,
      features_1: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer" ? this.sp_features_1 : null,
      features_2: this.sp_affinity === "1" && this.sp_affinity_type === "ibuyer" ? this.sp_features_2 : null
    });

    // This is how we know which SSs are selected
    if (this.sellerSolutions.length) {
      if (this.oldSS) {
        this.sellerSolutionsSelection = this.oldSS;
      } else {
        for (let sellerSolution of this.sellerSolutions) {
          if (sellerSolution.id == 99) {
            this.conciergeSelected && this.sellerSolutionsSelection.push( sellerSolution.value );
          } else {
            this.sellerSolutionsSelection.push( sellerSolution.value );
          }
        }
        this.platformDataService.addUserData(this.fns.FieldNames.sellerSolutions.SellerSolutions, this.sellerSolutionsSelection);
      }
    }
    this.checkValidity()
  }

}
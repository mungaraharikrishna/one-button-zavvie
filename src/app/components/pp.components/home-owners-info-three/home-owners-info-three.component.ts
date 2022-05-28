import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-home-owners-info-three',
  templateUrl: './home-owners-info-three.component.html',
  styleUrls: ['./home-owners-info-three.component.scss']
})
export class HomeOwnersInfoThreeComponent implements OnInit {
  newval:any;
  bridgeHeading:any
  showLoader:boolean = false;
  submittedToPB:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService) { }

  homeOwnerThreeInfo = this.fb.group({
    Buying_Replacement_Home: [''],
    Buying_In_City: [''],
    BuyingPriceRangeLow: ['', [Validators.minLength(4), Validators.maxLength(11)]],
    BuyingPriceRangeHigh: ['', [Validators.minLength(4), Validators.maxLength(11)]],
    Ready_To_Make_Offer: [''],
    Prequalify_Me: [''],
    Monthly_Income: [''],
    Additional_Income: ['']
  });

  // Buying a replacement home
  buyingReplacementHomeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Buying_Replacement_Home);
  buyingReplacementHomeQuestionConfig = {
    inputlabel: "Will you be buying a replacement home?",
    type: "radio",
    controlname: "Buying_Replacement_Home",
    truelabel: "Yes",
    trueval: true,
    falselabel: "No",
    falseval: false
  }

  // Buying in what city 
  buyingInCityDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Buying_In_City);
  buyingInCityQuestionConfig = {
    inputlabel: "In what city are you looking to buy?",
    controlname: "Buying_In_City",
    placeholder: "City",
    required: "false",
    format: ""
  }

  // Price Range For Replacement Home
  buyingPriceRangeLowDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow);
  buyingPriceRangeLowQuestionConfig = {
    inputlabel: "Buying price range?",
    controlname: "BuyingPriceRangeLow",
    placeholder: "$0",
    required: "true",
  }
  buyingPriceRangeHighDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh);
  buyingPriceRangeHighQuestionConfig = {
    inputlabel: "",
    controlname: "BuyingPriceRangeHigh",
    placeholder: "$0",
    required: "false",
  }
  
  // Ready to make an offer on a home 
  readyToMakeOfferDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Ready_To_Make_Offer);
  readyToMakeOfferQuestionConfig = {
    inputlabel: "Are you ready to make an offer or still searching for your new home?",
    type: "radio",
    controlname: "Ready_To_Make_Offer",
    truelabel: "Ready to place an offer",
    trueval: true,
    falselabel: "Still searching",
    falseval: false
  }

  // pre-approved for a loan 
  preApprovalArray = [ 
    {
      value: "Yes I'm already preapproved",
      heading: 'Yes',
      subHeading: "I'm already preapproved"
    },
    {
      value: "No but I want to get preapproval",
      heading: 'No',
      subHeading: "But I want to get preapproval"
    },
    {
      value: "No I will do that later",
      heading: 'No',
      subHeading: "I will do that later"
    }
  ];
  preApprovalDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Prequalify_Me);
  // Your Approvimate Monthly Income 
  monthlyIncomeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Monthly_Income);
  monthlyIncomeQuestionConfig = {
    inputlabel: "What is your approximate monthly income?",
    controlname: "Monthly_Income",
    placeholder: "$0",
    required: "false",
  }
  // Additional Income form Household Members
  additionalIncomeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.Additional_Income);
  additionalIncomeQuestionConfig = {
    inputlabel: "Any additional income from household members?",
    controlname: "Additional_Income",
    placeholder: "$0",
    required: "false",
  }

  back = () => this.nav.goto.sellerInfo2.back();

  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
    const platform_meta = this.platformDataService.getData('platform_meta');
    this.bridgeHeading = platform_meta.bridge_heading[0];
  }
  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined;
  checkValidity = () => {
    this.sendBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.homeownerinfo3.Buying_Replacement_Home) 
    || this.get('Buying_Replacement_Home') == "false"
    || this.get('Buying_Replacement_Home') == "true" && this.get(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow) && this.get(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow).length > 4
      && this.get(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh) && this.get(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh).length > 4  ? false : true;
  }

  formValueChanged = (name:string, e:any) => {
    console.log(name, e);
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    console.log(this.platformDataService.getAllUserData());
    if (name === this.fns.FieldNames.homeownerinfo3.Buying_Replacement_Home && e === 'true') {
      this.buyingPriceRangeLowDefault = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeLow);
      this.buyingPriceRangeHighDefault = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo3.BuyingPriceRangeHigh);
    }
    this.checkValidity();
  }

  sendToPb = () => {
    this.platformDataService.changeSuccessMessage('success');
    this.showLoader = true;
    this.submittedToPB = true;
    this.platformDataService.addUserData('submittedToPB', this.submittedToPB);
  }

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    sendUpdate: true
  }
  sendBtnConfig = {
    text: 'SUBMIT',
    sendUpdate: true,
    sendToPB: true,
    disabledBtn: false
  }
  backBtnConfig = {
    backtext: "BACK"
  }
}
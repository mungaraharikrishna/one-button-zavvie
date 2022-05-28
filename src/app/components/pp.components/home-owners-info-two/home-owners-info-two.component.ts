import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from '../../../services/nav.service';

@Component({
  selector: 'app-home-owners-info-two',
  templateUrl: './home-owners-info-two.component.html',
  styleUrls: ['./home-owners-info-two.component.scss']
})
export class HomeOwnersInfoTwoComponent implements OnInit {
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

  homeOwnerTwoInfo = this.fb.group({
    Mortgage_Balance: [''],
    Monthly_HOA_Fees: [''],
    Use_Equity: [''],
    Money_Needed: [''],
    Additional_Debt: ['']
  });

  mortgageBalanceDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Mortgage_Balance);
  mortgageBalanceQuestionConfig = {
    inputlabel: "What is your approximate mortgage balance?",
    controlname: "Mortgage_Balance",
    placeholder: "$0",
  }
  
  monthlyHOAFeesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Monthly_HOA_Fees);
  monthlyHOAFeesQuestionConfig = {
    inputlabel: "How much are your HOA fees per month?",
    controlname: "Monthly_HOA_Fees",
    placeholder: "$0",
  }

  useEquityDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Use_Equity);
  useEquityQuestionConfig = {
    inputlabel: "Are you looking to tap the equity of your existing home before you move out of it?",
    suplabel: "For example: renovate and repair your home, shore up your financial situation, help finance your move",
    type: "radio",
    controlname: "Use_Equity",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false'
  }
  
  moneyNeededDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Money_Needed);
  moneyNeededQuestionConfig = {
    inputlabel: "How much money do you need?",
    controlname: "Money_Needed",
    placeholder: "$0",
  }

  additionalDebtDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo2.Additional_Debt);
  additionalDebtQuestionConfig = {
    inputlabel: "How much is owed in liens in addition to primary mortgage?",
    controlname: "Additional_Debt",
    placeholder: "$0",
  }

  back = () => this.nav.goto.sellerInfo2.back();
  next = () => this.nav.goto.sellerInfo2.next();

  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
    this.scrollDownService.addScrollDowns(this.scrolldowns);
    const platform_meta = this.platformDataService.getData('platform_meta');
    this.bridgeHeading = platform_meta.bridge_heading[0];
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    this.scrollDownService.scrollDown(name, e);
  }

  //send to PB
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
  backBtnConfig = {
    backtext: "BACK"
  }
  sendBtnConfig = {
    text: 'SUBMIT',
    sendUpdate: true,
    sendToPB: true,
    disabledBtn: false
  }
  scrolldowns = [
    {
      key: this.fns.FieldNames.homeownerinfo2.Use_Equity,
      value: 'true',
      height: 100
    }
  ];
}
import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-home-owners-info',
  templateUrl: './home-owners-info.component.html',
  styleUrls: ['./home-owners-info.component.scss']
})
export class HomeOwnersInfoComponent implements OnInit {
  newval:any;
  ssCheckArray:any;
  ssOldCheckArray:any;
  bridgeCheckedArray:any;
  bridgeChecked:any;
  showLoader:boolean = false;
  submittedToPB:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    private nav: NavService ) { }
  
  homeOwnerInfo = this.fb.group({
    'Repair_Cost': ['', [Validators.required]],
    'WhenReadyToSell': ['', [Validators.required]],
    'Message': ['']
  });

  repairCostDefault:any = '';
  repairCostQuestionConfig = {
    inputlabel: "Estimated repair costs of your home",
    controlname: "Repair_Cost",
    placeholder: "$0",
    required: "true"
  }

  readyToSell = ['ASAP', '3 Months', '4-6 Months', '6 Months','Not sure']
  readyToSellDefault:any = '';
  readyToSellQuestionConfig = {
    inputlabel: "When are you ready to sell your home?",
    controlname: "WhenReadyToSell",
    label: "Select",
    required: "true"
  }

  messageDefault:string = '';

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.homeownerinfo1.next();
  back = () => this.nav.goto.homeownerinfo1.back();

  ngOnInit(): void {
    this.repairCostDefault = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo1.Repair_Cost) || '';
    this.repairCostDefault != '' && this.homeOwnerInfo.patchValue({ Repair_Cost: this.repairCostDefault });
    this.readyToSellDefault = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo1.WhenReadyToSell) || '';
    this.readyToSellDefault != '' && this.homeOwnerInfo.patchValue({ WhenReadyToSell: this.readyToSellDefault });
    this.messageDefault = this.platformDataService.getUserData(this.fns.FieldNames.homeownerinfo1.Message) || '';
    this.messageDefault != '' && this.homeOwnerInfo.patchValue({ Message: this.messageDefault });
    this.checkBridge();
    this.checkValidity();
  }

  checkBridge = () => {
    let ss = this.fns.FieldNames.sellerSolutions.SellerSolutions;
    this.ssCheckArray = this.platformDataService.getUserData(ss);
    this.bridgeChecked = this.ssCheckArray && this.ssCheckArray.includes("Bridge") ? "true" : "false";
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    this.checkValidity();
  }

  repairCostsChanged = (e:any) => {
    this.platformDataService.addUserData(this.fns.FieldNames.homeownerinfo1.Repair_Cost, e.target.value.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,''));
    this.checkValidity();
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.homeownerinfo1.WhenReadyToSell) || this.notAnswered(this.fns.FieldNames.homeownerinfo1.Repair_Cost) ? true : false;
    this.sendBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.homeownerinfo1.WhenReadyToSell) || this.notAnswered(this.fns.FieldNames.homeownerinfo1.Repair_Cost) ? true : false;
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
    disabledBtn: true,
    sendUpdate: true,
    sendToPB: false
  }
  sendBtnConfig = {
    text: 'SUBMIT',
    disabledBtn: true,
    sendUpdate: true,
    sendToPB: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }

}
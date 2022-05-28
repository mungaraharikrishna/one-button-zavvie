import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-exterior',
  templateUrl: './exterior.component.html',
  styleUrls: ['./exterior.component.scss']
})
export class ExteriorComponent implements OnInit {

  newval:any;

  constructor(
    public fns: FieldNameService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService ) {
  }

  homeFeaturesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Home_Features);
  homeFeatures = ['Gated community','HOA','Age-restricted community','Chemical contamination','Well water','Septic system','None of the above'];
  homeFeaturesQuestionConfig = {
    controlname: "HomeFeatures",
    label: "Does your home have any of the following?:",
    required: true
  }
  
  sharedWellDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Shared_Well);
  sharedWellQuestionConfig = {
    inputlabel: "Is your well shared?",
    type: "radio",
    controlname: "sharedWell",
    truelabel: "Yes",
    trueval: true,
    falselabel: "No",
    falseval: false
  }

  solarPanelDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Solar_Panels);
  SolarPanelQuestionConfig = {
    inputlabel: "Does your home have solar panels?",
    type: "radio",
    controlname: "solarPanels",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false',
    required: "true"
  }

  solarPanel2Default:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Solar_Own_Lease);
  SolarPanel2QuestionConfig = {
    inputlabel: "Do you own or lease your solar panels?",
    type: "radio",
    controlname: "solarPanels2",
    truelabel: "Own",
    trueval: 'true',
    falselabel: "Lease",
    falseval: 'false'
  }
  solarCompanyDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Solar_Company);
  solarCompanyQuestionConfig = {
    inputlabel: "What company are the solar panels leased through?",
    controlname: "solarCompany",
    placeholder: "Answer",
    required: "false",
    format: ""
  }
 
  swimmingPoolDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Swimming_Pool);
  SwimmingPoolQuestionConfig = {
    inputlabel: "Is there a swimming pool?",
    type: "radio",
    controlname: "swimmingPool",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false',
    required: "true"
  }

  poolType = ['In-ground', 'Above ground', 'Community pool']
  poolTypeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Pool_Type)
  poolTypeQuestionConfig = {
    inputlabel: "What type of pool?",
    controlname: "choosePoolType",
    label: "Select"
  }

  spaDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Spa);
  SpaQuestionConfig = {
    inputlabel: "In-ground spa?",
    type: "radio",
    controlname: "spa",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false'
  }

  exteriorOneInfo = this.fb.group({
    HomeFeatures: this.fb.array([]),
    solarPanels: ['', [Validators.required]],
    solarPanels2: [''],
    solarCompany: [''],
    swimmingPool:['', [Validators.required]],
    choosePoolType: [''],
    spa: [''],
    sharedWell:['']
  });

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.exterior1.next();
  back = () => this.nav.goto.exterior1.back();

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    this.scrollDownService.scrollDown(name, e);
    // console.log(this.platformDataService.getAllUserData());
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.exterior1.Home_Features) || this.notAnswered(this.fns.FieldNames.exterior1.Solar_Panels) || this.notAnswered(this.fns.FieldNames.exterior1.Swimming_Pool) ? true : false;
  }

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true,
    sendUpdate: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }
  scrolldowns = [
    {
      key: this.fns.FieldNames.exterior1.Solar_Panels,
      value: 'true',
      height: this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Home_Features) && this.platformDataService.getUserData(this.fns.FieldNames.exterior1.Home_Features).indexOf('Well water') > -1 ? 200 : 100
    },
    {
      key: this.fns.FieldNames.exterior1.Solar_Own_Lease,
      value: 'false',
      height: 200
    },
    {
      key: this.fns.FieldNames.exterior1.Home_Features,
      value: 'Well water',
      height: 100
    }
  ];

  ngOnInit(): void {
    this.scrollDownService.addScrollDowns(this.scrolldowns);
    this.scrollDownService.doScroll(350, false);
    this.checkValidity();
  }
}
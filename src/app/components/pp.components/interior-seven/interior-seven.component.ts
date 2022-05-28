import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-seven',
  templateUrl: './interior-seven.component.html',
  styleUrls: ['./interior-seven.component.scss']
})
export class InteriorSevenComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService) { }

  appliancesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior7.Appliances_that_need_to_be_replaced);
  appliances = ['Refrigerator', 'Dishwasher', 'Range/Stove', 'Hot Water Heater', 'Washer/Dryer', 'None of the above']
  appliancesQuestionConfig = {
    controlname: "Appliances_that_need_to_be_replaced",
    label: "Appliances that need to be replaced:",
  }

  knownIssuesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior7.Known_Issues_with_the_Following);
  issues = ['Plumbing', 'Electrical', 'Heating', 'Cooling', 'Windows', 'Fire Damage', 'Foundation', 'Previous Flood Damage', 'None of the above']  
  knownIssuesQuestionConfig = {
    controlname: "Known_Issues_with_the_Following",
    label: "Known issues with the following",
    required: true
  }

  majorRepairsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.interior7.Needs_Major_Repairs) || '';
  majorRepairsQuestionConfig = {
    inputlabel: "Does this home need major repairs?",
    type: "radio",
    controlname: "Needs_Major_Repairs",
    truelabel: "Yes",
    trueval: "true",
    falselabel: "No",
    falseval: "false",
    required: "true"
  }

  majorUpdatingDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.interior7.Needs_Major_Updating) || '';
  majorUpdatingQuestionConfig = {
    inputlabel: "Does the home need major updating or renovations?",
    type: "radio",
    controlname: "Needs_Major_Updating",
    truelabel: "Yes",
    trueval: "true",
    falselabel: "No",
    falseval: "false",
    required: "true"
  }

  interiorSeven = this.fb.group({
    Appliances_that_need_to_be_replaced: this.fb.array([]),
    Known_Issues_with_the_Following: this.fb.array([]),
    Needs_Major_Repairs: [this.majorRepairsDefault],
    Needs_Major_Updating: [this.majorUpdatingDefault]
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }
 
  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior7.Known_Issues_with_the_Following)
    || this.notAnswered(this.fns.FieldNames.interior7.Needs_Major_Repairs)
    || this.notAnswered(this.fns.FieldNames.interior7.Needs_Major_Updating) ? true : false;

  BASEPATH:string = this.platformDataService.getData('home');
  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior7.next();
  back = () => this.nav.goto.interior7.back();

  ngOnInit(): void {

    if (this.majorRepairsDefault) {
      this.interiorSeven.patchValue({
        'Needs_Major_Repairs': this.majorRepairsDefault,
        'Needs_Major_Updating': this.majorUpdatingDefault
      });
    }

    this.checkValidity();
    this.scrollDownService.doScroll(350, false);
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
}

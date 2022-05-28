import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-property-four',
  templateUrl: './property-four.component.html',
  styleUrls: ['./property-four.component.scss']
})
export class PropertyFourComponent implements OnInit {

  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    public scrollDownService: ScrollDownService,
    private nav: NavService ) {
  }

  propertyFour = this.fb.group({
    Additions: ['', [Validators.required]],
    AdditionsType: [''],
    AdditionsLocations: [''],
    MasterBedroomLocation: [''],
    BasementType: ['']
  });

  additionsDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property4.Additions);
  additionsQuestionConfig = {
    inputlabel: "Are there any additions?",
    type: "radio",
    controlname: "Additions",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false',
    required: "true"
  }

  additionsPermittedDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property4.AdditionsType);
  additionsPermittedQuestionConfig = {
    inputlabel: "Are additions permitted or unpermitted?",
    type: "radio",
    controlname: "AdditionsType",
    truelabel: "Permitted",
    trueval: 'true',
    falselabel: "Unpermitted",
    falseval: 'false',
  }

  additionsLocationDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property4.AdditionsLocations);
  additionsLocationQuestionConfig = {
    inputlabel: "What part of the home has additions?",
    controlname: "AdditionsLocations",
    placeholder: "Answer",
    required: "false",
    format: ""
  }

  masterBedroomLocation = [ 'Upper Floor', 'Main Floor', 'Basement' ];
  masterBedroomLocationDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property4.MasterBedroomLocation);
  masterBedroomLocationQuestionConfig = {
    inputlabel: "Master bedroom location",
    controlname: "MasterBedroomLocation",
    label: "Select"
  }

  basement = [ 'Unfinished', 'Partially Finished', 'Finished' ];
  basementDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property4.BasementType);
  basementQuestionConfig = {
    inputlabel: "Is there a basement?",
    controlname: "BasementType",
    label: "Select"
  }

  requiredValueChanged = () => {
    this.nextBtnConfig.disabledBtn = this.propertyFour.invalid ? true : false;
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    name == this.fns.FieldNames.property4.Additions && e == 'true' && this.scrollDownService.doScroll(100, false);
    this.checkValidity();
  }

  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true,
    sendUpdate: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }

  checkValidity = () => {
    let additions = this.fns.FieldNames.property4.Additions;
    this.nextBtnConfig.disabledBtn = this.platformDataService.getUserData(additions) != undefined ? false : true;
  }

  back = () => this.nav.goto.property4.back();
  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.property4.next();

  ngOnInit(): void {
    this.checkValidity();
    this.scrollDownService.doScroll(350, false);
  }

}
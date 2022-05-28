import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {

  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    private scrollDownService: ScrollDownService,
    private nav: NavService ) {
  }

  propertyOne = this.fb.group({
    ApproximateHomeVal: [''],
    HomeCondition: [''],
    PropertyType: [''],
    HomeType: [''],
    InvPropRented: [''],
    LeaseEnd: ['']
  });

  homeValue:string = '';
  homeValueDefault:string = this.homeValue;

  homeCondition = [ 'Pristine', 'Needs minor repairs', 'Needs major repairs' ];
  homeConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property1.HomeCondition);
  homeConditionQuestionConfig = {
    inputlabel: "Home condition",
    controlname: "HomeCondition",
    label: "Select",
    required: "true"
  }

  asisSituation = () => this.platformDataService.getUserData(this.fns.FieldNames.property1.HomeCondition) == 'Needs major repairs';

  propertyType = [ 'House', 'Condo', 'Townhome', 'Other' ];
  propTypeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property1.PropertyType);
  propertyTypeQuestionConfig = {
    inputlabel: "Property type",
    controlname: "PropertyType",
    label: "Select"
  }

  homeTypeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property1.HomeType);
  homeTypeQuestionConfig = {
    inputlabel: "Is this a...",
    type: "checkbox",
    controlname: "HomeType",
    truelabel: "Primary Home",
    trueval: "Primary Home",
    falselabel: "Investment Property",
    falseval: "Investment Property"
  }

  invPropRentedDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property1.InvPropRented);
  currentlyRentedQuestionConfig = {
    inputlabel: "Is it currently rented?",
    type: "radio",
    controlname: "InvPropRented",
    truelabel: "Yes",
    trueval: 'true',
    falselabel: "No",
    falseval: 'false'
  }

  leaseEndDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property1.LeaseEnd);
  leaseEndQuestionConfig = {
    inputlabel: "When is the lease up?",
    controlname: "LeaseEnd",
    placeholder: "Answer",
    required: "false",
    format: ""
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    this.scrollDownService.scrollDown(name, e);
    this.checkValidity();
  }

  homeValueChanged = (e:any) => {
    this.platformDataService.addUserData(this.fns.FieldNames.property1.ApproximateHomeVal, e.target.value.replace(/[, ]+/g, " ").replace(/\s/g, '').replace(/\$/g,''));
    this.checkValidity();
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined;
  checkValidity = () => this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.property1.ApproximateHomeVal)
    || this.propertyOne.get('ApproximateHomeVal')!.value.length < 5
    || this.notAnswered(this.fns.FieldNames.property1.HomeCondition)
    || this.propertyOne.get('HomeCondition')!.value == 'Select'
      ? true : false;

  // Next and Back button
  nextBtnConfig = {
    text: 'NEXT',
    sendUpdate: true,
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }

  scrolldowns = [
    {
      key: this.fns.FieldNames.property1.HomeType,
      value: 'Investment Property',
      height: 100
    },
    {
      key: this.fns.FieldNames.property1.InvPropRented,
      value: 'Yes',
      height: 200
    }
  ];

  back = () => this.nav.goto.property1.back();
  next = () => this.nav.goto.property1.next();

  ngOnInit(): void {
    this.homeValue = this.platformDataService.getUserData(this.fns.FieldNames.property1.ApproximateHomeVal);
    this.propertyOne.patchValue({ApproximateHomeVal: this.homeValue});
    this.scrollDownService.addScrollDowns(this.scrolldowns);
    this.checkValidity();
  }
}
import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-property-three',
  templateUrl: './property-three.component.html',
  styleUrls: ['./property-three.component.scss']
})
export class PropertyThreeComponent implements OnInit {

  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    private scrollDownService: ScrollDownService,
    private nav: NavService ) {
  }

  totalSqFootageDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property3.TotalSqFt);
  totalSqFootageQuestionConfig = {
    inputlabel: "Total square footage",
    controlname: "TotalSqFt",
    placeholder: "0",
    required: "false",
    format: ""
  }

  aboveSqFootageDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property3.AboveGroundSqFt);
  aboveSqFootageQuestionConfig = {
    inputlabel: "Above ground square footage",
    controlname: "AboveGroundSqFt",
    placeholder: "0",
    required: "false",
    format: ""
  }

  belowSqFootageDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property3.BelowGroundSqFt);
  belowSqFootageQuestionConfig = {
    inputlabel: "Below ground square footage",
    controlname: "BelowGroundSqFt",
    placeholder: "0",
    required: "false",
    format: ""
  }

  yearBuiltDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property3.YearBuilt);
  yearBuiltQuestionConfig = {
    inputlabel: "Year built",
    controlname: "YearBuilt",
    placeholder: "",
    required: "false",
    format: ""
  }

  yearPurchasedDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.property3.YearPurchased);
  yearPurchasedQuestionConfig = {
    inputlabel: "Year purchased",
    controlname: "YearPurchased",
    placeholder: "",
    required: "false",
    format: ""
  }

  numberFloorsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property3.Number_Floors) || 0;
  numberFloorsQuestionConfig = {
    inputlabel: "Number of floors",
    controlname: "Number_Floors"
  }

  numberGarageSpacesDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property3.Number_GarageSpaces) || 0;
  numberGarageSpacesQuestionConfig = {
    inputlabel: "Number of garage spaces",
    controlname: "Number_GarageSpaces"
  }

  garageTypesArray = [ 'Attached', 'Detached', 'Carport' ];
  garageTypesDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property3.GarageType);

  propertyThree = this.fb.group({
    TotalSqFt: [''],
    AboveGroundSqFt: [''],
    BelowGroundSqFt: [''],
    YearBuilt: [''],
    YearPurchased: [''],
    Number_Floors: [''],
    Number_GarageSpaces: [''],
    GarageType: ['']
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  nextBtnConfig = {
    text: 'NEXT',
    sendUpdate: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
 
  back = () => this.nav.goto.property3.back();
  next = () => this.nav.goto.property3.next();

  ngOnInit(): void {

    if (this.garageTypesDefault) {
      this.propertyThree.patchValue({ 'GarageType': this.garageTypesDefault })
    }
    this.scrollDownService.doScroll(350, false);
  }

}
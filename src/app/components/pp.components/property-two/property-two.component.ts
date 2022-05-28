import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-property-two',
  templateUrl: './property-two.component.html',
  styleUrls: ['./property-two.component.scss']
})
export class PropertyTwoComponent implements OnInit {

  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService ) {
  }

  propertyTwo = this.fb.group({});

  bedroomsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property2.Number_Bedrooms);
  bedroomsQuestionConfig = {
    inputlabel: "Bedrooms",
    controlname: "numberBedrooms"
  }

  fullBathsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property2.Number_FullBathrooms);
  fullBathsQuestionConfig = {
    inputlabel: "Full Baths",
    controlname: "numberFullBaths"
  }

  oneQtrBathsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property2.Number_QtrBathrooms);
  oneQtrBathsQuestionConfig = {
    inputlabel: "1/4 Baths",
    controlname: "number1QtrBaths"
  }

  halfBathsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property2.Number_HalfBathrooms);
  halfBathsQuestionConfig = {
    inputlabel: "1/2 Baths",
    controlname: "numberHalfBaths"
  }

  threeQtrBathsDefault:string = this.platformDataService.getUserData(this.fns.FieldNames.property2.Number_3QtrBathrooms);
  threeQtrBathsQuestionConfig = {
    inputlabel: "3/4 Baths",
    controlname: "number3QtrBaths"
  }

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

  back = () => this.nav.goto.property2.back();
  next = () => this.nav.goto.property2.next();

  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
  }

}
import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-six',
  templateUrl: './interior-six.component.html',
  styleUrls: ['./interior-six.component.scss']
})
export class InteriorSixComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService ) { }

  bedroomFlooringTypesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior6.Bedroom_Flooring_Types);
  flooringTypes = ['Carpet','Hardwood','Laminate','Tile','Vinyl/Linoleum','Other'];
  bedroomFlooringTypesQuestionConfig = {
    controlname: "Bedroom_Flooring_Types",
    label: "What type of flooring is in the bedroom(s)?",
    required: true
  }

  bedroomFlooringCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  bedroomFlooringConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior6.Bedroom_Flooring_Condition);
  bedroomFlooringConditionQuestionConfig = {
    inputlabel: "Overall condition of bedroom flooring",
    controlname: "Bedroom_Flooring_Condition",
    label: "Select"
  }

  bathroomFlooringTypesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior6.Bathroom_Flooring_Types);
  bathroomflooringTypes = ['Carpet','Hardwood','Laminate','Tile','Vinyl/Linoleum','Other'];
  bathroomFlooringTypesQuestionConfig = {
    controlname: "Bathroom_Flooring_Types",
    label: "What type of flooring is in the bathroom(s)?",
    required: true
  }

  bathroomFlooringCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  bathroomFlooringConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior6.Bathroom_Flooring_Condition);
  bathroomFlooringConditionQuestionConfig = {
    inputlabel: "Overall condition of bathroom flooring",
    controlname: "Bathroom_Flooring_Condition",
    label: "Select"
  }

  interiorSixInfo = this.fb.group({
    Bedroom_Flooring_Types: this.fb.array([], [Validators.required]),
    Bathroom_Flooring_Types: this.fb.array([], [Validators.required]),
    Bedroom_Flooring_Condition: [''],
    Bathroom_Flooring_Condition: ['']
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior6.Bedroom_Flooring_Types) || this.notAnswered(this.fns.FieldNames.interior6.Bathroom_Flooring_Types) ? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior6.next();
  back = () => this.nav.goto.interior6.back();

  ngOnInit(): void {
    this.checkValidity();
    this.scrollDownService.doScroll(350, false);
  }

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true,
    sendUpdate: true
  }
  backBtnConfig={
    backtext: "BACK"
  }
}

import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-five',
  templateUrl: './interior-five.component.html',
  styleUrls: ['./interior-five.component.scss']
})
export class InteriorFiveComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService) { }

  kitchenFlooringTypesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior5.Kitchen_Flooring_Types);
  flooringTypes = ['Carpet','Hardwood','Laminate','Tile','Vinyl/Linoleum','Other'];
  kitchenFlooringTypesQuestionConfig = {
    controlname: "Kitchen_Flooring_Types",
    label: "What type of flooring is in the kitchen?",
    required: true
  }

  kitchenFlooringCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  kitchenFlooringConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior5.Kitchen_Flooring_Condition);
  kitchenFlooringConditionQuestionConfig = {
    inputlabel: "Overall condition of kitchen flooring",
    controlname: "Kitchen_Flooring_Condition",
    label: "Select"
  }

  mainFlooringTypesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior5.Main_Flooring_Types);
  mainflooringTypes = ['Carpet','Hardwood','Laminate','Tile','Vinyl/Linoleum','Other'];
  mainFlooringTypesQuestionConfig = {
    controlname: "Main_Flooring_Types",
    label: "What type of flooring is in the main areas of the home?",
    required: true
  }

  mainFlooringCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  mainFlooringConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior5.Main_Flooring_Condition);
  mainFlooringConditionQuestionConfig = {
    inputlabel: "Overall condition of main area flooring",
    controlname: "Main_Flooring_Condition",
    label: "Select"
  }

  interiorFiveInfo = this.fb.group({
    Kitchen_Flooring_Types: this.fb.array([], [Validators.required]),
    Main_Flooring_Types: this.fb.array([], [Validators.required]),
    Kitchen_Flooring_Condition: [''],
    Main_Flooring_Condition: ['']
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }
  
  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior5.Kitchen_Flooring_Types) || this.notAnswered(this.fns.FieldNames.interior5.Main_Flooring_Types) ? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior5.next();
  back = () => this.nav.goto.interior5.back();

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

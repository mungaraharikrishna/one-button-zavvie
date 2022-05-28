import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-three',
  templateUrl: './interior-three.component.html',
  styleUrls: ['./interior-three.component.scss']
})
export class InteriorThreeComponent implements OnInit {
  newval:any;
  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService ) {
  }

  kitchenFeaturesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior3.Kitchen_Special_Features);
  kitchenFeatures = ['Walk-in Pantry', 'Kitchen Island', 'Double Oven', 'Separate Cooktop',
  'Built-in Microwave', 'Built-in Wall Oven', 'Tile Backsplash', 'Updated Cabinets', 'None of the above'];
  kitchenFeaturesQuestionConfig = {
    controlname: "Kitchen_Special_Features",
    label: "Kitchen:",
    required: true
  }

  remodeledKitchen = ['Never', 'Past 5 years', '5-10 years', '10+ years']
  remodeledKitchenDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior3.Remodeled_Kitchen);
  remodeledKitchenQuestionConfig = {
    inputlabel: "Remodeled kitchen",
    controlname: "Remodeled_Kitchen",
    label: "Select",
  }

  kitchenCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  kitchenConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior3.Overall_Condition_of_Kitchen);
  kitchenConitionQuestionConfig = {
    inputlabel: "Overall condition of kitchen",
    controlname: "Overall_Condition_of_Kitchen",
    label: "Select",
  }

  interiorThreeInfo = this.fb.group({
    Kitchen_Special_Features: this.fb.array([]),
    Remodeled_Kitchen: [''],
    Overall_Condition_of_Kitchen: ['']
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior3.Kitchen_Special_Features) ? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior3.next();
  back = () => this.nav.goto.interior3.back();

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

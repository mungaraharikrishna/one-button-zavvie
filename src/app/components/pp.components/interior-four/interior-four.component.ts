import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-four',
  templateUrl: './interior-four.component.html',
  styleUrls: ['./interior-four.component.scss']
})
export class InteriorFourComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService) { }
  
  masterBathDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior4.Bathroom_Special_Features);
  masterBath = ['Granite Countertops', 'Double Sink', 'Separate Tub/Shower', 'Custom Bathtub',
  'Updated Tile Floor', 'Tile Shower Walls', 'None of the above'];
  masterBathQuestionConfig = {
    controlname: "Bathroom_Special_Features",
    label: "Master bathroom:",
    required: true
  }

  remodeledMbath = ['Never', 'Past 5 years', '5-10 years', '10+ years']
  masterBathRemodeledDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior4.Remodeled_Master_Bathroom);
  masterBathRemodeledQuestionConfig = {
    inputlabel: "Remodeled master bathroom?",
    controlname: "Remodeled_Master_Bathroom",
    label: "Select",
  }

  masterBathCondition = ['Needs Work', 'Average Condition', 'Looks Brand new']
  masterBathConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior4.Overall_Condition_of_Master_Bathroom);
  masterBathConitionQuestionConfig = {
    inputlabel: "Overall condition of master bathroom",
    controlname: "Overall_Condition_of_Master_Bathroom",
    label: "Select",
  }
 
  interiorFourInfo = this.fb.group({
    Bathroom_Special_Features: this.fb.array([], [Validators.required]),
    Remodeled_Master_Bathroom: [''],
    Overall_Condition_of_Master_Bathroom: ['']
  });

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior4.Bathroom_Special_Features) ? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior4.next();
  back = () => this.nav.goto.interior4.back();

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

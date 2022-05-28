import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder, Validators } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-exterior-three',
  templateUrl: './exterior-three.component.html',
  styleUrls: ['./exterior-three.component.scss']
})
export class ExteriorThreeComponent implements OnInit {

  newval:any;
  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    public scrollDownService: ScrollDownService,
    private nav: NavService) { }

  exteriorThreeInfo = this.fb.group({
    chooseExteriorPaint: ['', [Validators.required]],
    chooseBackyardFence: ['', [Validators.required]],
    chooseRoofCondition: ['', [Validators.required]],
    backsupto: this.fb.array([], [Validators.required])
  });
  
  exteriorPaintType = ['Needs Work', 'Average Condition', 'Looks Brand New'];
  exteriorPaintTypeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior3.Exterior_Paint);
  exteriorPaintTypeQuestionConfig = {
    inputlabel: "Exterior paint condition",
    controlname: "chooseExteriorPaint",
    label: "Select",
  }
  
  backyardFenceType = ['Fully Fenced', 'Partially Fenced', 'No Fence'];
  backyardFenceTypeDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior3.Backyard_Fence);
  backyardFenceTypeQuestionConfig = {
    inputlabel: "Backyard fence",
    controlname: "chooseBackyardFence",
    label: "Select",
  }
    
  roofCondition = ['Needs Work', 'Average Condition', 'Looks Brand New'];
  roofConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior3.Roof_Condition);
  roofConditionQuestionConfig = {
    inputlabel: "Roof condition",
    controlname: "chooseRoofCondition",
    label: "Select",
  }
  
  backsUpTo = ['Busy road', 'Commercial buildings', 'Power lines', 'Commuter/Freight train', 'None of the above'];
  backsUpToDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior3.Property_Backs_up_to);
  backsUpToQuestionConfig = {
    controlname: "backsupto",
    label:"Property backs up to the following:",
  }
   
  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    // console.log(this.platformDataService.getAllUserData());
  }

  next = () => this.nav.goto.exterior3.next();
  back = () => this.nav.goto.exterior3.back();

  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
  }

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    sendUpdate: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior',
  templateUrl: './interior.component.html',
  styleUrls: ['./interior.component.scss']
})
export class InteriorComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    public fb: FormBuilder,
    private nav: NavService ) { }

  interiorOne = this.fb.group({
    Interior_Paint: [''],
    Neutral_Interior_Paint_Colors: ['', [Validators.required]]
  });
  conditionPaintInterior = ['Needs Work','Average Condition','Looks Brand New']
  interiorPaintConditionDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior1.Interior_Paint);
  interiorPaintConditionQuestionConfig = {
    inputlabel: "Interior paint condition",
    controlname: "Interior_Paint",
    label: "Select"
  }
  neutralPaintColors = ['Yes','No','Mixed - Mostly Neutral', 'Mixed - Mostly Non-Neutral']
  interiorPaintColorsDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior1.Neutral_Interior_Paint_Colors);
  interiorPaintColorsQuestionConfig = {
    inputlabel: "Neutral interior paint colors?",
    controlname: "Neutral_Interior_Paint_Colors",
    label: "Select",
    required: "true"
  }
  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }
  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined || this.get(name).length < 1;
  checkValidity = () => {
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior1.Neutral_Interior_Paint_Colors)? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior1.next();
  back = () => this.nav.goto.interior1.back();

  ngOnInit(): void {
    this.checkValidity();
    // remove active class from Property transbtn
    let transbtn = document.getElementById('transbtn-property');
    transbtn?.classList.remove('active');
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

import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { FormBuilder } from "@angular/forms";
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-exterior-two',
  templateUrl: './exterior-two.component.html',
  styleUrls: ['./exterior-two.component.scss']
})
export class ExteriorTwoComponent implements OnInit {
  newval:any;

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService ) { }

  exteriorTwoInfo = this.fb.group({
    Front_Yard_Landscaping: [''],
    Back_Yard_Landscaping: ['']
  });

  landscapingTypesFrontDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior2.Front_Yard_Landscaping);
  landscapingTypesFront= [
    { name: 'None',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-front-none.jpg' },
    { name: 'Lush',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-front-lush.jpg' },
    { name: 'Sparse',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-front-medium.jpg' }
  ]
  landscapingFrontQuestionConfig = {
    controlname: "Front_Yard_Landscaping",
    label: "Front yard landscaping:",
    name:"radio"
  }

  landscapingTypesBackDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.exterior2.Back_Yard_Landscaping);
  landscapingTypesBack= [
    { name: 'None',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-back-none.jpg' },
    { name: 'Lush',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-back-lush.jpg' },
    { name: 'Sparse',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/landscaping-back-medium.jpg' }
  ]

  landscapingBackQuestionConfig = {
    controlname: "Back_Yard_Landscaping",
    label: "Back yard landscaping:",
    name:"radioImg"
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    // console.log(this.platformDataService.getAllUserData());
  }


  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    sendUpdate: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }
 
  next = () => this.nav.goto.exterior2.next();
  back = () => this.nav.goto.exterior2.back();

  ngOnInit(): void {
    this.scrollDownService.doScroll(350, false);
  }

}
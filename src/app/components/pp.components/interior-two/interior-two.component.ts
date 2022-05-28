import { Component, OnInit } from '@angular/core';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FormBuilder, Validators } from "@angular/forms";
import { ScrollDownService } from '../../../services/scroll-down.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-interior-two',
  templateUrl: './interior-two.component.html',
  styleUrls: ['./interior-two.component.scss']
})
export class InteriorTwoComponent implements OnInit {
  newval:any;
  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    public fb: FormBuilder,
    private nav: NavService) { }

  interiorTwoInfo = this.fb.group({
    Kitchen_Counter_Tops: ['', [Validators.required]],
    Kitchen_Appliances: ['', [Validators.required]]
  });

  kitchenCounterTopsDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior2.Kitchen_Counter_Tops);
  counterTops = [
    { name: 'Granite',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_granite.png' },
    { name: 'Marble',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_marble.png' },
    { name: 'Tile',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_granite-tile.jpg' },
    { name: 'Quartz',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_quartz.png' },
    { name: 'Corian',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_corian.png' },
    { name: 'Formica',
      img: 'https://zavvie.com/wp-content/themes/bb-theme-child/zavvie-partners/ngpp/img/countertop_formica.png' }
  ]

  kitchenCounterTopsQuestionConfig = {
    controlname: "Kitchen_Counter_Tops",
    label: "Kitchen countertops",
    required: "true",
  }

  kitchenAppliances = ['All Black', 'All White', 'All Stainless', 'Mixed']
  kitchenAppliancesDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.interior2.Kitchen_Appliances);
  kitchenAppliancesQuestionConfig = {
    inputlabel: "Kitchen appliances",
    controlname: "Kitchen_Appliances",
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
    this.nextBtnConfig.disabledBtn = this.notAnswered(this.fns.FieldNames.interior2.Kitchen_Counter_Tops) || this.notAnswered(this.fns.FieldNames.interior2.Kitchen_Appliances) ? true : false;
  }

  next = () => !this.nextBtnConfig.disabledBtn && this.nav.goto.interior2.next();
  back = () => this.nav.goto.interior2.back();

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

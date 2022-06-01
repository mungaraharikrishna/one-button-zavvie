import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-financial-info',
  templateUrl: './financial-info.component.html',
  styleUrls: ['./financial-info.component.scss']
})
export class FinancialInfoComponent implements OnInit {
  nextBtnConfig = {
    text: 'NEXT',
    type: 'submit',
    disabledBtn: false
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
  financialInfoForm!: FormGroup;
  showBuyerPPLoader: boolean = false;
  constructor(public fb: FormBuilder,
    public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) { }

  ngOnInit(): void {
  }

  back = () => {
    this.nav.goto.financialInfo.back();
  }

  next = () => {
    this.nav.goto.financialInfo.next();
  }

}

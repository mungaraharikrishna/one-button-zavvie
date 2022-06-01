import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-mortgage-info',
  templateUrl: './mortgage-info.component.html',
  styleUrls: ['./mortgage-info.component.scss']
})
export class MortgageInfoComponent implements OnInit {
  nextBtnConfig = {
    text: 'NEXT',
    type: 'submit',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
  showBuyerPPLoader: boolean = false;
  mortgageForm: FormGroup;
  showMortgageSize: boolean = false;
  showMortgageTBD: boolean = false;
  showMortgagePlane: boolean = false;
  constructor( public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService, private fb: FormBuilder) { 
      this.mortgageForm = this.fb.group({
        mortgage: ['', [Validators.required]],
        mortgageSize: [''],
        mortgageTBD: [''],
        mortgagePlan: [''],
        clientSell: ['']
      })
    }

  ngOnInit(): void {
    this.mortgageForm.valueChanges.subscribe(val => {
      this.nextBtnConfig.disabledBtn = this.mortgageForm.invalid;
    })
    this.mortgageForm.get('mortgage')?.valueChanges.subscribe(val => {
      this.showMortgageSize = val == 'VA loan' ? true : false;
      this.showMortgagePlane = val == 'N/A - Other' ? true : false;
      if (this.showMortgageSize) {
        this.mortgageForm.get('mortgageSize')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('mortgageSize')?.clearValidators();
      }
      this.mortgageForm.get('mortgageSize')?.updateValueAndValidity();
      if (this.showMortgagePlane) {
        this.mortgageForm.get('mortgagePlan')?.setValidators([Validators.required]);
        this.mortgageForm.get('clientSell')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('mortgagePlan')?.clearValidators();
        this.mortgageForm.get('clientSell')?.clearValidators();
      }
      this.mortgageForm.get('mortgagePlan')?.updateValueAndValidity();
      this.mortgageForm.get('clientSell')?.updateValueAndValidity();
    })
    this.mortgageForm.get('mortgageSize')?.valueChanges.subscribe(val => {
      this.showMortgageTBD = val == 'Conforming' ? true : false;
      if (this.showMortgageTBD) {
        this.mortgageForm.get('mortgageTBD')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('mortgageTBD')?.clearValidators();
      }
      this.mortgageForm.get('mortgageTBD')?.updateValueAndValidity();
    })
    let data = this.platformDataService.getData('morrtgageData');
    if (data) {
      this.mortgageForm.patchValue({
        'mortgage': data.mortgage,
        'mortgageSize': data.mortgageSize,
        'mortgageTBD': data.mortgageTBD,
        'mortgagePlan': data.mortgagePlan,
        'clientSell': data.clientSell,
      })
    }
  }

  back = () => {
    this.nav.goto.mortgageInfo.back();
  }

  next = () => {
    this.platformDataService.setData('morrtgageData', this.mortgageForm.value);
    this.nav.goto.mortgageInfo.next();
  }

}

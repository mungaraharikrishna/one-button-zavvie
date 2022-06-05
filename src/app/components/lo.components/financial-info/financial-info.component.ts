import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  financialInfoForm: FormGroup;
  showBuyerPPLoader: boolean = false;
  newval: any;
  showHideText: boolean = true;
  showgapCoverageAmount: boolean = false;
  constructor(public fb: FormBuilder,
    public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) {
    this.financialInfoForm = this.fb.group({
      MaxRange: [null, [Validators.required]],
      AppraisalGapCoverage: ['', [Validators.required]],
      AppraisalGapCoverageAmount: [null],
      DownPaymentAmount: [null, [Validators.required]],
      DownPaymentPrecent: [null, [Validators.required]],
      CreditScore: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.financialInfoForm.valueChanges.subscribe(val => {
      this.nextBtnConfig.disabledBtn = this.financialInfoForm.invalid;
    })
    this.financialInfoForm.get('AppraisalGapCoverage')?.valueChanges.subscribe(val => {
      this.showgapCoverageAmount = val;
      if (this.showgapCoverageAmount) {
        this.financialInfoForm.get('AppraisalGapCoverageAmount')?.setValidators([Validators.required]);
      } else {
        this.financialInfoForm.get('AppraisalGapCoverageAmount')?.setValue(null);
        this.financialInfoForm.get('AppraisalGapCoverageAmount')?.clearValidators();
      }
      this.financialInfoForm.get('AppraisalGapCoverageAmount')?.updateValueAndValidity();
    })
    let data = this.platformDataService.getData('financialData');
    if (data) {
      this.financialInfoForm.patchValue({
        'MaxRange': this.platformDataService.getUserData(this.fns.FieldNames.buyerInfo.MaxRange),
        'AppraisalGapCoverage': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AppraisalGapCoverage),
        'AppraisalGapCoverageAmount': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AppraisalGapCoverageAmount),
        'DownPaymentAmount': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.DownPaymentAmount),
        'DownPaymentPrecent': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.DownPaymentPrecent),
        'CreditScore': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.CreditScore),
      })
    }
  }

  numberPatternValidation(event: any) {
    const allowedRegex = /[0-9]/g;
    if (!event.key.match(allowedRegex)) {
      event.preventDefault();
    }
  }

  changeShowHide(elm: HTMLInputElement) {
    if (elm.value) {
      this.showHideText = !this.showHideText;
    }
  }

  formValueChanged = (name: string, e: any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  back = () => {
    this.nav.goto.financialInfo.back();
  }

  next = () => {
    this.platformDataService.setData('financialData', this.financialInfoForm.value);
    this.nav.goto.financialInfo.next();
  }

}

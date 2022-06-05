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
  newval: any;
  constructor( public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService, private fb: FormBuilder) { 
      this.mortgageForm = this.fb.group({
        MortgageType: ['', [Validators.required]],
        MortgageSize: [''],
        Underwritingapproval: [''],
        MortgagePlan: [''],
        HomeToSell: ['']
      })
    }

  ngOnInit(): void {
    this.mortgageForm.valueChanges.subscribe(val => {
      this.nextBtnConfig.disabledBtn = this.mortgageForm.invalid;
    })
    this.mortgageForm.get('MortgageType')?.valueChanges.subscribe(val => {
      this.showMortgageSize = val == 'VA loan' ? true : false;
      this.showMortgagePlane = val == 'N/A - Other' ? true : false;
      if (this.showMortgageSize) {
        this.mortgageForm.get('MortgageSize')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('MortgageSize')?.setValue('');
        this.mortgageForm.get('MortgageSize')?.clearValidators();
      }
      this.mortgageForm.get('MortgageSize')?.updateValueAndValidity();
      if (this.showMortgagePlane) {
        this.mortgageForm.get('MortgagePlan')?.setValidators([Validators.required]);
        this.mortgageForm.get('HomeToSell')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('MortgagePlan')?.setValue('');
        this.mortgageForm.get('HomeToSell')?.setValue('');
        this.mortgageForm.get('MortgagePlan')?.clearValidators();
        this.mortgageForm.get('HomeToSell')?.clearValidators();
      }
      this.mortgageForm.get('MortgagePlan')?.updateValueAndValidity();
      this.mortgageForm.get('HomeToSell')?.updateValueAndValidity();
    })
    this.mortgageForm.get('MortgageSize')?.valueChanges.subscribe(val => {
      this.showMortgageTBD = val == 'Conforming' ? true : false;
      if (this.showMortgageTBD) {
        this.mortgageForm.get('Underwritingapproval')?.setValidators([Validators.required]);
      } else {
        this.mortgageForm.get('Underwritingapproval')?.setValue('');
        this.mortgageForm.get('Underwritingapproval')?.clearValidators();
      }
      this.mortgageForm.get('Underwritingapproval')?.updateValueAndValidity();
    })
    let data = this.platformDataService.getData('mortgageData');
    if (data) {
      this.mortgageForm.patchValue({
        'MortgageType': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.MortgageType),
        'MortgageSize': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.MortgageSize),
        'Underwritingapproval': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.Underwritingapproval),
        'MortgagePlan': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.MortgagePlan),
        'HomeToSell': this.platformDataService.getUserData(this.fns.FieldNames.buyerSolutions.HomeToSell),
      })
    }
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  back = () => {
    this.nav.goto.mortgageInfo.back();
  }

  next = () => {
    this.platformDataService.setData('mortgageData', this.mortgageForm.value);
    this.nav.goto.mortgageInfo.next();
    this.wpApiService.updateClientContactLO(this.mortgageForm.value);
  }

}

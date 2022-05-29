import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-client-contact-info',
  templateUrl: './client-contact-info.component.html',
  styleUrls: ['./client-contact-info.component.scss']
})
export class ClientContactInfoComponent implements OnInit {
  nextBtnConfig = {
    text: 'NEXT',
    type: 'submit',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
  clientContactForm: FormGroup;
  showBuyerPPLoader: boolean = false;
  checkmsg: any;
  constructor(public fb: FormBuilder,
    public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) { 
      this.clientContactForm = this.fb.group({
        'clientFirstName': ['', [Validators.required]],
        'clientLastName': ['', [Validators.required]],
        'clientEmail': ['', [Validators.required, Validators.email]],
        'clientPhone': ['', [Validators.required]],
        'loanOfficerFirstName': ['', [Validators.required]],
        'loanOfficerLastName': ['', [Validators.required]],
        'loanOfficerEmail': ['', [Validators.required, Validators.email]],
        'loanOfficerPhone': ['', [Validators.required]],
        'loanOfficerID': ['', [Validators.required]],
        'SignedListingAgreement': [true]
      });
      this.clientContactForm.valueChanges.subscribe(val => {
        this.nextBtnConfig.disabledBtn = this.clientContactForm.invalid;
      })
    }

  ngOnInit(): void {
    this.platformDataService.currentSuccessMessage.subscribe(currentSuccessMessage => this.checkmsg = currentSuccessMessage);
  }

  back = () => {
    this.nav.goto.clientContactInfo.back();
  }

  next = () => {
    console.log(this.clientContactForm.value);
    this.nav.goto.clientContactInfo.next();
  }

}

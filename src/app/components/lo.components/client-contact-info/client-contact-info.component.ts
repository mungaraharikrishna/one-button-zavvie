import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    backtext: 'Start over'
  }
  clientContactForm: FormGroup;
  showBuyerPPLoader: boolean = false;
  checkmsg: any;
  showAgentFields: boolean = false;
  newval: any;
  constructor(public fb: FormBuilder,
    public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) {
    this.clientContactForm = this.fb.group({
      'ClientFirstName': ['', [Validators.required]],
      'ClientLastName': ['', [Validators.required]],
      'ClientEmail': ['', [Validators.required, Validators.email]],
      'ClientPhone': ['', [Validators.required]],
      'LoanOfficerFirstName': ['', [Validators.required]],
      'LoanOfficerLastName': ['', [Validators.required]],
      'LoanOfficerEmail': ['', [Validators.required, Validators.email]],
      'LoanOfficerPhone': ['', [Validators.required]],
      'LoanOfficerID': ['', [Validators.required]],
      'AdditionalClientContacts': this.fb.array([]),
      'SignedListingAgreement': ['', [Validators.required]],
      'AgentFirstName': [''],
      'AgentLastName': [''],
      'AgentEmail': [''],
      'AgentPhone': [''],
      'AgentID': [''],
    });
    this.clientContactForm.valueChanges.subscribe(val => {
      this.nextBtnConfig.disabledBtn = this.clientContactForm.invalid;
    })
    this.clientContactForm.get('SignedListingAgreement')?.valueChanges.subscribe(val => {
      this.showAgentFields = val == 'true' ? true : false;
      if (this.showAgentFields) {
        this.clientContactForm.get('AgentFirstName')?.setValidators([Validators.required]);
        this.clientContactForm.get('AgentLastName')?.setValidators([Validators.required]);
        this.clientContactForm.get('AgentEmail')?.setValidators([Validators.required, Validators.email]);
      } else {
        this.clientContactForm.get('AgentFirstName')?.clearValidators();
        this.clientContactForm.get('AgentLastName')?.clearValidators();
        this.clientContactForm.get('AgentEmail')?.clearValidators();
      }
      this.clientContactForm.get('AgentFirstName')?.updateValueAndValidity();
      this.clientContactForm.get('AgentLastName')?.updateValueAndValidity();
      this.clientContactForm.get('AgentEmail')?.updateValueAndValidity();
    })
  }

  ngOnInit(): void {
    this.platformDataService.currentSuccessMessage.subscribe(currentSuccessMessage => this.checkmsg = currentSuccessMessage);
    let data = this.platformDataService.getData('contactInfo');
    if (data) {
      this.clientContactForm.patchValue({
        'ClientFirstName': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientFirstName),
        'ClientLastName': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientLastName),
        'ClientEmail': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientEmail),
        'ClientPhone': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.ClientPhone),
        'LoanOfficerFirstName': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerFirstName),
        'LoanOfficerLastName': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerLastName),
        'LoanOfficerEmail': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerEmail),
        'LoanOfficerPhone': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerPhone),
        'LoanOfficerID': this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.LoanOfficerID),
        'SignedListingAgreement': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement),
        'AgentFirstName': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName),
        'AgentLastName': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName),
        'AgentEmail': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail),
        'AgentPhone': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone),
        'AgentID': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentID),
      });
      if (data.AdditionalClientContacts && data.AdditionalClientContacts.length) {
        let clientContactsArr = this.clientContacts;
        clientContactsArr.controls = [];
        data.AdditionalClientContacts.forEach((val: any) => {
          clientContactsArr.push(this.getClientContactForm(val));
        });
      }
    }
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
  }

  getClientContactForm(data?: any) {
    return this.fb.group({
      'AdditionalclientFirstName': [data ? this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AdditionalclientFirstName) : '', [Validators.required]],
      'AdditionalclientLastName': [data ? this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AdditionalclientLastName) : '', [Validators.required]],
      'AdditionalclientEmail': [data ? this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AdditionalclientEmail) : '', [Validators.required, Validators.email]],
      'AdditionalclientPhone': [data ? this.platformDataService.getUserData(this.fns.FieldNames.clientContactInfo.AdditionalclientPhone) : ''],
    })
  }

  get clientContacts(): FormArray {
    return this.clientContactForm.get('AdditionalClientContacts') as FormArray;
  }

  get clientContactsLength() {
    let clientContactsArr = this.clientContacts;
    return clientContactsArr.controls.length;
  }

  addClientContacts(event: Event) {
    event.preventDefault();
    let clientContactsArr = this.clientContacts;
    if (this.clientContactsLength < 2) {
      clientContactsArr.push(this.getClientContactForm());
    }
  }

  removeClientContact(index: number) {
    this.clientContacts.removeAt(index);
  }

  back = () => {
    this.platformDataService.changeLoFlow('');
    this.platformDataService.setData('contactInfo', '');
    this.nav.goto.home();
  }

  next = () => {
    console.log(this.clientContactForm.value)
    this.platformDataService.setData('contactInfo', this.clientContactForm.value);
    this.nav.goto.contactInfo.next();
    this.wpApiService.updateClientContactLO(this.clientContactForm.value);
  }

}

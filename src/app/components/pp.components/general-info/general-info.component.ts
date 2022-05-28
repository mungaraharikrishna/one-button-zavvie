import { Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldNameService } from '../../../services/field-name.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { NavService } from 'src/app/services/nav.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss'],
})
export class GeneralInfoComponent implements OnInit {

  checkmsg:any = "";
  retrievedObject:any;
  parseData:any;
  platformData:any;

  newval:any;

  isSeller:boolean = false;
  isBuyer:boolean = false;
  
  constructor (
    public fb: FormBuilder,
    public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) {
   }

  // General Info input fields
  generalInfo = this.fb.group({
    'AgentFirstName': [''],
    'AgentLastName': [''],
    'AgentEmail': ['', [Validators.required, Validators.email]],
    'AgentPhone': ['', [Validators.required]],
    'AgentID': [''],
    'AgentClientFirstName': [''],
    'AgentClientLastName': [''],
    'AgentClientEmail': ['', [Validators.required, Validators.email]],
    'ClientPhone': [''],
    'SignedListingAgreement': ['']
  });

  agentFirstNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
  agentFirstNameQuestionConfig = {
    inputlabel: "Agent first name",
    controlname: "AgentFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentLastNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
  agentLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentLastName",
    placeholder: "Last name",
    required: "true"
  }

  agentIDDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentID);
  agentIDQuestionConfig = {
    inputlabel: "MLS Agent ID",
    controlname: "AgentID",
    placeholder: "Agent ID",
  }

  agentClientFirstNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);
  agentClientFirstNameQuestionConfig = {
    inputlabel: "Client first name",
    controlname: "AgentClientFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentClientLastNameDefault:any = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName);
  agentClientLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentClientLastName",
    placeholder: "Last name",
    required: "true"
  }

  haveSignedListingAgreement:boolean = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement) || false;
  stringSignedListingAgreement:string = this.haveSignedListingAgreement ? 'true' : 'false';
  toggleSignedAgreementSelection = () => {
    this.haveSignedListingAgreement = !this.haveSignedListingAgreement;
    this.stringSignedListingAgreement = this.haveSignedListingAgreement ? 'true' : 'false';
    this.platformDataService.addUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement, this.haveSignedListingAgreement ? 'true' : 'false');
  }

  //// Next and back Button ////
  nextBtnConfig = {
    text: 'NEXT',
    type: 'submit',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }

  formValueChanged = (name:string, e:any) => {
    this.newval = e;
    this.platformDataService.addUserData(name, e);
    this.checkValidity();
    // console.log(this.platformDataService.getAllUserData());
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.platformDataService.getUserData(name);
  notAnswered = (name:any) => this.get(name) == '' || this.get(name) == null || this.get(name) == undefined;
  checkValidity = () => this.nextBtnConfig.disabledBtn = this.generalInfo.invalid
    || this.notAnswered(this.fns.FieldNames.generalInfo.AgentClientFirstName)
    || this.notAnswered(this.fns.FieldNames.generalInfo.AgentClientLastName)
      ? true : false;

  agentPhoneDefault:string = '';
  agentEmailDefault:string = '';
  agentClientEmailDefault:string = '';
  clientPhoneDefault:string = '';
  showBuyerPPLoader:boolean = false;
  buyerPPid:any;
  buyerPPidSet:boolean = false;

  back = () => this.nav.goto.generalInfo.back();
  next = () => {
    this.showBuyerPPLoader = true;
    if (this.isBuyer) {
      this.buyerPPid = this.platformDataService.getData('buyerPPid');
      if (!this.buyerPPid) {
        this.wpApiService.makeBuyerPropertyProfile().subscribe((response:any) => {
          this.buyerPPid = response.id;
          this.platformDataService.setData('buyerPPid', this.buyerPPid);
          this.buyerPPidSet = this.buyerPPid == '' ? false : true;
          this.buyerPPidSet
            ? this.nav.goto.generalInfo.next()
            : console.log('Something went wrong...oops');
        });
      } else {
        this.nav.goto.generalInfo.next();
      }
    } else {
      this.nav.goto.generalInfo.next();
    }
  }

  currentAgent:any;
  ngOnInit(): void {
    this.platformDataService.currentSuccessMessage.subscribe(currentSuccessMessage => this.checkmsg = currentSuccessMessage);
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
  
    this.generalInfo.patchValue({
      'HomeownerEmail': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail),
      'AgentFirstName': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName),
      'AgentLastName': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName),
      'AgentEmail': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail),
      'AgentPhone': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone),
      'ClientPhone': this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone),
      'SignedListingAgreement': this.haveSignedListingAgreement
    });
  
    this.checkValidity();
    this.scrollDownService.doScroll(350, false);
  }

}
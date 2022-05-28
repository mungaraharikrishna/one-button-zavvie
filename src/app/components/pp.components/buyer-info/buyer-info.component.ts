import { Component, OnInit } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { NavService } from 'src/app/services/nav.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FieldNameService } from 'src/app/services/field-name.service';
import { WpApiService } from 'src/app/services/wp-api.service';
import { BuyerMarketService } from 'src/app/services/buyer-market.service';
import { ConfigService } from 'src/app/services/config.service';
import { EmailClientService } from 'src/app/services/email-client.service';

@Component({
  selector: 'app-buyer-info',
  templateUrl: './buyer-info.component.html',
  styleUrls: ['./buyer-info.component.scss']
})
export class BuyerInfoComponent implements OnInit {

  constructor(
    private pds: PlatformDataService,
    public fns: FieldNameService,
    public buyerMarketService: BuyerMarketService,
    private wpApiService: WpApiService,
    private nav: NavService,
    private fb: FormBuilder,
    private emailService: EmailClientService,
    private configService: ConfigService) {
      this.pds.currentBuyerMaxPrice.subscribe(newstatus => this.maxRangeDefault = newstatus);
    }

  isseller:boolean = false;
  isbuyer:boolean = false;

  ngOnInit(): void {
    this.pds.addUserData('MaxRange', this.maxRangeDefault);
    this.buyerInfoForm.get('MaxRange')!.setValue(this.maxRangeDefault, { onlySelf: true });
    this.pds.currentSellerStatus.subscribe(newstatus => this.isseller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isbuyer = newstatus);
    this.pds.currentVerifiedBuyers.subscribe(newbuyers => this.verified_buyers = newbuyers);
    this.setBuyerInfoFormValidator();
    this.checkValidity();
  }

  buyerInfoForm = this.fb.group({
    'MaxRange': ['', [Validators.minLength(4), Validators.maxLength(11)]],
    'Prequalified': [''],
    'LoanFirstName': [''],
    'LoanLastName': [''],
    'LoanEmail': [''],
    'LoanPhone': [''],
    'LoanType': [''],
    'HomeToSell': ['']
  });

  buyerLocationForm = this.fb.group({
    'LocationState': ['', [Validators.required]],
    'LocationCounty': ['', [Validators.required]]
  });
  
  setBuyerInfoFormValidator() {
    const LoanEmail = this.buyerInfoForm.get('LoanEmail')!;
    this.buyerInfoForm.get('Prequalified')!.valueChanges.subscribe(prequal => {
      if (prequal == 'Yes preapproved') {
        LoanEmail.setValidators([Validators.required, Validators.email]);
      }
      if (prequal == 'No not interested' || prequal == 'No but interested') {
        LoanEmail.setValidators(null);
      }
      LoanEmail.updateValueAndValidity();
      this.buyerInfoForm.updateValueAndValidity();
      this.checkValidity();
    })
  }

  newval:any;
  formValueChanged = (name:string, e:any) => {
    (name == "MaxRange")
      ? (this.pds.addUserData(name, e.target.value), this.newval = e.target.value)
      : (this.pds.addUserData(name, e), this.newval = e);
    this.checkValidity();
  }

  maxRangeDefault:string = '';
  maxRangeQuestionConfig:any = {
    placeholder: '$0',
    controlname: this.fns.FieldNames.buyerInfo.MaxRange,
    inputlabel: 'Max offer price',
    required: 'true'
  };

  // pre-approved for a loan 
  preApprovalArray = [ 
    {
      value: "Yes preapproved",
      heading: 'Yes'
    },
    {
      value: "No not interested",
      heading: 'No'
    },
    {
      value: "No but interested",
      heading: "No",
      subHeading: ", but they are interested in preapproval"
    }
  ];
  preApprovalDefault:string = this.pds.getUserData(this.fns.FieldNames.buyerInfo.Prequalified);

  loanFirstNameDefault:any = this.pds.getUserData(this.fns.FieldNames.buyerInfo.LoanFirstName);
  loanFirstNameQuestionConfig = {
    inputlabel: "Loan officer first name",
    controlname: "LoanFirstName",
    placeholder: "First name",
    required: "false"
  }

  loanLastNameDefault:any = this.pds.getUserData(this.fns.FieldNames.buyerInfo.LoanLastName);
  loanLastNameQuestionConfig = {
    inputlabel: "Loan officer last name",
    controlname: "LoanLastName",
    placeholder: "Last name",
    required: "false"
  }

  loanTypeDefault:any = this.pds.getUserData(this.fns.FieldNames.buyerInfo.LoanType);
  loanTypeArray = [ "Conventional loan", "FHA loan", "VA loan", "Jumbo loan", "Other/Not sure" ]
  loanTypeQuestionConfig = {
    controlname: "LoanType",
    label: "What type of loan is your client interested in?",
    required: true
  }

  // manually check validity of our required component inputs
  get = (name:any) => this.pds.getUserData(name);
  answered = (name:any) => this.get(name) != '' && this.get(name) != null && this.get(name) != undefined && this.get(name).length > 0 && this.get(name) != '$0' && this.get(name) != '$';
  checkValidity = () => this.nextBtnConfig.disabledBtn = !this.buyerInfoForm.invalid
    && this.answered(this.fns.FieldNames.buyerInfo.Prequalified)
    && this.answered(this.fns.FieldNames.buyerInfo.LoanType)
    && this.answered('buyerLocationText')
    && this.answered(this.fns.FieldNames.buyerInfo.MaxRange) ? false : true;

  proceedToSellerInfo = () => this.nav.goto.buyerInfo.next();

  doing_things:boolean = false;
  proceedSeller:boolean = false;
  showBuyerPPLoader:boolean = false;
  next = () => {
    this.showBuyerPPLoader = true;
    this.pds.addUserData('buyerEmailToClientConfirmed', true);
    this.pds.changeSuccessMessage('buyerEmailToClient');
    this.wpApiService.updateBuyerPP(this.pds.getData('buyerPPid')).subscribe((update_response:any) => {
      this.wpApiService.buyerSendToPb(this.pds.getData('buyerPPid')).subscribe((pb_response:any) => {
        this.pds.addUserData('pbConfirmation', pb_response.confirmation_number);
        this.emailService.sendBuyerEmailToAgent().subscribe();
        this.emailService.sendBuyerEmailToBuyer().subscribe();
        !this.isseller
          ? this.nav.goto.buyerInfo.next()
          : this.proceedSeller = true;
        this.showBuyerPPLoader = false;
      });
    });
  }
  back = () => this.nav.goto.buyerInfo.back();

  // Next and back Button
  nextBtnConfig = {
    text: 'NEXT',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: "BACK"
  }

  stateInputValue:string = '';
  public stateChanged = (e:any) => {
    if (e.target.value.length > 0) {
      this.stateInputValue = e.target.value;
      this.displayStates = this.displayStates.filter( (state:any) => {
        return state.name.toLowerCase().includes( e.target.value.toLowerCase() ) || state.abbr.toLowerCase() == e.target.value.toLowerCase();
      });
    } else {
      this.displayStates = this.states;
      return;
    }
  }

  current_state:string = '';
  countyInputValue:string = '';
  public countyChanged = (e:any) => {
    if (e.target.value.length > 0) {
      this.countyInputValue = e.target.value;
      this.displayCounties = this.displayCounties.filter( (county:any) => {
        return county.county.toLowerCase().includes( e.target.value.toLowerCase() );
      });
    } else {
      this.displayCounties = this.currentCounties;
      return;
    }
  }

  buyersolutions:any = [];
  state_changed:boolean = false;
  stateChosenFromList:boolean = false;
  showLocationModal:boolean = false;

  showLocModal = () => this.showLocationModal = true;
  confirmLocation = () => {
    this.displayStates = this.states;
    this.buyerLocationsArray.push({
      state: this.current_state,
      counties: this.buyerCounties
    });
    this.haveLocations = true;
    this.locationConfirmed = true;
    this.haveState = false;
    this.haveCounty = false;
    this.buyerStates = [];
    this.buyerCounties = [];
  }

  closeBuyerModal = () => {
    this.pds.addUserData('buyerLocation', this.buyerLocationsArray);
    this.buyerLocationText = '';

    let index = 0;
    for (const loc of this.buyerLocationsArray) {
      this.buyerLocationText += index == 0
        ? loc.state + ' - '
        : '; ' + loc.state + ' - ';
      let cntyindex = 0;
      for (const cnty of loc.counties) {
        this.buyerLocationText += cntyindex == 0
          ? cnty.county
          : ', ' + cnty.county;
        cntyindex++;
      }
      index++;
    }
    this.pds.addUserData('buyerLocationText', this.buyerLocationText);
    this.showLocationModal = false;
    this.checkValidity();
  }

  buyerLocations:any = {};
  buyerLocationsArray:any = [];
  haveLocations:boolean = false;
  locationConfirmed:boolean = false;
  buyerStates:any = [];
  buyerCounties:any = [];

  addState = (state:any, abbr:string) => {
    if (!this.buyerStates.includes(state)) {
      this.buyerStates.push(state); // add to buyerStates []
      this.states_abbrs.push(abbr);
      this.buyerLocations[state] = []; // add to buyerLocations {}
      this.current_state = state; // set current_state
      this.getCounties(state); // set the counties
      this.haveState = true;
    }
  }

  removeState = (state:any) => {
    // remove from buyerStates []
    this.buyerStates = this.buyerStates.filter( (buyerState:any) => buyerState != state );
    this.states_abbrs = this.states_abbrs.filter( (state_abbr:any ) => state_abbr != state.abbr );
    // remove from buyerLocations {}
    delete this.buyerLocations[state];
    this.buyerCounties = []; // TODO
    this.haveState = false;
    this.haveCounty = false;
  }

  removeCounty = (county:any, state:any) => {
    // remove from buyerCounties []
    this.buyerCounties = this.buyerCounties.filter( (buyerCounty:any) => buyerCounty.state == state && buyerCounty.county != county );
    // remove from buyerLocations {}
    this.buyerLocations[state] = this.buyerCounties.filter( (buyerCounty:any) => buyerCounty.county != county );
    this.haveCounty = this.buyerCounties.length > 0 ? true : false;
  }

  removeLocationState = (state:any) => {
    // remove from buyerLocations {}
    delete this.buyerLocations[state];
    this.buyerLocationsArray = this.buyerLocationsArray.filter( (location:any) => location.state != state);
  }

  removeLocationCounty = (county:any, state:any) => {
    // remove from buyerLocations {}
    this.buyerLocations[state] = this.buyerLocations[state].filter( (buyerCounty:any) => buyerCounty != county );
    for (let location of this.buyerLocationsArray) {
      if (location.state == state) {
        location.counties = location.counties.filter( (loccounty:any) => loccounty.county != county);
      }
    }
  }

  addCounty = (county:any) => {
    if (!this.buyerLocations[this.current_state].includes(county.county)) {
      this.buyerLocationForm.patchValue({ LocationCounty: '' });
      // add to buyerCounties []
      this.buyerCounties.push({county: county.county, state: this.current_state});
      // add to buyerLocations {}
      this.buyerLocations[this.current_state].push(county.county);
      this.displayCounties = this.getCounties(this.current_state);
      this.haveCounty = true;
    }
  }

  states:any = this.buyerMarketService.getStates();
  displayStates:any = this.states;

  currentCounties:any = [];
  allCounties:any = this.buyerMarketService.getCounties();
  states_abbrs:any = [];

  buyerLocationText:string = '';
  getCounties = (state:string) => this.displayCounties = this.allCounties.filter( (county:any) => county.state.toLowerCase() == state.toLowerCase());
  addNew = () => this.locationConfirmed = false;
  confirmDone = () => {
    this.showLocationModal = false;
    this.pds.addUserData('buyerLocation', this.buyerLocationsArray);
    this.buyerLocationText = '';

    let index = 0;
    for (const loc of this.buyerLocationsArray) {
      this.buyerLocationText += index == 0
        ? loc.state + ' - '
        : '; ' + loc.state + ' - ';
      let cntyindex = 0;
      for (const cnty of loc.counties) {
        this.buyerLocationText += cntyindex == 0
          ? cnty.county
          : ', ' + cnty.county;
        cntyindex++;
      }
      index++;
    }
    this.pds.addUserData('buyerLocationText', this.buyerLocationText);
    this.configService.getVerifiedBuyersByState(this.states_abbrs).subscribe((data:any) => {
      // console.log('VBs by state', data);
      this.pds.changeVerifiedBuyers(data);
      this.pds.setMarketData('Verified Buyers', data);
      this.configService.getBuyerLinks(data).subscribe((links_data:any) => {
        this.pds.setMarketData('Verified Buyer Links', links_data);
        console.log('VBs and IDs', this.pds.getMarketData('Verified Buyer Links'));
        this.checkValidity();
      });
    });
  }

  locationInputText = () => this.pds.getUserData('buyerLocationText') || 'Select location';

  verified_buyers:any;
  displayCounties:any = this.currentCounties;

  haveState:boolean = false;
  haveCounty:boolean = false;

  showRibbonInfo:boolean = false;
  ribbonUrl:string = '';
  ribbon_waiting:boolean = false;
  add_account:boolean = false;
  platform_do_ribbon:boolean = this.pds.getData('do_ribbon');

  closeRibbon = () => {
    this.showRibbonInfo = false;
    this.ribbon_waiting = false;
    this.pds.changeSuccessMessage('buyerEmailToClient');
    this.next();
  }

  toggleShow = () => {
    this.doing_things = true;
    // Is Ribbon a VB?
    let do_ribbon:boolean = false;
    let buyers = this.pds.getMarketData('Verified Buyers');;
    // console.log(buyers);
    if (buyers) {
      // console.log(buyers);
      for (let state of buyers) {
        // console.log('state', state);
        for (let vb of state.buyers.cash_vbs) {
          // console.log('vb', vb);
          if (vb && vb === 'Ribbon') {
            do_ribbon = true;
          }
        }
      }
    }

    //
    //
    // TODO: REMOVE THIS TO TURN RIBBON INT BACK ON
    // do_ribbon = false;
    // TODO: REMOVE THIS TO TURN RIBBON INT BACK ON
    //
    //


    // Send the lead to Ribbon if Ribbon is a VB
    // and turned on in Platform Settings
    if (this.platform_do_ribbon && do_ribbon) {
      this.ribbon_waiting = true;
      this.add_account = false;
      // Try to update an account
      this.wpApiService.updateRibbonAccount().subscribe((update_response:any) => {
        let update_res = JSON.parse(update_response);
        if (update_res.status == 0) { // Account not found
          this.add_account = true;
          // Create a new Ribbon account with the agent's name/email
          // The response includes a Ribbon Invite URL if successful
          this.wpApiService.addRibbonAccount().subscribe((add_response:any) => {
            let add_res = JSON.parse(add_response);
            if (add_res['Ribbon Invite URL']) {
              // Show them the Ribbon Invite URL in a modal
              this.ribbonUrl = add_res['Ribbon Invite URL'];
              this.showRibbonInfo = true;
              console.log('found Ribbon Invite URL', add_res['Ribbon Invite URL']);
            } else {
              // Pass them along
              console.log('Ribbon Invite URL not found', add_res);
              this.closeRibbon();
              this.next();
            }
          });
        } else if (update_res.status == 1) { // Account found all good
          // We updated the agent's Ribbon account
          this.add_account = false;
          this.ribbonUrl = update_res['Ribbon Invite URL'];
          this.showRibbonInfo = true;
          console.log('Ribbon account updated', update_res);
          this.closeRibbon();
          this.next();
        } else { // Something else happened
          // pass them along
          this.add_account = false;
          console.log('Ribbon Invite URL not found', update_res);
          this.closeRibbon();
          this.next();
        }
      });
    } else { // ...or just pass them along
      console.log('Ribbon turned off OR not a VB');
      this.closeRibbon();
      this.next();
    }
  }
}
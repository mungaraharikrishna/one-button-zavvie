import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ConfigService } from '../../../services/config.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { WpApiService } from '../../../services/wp-api.service';
import { ScrollDownService } from '../../../services/scroll-down.service';



@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  allPPs:any
  platform_id:any
  searchText: any
  callEligibility:boolean = false
  CORconfigured:any;
  default_id:string = '';
  showConfirmLoader:boolean = false;
  EligibleBuyerArray:Array<any> = [];
  ineligibleBuyerArray:Array<any> = [];
  homeValue:any
  verifyBuyerdata:any = [];
  platformData:any = [];
  corValues:any;

  constructor(
    public fb: FormBuilder,
    private configService: ConfigService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    ) { }

  offerCollectorForm = this.fb.group({
    'homeAddress': ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.platformDataService.CORisConfigured.subscribe(CORisConfigured => this.CORconfigured = CORisConfigured);
    this.platformDataService.setCORData('offerCollectorForm', this.offerCollectorForm);
    this.checkValidity()
     // default ID is zavvie on staging/prod and 8z on local
     this.default_id = this.configService.getEnv() == 'local' ? '19' : '14746';
     this.searchText = this.offerCollectorForm.get('homeAddress')!.value;

    this.wpApiService.getPPs().subscribe((data:any) => {
      this.allPPs = data;
      // console.log("all pps ", this.allPPs)
    });

    this.offerCollectorForm.valueChanges.subscribe(val => {
      this.searchText = this.offerCollectorForm.get('homeAddress')!.value;
      this.platformDataService.changeCORConfiguredStatus(false);
    })

       //Get all Verified buyers on Page load for COR
    this.wpApiService.getvbs().subscribe((data:any) => {
      for (let vbdata of data) {
        this.verifyBuyerdata.push({vbid: String(vbdata.vbid),
          name: vbdata.verified_buyer,
          logo: vbdata.logo.url,
          eligible_text: vbdata.eligible,
          ineligible_text: vbdata.ineligible,
          offer_link: vbdata.eligible_link_url
        })
        this.platformDataService.setCORData('allvbs', this.verifyBuyerdata);
      }
      // console.log('COR allvbs', this.platformDataService.getCORData('allvbs'));
    });

    this.wpApiService.getPlatforms().subscribe((data:any) => {
      for(let platform of data){
        this.platformData.push({
          platform_id: platform.platform_id,
          platform_name: platform.platform,
          platform_logo: platform.platform_logo
        })
        this.platformDataService.setCORData('allplatforms', this.platformData);
      }
      // console.log('COR all platforms: ', this.platformDataService.getCORData('allplatforms'));
    })

    this.corValues = {
      aa: {
        open_mkt_price: '',
        service_fee: '',
        service_fee_percent: '',
        special_service_fee: '',
        seller_agent: '',
        seller_agent_percent: '',
        buyer_agent: '',
        buyer_agent_percent: '',
        prep_repairs: '',
        closing_costs: '',
        cos: '',
        net: ''
      },
      trash: {}
    }
    this.platformDataService.setCORData('corValues', this.corValues);
  }

  formatHomeValue = (val:any) => {
    return val == '' || !val
      ? 0 // val is false/null
      : (val.includes("$") || val.includes(",")) // if val includes a $ or , (formatted string)
        ? val.replace("$", "").replaceAll(",", "") // remove the $s and ,s
        : val; // its already a number
  }

  setAddress = (e:any) => {
    this.offerCollectorForm.get('homeAddress')!.setValue(e, { onlySelf: true });
    this.searchText = this.offerCollectorForm.get('homeAddress')!.value;
  }
 
  showClearBtn = () => this.offerCollectorForm.valid && !this.CORconfigured;

  clearAddressInput = () => {
    // this.platformDataService.changeCORConfiguredStatus(false);
    this.offerCollectorForm.get('homeAddress')!.setValue('', { onlySelf: true });
    this.searchText = this.offerCollectorForm.get('homeAddress')!.value;
    this.checkValidity()
  }

  confirmBtn = (ppIdvalue: any) => {
    this.showConfirmLoader = true;
    this.platform_id = this.platformDataService.getData('partner');
    this.platformDataService.changePPId(ppIdvalue);
    this.platformDataService.changeEligible([]);
    this.platformDataService.changeIneligible([]);
    this.EligibleBuyerArray = [];
    this.ineligibleBuyerArray = [];

    // Do Eligibility
    this.wpApiService.doEligibility().subscribe((elig_response:any) => {
      // console.log(elig_response);

      //Get PP Information by the ID
      this.wpApiService.getPPbyId(ppIdvalue, this.platform_id).subscribe((data:any) => {
        if (data.pp) {
          // console.log('data.pp', data.pp);
          let address = Array.isArray(data.pp.address) ? data.pp.address[0] : data.pp.address;
          this.platformDataService.setCORData('ppAddress', address);
          if (data.pp.approximate_home_value) {
            this.corValues.aa.open_mkt_price = data.pp.approximate_home_value[0] == '' ? 0 : parseInt(data.pp.approximate_home_value[0]);
            this.platformDataService.setCORData('corValues', this.corValues);
            this.homeValue = this.corValues.aa.open_mkt_price;
            this.platformDataService.setCORData('homeValue', this.homeValue);
          }
          if (data.pp.agent_first_name && data.pp.agent_last_name) {
            let agent_name = `${data.pp.agent_first_name[0]} ${data.pp.agent_last_name[0]}`;
            this.platformDataService.setCORData('AgentFullName', agent_name);
            this.platformDataService.setCORData('AgentFirstName', data.pp.agent_first_name[0]);
            this.platformDataService.setCORData('AgentEmail', data.pp.agent_email[0]);
          }
        }

        //Show Powered by Zavvie
        let showPoweredBy = data.show_powered_by_zavvie == null || data.show_powered_by_zavvie == true || data.show_powered_by_zavvie == '1';
        this.platformDataService.changeShowPoweredByZavvieStatus(showPoweredBy);
        this.platformDataService.setCORData('partner_logo', data.partner_logo);

        // Get eligible verify buyers
        this.wpApiService.getEligibleVB(ppIdvalue).subscribe((data:any) => {
          // console.log('Eligible DATA: ', data);
          this.platformDataService.setCORData('AllconfirmedVBs', data);
          let allBuyers = [];
          for (let item of data) {
            allBuyers.push(item);
            if (item.eligible) {
              this.EligibleBuyerArray.push(item);
              this.platformDataService.changeEligible(this.EligibleBuyerArray);
            } else {
              this.ineligibleBuyerArray.push(item)
              this.platformDataService.changeIneligible(this.ineligibleBuyerArray);
            }
          }
          this.platformDataService.changeAllVerifiedBuyers(allBuyers);
          this.showConfirmLoader = false;
          this.callEligibility = true;

          this.checkValidity();
          this.checkForVBsection();
          this.platformDataService.changeCORConfiguredStatus(true);
        });
      })
    });
  }

  //check if eligible verified buyer section is in the DOM then scroll
  checkForVBsection = () => {
    let findEli = setInterval(() => {
      let eligibleSection:any = document.querySelector('#open-market-sales')
      if (eligibleSection && this.CORconfigured) {
        eligibleSection.scrollIntoView({behavior:"smooth"})
        clearInterval(findEli);
      }
    })
  }

  confirmBtnConfig:any = {
    disabledBtn: false
  }
  
  public checkValidity():void {
    this.confirmBtnConfig.disabledBtn = this.CORconfigured  ? true : false;
    // console.log("CORconfigured ", this.CORconfigured )
  }
}

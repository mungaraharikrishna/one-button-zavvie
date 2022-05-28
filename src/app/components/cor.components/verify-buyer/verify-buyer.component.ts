import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Event, NavigationEnd } from '@angular/router';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ConfirmComponent } from '../../../components/cor.components/confirm/confirm.component';
import { NavService } from '../../../services/nav.service';
// import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  providers: [ConfirmComponent],
  selector: 'verify-buyer',
  templateUrl: './verify-buyer.component.html',
  styleUrls: ['./verify-buyer.component.scss']
})
export class VerifyBuyerComponent implements OnInit {
  callPreview:boolean = false
  addverifyBuyer:boolean = false
  ppIdvalue:any
  allEligible:any
  eligibleArray:Array<any> = []
  eligibleArraySelected:Array<any> = []
  CORconfigured:any
  addBtnDisabled:boolean = true;
  elig:any = [];
  inelig:any = [];
  CORdataInput:any
  estimateNet:any
  costOfselling:any
  NetDifference: any

  accordionOpen:boolean = false

  constructor(
    public fb: FormBuilder,
    public platformDataService: PlatformDataService,
    public router: Router,
    public nav: NavService,
    private confirmComponent: ConfirmComponent,
  ) { }

  verifyBuyerForm = this.fb.group({
    'VBname': ['', [Validators.required]]
  });

  offerStatusForm = this.fb.group({
    'offerStatus': ['', [Validators.required]]
  })

  verifyBuyers:any = this.platformDataService.getCORData('allvbs');
  corValues:any = this.platformDataService.getCORData('corValues');

  offers:any = [];

  ngOnInit(): void {
    this.platformDataService.CORisConfigured.subscribe(CORisConfigured => this.CORconfigured = CORisConfigured);
    this.platformDataService.currentPPId.subscribe(currentPPId => this.ppIdvalue = currentPPId);
    this.platformDataService.eligibleVerifiedBuyers.subscribe(eligibleVerifiedBuyers => this.elig = eligibleVerifiedBuyers);
    this.platformDataService.inEligibleVerifiedBuyers.subscribe(inEligibleVerifiedBuyers => this.inelig = inEligibleVerifiedBuyers);
    this.allEligible = this.elig;
    // console.log('verifyBuyers', this.verifyBuyers);
    this.offerStatusForm.setValue({offerStatus:'Still waiting'});

    for (let el of this.allEligible) {
      this.offers[el.vbid] = 'vb-accordion-' + el.vbid;
    }

    for (let elig of this.elig) {
      this.corValues[elig.vbid] = {
        name: elig.name,
        cash_funding: '',
        mort_balance: '',
        existing_mort: '',
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
        net: '',
        net_diff: ''
      }
    }
    this.platformDataService.setCORData('corValues', this.corValues);
    // console.log("all COR data", this.platformDataService.getAllCORData());
  }

  pdf_eligible:any = [];
  pdf_ineligible:any = [];
  checkAccordionValidity = (vb:string, e:any, index:number) => {
    this.callPreview = false;
    this.offers[vb] = this.offerStatusForm.get('offerStatus')!.value === "Received Offer"
      ? 'vb-accordion' + index : 'vb-accordion-' + vb;
    
    if (e.target.value == "Received Offer") {
      document.querySelector('heading' + index)?.classList.add('vb-accordion');
      this.pdf_eligible.push(this.allEligible[index]);
      this.platformDataService.changeEligible(this.pdf_eligible);
      let idx = 0;
      // if the offer is in the inelig array, remove it
      for (let inelig of this.pdf_ineligible) {
        if (inelig.vbid == vb) {
          this.pdf_ineligible.splice(idx, 1)
        }
        idx++;
      }
    } else {
      document.getElementById('heading' + index)?.classList.remove('vb-accordion');
      this.pdf_ineligible.push(this.allEligible[index]);
      this.platformDataService.changeIneligible(this.pdf_ineligible);
      let edx = 0;
      // if the offer is in the elig array, remove it
      for (let elig of this.pdf_eligible) {
        if (elig.vbid == vb) {
          this.pdf_eligible.splice(edx, 1);
        }
        edx++;
      }
    }
    this.platformDataService.getCORData('corValues')[vb].offer_status = e.target.value;
    this.previewBtnConfig.disabledBtn = this.pdf_eligible.length < 1;
  }

  addVerifyBuyer = () => {
    let obj = this.verifyBuyerForm.get('VBname')!.value;
    // console.log("obj ", obj);
    if (obj.name !== undefined) {
      this.elig.push(obj);
      this.corValues[obj.vbid] = {
        name: obj.name,
        cash_funding: '',
        mort_balance: '',
        existing_mort: '',
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
        net: '',
        net_diff: ''
      }
      this.platformDataService.setCORData('corValues', this.corValues);
      this.platformDataService.changeEligible(this.elig);
    }
    this.verifyBuyerForm.get('VBname')!.patchValue('', { onlySelf: true });
    this.addverifyBuyer = !this.addverifyBuyer;
    // console.log('this.elig', this.elig);
    // console.log('this.allEligible', this.allEligible);
  }

  formValueChanged = (vb:string, name:string, e:any) => {
    this.callPreview = false;
    this.platformDataService.getCORData('corValues')[vb][name] = e;
    // console.log(this.platformDataService.getCORData('corValues'));
    this.platformDataService.getCORData('corValues')[vb].cos = this.costOfSelling(vb);
  }

  costOfSelling = (vbid:any) => {
    let serviceFee = parseInt(this.platformDataService.getCORData('corValues')[vbid].service_fee) || 0;
    let prepRepair = parseInt(this.platformDataService.getCORData('corValues')[vbid].prep_repairs) || 0;
    let closingCost = parseInt(this.platformDataService.getCORData('corValues')[vbid].closing_costs) || 0;
    let sellerAgentCost = parseInt(this.platformDataService.getCORData('corValues')[vbid].seller_agent) || 0;
    let buyerAgentCost = parseInt(this.platformDataService.getCORData('corValues')[vbid].buyer_agent) || 0;
    this.costOfselling = serviceFee + prepRepair + closingCost + sellerAgentCost + buyerAgentCost || 0;
    return this.costOfselling;
  }

  estimatedNet = (vbid:any) => {
    let cashFunding = this.platformDataService.getCORData('corValues')[vbid].cash_funding;
    this.estimateNet = this.costOfselling !== undefined && cashFunding !== undefined
      ? Math.abs(this.costOfselling - cashFunding) : 0;
    this.platformDataService.getCORData('corValues')[vbid].net = this.estimateNet;
    return this.estimateNet;
  }
  
  netDifference = (vbid:any) => {
    let OMestimatedNet = this.platformDataService.getCORData('corValues').aa.net;
    let VBestimatedNet = this.platformDataService.getCORData('corValues')[vbid].net;
    
    this.NetDifference = OMestimatedNet !== undefined && VBestimatedNet !== undefined
      ? Math.abs(parseInt(OMestimatedNet) - parseInt(VBestimatedNet)) : 0;

    this.platformDataService.getCORData('corValues')[vbid].net_diff = this.NetDifference;
    return this.NetDifference;
  }

  netDiffText = (vbid:any) => {
    let OMestimatedNet = this.platformDataService.getCORData('corValues').aa.net;
    let VBestimatedNet = this.platformDataService.getCORData('corValues')[vbid].net;
    return parseInt(OMestimatedNet) > parseInt(VBestimatedNet) ? 'iBuyer Premium' : 'Net Proceeds';
  }

  viewPreview = () => {
    this.callPreview = true;
    this.checkForPreview();
  }

  checkForPreview = () => {
    let findPreview = setInterval(() => {
      let previewSection:any = document.querySelector('#preview-pdf-section')
      if(previewSection && this.CORconfigured){
        clearInterval(findPreview)
        previewSection.scrollIntoView({behavior:"smooth"})
      }
    })
  }

  startOver = (e:any) => {
    e.preventDefault();
    this.platformDataService.changeCORConfiguredStatus(false);
    this.platformDataService.setCORData('ppAddress', '');
    this.platformDataService.setCORData('corValues', '');
    this.platformDataService.setCORData('homeValue', '');
    let CORaddress_el = <HTMLInputElement>document.getElementById('enter-CORaddress');
    CORaddress_el.focus();
    this.platformDataService.getCORData('offerCollectorForm').reset()
    // this.confirmComponent.checkValidity();
    // console.log('re run check validity on start over',this.confirmComponent.checkValidity())
  }

  previewBtnConfig = {
    cortext: "View Report",
    disabledBtn: true
  }

  startOverBtnConfig = {
    cortext: "Start Over"
  }
  addBtnConfig = {
    cortext: "Add"
  }
}

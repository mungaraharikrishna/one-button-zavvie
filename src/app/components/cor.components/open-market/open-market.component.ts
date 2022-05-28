import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';

@Component({
  selector: 'open-market',
  templateUrl: './open-market.component.html',
  styleUrls: ['./open-market.component.scss']
})
export class OpenMarketComponent implements OnInit {
  ppAddress:string = '';
  isHidden = false
  sellingcost:any = '';
  CORdataInput:any
  costOfselling:any
  estimateNet:any
  CORconfigured:any;

  constructor(
    public fb: FormBuilder,
    public platformDataService: PlatformDataService) { }

    corValues:any = '';
    homeValue:any = '';

    openMarketForm = this.fb.group({
      'approxHomeValue': [this.homeValue, [Validators.required]],
    });

  ngOnInit(): void {
    this.corValues = this.platformDataService.getCORData('corValues');
    this.homeValue = this.platformDataService.getCORData('homeValue');
    this.ppAddress = this.platformDataService.getCORData('ppAddress');
    this.openMarketForm.patchValue({approxHomeValue: this.homeValue});
    // console.log('this.ppAddress ', this.ppAddress);
    // console.log(this.corValues.aa.open_mkt_price)
    this.platformDataService.CORisConfigured.subscribe(CORisConfigured => this.CORconfigured = CORisConfigured);
  }

  formValueChanged = (name:string, e:any) => {
    this.platformDataService.getCORData('corValues').aa[name] = e;
    // console.log(this.platformDataService.getCORData('corValues'));
    this.platformDataService.getCORData('corValues').aa.cos = this.costOfSelling();
  }

  costOfSelling = () => {
    let serviceFee = this.corValues.aa && this.corValues.aa.service_fee ? parseInt(this.corValues.aa.service_fee) : 0;
    let prepRepair = this.corValues.aa && this.corValues.aa.prep_repairs ? parseInt(this.corValues.aa.prep_repairs) : 0;
    let closingCost = this.corValues.aa && this.corValues.aa.closing_cost ? parseInt(this.corValues.aa.closing_costs) : 0;
    let sellerAgentCost = this.corValues.aa && this.corValues.aa.seller_agent ? parseInt(this.corValues.aa.seller_agent) : 0;
    let buyerAgentCost = this.corValues.aa && this.corValues.aa.buyer_agent ? parseInt(this.corValues.aa.buyer_agent) : 0;
    this.costOfselling = serviceFee + prepRepair + closingCost + sellerAgentCost + buyerAgentCost || 0;
    if (this.corValues.aa) {
      this.corValues.aa.cos = this.costOfselling;
    }
    return this.costOfselling;
  }

  estimatedNet = () => {
    let OMapproxHomeValue = this.corValues.aa && this.corValues.aa.open_mkt_price ? parseInt(this.corValues.aa.open_mkt_price) : 0;
    this.estimateNet = this.costOfselling !== undefined && OMapproxHomeValue !== undefined
      ? Math.abs(parseInt(this.costOfselling) - OMapproxHomeValue) : 0;
    if (this.corValues.aa) {
      this.corValues.aa.net = parseInt(this.estimateNet);
    }
    return this.estimateNet;
  }
}

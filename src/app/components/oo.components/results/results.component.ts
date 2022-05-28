import { Component, OnInit, Input } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})

export class ResultsComponent implements OnInit {
  constructor(private platformDataService: PlatformDataService) { }

  @Input() configured: boolean = false;

  isBuyer:boolean = false;
  isSeller:boolean = false;

  market:any = this.platformDataService.getHomeValueData('market');
  aa:any = this.platformDataService.getHomeValueData('aa');
  values:any = this.platformDataService.getHomeValueData('values');
  homeValue:string = this.platformDataService.getHomeValueData('homeValue');
  homeCondition:any = this.platformDataService.getHomeValueData('homeCondition');
  cta:any = this.platformDataService.getData('cta');

  showSellerResults:boolean = false;
  showBuyerResults:boolean = false;

  buyersolutions:any = this.platformDataService.getMarketData('buyersolutions');

  public toggleResults = () => {
    this.showSellerResults = !this.showSellerResults;
    this.showBuyerResults = !this.showBuyerResults;
  }

  tooHigh = () => this.homeValue && this.homeValue.length > 7;
  haveIos = () => this.market && this.market.con_offers.length > 0;
  asIsSituation = () => this.homeCondition && this.homeCondition.id == 3 ? true : false;

  removeStd = () => {
    let newArray = [];
    for (let market of this.market.con_offers) {
      (market.con_io_type != 'standard') && newArray.push(market);
    }
    return newArray;
  }
  removeAsis = () => {
    let newArray = [];
    for (let market of this.market.con_offers) {
      (market.id != 88) && newArray.push(market);
    }
    return newArray;
  }

  ngOnInit(): void {
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);

    this.showSellerResults = this.isSeller;
    this.showBuyerResults = !this.isSeller && this.isBuyer;

    this.buyersolutions = this.platformDataService.getMarketData('buyersolutions');
  }

  showValues = () => {
    console.log('Results: market', this.market);
    console.log('Results: values', this.values);
    console.log('Results: homeVal', this.homeValue);
    console.log('Results: homeCondition', this.homeCondition);
    console.log('Results: buyersolutions', this.buyersolutions);
  }

}

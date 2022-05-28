import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';

@Component({
  selector: 'offer-optimizer',
  templateUrl: './offer-optimizer.component.html',
  styleUrls: ['./offer-optimizer.component.scss']
})
export class OfferOptimizerComponent implements OnInit {

  @Input() showoo:any;
  @Input() showPoweredByZavvie:boolean = false;
  @Input() showBuyerOBZ:any;
  @Input() aaTerm:string = '';
  @Input() aaHeading:string = '';
  @Input() ioHeading:string = '';
  @Input() ioTerm:string = '';
  @Input() asIsTerm:string = '';
  @Input() bridgeHeading:string = '';
  @Input() bridgeTerm:string = '';
  @Input() openMarketBuyerHeading:string = '';
  @Input() cashHeading:string = '';
  @Input() leaseToOwnHeading:string = '';
  @Input() res_wait:any;
  @Input() hideBridge:any;
  @Input() ppaddress:string = '';
  @Output() ooconfigured = new EventEmitter<boolean>();

  constructor(private platformDataService: PlatformDataService) {}

  configured:boolean = false;
  formLoaded:boolean = false;
  isDisabled:boolean = true;
  disabled:string = 'disabled';
  response_waiting:boolean = false;
  express:boolean = false;

  setConfigured = (status:boolean) => {
    this.configured = status;
    this.ooconfigured.emit(this.configured);
  }

  ngOnInit(): void {
    this.platformDataService.currentAddressStatus.subscribe(newstatus => this.configured = newstatus);
    this.platformDataService.activateExpressRouteStatus.subscribe(newstatus => this.express = newstatus);
  }

}

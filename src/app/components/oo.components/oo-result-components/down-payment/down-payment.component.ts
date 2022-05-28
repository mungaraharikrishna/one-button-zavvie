import { Component, OnInit, Input,
  OnChanges, SimpleChanges,
  EventEmitter, Output } from '@angular/core';
//
// PercDollarInputsComponent: ONLY AA Seller Solution-
// Service Fee
// Seller Commission
// Buyer Commission
//
@Component({
  selector: 'down-payment',
  templateUrl: './down-payment.component.html',
  styleUrls: ['./down-payment.component.scss']
})
export class DownPaymentComponent implements OnInit, OnChanges {
  constructor() { }

  @Input() perc_1:any;
  @Input() perc_2:any;
  @Input() priceval_1:any;
  @Input() priceval_2:any;

  @Output() updateDollar1Value = new EventEmitter<string>();
  @Output() updatePercent1Value = new EventEmitter<string>();
  @Output() updateDollar2Value = new EventEmitter<string>();
  @Output() updatePercent2Value = new EventEmitter<string>();

  dollar_1:any;
  dollar_2:any;
  
  invalidVal = (val:any) => isNaN(val) || val == undefined || val == '' || val == '.';

  changeDollar1Amt = () => {
    let val = ((parseInt(this.priceval_1) * parseFloat(this.perc_1)) / 100).toFixed(0);
    this.dollar_1 = this.invalidVal(this.perc_1) ? 0 : parseInt(val);
    this.updateDollar1Value.emit(this.dollar_1);
    this.updatePercent1Value.emit(this.perc_1);
  }

  changeDollar2Amt = () => {
    let val = ((parseInt(this.priceval_2) * parseFloat(this.perc_2)) / 100).toFixed(0);
    this.dollar_2 = this.invalidVal(this.perc_2) ? 0 : parseInt(val);
    this.updateDollar2Value.emit(this.dollar_2);
    this.updatePercent2Value.emit(this.perc_2);
  }

  changePerc1Amt = () => {
    this.perc_1 = this.invalidVal(this.dollar_1)
      ? 0 : (parseInt(this.dollar_1)/parseInt(this.priceval_1)*100).toFixed(2);
    
    this.updatePercent1Value.emit(this.perc_1);
  }

  changePerc2Amt = () => {
    this.perc_2 = this.invalidVal(this.dollar_2)
      ? 0 : (parseInt(this.dollar_2)/parseInt(this.priceval_2)*100).toFixed(2);
    
    this.updatePercent2Value.emit(this.perc_2);
  }

  ngOnInit(): void {
    this.dollar_1 = this.invalidVal(this.perc_1)
      ? 0 : ((parseInt(this.priceval_1) * parseFloat(this.perc_1)) / 100).toFixed(0);
    this.updateDollar1Value.emit(this.dollar_1);
    this.updatePercent1Value.emit(this.perc_1);

    this.dollar_2 = this.invalidVal(this.perc_2)
      ? 0 : ((parseInt(this.priceval_2) * parseFloat(this.perc_2)) / 100).toFixed(0);
    this.updateDollar2Value.emit(this.dollar_2);
    this.updatePercent2Value.emit(this.perc_2);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.priceval_1) {
      this.changeDollar1Amt();
    }
    if (changes.priceval_2) {
      this.changeDollar2Amt();
    }
  }
}

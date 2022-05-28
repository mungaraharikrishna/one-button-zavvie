//
// [Percent-Dollar-Inputs][Component
//
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
  selector: 'perc-dollar-inputs',
  templateUrl: './perc-dollar-inputs.component.html',
  styleUrls: ['./perc-dollar-inputs.component.scss']
})
export class PercDollarInputsComponent implements OnInit, OnChanges {
  constructor() { }

  @Input() perc:any;
  @Input() name:any;
  @Input() spec:any;
  @Input() priceval:any;
  @Input() concierge:boolean = false;
  @Input() conciergefee:any;
  @Input() cos:any;

  @Output() updateDollarValue = new EventEmitter<string>();
  @Output() updatePercentValue = new EventEmitter<string>();

  dollar:any;
  conciergeservicefee:any;
  conciergechanged:boolean = false;

  conciergeTrue = () => {
    this.concierge = true;
    this.conciergechanged = true;
    if (this.conciergefee) {
      this.perc = (parseFloat(this.perc) + parseFloat(this.spec)).toFixed(2);
      this.updatePercentValue.emit(this.perc);
      this.changeDollarAmt();
    }
  }

  conciergeFalse = () => {
    this.concierge = false;
    if (this.conciergefee) {
      this.perc = !this.conciergechanged
        ? parseFloat(this.perc)
        : parseFloat(this.perc) - parseFloat(this.spec) <= 0
          ? 0.0
          : parseFloat(this.perc) - parseFloat(this.spec);
      this.perc = (this.perc).toFixed(2);
      this.updatePercentValue.emit(this.perc);
      this.changeDollarAmt();
    }
  }
  
  invalidVal = (val:any) => isNaN(val) || val == undefined || val == '' || val == '.';

  changeDollarAmt = () => {
    let val = ((parseInt(this.priceval) * parseFloat(this.perc)) / 100).toFixed(0);
    this.dollar = this.invalidVal(this.perc) ? 0 : parseInt(val);
    this.updateDollarValue.emit(this.dollar);
    this.updatePercentValue.emit(this.perc);
  }

  changePercAmt = () => {
    this.perc = this.invalidVal(this.dollar)
      ? 0 : (parseInt(this.dollar)/parseInt(this.priceval)*100).toFixed(2);
    
    this.updateDollarValue.emit(this.dollar);
    this.updatePercentValue.emit(this.perc);
  }

  changeConcierge = () => {
    this.concierge = !this.concierge;
    this.concierge ? this.conciergeTrue() : this.conciergeFalse()
  }

  ngOnInit(): void {
    this.dollar = this.invalidVal(this.perc)
      ? 0 : ((parseInt(this.priceval) * parseFloat(this.perc)) / 100).toFixed(0);
    this.updateDollarValue.emit(this.dollar);
    this.updatePercentValue.emit(this.perc);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.priceval) {
      this.changeDollarAmt();
    }

    if (changes.concierge) {
      changes.concierge.currentValue == true
        ? this.conciergeTrue()
        : this.conciergeFalse()
    }
  }

}
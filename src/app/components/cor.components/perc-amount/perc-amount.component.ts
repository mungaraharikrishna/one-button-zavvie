import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'perc-amount',
  templateUrl: './perc-amount.component.html',
  styleUrls: ['./perc-amount.component.scss']
})
export class PercAmountComponent {

  @Input() dollar_amount:any;
  @Input() perc_value:any;
  @Output() getValue = new EventEmitter<any>();
  @Output() getPercentValue = new EventEmitter<any>();
  formattedAmount: any;
  formattedPerc: any;

  constructor() { }

  changeDollarValue = (e: any) => {
    this.formattedAmount = parseInt(e.target.value.replace("$", "").replaceAll(",", ""));
    this.getValue.emit(this.formattedAmount);
  }

  changePercValue = (e: any) => {
    this.formattedPerc = e.target.value;
    this.getPercentValue.emit(this.formattedPerc);
  }
}

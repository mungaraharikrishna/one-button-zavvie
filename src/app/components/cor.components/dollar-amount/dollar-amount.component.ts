import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dollar-amount',
  templateUrl: './dollar-amount.component.html',
  styleUrls: ['./dollar-amount.component.scss']
})
export class DollarAmountComponent implements OnInit {
  @Input() dollar_amount:any;
  @Input() controlname: any;
  @Output() getValue = new EventEmitter<any>()
  formattedAmount : any

  constructor() { }
  changeDollarValue = (e: any) => {
    this.formattedAmount=parseInt(e.target.value.replace("$", "").replaceAll(",", ""))
    this.getValue.emit(this.formattedAmount);
  }

  ngOnInit(): void {
  }

}

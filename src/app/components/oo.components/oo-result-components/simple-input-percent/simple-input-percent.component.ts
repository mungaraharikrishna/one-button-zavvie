//
// [Simple-Input-Percent][Component
//
import { Component, OnInit, OnChanges, SimpleChanges,
  Input, Output, EventEmitter } from '@angular/core';
//
// SimpleInputPercentComponent is used ONLY by the AA Seller Solution:
// Closing Costs
//
// Needs to include the PrepAndRepairs value if user turns ON Concierge !!
//
@Component({
  selector: 'simple-input-percent',
  templateUrl: './simple-input-percent.component.html',
  styleUrls: ['./simple-input-percent.component.scss']
})
export class SimpleInputPercentComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() perc:any;
  @Input() dollar:any;
  @Input() prdollar:any;
  @Input() priceval:any;
  @Input() concierge:boolean = false;

  @Output() updateDollarValue = new EventEmitter<string>();

  conciergeTrue = () => {
    this.concierge = true;
    this.updateInputVal();
  }

  conciergeFalse = () => {
    this.concierge = false;
    this.updateInputVal();
  }

  validVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';
  emitDollarVal = () => this.updateDollarValue.emit(this.dollar);

  updateInputVal = () => {
    this.perc = this.perc + "";
    if (this.perc.indexOf('.') !== -1) {
      this.dollar = this.validVal(this.perc)
        ? 0 : this.concierge
          ? ((parseInt(this.priceval) * parseFloat(this.perc) / 100) + parseInt(this.prdollar)).toFixed(0)
          : ((parseInt(this.priceval) * parseFloat(this.perc) / 100)).toFixed(0);
    } else {
      this.dollar = this.validVal(this.perc)
        ? 0 : this.concierge
          ? parseInt(this.perc) + parseInt(this.prdollar)
          : this.perc;
    }
    this.emitDollarVal();
  }

  updateHiddenVal = () => {
    this.perc = this.dollar + "";
    this.updateInputVal();
  }

  ngOnInit(): void {
    this.dollar = this.validVal(this.perc)
      ? 0 : ((parseInt(this.priceval) * this.perc / 100)).toFixed(0);

    this.emitDollarVal();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.priceval) {
      this.priceval = changes.priceval.currentValue;
      this.updateInputVal();
    }
    
    if (changes.prdollar) {
      changes.concierge && changes.concierge.currentValue == true
        ? (this.prdollar = changes.prdollar.previousValue, this.conciergeTrue())
        : (this.prdollar = 0, this.conciergeFalse());
    }
  }
}

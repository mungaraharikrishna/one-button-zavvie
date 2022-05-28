//
// [Monthly-Ranged-Simple-Input-Percent][Component
//
import { Component, OnInit, Input, OnChanges, SimpleChanges,
  EventEmitter, Output } from '@angular/core';
//
// MonthlyRangedSimpleInputPercentComponent is used by all Buyer Solutions:
// Monthly Costs
//
// Nothing complicated, just calculate based on Selling Price / 12
//
@Component({
  selector: 'monthly-ranged-simple-input-percent',
  templateUrl: './monthly-ranged-simple-input-percent.component.html',
  styleUrls: ['./monthly-ranged-simple-input-percent.component.scss']
})
export class MonthlyRangedSimpleInputPercentComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() lowperc:any;
  @Input() highperc:any;
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() name:any;
  @Input() pricevalhigh:any;
  @Input() pricevallow:any;

  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();

  validVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';

  updateLowInputVal = () => {
    let varVal = this.lowperc + "";
    if (varVal.indexOf('.') !== -1) { // has a decimal
      this.lowdollar = this.validVal(this.lowperc)
      ? 0 : (parseInt(this.pricevallow) * (parseFloat(this.lowperc)/100 / 12)).toFixed(0);
    } else { // whole number
      this.lowdollar = this.validVal(this.lowperc) ? 0 : parseFloat(this.lowperc);
    }
    this.updateLowDollarValue.emit(this.lowdollar);
  }
  updateHighInputVal = () => {
    let varVal = this.highperc + "";
    if (varVal.indexOf('.') !== -1) { // has a decimal
      this.highdollar = this.validVal(this.highperc)
      ? 0 : (parseInt(this.pricevalhigh) * (parseFloat(this.highperc)/100 / 12)).toFixed(0);
    } else { // whole number
      this.highdollar = this.validVal(this.highperc) ? 0 : parseFloat(this.highperc);
    }
    this.updateHighDollarValue.emit(this.highdollar);
  }

  updateLowHiddenVal = () => {
    this.lowperc = this.lowdollar;
    this.updateLowDollarValue.emit(this.lowdollar);
  }
  updateHighHiddenVal = () => {
    this.highperc = this.highdollar;
    this.updateHighDollarValue.emit(this.highdollar);
  }

  ngOnInit(): void {
    this.updateLowInputVal();
    this.updateHighInputVal();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes.pricevallow) {
      this.pricevallow = changes.pricevallow.currentValue;
      this.updateLowInputVal();
    } 
    if (changes.pricevalhigh) {
      this.pricevalhigh = changes.pricevalhigh.currentValue;
      this.updateHighInputVal();
    }
  }

}

//
// [Randed-Simple-Input-Percent][Component
//
import { Component, OnInit, Input, OnChanges, SimpleChanges,
  EventEmitter, Output } from '@angular/core';
//
// RangedSimpleInputPercentComponent is used by all Non-AA Seller Solutions:
// Closing Costs
//
// Nothing complicated, just calculate based on Selling Price
//
@Component({
  selector: 'ranged-simple-input-percent',
  templateUrl: './ranged-simple-input-percent.component.html',
  styleUrls: ['./ranged-simple-input-percent.component.scss']
})
export class RangedSimpleInputPercentComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() disabledollar:boolean = false;
  @Input() lowperc:any;
  @Input() highperc:any;
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() name:any;
  @Input() pricevalhigh:any;
  @Input() pricevallow:any;

  @Input() warranty:boolean = false;

  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();

  disableInput:boolean = this.disabledollar;

  validVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';

  updateLowInputVal = () => {
    let varVal = this.lowperc + "";
    if (varVal.indexOf('.') !== -1 && this.lowperc < 10) {
      this.lowdollar = this.validVal(parseFloat(this.lowperc))
      ? 0 : (parseInt(this.pricevallow) * (parseFloat(this.lowperc) / 100)).toFixed(0);
    } else {
      this.lowdollar = this.validVal(this.lowperc) ? 0 : parseInt(this.lowperc);
    }
    this.updateLowDollarValue.emit(this.lowdollar);
  }
  updateHighInputVal = () => {
    let varVal = this.highperc + "";
    if (this.warranty) {
      this.highdollar = this.lowdollar;
    } else {
      if (varVal.indexOf('.') !== -1 && this.highperc < 10) {
        this.highdollar = this.validVal(this.highperc)
          ? 0 : (parseInt(this.pricevalhigh) * (parseFloat(this.highperc) / 100)).toFixed(0);
      } else {
        this.highdollar = this.validVal(this.highperc) ? 0 : parseInt(this.highperc);
      }
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
    if (changes.warranty) {
      this.updateLowInputVal();
      this.updateHighInputVal();
    }
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

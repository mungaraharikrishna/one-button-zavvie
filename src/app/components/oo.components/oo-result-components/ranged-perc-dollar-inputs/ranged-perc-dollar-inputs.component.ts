//
// [Ranged-Percent-Dollar-Inputs][Component
//
import { Component, OnInit,
  EventEmitter,
  Input, Output,
  OnChanges, SimpleChanges } from '@angular/core';
//
// RangedPercDollarInputsComponent is used by ALL Seller Solutions EXCEPT AA:
// Seller Fee
// Buyer Fee
//
@Component({
  selector: 'ranged-perc-dollar-inputs',
  templateUrl: './ranged-perc-dollar-inputs.component.html',
  styleUrls: ['./ranged-perc-dollar-inputs.component.scss']
})
export class RangedPercDollarInputsComponent implements OnInit, OnChanges {
  constructor() { }

  @Input() perc:any;
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() name:any;
  @Input() pricevalhigh:any;
  @Input() pricevallow:any;

  @Output() updatePercentValue = new EventEmitter<string>();
  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();
  
  invalidVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';

  changeDollarAmt = () => {
    this.lowdollar = this.invalidVal(this.perc)
      ? 0 : ((parseInt(this.pricevallow) * parseFloat(this.perc)) / 100).toFixed(0);
    this.highdollar = this.invalidVal(this.perc)
      ? 0 : ((parseInt(this.pricevalhigh) * parseFloat(this.perc)) / 100).toFixed(0);

    this.updatePercentValue.emit(this.perc);
    this.updateLowDollarValue.emit(this.lowdollar);
    this.updateHighDollarValue.emit(this.highdollar);
  }

  ngOnInit(): void {
    this.highdollar = this.invalidVal(this.perc)
      ? 0 : (parseInt(this.pricevalhigh) * this.perc / 100).toFixed(0);
    this.lowdollar = this.invalidVal(this.perc)
      ? 0 : (parseInt(this.pricevallow) * this.perc / 100).toFixed(0);

    this.updateLowDollarValue.emit(this.lowdollar);
    this.updateHighDollarValue.emit(this.highdollar);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pricevallow) {
      this.pricevallow = changes.pricevallow.currentValue;
      this.lowdollar = ((parseInt(this.pricevallow) * parseFloat(this.perc)) / 100).toFixed(0);
      this.updateLowDollarValue.emit(this.lowdollar);
    } 
    if (changes.pricevalhigh) {
      this.pricevalhigh = changes.pricevalhigh.currentValue;
      this.updateHighDollarValue.emit(this.highdollar);
      this.highdollar = ((parseInt(this.pricevalhigh) * parseFloat(this.perc)) / 100).toFixed(0);
    }
  }
}
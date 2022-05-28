//
// [Ranged-Double-Percent-Dollar-Inputs][Component
//
import { Component, OnInit, Input,
  OnChanges, SimpleChanges,
  Output, EventEmitter } from '@angular/core';
//
// RangedDoublePercentDollarInputsComponent is used by BRIDGE Seller Solutions:
// Service Fee for Standard and Alt Bridge-types
//
// if usehpv == true | Bridge Alt | Calculate using Home Purchase Value
// if usehpv == false | Bridge Standard | Calculate using Selling Price
//
@Component({
  selector: 'ranged-double-percent-dollar-inputs',
  templateUrl: './ranged-double-percent-dollar-inputs.component.html',
  styleUrls: ['./ranged-double-percent-dollar-inputs.component.scss']
})
export class RangedDoublePercentDollarInputsComponent implements OnInit, OnChanges {

  constructor() {}

  @Input() lowperc:any;
  @Input() highperc:any;
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() pricevalhigh:any;
  @Input() pricevallow:any;
  @Input() lowhpc:any;
  @Input() highhpc:any;
  @Input() usehpv:any;

  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();
  @Output() updateLowPercentValue = new EventEmitter<string>();
  @Output() updateHighPercentValue = new EventEmitter<string>();

  invalidVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';

  changeLowDollarAmt = () => {
    this.pricevallow = this.usehpv ? this.lowhpc : this.pricevallow;
    this.lowdollar = this.invalidVal(this.lowperc)
      ? 0 : ((parseInt(this.pricevallow) * parseFloat(this.lowperc)) / 100).toFixed(0);
    
    this.updateLowDollarValue.emit(this.lowdollar);
    this.updateLowPercentValue.emit(this.lowperc);
  }

  changeHighDollarAmt = () => {
    this.pricevalhigh = this.usehpv ? this.highhpc : this.pricevalhigh;
    this.highdollar = this.invalidVal(this.highperc)
      ? 0 : ((parseInt(this.pricevalhigh) * parseFloat(this.highperc)) / 100).toFixed(0);

    this.updateHighDollarValue.emit(this.highdollar);
    this.updateHighPercentValue.emit(this.highperc);
  }

  changeLowPercAmt = () => {
    this.pricevallow = this.usehpv ? this.lowhpc : this.pricevallow;
    this.lowdollar = this.lowdollar;
    this.lowperc = this.invalidVal(this.lowdollar)
      ? 0.0 : (parseInt(this.lowdollar)/parseInt(this.pricevallow)*100).toFixed(2);
      
    this.updateLowDollarValue.emit(this.lowdollar);
    this.updateLowPercentValue.emit(this.lowperc);
  }

  changeHighPercAmt = () => {
    this.pricevalhigh = this.usehpv ? this.highhpc : this.pricevalhigh;
    this.highdollar = this.highdollar;
    this.highperc = this.invalidVal(this.highdollar)
      ? 0.0 : (parseInt(this.highdollar)/parseInt(this.pricevalhigh)*100).toFixed(2);
    
    this.updateHighDollarValue.emit(this.highdollar);
    this.updateHighPercentValue.emit(this.highperc);
  }

  ngOnInit(): void {
    this.changeLowPercAmt();
    this.changeLowDollarAmt();
    this.changeHighPercAmt();
    this.changeHighDollarAmt();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pricevallow) {
      this.pricevallow = changes.pricevallow.currentValue;
      this.changeLowDollarAmt();
    }
    if (changes.pricevalhigh) {
      this.pricevalhigh = changes.pricevalhigh.currentValue;
      this.changeHighDollarAmt();
    }
    if (changes.lowhpc) {
      this.lowhpc = changes.lowhpc.currentValue;
      this.changeLowDollarAmt();
    } 
    if (changes.highhpc) {
      this.highhpc = changes.highhpc.currentValue;
      this.changeHighDollarAmt();
    }
  }

}

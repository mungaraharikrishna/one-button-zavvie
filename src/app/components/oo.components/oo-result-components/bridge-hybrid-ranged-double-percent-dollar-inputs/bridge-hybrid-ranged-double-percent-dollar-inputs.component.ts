//
// [Bridge-Hybrid-Double-Percent-Dollar-Inputs][Component
//
import { Component, OnInit, Input,
  OnChanges, SimpleChanges,
  EventEmitter, Output } from '@angular/core';
//
// BridgeHybridRangedDoublePercentDollarInputsComponent: ONLY BRIDGE Seller Solution-
// Service Fee = for Hybrid Bridge-type
//
// Calculates using Selling Price AND Bridge Home Being Purchased price |
// Displays the lower of the two as the Low Dollar and the higher of
// the two as the High Dollar
//
@Component({
  selector: 'bridge-hybrid-ranged-double-percent-dollar-inputs',
  templateUrl: './bridge-hybrid-ranged-double-percent-dollar-inputs.component.html',
  styleUrls: ['./bridge-hybrid-ranged-double-percent-dollar-inputs.component.scss']
})
export class BridgeHybridRangedDoublePercentDollarInputsComponent implements OnInit, OnChanges {

  constructor() { }

  @Input() lowperc:any;
  @Input() highperc:any;
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() bridgecontractval:any;
  @Input() lowhpc:any;
  @Input() highhpc:any;

  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();
  @Output() updateLowPercentValue = new EventEmitter<string>();
  @Output() updateHighPercentValue = new EventEmitter<string>();

  invalidVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';

  findLowest = () => {
    let exp1 = (parseInt(this.bridgecontractval)*parseFloat(this.lowperc)) / 100;
    let exp2 = (parseInt(this.lowhpc)*parseFloat(this.lowperc)) / 100;
    return exp1 <= exp2 ? (exp1).toFixed(0) : (exp2).toFixed(0);
  }

  findHighest = () => {
    let exp1 = (parseInt(this.bridgecontractval)*parseFloat(this.highperc)) / 100;
    let exp2 = (parseInt(this.highhpc) * parseFloat(this.highperc)) / 100;
    return exp1 >= exp2 ? (exp1).toFixed(0) : (exp2).toFixed(0);
  }

  changeLowDollarAmt = () => {
    this.lowdollar = this.invalidVal(this.lowperc)
      ? 0 : this.findLowest();
    
    this.updateLowDollarValue.emit(this.lowdollar);
    this.updateLowPercentValue.emit(this.lowperc);
  }

  changeHighDollarAmt = () => {
    this.highdollar = this.invalidVal(this.highperc)
      ? 0 : this.findHighest();

    this.updateHighDollarValue.emit(this.highdollar);
    this.updateHighPercentValue.emit(this.highperc);
  }

  findLowestPercent = () => {
    this.lowdollar = this.lowdollar;
    let exp1 = parseInt(this.lowdollar)/parseInt(this.bridgecontractval)*100;
    let exp2 = parseInt(this.lowdollar)/parseInt(this.lowhpc)*100;
    return exp1 <= exp2 ? exp1 : exp2;
  }

  findHighestPercent = () => {
    this.highdollar = this.highdollar;
    let exp1 = parseInt(this.highdollar)/parseInt(this.bridgecontractval)*100;
    let exp2 = parseInt(this.highdollar)/parseInt(this.highhpc)*100;
    return exp1 >= exp2 ? exp1 : exp2;
  }

  changeLowPercAmt = () => this.lowperc = (this.findLowestPercent()).toFixed(2);
  changeHighPercAmt = () => this.highperc = (this.findHighestPercent()).toFixed(2);

  ngOnInit(): void {
    this.findLowestPercent();
    this.changeLowDollarAmt();
    this.findHighestPercent();
    this.changeHighDollarAmt();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.lowhpc) {
      this.lowhpc = changes.lowhpc.currentValue;
      this.changeLowDollarAmt();
    } 
    if (changes.highhpc) {
      this.highhpc = changes.highhpc.currentValue;
      this.changeHighDollarAmt();
    }
    if (changes.pricevallow) {
      this.bridgecontractval = changes.pricevallow.currentValue;
      this.changeLowDollarAmt();
    } 
    if (changes.pricevalhigh) {
      this.bridgecontractval = changes.pricevalhigh.currentValue;
      this.changeHighDollarAmt();
    }
  }

}

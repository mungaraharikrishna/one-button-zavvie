//
// [Ranged-Alt-Input-Percent][Component
//
import { Component, OnInit, Input,
  Output, EventEmitter,
  OnChanges, SimpleChanges } from '@angular/core';
//
// RangedAltInputPercentComponent is used by ALL Seller Solutions EXCEPT AA:
// Prep & Repairs
//
@Component({
  selector: 'ranged-alt-input-percent',
  templateUrl: './ranged-alt-input-percent.component.html',
  styleUrls: ['./ranged-alt-input-percent.component.scss']
})
export class RangedAltInputPercentComponent implements OnInit, OnChanges {
            
  @Input() lowdollar:any;
  @Input() highdollar:any;
  @Input() lowperc:any;
  @Input() highperc:any;
  @Input() prmodifier:any;
  @Input() lowaltmod:any;
  @Input() highaltmod:any;
  @Input() asisbridge:any;
  @Input() pricevallow:any;
  @Input() pricevalhigh:any;

  @Output() updateLowDollarValue = new EventEmitter<string>();
  @Output() updateHighDollarValue = new EventEmitter<string>();

  constructor() { }

  invalidVal = (val:any) => isNaN(val) || val === null || val === '' || val === '.';
  getPrMod = () => this.prmodifier.mod || 1;

  updateLowInputVal = () => {
    this.lowdollar = this.invalidVal(this.lowdollar)
      ? 0 : this.lowdollar;
    this.lowperc = this.lowperc + "";
    if (this.lowperc.indexOf('.') !== -1) { // if this.mod has a decimal in it
      if (this.asisbridge) {
        // asisBridge works like asisAA, instead of using the low/high modifiers
        // we just multiply the cv by the PRmod (which is the ARV)
        this.lowdollar = (parseInt(this.pricevallow) * (this.getPrMod() / 100)).toFixed(0); // don't factor in PR mod for Bridge
      } else {
        // normal calculation
        // multiply cv by low/high mod and by PR mod (which is the condition modifier)
        this.lowdollar = (parseInt(this.pricevallow) * (parseFloat(this.lowperc) / 100) * this.getPrMod()).toFixed(0);
      }
    } else { // if this.mod has no decimal -- it's a specific value like $150 for 8z
      this.lowdollar = parseInt(this.lowperc);
    }
    this.updateLowDollarValue.emit(this.lowdollar);
  }

  updateHighInputVal = () => {
    this.pricevalhigh = this.pricevalhigh;
    this.highdollar = this.invalidVal(this.highdollar)
      ? 0 : this.highdollar;
    this.highperc = this.highperc + "";
    if (this.highperc.indexOf('.') !== -1) { // if this.mod has a decimal in it
      if (this.asisbridge) {
        // asisBridge works like asisAA, instead of using the low/high modifiers
        // we just multiply the cv by the PRmod (which is the ARV)
        this.highdollar = (parseInt(this.pricevalhigh) * (this.getPrMod() / 100)).toFixed(0);
      } else {
        // normal calculation
        // multiply cv by low/high mod and by PR mod (which is the condition modifier)
        this.highdollar = (parseInt(this.pricevalhigh) * (parseFloat(this.highperc) / 100) * this.getPrMod()).toFixed(0);
      }
    } else { // if this.mod has no decimal -- it's a specific value like $150 for 8z
      this.highdollar = parseInt(this.highperc);
    }
    this.updateHighDollarValue.emit(this.highdollar);
  }

  updateLowHiddenVal = () => { // set altmod to the new value
    this.lowaltmod = this.lowdollar;
    this.lowperc = this.lowaltmod;
    this.updateLowInputVal();
  }

  updateHighHiddenVal = () => { // set altmod to the new value
    this.highaltmod = this.highdollar;
    this.highperc = this.highaltmod;
    this.updateHighInputVal();
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

//
// [Alt-Input-Percent][Component
//
import { Component, OnInit, Input, 
  OnChanges, SimpleChanges,
  EventEmitter, Output } from '@angular/core';
import { PlatformDataService } from '../../../../services/platform-data.service';
//
// AltInputPercentComponent: ONLY AA Seller Solution-
// PrepAndRepairs
//
// Turns Concierge ON/OFF
// If Concierge is OFF => PrepAndRepairs input value is 0
//
@Component({
  selector: 'alt-input-percent',
  templateUrl: './alt-input-percent.component.html',
  styleUrls: ['./alt-input-percent.component.scss']
})
export class AltInputPercentComponent implements OnInit, OnChanges {

  @Input() dollar:any;
  @Input() perc:any;
  @Input() prmodifier:any;
  @Input() altmod:any;
  @Input() asisandaa:any;
  @Input() priceval:any;
  @Input() asismod:any;
  @Input() concierge:boolean = false;
  @Input() conciergelabel:any;

  @Output() updateDollarValue = new EventEmitter<string>();
  @Output() conciergeChanged = new EventEmitter<number>();

  showconcierge:boolean = this.platformDataService.getData('showConcierge');
  valchanged:boolean = false;
  old_pr_val:any;
  pr_val:any;

  constructor(private platformDataService: PlatformDataService) { }

  changeConcierge = () => {
    this.concierge = !this.concierge;
    this.platformDataService.changeConciergeStatus(this.concierge);
    this.updateInputVal();
    this.pr_val = this.concierge ? this.old_pr_val : -this.old_pr_val;
    this.conciergeChanged.emit(this.pr_val);
  }

  getPrMod = () => this.prmodifier.mod || 1;

  updateInputVal = () => {
    let asismod = this.asismod && (parseInt(this.asismod) / 100).toFixed(0);
    this.perc = this.perc + "";
    if (this.perc.indexOf('.') !== -1) { // if this.perc has a decimal in it
      if (this.asisandaa) { // if this is the AA and as-is situation
        // modify the AA p&r to be equal to Home Condition Modifier
        this.altmod = this.concierge ? 0 : asismod;
        this.dollar = this.concierge ? 0 : asismod;
      } else { // all the other IOs (or non-As-is AA)
        // normal calculation
        // multiply cv by low/high perc and by PR perc (which is the condition modifier)
        this.altmod = 0; // zero out altmod...just use this.perc which is a decimal value

        this.dollar = this.concierge
          ? (parseInt(this.altmod)).toFixed(0)
          : (parseInt(this.priceval) * (parseInt(this.perc) / 100) * parseInt(this.getPrMod())).toFixed(0);
      }
    } else { // if this.perc has no decimal -- it's a specific value like $150 for 8z
      this.dollar = this.concierge
        ? 0 // the concierge value - $0
        : this.valchanged // did the user change the value?
          ? (parseInt(this.perc) / 100).toFixed(0) // calculate the user's value
          : (parseInt(this.perc)).toFixed(0); // use our value
    }
    this.updatePrepRepairs();
  }
  
  updateHiddenVal = () => { // set altmod to the new value
    this.valchanged = true;
    this.altmod = this.dollar;
    // use toFixed(0) to make sure this.perc's new value doesn't have a decimal
    this.perc = (parseInt(this.priceval)*(parseInt(this.dollar)/parseInt(this.priceval)*100)).toFixed(0);
    this.dollar = this.altmod;
    this.old_pr_val = this.dollar;
  }

  updatePrepRepairs = () => {
    this.updateDollarValue.emit(this.dollar);
  }

  ngOnInit(): void {
    this.updateInputVal();
    this.old_pr_val = this.dollar;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.priceval) {
      this.priceval = changes.priceval.currentValue;
      this.updateInputVal();
      this.old_pr_val = this.dollar == '0' ? this.old_pr_val : this.dollar;
    }
  }
}
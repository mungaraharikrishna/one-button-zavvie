import { Component, OnInit, Input, Output, EventEmitter, ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'multi-select-checkbox',
  templateUrl: './multi-select-checkbox.component.html',
  styleUrls: ['./multi-select-checkbox.component.scss']
})

export class MultiSelectCheckboxComponent implements OnInit {

  constructor() { }

  @Input() formname:any;
  @Input() opts:any;
  @Input() qconfig:any;
  @Input() oldval:any;

  @Output() newval = new EventEmitter<any>();

  @ViewChildren("checkboxes")checkboxes!: QueryList<ElementRef>;
  @ViewChildren("nonCheckbox")nonCheckbox!: QueryList<ElementRef>;

  selection:any = [];

  toggleCompFeatures = (feature:string) => {
    let nota = this.selection.indexOf('None of the above');
    let idx = this.selection.indexOf(feature);

    (idx > -1) // is it in there?
      ? this.selection.splice(idx, 1) // In there...remove it
      // Not in there -- need to add it && remove everything else IF it's NOTA
      : (feature === 'None of the above') // Is feature NOTA?
        // Yep, remove everything, then add this feature
        ? (this.selection.splice(0, this.selection.length), this.selection.push(feature))
        // Not NOTA -- need to find and remove NOTA
        : ((nota > -1) && this.selection.splice(nota, 1), this.selection.push(feature));

    this.newval.emit(this.selection);
  };

  ngOnInit(): void {
    if (this.oldval) {
      this.selection = this.oldval;
    }
  }

}
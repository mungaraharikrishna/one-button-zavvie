import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss']
})
export class SelectOptionComponent {

  @Input() formname:any;
  @Input() opts:any;
  @Input() qconfig:any;
  @Input() oldval:any;

  @Output() newval = new EventEmitter<any>();
  
  changeSelection(e:any) {
    this.formname.get(this.qconfig.controlname)!.setValue(e.target.value, {
      onlySelf: true
    })
    this.newval.emit(this.formname.get(this.qconfig.controlname)!.value);
  }

  constructor() {}

}

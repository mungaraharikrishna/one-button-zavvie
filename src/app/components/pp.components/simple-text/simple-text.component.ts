import { Component, OnInit,
  Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'simple-text',
  templateUrl: './simple-text.component.html',
  styleUrls: ['./simple-text.component.scss']
})
export class SimpleTextComponent implements OnInit {

  @Input() formname:any;
  @Input() qconfig:any;
  @Input() oldval:any;

  @Output() newval = new EventEmitter<any>();

  constructor() { }

  changeSelection(e:any) {
    this.formname.get(this.qconfig.controlname)!.setValue(e.target.value, {
      onlySelf: true
    })
    this.newval.emit(this.formname.get(this.qconfig.controlname)!.value);
  }

  ngOnInit(): void {
    if (!this.oldval) { this.oldval = '' }
  }

}

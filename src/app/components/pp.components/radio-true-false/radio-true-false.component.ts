import { Component, OnInit, Input,
  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'radio-true-false',
  templateUrl: './radio-true-false.component.html',
  styleUrls: ['./radio-true-false.component.scss']
})
export class RadioTrueFalseComponent implements OnInit {

  @Input() formname:any;
  @Input() qconfig:any;
  @Input() oldval:any;

  @Output() newval = new EventEmitter<any>();

  nuevovalue:any;

  constructor() { }

  updateValue = (e:any) => {
    this.formname.get(this.qconfig.controlname)!.setValue(e.target.value, {
      onlySelf: true
    })
    this.nuevovalue = this.formname.get(this.qconfig.controlname)!.value;
    this.newval.emit(this.nuevovalue);
  }

  ngOnInit(): void {
    if (this.oldval) {
      this.formname.get(this.qconfig.controlname)!.patchValue(this.oldval, {
        onlySelf: true
      })
    }
  }

}
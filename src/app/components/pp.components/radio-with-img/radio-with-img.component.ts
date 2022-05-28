import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'radio-with-img',
  templateUrl: './radio-with-img.component.html',
  styleUrls: ['./radio-with-img.component.scss']
})
export class RadioWithImgComponent implements OnInit {
  
  @Input() opts:any;
  @Input() formname:any;
  @Input() qconfig:any;
  @Input() oldval:any;
  @Output() newval = new EventEmitter<any>();

  constructor() { }
  updateValue = (e:any) => {
    this.formname.get(this.qconfig.controlname)!.setValue(e.target.value, {
      onlySelf: true
      })
      this.newval.emit(this.formname.get(this.qconfig.controlname)!.value);
  }
  ngOnInit(): void {
  }

}

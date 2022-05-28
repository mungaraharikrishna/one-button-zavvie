import { Component, OnInit, Input,
  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'number-increment',
  templateUrl: './number-increment.component.html',
  styleUrls: ['./number-increment.component.scss']
})
export class NumberIncrementComponent implements OnInit {

  @Input() formname:any;
  @Input() qconfig:any;
  @Input() oldval:any;

  @Output() newval = new EventEmitter<any>();

  constructor() { }

  data:any;

  increase = () => {
    this.data = this.data+1;
    this.newval.emit(this.data);
  }

  decrease = () => {
    this.data = this.data-1;
    this.newval.emit(this.data);
  }

  ngOnInit(): void {
    this.data = this.oldval ? parseInt(this.oldval) : 0;
  }

}

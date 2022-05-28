import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'simple-number-text',
  templateUrl: './simple-number-text.component.html',
  styleUrls: ['./simple-number-text.component.scss']
})
export class SimpleNumberTextComponent implements OnInit {
  @Input() formname:any;
  @Input() qconfig:any;
  @Input() oldval:any;
  @Output() newval = new EventEmitter<any>();
  formattedAmount:any

  constructor(private currencyPipe : CurrencyPipe) { }

  changeSelection(e:any) {
    this.formname.get(this.qconfig.controlname)!.setValue(e.target.value, {
      onlySelf: true
    })
    this.newval.emit(this.formname.get(this.qconfig.controlname)!.value);
  }

  transformAmount(e:any) {
    this.formattedAmount = this.currencyPipe.transform(this.formattedAmount, '$');
    e.target.value = this.formattedAmount;
  }

  ngOnInit(): void {
    if (!this.oldval) { this.oldval = '' }
  }

}

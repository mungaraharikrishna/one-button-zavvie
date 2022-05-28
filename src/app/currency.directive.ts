import { Directive, OnInit, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Directive({
  selector: '[appCurrency]'
})
export class CurrencyDirective implements OnInit{
  constructor(public el: ElementRef, public renderer: Renderer2, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.format(this.el.nativeElement.value); // format any initial values
  }
  @HostListener('input', ["$event.target.value"]) onInput(e: string) {
    this.format(e);
  };

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    event.preventDefault();
    if(event.clipboardData !== null){
      this.format(event.clipboardData.getData('text/plain'));
    } 
  }
  format(val:string) {
    const numberFormat = this.currencyPipe.transform(val.replace(/\D/g,'').replace(/^0+/,''),'USD', 'symbol', '1.0-0' )
    this.renderer.setProperty(this.el.nativeElement, 'value', numberFormat);
  }
}

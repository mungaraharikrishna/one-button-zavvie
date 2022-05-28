import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'button-comp',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() disable:boolean = false;
  @Input() label:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}

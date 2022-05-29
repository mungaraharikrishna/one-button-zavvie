import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lo-page-title',
  templateUrl: './lo-page-title.component.html',
  styleUrls: ['./lo-page-title.component.scss']
})
export class LoPageTitleComponent implements OnInit {
  @Input() label:any;
  constructor() { }

  ngOnInit(): void {
  }

}

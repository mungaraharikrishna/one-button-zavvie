import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pp-page-title',
  templateUrl: './pp-page-title.component.html',
  styleUrls: ['./pp-page-title.component.scss']
})
export class PpPageTitleComponent implements OnInit {

  @Input() label:any;

  constructor() { }

  ngOnInit(): void {
  }

}

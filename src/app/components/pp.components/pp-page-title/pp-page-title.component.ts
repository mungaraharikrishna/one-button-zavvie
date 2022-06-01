import { Component, OnInit, Input } from '@angular/core';
import { PlatformDataService } from 'src/app/services/platform-data.service';

@Component({
  selector: 'pp-page-title',
  templateUrl: './pp-page-title.component.html',
  styleUrls: ['./pp-page-title.component.scss']
})
export class PpPageTitleComponent implements OnInit {

  @Input() label:any;
  show_lo: boolean = false;

  constructor(private pds: PlatformDataService) { }

  ngOnInit(): void {
    this.pds.currentVisibilityStatusLO.subscribe(newstatus => this.show_lo = newstatus);
  }

}

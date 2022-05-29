import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';

@Component({
  selector: 'app-client-info-profile',
  templateUrl: './client-info-profile.component.html',
  styleUrls: ['./client-info-profile.component.scss']
})
export class ClientInfoProfileComponent implements OnInit {
  loVisible: boolean = false;
  @Input() ooconfigured:any;
  @Output() change_showlo = new EventEmitter<boolean>();
  constructor(public configService: ConfigService, public scrollDownService: ScrollDownService, private platformDataService: PlatformDataService, private nav: NavService) { }

  ngOnInit(): void {
    this.platformDataService.currentVisibilityStatusLO.subscribe(newstatus => this.loVisible = newstatus);
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ConfigService } from '../../../services/config.service';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'property-profiler',
  templateUrl: './property-profiler.component.html',
  styleUrls: ['./property-profiler.component.scss']
})
export class PropertyProfilerComponent implements OnInit {

  @Input() ooconfigured:any;
  @Output() change_showoo = new EventEmitter<boolean>();

  ppVisible:boolean = false;
  loVisible:boolean = false;
  isSeller:boolean = false;
  isBuyer:boolean = false;
  isCashoffer: boolean = false;
  
  constructor(
    public configService: ConfigService,
    public scrollDownService: ScrollDownService,
    private platformDataService: PlatformDataService,
    private nav: NavService) {}

  showPP = (e:any) => {
    e.preventDefault();
    this.platformDataService.changeVisibilityPP(true);
    this.change_showoo.emit(false);
    this.scrollDownService.doScroll(250, false);
    this.nav.goto.ppstart();
  }

  ngOnInit() {
    this.platformDataService.currentAddressStatus.subscribe(newstatus => this.ppVisible = newstatus);
    this.platformDataService.currentVisibilityStatusPP.subscribe(newstatus => this.ppVisible = newstatus);
    this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
    this.platformDataService.currentVisibilityStatusLO.subscribe(newstatus => this.loVisible = newstatus);
    this.platformDataService.currentVisibilityStatusCashOffer.subscribe(newstatus => this.isCashoffer = newstatus);
    if (this.loVisible) {
      this.nav.goto.lostart();
    }
  }

}
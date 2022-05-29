import { Component, OnInit } from '@angular/core';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { ScrollDownService } from 'src/app/services/scroll-down.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-mortgage-info',
  templateUrl: './mortgage-info.component.html',
  styleUrls: ['./mortgage-info.component.scss']
})
export class MortgageInfoComponent implements OnInit {
  nextBtnConfig = {
    text: 'NEXT',
    type: 'submit',
    disabledBtn: true
  }
  backBtnConfig = {
    backtext: 'BACK'
  }
  showBuyerPPLoader: boolean = false;
  constructor( public fns: FieldNameService,
    private wpApiService: WpApiService,
    public platformDataService: PlatformDataService,
    private scrollDownService: ScrollDownService,
    private nav: NavService) { }

  ngOnInit(): void {
  }

  back = () => {
    this.nav.goto.mortgageInfo.back();
  }

  next = () => {
    this.nav.goto.mortgageInfo.next();
  }

}

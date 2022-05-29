import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'app-next-back-buttons',
  templateUrl: './next-back-buttons.component.html',
  styleUrls: ['./next-back-buttons.component.scss']
})
export class NextBackButtonsComponent implements OnInit {
  @Input() buttonConfig: any;
  @Input() disabled: any;
  @Input() ppvalue: any;
  isSeller: boolean = false;
  express: boolean = false;
  constructor(
    private wpApiService: WpApiService,
    private platformDataService: PlatformDataService,
    private router: Router) {
  }

  ngOnInit(): void {
  }

  sendUpdate() {
    
  }

}

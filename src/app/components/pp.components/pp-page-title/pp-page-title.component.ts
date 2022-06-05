import { Component, OnInit, Input } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';

@Component({
  selector: 'pp-page-title',
  templateUrl: './pp-page-title.component.html',
  styleUrls: ['./pp-page-title.component.scss']
})
export class PpPageTitleComponent implements OnInit {

  @Input() label:any;

  constructor(private login: LoginDataService) { }

  userPersona:string = '';
  isLoanOfficer:boolean = false;
  ngOnInit(): void {
    this.login.userPersona.subscribe(officer => this.userPersona = officer);
    if (this.userPersona === 'loan-officer') {
      this.isLoanOfficer = true;
    }
  }

}

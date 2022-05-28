import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PlatformDataService } from '../../../services/platform-data.service';

@Component({
  selector: 'preview-pdf',
  templateUrl: './preview-pdf.component.html',
  styleUrls: ['./preview-pdf.component.scss']
})
export class PreviewPdfComponent implements OnInit {
  Date = Date.now();
  showPoweredByZavvie:boolean = false;
  partnerName = this.platformDataService.getData('partnerName')
  agentName = this.platformDataService.getCORData('AgentFullName');
  ppAddress = this.platformDataService.getCORData('ppAddress');
  partnerLogo = this.platformDataService.getData('logo');
  allPlatforms:any = this.platformDataService.getCORData('allplatforms');
  corValues:any = this.platformDataService.getAllCORData().corValues;

  EligibleBuyerArray:Array<any> = [];
  ineligibleBuyerArray:Array<any> = [];

  constructor( public fb: FormBuilder,
    public platformDataService: PlatformDataService) { }

  logo:any;
  ngOnInit(): void {
    this.platformDataService.showPoweredByZavvie.subscribe(newstatus => this.showPoweredByZavvie = newstatus);
    this.platformDataService.eligibleVerifiedBuyers.subscribe(eligibleVerifiedBuyers => this.EligibleBuyerArray = eligibleVerifiedBuyers);
    this.platformDataService.inEligibleVerifiedBuyers.subscribe(inEligibleVerifiedBuyers => this.ineligibleBuyerArray = inEligibleVerifiedBuyers);
    this.logo = this.platformDataService.getData('partner_logo');
  }

  img = (img:string) => {
    let origin:string = window.location.origin;
    return (origin == 'http://localhost:4200') ? 'assets/img/BHHS-Perrie-Mundie-Cab-NO-SEAL-1.png' : img;
  }

  powered_by_img = () => {
    let origin:string = window.location.origin;
    let first_part = (origin == 'http://localhost:4200')
      ? 'assets/img/BHHS-Perrie-Mundie-Cab-NO-SEAL-1.png'
      : (origin == 'http://localhost:8888')
        ? origin + '/zavvie' : origin;

    let middle_part = '/wp-content/uploads/2021/11/';
    let file_name = 'powered-by-zavvie.png';

    return (origin == 'http://localhost:4200')
      ? 'assets/img/BHHS-Perrie-Mundie-Cab-NO-SEAL-1.png'
      : first_part + middle_part + file_name;
  }

  updateNextStepsInfo = (id:number, key:string, e:any) => {
    this.corValues[id][key] = e.target.value;
    this.platformDataService.setCORData('corValues', this.corValues);
  }
}

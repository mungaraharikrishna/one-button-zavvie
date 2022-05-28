import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { EmailClientService } from 'src/app/services/email-client.service';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'buyer-email',
  templateUrl: './buyer-email.component.html',
  styleUrls: ['./buyer-email.component.scss']
})
export class BuyerEmailComponent implements OnInit {

  constructor(private wpApiService: WpApiService,
    public pds: PlatformDataService,
    public fns: FieldNameService,
    private emailService: EmailClientService,
    private nav: NavService) { }

  @Input() buyerEmailToClient:boolean = true;
  @Output() showemailtoclient = new EventEmitter<boolean>();

  showBuyerEmailLoader:boolean = false;
  buyerOnlyEmailSent:boolean = false;
  isSeller:boolean = false;
  isBuyer:boolean = false;
  proceedSeller:boolean = false
  hideEmailToClient:any = this.pds.getData('hideEmailToClient');

  buyerEmailMessageDefault: any = this.pds.getUserData('BuyerEmailMessageDefault');
  buyerEmailMessage_a:any;
  buyerEmailMessage_b:any;
  buyEmailBody = "There are some really great buyer solutions in your area that I think you would be interested in. Please fill out the application below to check your eligibility:";

  agentname = () => this.pds.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName) + ' '
    + this.pds.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);

  agentphone = () => {
    let phonenum:any = this.pds.getUserData('AgentPhone');
    const areacode = phonenum.substring(0, 3);
    const middle = phonenum.substring(3, 6);
    const lastfour = phonenum.substring(6, phonenum.length);
    return '(' + areacode + ') ' + middle + '-' + lastfour;
  }

  agentemail = () => this.pds.getUserData(this.fns.FieldNames.generalInfo.AgentEmail);
  clientname = () => this.pds.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);

  buyerEmailMessageUpdated = (e:any) => {
    this.buyerEmailMessage_a = `Hello ${this.clientname()},<br><br>${e.target.value}<br>`;
    this.pds.addUserData('BuyerEmailMessage', this.buyerEmailMessage_a);
  };

  buyerEmailClicked = () => {
    this.buyerEmailMessage_a = `Hello ${this.clientname()},<br><br>${this.buyEmailBody}<br>`;
    this.buyerEmailMessage_b = `<br>
    Let me know if you have any questions!<br>
    <br>
    Sincerely,<br>
    ${this.agentname()}<br>
    ${this.agentphone()}<br>
    ${this.agentemail()}`;
  
    if (!this.buyerEmailMessageDefault) {
      this.buyerEmailMessageDefault = this.buyerEmailMessage_a;
      this.pds.addUserData('BuyerEmailMessage', this.buyerEmailMessageDefault);
      this.pds.addUserData('buyerEmailMessage_b', this.buyerEmailMessage_b);
    }
  }

  buyerEmailToClientConfirmed = () => {
    this.pds.addUserData('buyerEmailToClientConfirmed', true);
    this.pds.changeSuccessMessage('buyerEmailToClient');
    this.showBuyerEmailLoader = true;
    this.buyerEmailClicked();
    this.emailService.sendBuyerEmailToAgent().subscribe(() => {
      this.emailService.sendBuyerEmailToBuyer().subscribe((buyer_email:any) => {
        this.wpApiService.buyerSendToPb(this.pds.getData('buyerPPid')).subscribe((pb_response:any) => {
          this.pds.addUserData('pbConfirmation', pb_response.confirmation_number);
          if (this.isBuyer && !this.isSeller) {
            this.buyerOnlyEmailSent = true;
            this.pds.addUserData('buyerOnlyEmailSent', this.buyerOnlyEmailSent);
            this.nav.goto.success();
          } else if (this.isBuyer && this.isSeller) {
            this.proceedSeller = true
          } else {
            this.nav.goto.sellerInfo2.next();
          }
        });
      });
    })
    
  }

  emailToClientCanceled = () => {
    this.confirmEmailToClient = false;
    this.showemailtoclient.emit(false);
  }

  confirmEmailToClient:boolean = false;

  //// Close Modal ////
  closeModal = (el:any) => {
    if (el.path[0].className == 'modal-background' || el.path[0].className == 'jw-modal') {
      this.confirmEmailToClient = false;
      this.buyerEmailToClient = false;
      this.proceedSeller = false;
      this.showBuyerEmailLoader = !this.showBuyerEmailLoader;
    }
  }
  proceedToSellerInfo = () => this.nav.goto.buyerInfo.next();
  
  verified_buyers:any;
  ngOnInit(): void {
    this.pds.currentVerifiedBuyers.subscribe(newbuyers => this.verified_buyers = newbuyers);
    this.pds.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
  }

}
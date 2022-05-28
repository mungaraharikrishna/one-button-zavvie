import { Component, OnInit } from '@angular/core';
import { EmailClientService } from 'src/app/services/email-client.service';
import { FieldNameService } from 'src/app/services/field-name.service';
import { NavService } from 'src/app/services/nav.service';
import { PlatformDataService } from 'src/app/services/platform-data.service';
import { WpApiService } from 'src/app/services/wp-api.service';

@Component({
  selector: 'seller-email',
  templateUrl: './seller-email.component.html',
  styleUrls: ['./seller-email.component.scss']
})
export class SellerEmailComponent implements OnInit {

  constructor(private wpApiService: WpApiService,
    public pds: PlatformDataService,
    public fns: FieldNameService,
    private emailService: EmailClientService,
    private nav: NavService) { }

  ngOnInit(): void {
    this.pds.currentSellerStatus.subscribe(newstatus => this.isseller = newstatus);
    this.pds.currentBuyerStatus.subscribe(newstatus => this.isbuyer = newstatus);
  }

  isShown:boolean = false;

  optionOneClick:boolean = false
  confirmEmailToClient:boolean = false;
  hasAgentLogo:boolean = this.pds.getData('agent_logo');

  newval:any;
  ppid:any = '';
  ppidSet:boolean = false;

  showLoader:boolean = false;
  showEmailLoader:boolean = false;

  isseller:boolean = false;
  isbuyer:boolean = false;
  hideEmailToClient:any = this.pds.getData('hideEmailToClient');

  emailToClientCanceled = () => {
    this.isShown = false;
    this.confirmEmailToClient = false;
  }
  
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

  greeting:string = ``;
  salutation:string = ``;
  body:string = `To ensure that I secure all possible offers available to you, I'd like you to complete this quick questionnaire about your home. It will take you only about 5-10 minutes and give me all the information I need to start the process.`

  emailMessageDefault:any = this.pds.getUserData('EmailMessage');
  emailMessage:any;

  // Option 1 or Option 2 Click
  optionOneClicked = () => {
    this.emailMessage = `Hello ${this.clientname()},<br>
      <br>
      ${this.body}<br>  
      <br>
      Let me know if you have any questions!<br>
      <br>
      Sincerely,<br>
      ${this.agentname()}<br>
      ${this.agentphone()}<br>
      ${this.agentemail()}`;

    if (!this.emailMessageDefault) {
      this.emailMessageDefault = this.emailMessage;
      this.pds.addUserData('EmailMessage', this.emailMessageDefault);
    }
    this.confirmEmailToClient = true;
    this.optionOneClick = true
    this.pds.addUserData('optionOneClick', this.optionOneClick)
  }

  // Seller
  optionTwoClicked = () => {
    this.showLoader = true;
    this.pds.changeSuccessMessage('congratulation');
    this.ppid = this.pds.getData('ppid');

    if (!this.ppid) {
      this.wpApiService.makePropertyProfile().subscribe((response:any) => {
        console.log(response && response.id);
        this.ppid = response.id;
        this.pds.setData('ppid', this.ppid);
        this.ppidSet = this.ppid == '' ? false : true;
        this.ppidSet
          ? this.nav.goto.confirmAddress.next()
          : console.log('Something went wrong...oops');
      });
    } else {
      this.pds.addUserData('emailToClient', false);
      this.nav.goto.confirmAddress.next();
    }
  }

  emailMessageUpdated = (name:string, e:any) => {
    this.emailMessage = `Hello ${this.clientname()},<br>
      <br>
      ${e.target.value}<br>  
      <br>
      Let me know if you have any questions!<br>
      <br>
      Sincerely,<br>
      ${this.agentname()}<br>
      ${this.agentphone()}<br>
      ${this.agentemail()}`;

    this.pds.addUserData(name, this.emailMessage);
  }

  emailToClientConfirmed = () => {
    this.showEmailLoader = true;
    this.pds.addUserData('emailToClient', true);
    this.emailService.sendEmailToClient(this.pds.getUserData('EmailMessage')).subscribe((response:any) => {
      console.log(response);
      this.pds.changeSuccessMessage('emailToClient');
      this.nav.goto.success();
    })
  }

}

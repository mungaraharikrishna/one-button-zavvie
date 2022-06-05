import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { FieldNameService } from '../services/field-name.service';
import { PlatformDataService } from '../services/platform-data.service';
import { ConfigService } from '../services/config.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmailClientService {
 API_SERVER:string = '';
 BUYER_EMAIL_API_SERVER:string = '';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(
    private httpClient: HttpClient,
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private configService: ConfigService) {
  }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  sendEmailToClient(msg:string) {
    let client_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);
    let client_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName);
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail);

    let agent_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
    let agent_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail);
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone);
    let listing_agreement = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement)
      ? 'true'
      : 'false';

    let addressa = this.platformDataService.getAddressData('addressa');
    let addressb = this.platformDataService.getAddressData('addressb');
    let zipcode = this.platformDataService.getAddressData('zipcode');
    let latitude = this.platformDataService.getAddressData('latitude');
    let longitude = this.platformDataService.getAddressData('longitude');
    let message_body = msg;
    let partnerId = this.configService.getPlatformIds().partnerId;
    let lpid = this.configService.getPlatformIds().landingpage_id;

    // console.log('client_email', client_email);
    // console.log('addressa', addressa);
    // console.log('addressb', addressb);

    // console.log('lpid', lpid);
    // console.log('message_body', message_body);

    let params = 'client_first_name=' + encodeURIComponent(client_first_name)
      + '&client_last_name=' + encodeURIComponent(client_last_name)
      + '&client_email=' + encodeURIComponent(client_email)
      + '&platform_id=' + encodeURIComponent(partnerId)
      + '&landing_page_id=' + encodeURIComponent(lpid)
      + '&addressa=' + encodeURIComponent(addressa)
      + '&addressb=' + encodeURIComponent(addressb)
      + '&zipcode=' + encodeURIComponent(zipcode)
      + '&latitude=' + encodeURIComponent(latitude)
      + '&longitude=' + encodeURIComponent(longitude)
      + '&message_body=' + encodeURIComponent(message_body)
      + '&agent_first_name=' + encodeURIComponent(agent_first_name)
      + '&agent_last_name=' + encodeURIComponent(agent_last_name)
      + '&agent_email=' + encodeURIComponent(agent_email)
      + '&agent_phone=' + encodeURIComponent(agent_phone)
      + '&listing_agreement=' + encodeURIComponent(listing_agreement);

    this.API_SERVER = this.configService.getServer() + "/wp-json/pp-1b/v1/email-client/?" + params
    return this.httpClient.get(this.API_SERVER , this.httpOptions).pipe(catchError(this.handleError));
  }

  // Send Buyer Email
  sendBuyerEmailToAgent() {

    let client_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);
    let client_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName);
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail);

    let agent_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
    let agent_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail);
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone);
    let listing_agreement = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.SignedListingAgreement)
      ? 'true'
      : 'false';

    let partnerId = this.configService.getPlatformIds().partnerId;

    let pdsBuyers = this.platformDataService.getMarketData('Verified Buyer Links');
    let buyerSolutions = this.platformDataService.getUserData('BuyerSolutions') || '';
    let show_mort_fin_vbs:boolean = buyerSolutions.indexOf('Open Market') > -1;
    let show_cash_vbs:boolean = buyerSolutions.indexOf('Cash Offer') > -1;
    let show_lease_vbs:boolean = buyerSolutions.indexOf('Lease to Own') > -1;
    let filtered_buyers = [];

    if (this.platformDataService.hasJsonStructure(pdsBuyers)) {
      let verified_buyers = JSON.parse(pdsBuyers);

      for (let verified_buyer of verified_buyers) {
        if (show_mort_fin_vbs) {
          filtered_buyers.push(verified_buyer.buyers.warranty_vbs);
        }
        if (show_cash_vbs) {
          filtered_buyers.push(verified_buyer.buyers.cash_vbs);
        }
        if (show_lease_vbs) {
          filtered_buyers.push(verified_buyer.buyers.lease_vbs);
        }
      }
    }

    let params = 'client_first_name=' + encodeURIComponent(client_first_name)
      + '&client_last_name=' + encodeURIComponent(client_last_name)
      + '&client_email=' + encodeURIComponent(client_email)
      + '&platform_id=' + encodeURIComponent(partnerId)
      + '&agent_first_name=' + encodeURIComponent(agent_first_name)
      + '&agent_last_name=' + encodeURIComponent(agent_last_name)
      + '&agent_email=' + encodeURIComponent(agent_email)
      + '&agent_phone=' + encodeURIComponent(agent_phone)
      + '&listing_agreement=' + encodeURIComponent(listing_agreement)
      + '&verified_buyers=' + encodeURIComponent( JSON.stringify(filtered_buyers) )
      + '&show_mort_fin_vbs=' + encodeURIComponent(show_mort_fin_vbs);

    this.API_SERVER = this.configService.getServer() + "/wp-json/pp-1b/v1/buyer-email-client/?" + params
    return this.httpClient.get(this.API_SERVER , this.httpOptions).pipe(catchError(this.handleError));
  }

  sendBuyerEmailToBuyer() {
    let client_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientFirstName);
    let client_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientLastName);
    let client_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentClientEmail);
    let client_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.ClientPhone);

    let agent_first_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
    let agent_last_name = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
    let agent_email = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentEmail);
    let agent_phone = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentPhone);

    let partnerId = this.configService.getPlatformIds().partnerId;
    let buyerPPid = this.platformDataService.getData('buyerPPid');
    let verified_buyers = JSON.parse(this.platformDataService.getMarketData('Verified Buyer Links'));

    let buyerSolutions = this.platformDataService.getUserData('BuyerSolutions') || '';
    let show_mort_fin_vbs:boolean = buyerSolutions.indexOf('Open Market') > -1;
    let show_cash_vbs:boolean = buyerSolutions.indexOf('Cash Offer') > -1;
    let show_lease_vbs:boolean = buyerSolutions.indexOf('Lease to Own') > -1;

    let filtered_buyers = [];

    for (let verified_buyer of verified_buyers) {
      if (show_mort_fin_vbs) {
        filtered_buyers.push(verified_buyer.buyers.warranty_vbs);
      }
      if (show_cash_vbs) {
        filtered_buyers.push(verified_buyer.buyers.cash_vbs);
      }
      if (show_lease_vbs) {
        filtered_buyers.push(verified_buyer.buyers.lease_vbs);
      }
    }

    let mort_buyer = show_mort_fin_vbs ? this.platformDataService.getData('mortgageEmail') : '';
    let cash_buyer = show_cash_vbs ? this.platformDataService.getData('cashEmail') : '';

    let params = 'client_first_name=' + encodeURIComponent(client_first_name)
      + '&client_last_name=' + encodeURIComponent(client_last_name)
      + '&client_email=' + encodeURIComponent(client_email)
      + '&client_phone=' + encodeURIComponent(client_phone)
      + '&platform_id=' + encodeURIComponent(partnerId)
      + '&ppid=' + encodeURIComponent(buyerPPid)
      + '&agent_first_name=' + encodeURIComponent(agent_first_name)
      + '&agent_last_name=' + encodeURIComponent(agent_last_name)
      + '&agent_email=' + encodeURIComponent(agent_email)
      + '&agent_phone=' + encodeURIComponent(agent_phone)
      + '&verified_buyers=' + encodeURIComponent( JSON.stringify(filtered_buyers) )
      + '&mortgage_buyer=' + encodeURIComponent(mort_buyer)
      + '&cash_buyer=' + encodeURIComponent(cash_buyer)
      + '&show_cash_vbs=' + encodeURIComponent(show_cash_vbs)
      + '&show_lease_vbs=' + encodeURIComponent(show_lease_vbs)
      + '&show_mort_fin_vbs=' + encodeURIComponent(show_mort_fin_vbs);

    this.BUYER_EMAIL_API_SERVER = this.configService.getServer() + "/wp-json/pp-1b/v1/send-buyer-email/?" + params;
    return this.httpClient.get(this.BUYER_EMAIL_API_SERVER , this.httpOptions).pipe(catchError(this.handleError));
  }

}

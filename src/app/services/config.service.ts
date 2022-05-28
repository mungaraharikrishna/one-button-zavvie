import { OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { PlatformDataService } from './platform-data.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConfigService implements OnInit {
  params:string = '';
  partner_id_el:any = '';
  partner_id:string = '';
  landingpage_id:string = '';

  ngOnInit(): void {}

  constructor(
    private httpClient: HttpClient,
    private pds: PlatformDataService) {
    this.partner_id_el = <HTMLElement>document.getElementById('offer-optimizer');
    this.partner_id = this.partner_id_el && this.partner_id_el.dataset.partnerid;
    this.landingpage_id = this.partner_id_el && this.partner_id_el.dataset.landingpageid;

    let params = 'partner=' + encodeURIComponent(this.partner_id)
    + '&landingpageid=' + encodeURIComponent(this.landingpage_id);
  }

  public getServer(): string {
    if (environment.overrideWpServer) {
      return '' + environment.overrideWpServer;
    } else if (window.location.hostname === 'localhost') {
      return 'http://localhost:8888/zavvie';
    } else {
      return window.location.origin;
    }
  }

  public getEnv () {
    return (window.location.hostname === 'localhost')
      ? 'local'
      : window.location.hostname === 'zavvie.com'
        ? 'production'
        : 'staging';
  }

  public getPlatformIds() {
    let ids = {
      partnerId: this.partner_id,
      landingpage_id: this.landingpage_id
    };
    return ids;
  }

  public getLocation() {
    let loc = window.location;
    return loc;
  }

  public setPath() {
    let path:string = window.location.pathname;
    let origin:string = window.location.origin;
    let href:string = window.location.href;

    if (origin != 'http://localhost:4200') {
      path = (path.charAt(0) == '/') ? path.substring(1) : path;
      path = (path.charAt(path.length-1) == '/') ? path.substring(0, path.length-1) : path;
    } else {
      path = '/';
    }
    this.pds.setData('origin', href);
    this.pds.setData('home', path);
    // console.log('set PATH', this.pds.getData('home'));
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

  public getPlatforms(user_id:string) {
    let params = 'partner=' + encodeURIComponent(this.partner_id)
      + '&landingpageid=' + encodeURIComponent(this.landingpage_id)
      + '&wp_user=' + encodeURIComponent(user_id);

    const wpApiUrl = this.getServer() + "/wp-json/platforms/v1/data/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

  public getMarket(state:string, county:string) {
    let params = 'state=' + encodeURIComponent(state)
      + '&county=' + encodeURIComponent(county);

    const wpApiUrl = this.getServer() + "/wp-json/platforms/v1/get/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

  platform_id_for_vb_spoof:number = 15777;

  public getVerifiedBuyersByZip(zipcode:string) {
    console.log('getting VBs for Platform ID: ', this.platform_id_for_vb_spoof);
    let params = this.getEnv() == 'local'
      ? 'platform_id=' + this.platform_id_for_vb_spoof + '&zip_code=' + encodeURIComponent(zipcode)
      : 'platform_id=' + encodeURIComponent(this.getPlatformIds().partnerId) + '&zip_code=' + encodeURIComponent(zipcode);

    const wpApiUrl = this.getServer() + "/wp-json/marketplace-matrix/v1/get_vbs/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

  public getVerifiedBuyersByState(state:any) {
    let states = (state:any) => {
      let pars:string = '';
      for (let st of state) {
        pars += '&state[]=' + st;
      }
      return pars;
    };
    let params = this.getEnv() == 'local'
      ? 'platform_id=' + this.platform_id_for_vb_spoof + states(state)
      : 'platform_id=' + encodeURIComponent(this.getPlatformIds().partnerId) + states(state);

    const wpApiUrl = this.getServer() + "/wp-json/marketplace-matrix/v1/get_buyer_vbs/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

  public getBuyerLinks(data:any) {
    let states = (state:any) => {
      if (state) {
        let pars:string = '';
        for (let st of state) {
          pars += '&state[]=' + st.state;
        }
        return pars;
      } else {
        return '';
      }
    }

    let params = this.getEnv() == 'local'
      ? 'platform_id=' + this.platform_id_for_vb_spoof + states(data)
      : 'platform_id=' + encodeURIComponent(this.getPlatformIds().partnerId) + states(data);

    const wpApiUrl = this.getServer() + "/wp-json/marketplace-matrix/v1/get_vb_links/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

  getResponse = (id:string) => this.pds.getUserData(id);
  encodeResponse = (res:string) => encodeURIComponent(this.getResponse(res));
  public getVerifiedIbuyers() {

    let homeval = this.pds.getHomeValueData('homeValue');
    let params = this.getEnv() == 'local'
      ? 'platform_id=' + this.platform_id_for_vb_spoof + '&ppid=' + encodeURIComponent(this.pds.getData('ppid') + '&homeval=' + encodeURIComponent(homeval))
      : 'platform_id=' + encodeURIComponent(this.getPlatformIds().partnerId) + '&ppid=' + encodeURIComponent(this.pds.getData('ppid')) + '&homeval=' + encodeURIComponent(homeval);

    const wpApiUrl = this.getServer() + "/wp-json/marketplace-matrix/v1/get_vb_eligibility/?" + params;
    return this.httpClient.get(wpApiUrl).pipe(catchError(this.handleError));
  }

}

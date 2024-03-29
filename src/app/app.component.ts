import { Component } from '@angular/core';
import { ElementRef } from '@angular/core';
import { LoginDataService } from './services/login-data.service';
import { LoginApiService } from './services/login-api.service';
import { PlatformDataService } from './services/platform-data.service';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
// https://zavvie.com/remaxalliance/offer-optimizer/?addressa=4000%20Nelson%20Rd&addressb=Longmont%20CO,%2080503&zipcode=80503&latitude=40.1550868&longitude=-105.1577853&listing_agreement=false&client_first_name=VBill&client_last_name=Jorgenson&agent_first_name=Bob&agent_last_name=Jones&agent_phone=3035558484&agent_email=bob@aao.com&client_email=ron.caruthers@zavvie.com
export class AppComponent {
  title = 'one-button-zavvie';

  constructor(
    public el: ElementRef,
    private data: LoginDataService,
    private api: LoginApiService,
    private pds: PlatformDataService) {
      console.log('zavvie One Button v12.15 [sp-affinity]');

      this.platform_id = el.nativeElement.getAttribute('brid');
      this.platform_api_key = environment.overridePlatformApiKey ?? el.nativeElement.getAttribute('brapikey');
      this.platform_logo = el.nativeElement.getAttribute('brogo');
      this.platform_color = el.nativeElement.getAttribute('brcolor');
      data.setData('id', this.platform_id);
      data.setData('api_key', this.platform_api_key);
      data.setData('logo', this.platform_logo);
      data.setData('color', '#' + this.platform_color);
      pds.setData('highlight', '#' + this.platform_color);

      // Determine Solution Provider Affinity and details
      const sp_affinity = el.nativeElement.getAttribute('spaffinity');
      pds.setData('sp_affinity', sp_affinity);
      if (sp_affinity === "1") {
        const sp_affinity_type = el.nativeElement.getAttribute('spaffinity_type');
        const sp_affinity_id = el.nativeElement.getAttribute('spaffinity_id');
        const sp_affinity_name = el.nativeElement.getAttribute('spaffinity_name');
        const sp_affinity_logo = el.nativeElement.getAttribute('spaffinity_logo');
        const sp_affinity_description = el.nativeElement.getAttribute('spaffinity_description');
        const sp_affinity_features = el.nativeElement.getAttribute('spaffinity_features');
        const sp_affinity_nextsteps = el.nativeElement.getAttribute('spaffinity_nextsteps');
        pds.setData('sp_affinity_type', sp_affinity_type);
        pds.setData('sp_affinity_id', sp_affinity_id);
        pds.setData('sp_affinity_name', sp_affinity_name);
        pds.setData('sp_affinity_logo', sp_affinity_logo);
        pds.setData('sp_affinity_description', sp_affinity_description);
        pds.setData('sp_affinity_features', sp_affinity_features);
        pds.setData('sp_affinity_nextsteps', sp_affinity_nextsteps);
      }

      const jwt = this.api.getJwtToken();
      if (jwt === null) {
        return;
      }
      if (!this.api.isJwtTokenLoggedIn()) {
        return;
      }

      // If we have profile in storage, try loading it; otherwise try getting info from user profile API
      if (localStorage.getItem('userProfile')) {
        try {
          this.data.LoginUser(JSON.parse(localStorage.getItem('userProfile') + ''));
          return;
        } catch (e) {
          // no handling; move on to profile login check.
        }
      }

      // Simplified profile login check. If profile doesn't come back, erase Jwt token and assume customer logged-out.
      this.api.userProfile(jwt)
        .then(response => response.json())
        .then((responseJson) => {
          // do app-data.service.ts and do changeAgent() call. Don't need login because login is part of agent call.
          this.data.LoginUser(responseJson.data);
        }).catch((reason) => {
          this.api.removeJwtToken();
        });
  }

  platform_id:string = '';
  platform_api_key:string = '';
  platform_logo:string = '';
  platform_color:string = '';
}

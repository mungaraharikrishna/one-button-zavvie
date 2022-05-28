import {Component, EventEmitter, Output} from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'profile-comp',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  @Output() showChangePassword: any = new EventEmitter<any>();

  constructor(private data: LoginDataService) {
    this.data.currentAgent.subscribe(agent => this.agent = agent);
    this.color = this.data.getData('color');
    document.documentElement.style.setProperty('--brcolor', this.color);
  }

  color:string = '';
  agent:any

}

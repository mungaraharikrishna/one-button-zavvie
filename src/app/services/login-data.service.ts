import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldNameService } from './field-name.service';
import { NavService } from './nav.service';
import { PlatformDataService } from './platform-data.service';

@Injectable({
  providedIn: 'root'
})
export class LoginDataService {

  constructor(private pds: PlatformDataService,
    private fns: FieldNameService,
    private nav: NavService) {}

  //////////////////////
  // App Data
  //////////////////////
  appData:any = {
    data: []
  }
  setData = (id:any, newdata:any) => {
    this.appData.data[id] = '';
    this.appData.data[id] = newdata;
  }
  getAllData = () => this.appData.data;
  getData = (id:any) => this.appData.data[id];

  //////////////////////////////////////
  // Agent Data/Login/Logout Observables
  //////////////////////////////////////
  private agentObj = new BehaviorSubject<object>({});
  currentAgent = this.agentObj.asObservable();
  gi:any = this.fns.FieldNames.generalInfo;
  LoginUser(newobj:any) {
    this.agentObj.next(newobj);
    if (newobj) {
      this.setData('EmailAddress', newobj.email);
      localStorage.setItem('userProfile', JSON.stringify(newobj));
      this.pds.addUserData(this.gi.AgentFirstName, newobj.first_name);
      this.pds.addUserData(this.gi.AgentLastName, newobj.last_name);
      this.pds.addUserData(this.gi.AgentID, newobj.mls_number);
      this.pds.addUserData(this.gi.AgentPhone, newobj.phone);
      this.pds.addUserData(this.gi.AgentEmail, newobj.email);
      this.changeLoggedIn(true);
      if (this.go_to_pp) {
        this.pds.changeVisibilityPP(true);
        this.pds.changeVisibilityOO(false);
        this.pds.changeVisibilityCOR(false);
        this.nav.goto.ppstart();
        this.setGoToPP(false);
      }
    } else {
      this.LogoutUser();
    }
    console.log(this.pds.getAllUserData());
  }

  LogoutUser() {
    const emptyObj:object = {};
    this.agentObj.next(emptyObj);
    localStorage.removeItem('userProfile');
    this.changeLoggedIn(false);
    this.changeActiveForm('');
    window.location.href = this.pds.getData('origin');
  }

  private go_to_pp:boolean = false;
  setGoToPP(newstatus:boolean) {
    this.go_to_pp = newstatus;
  }

  /////////////
  // showApp()
  /////////////
  showApp() {
    this.changeActiveForm('login-form');
    document.body.style.position = 'fixed';
    document.body.style.overflow = 'hidden';
  }

  /////////////////////////
  // isLoggedIn Observable
  /////////////////////////
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn = this.loggedIn.asObservable();
  changeLoggedIn(newstatus:any) {
    this.loggedIn.next(newstatus);
  }

  /////////////////////////
  // activeForm Observable
  /////////////////////////
  private activeForm = new BehaviorSubject<string>('');
  currentActiveForm = this.activeForm.asObservable();
  changeActiveForm(newform:any) {
    this.activeForm.next(newform);
  }

  /////////////////////////
  // UserPersona Obs
  /////////////////////////
  private persona = new BehaviorSubject<string>('loan-officer');
  userPersona = this.persona.asObservable();
  changePersona(newpersona: any) {
    this.persona.next(newpersona);
  }

  //////////////////////////////
  // clearLoginModal Observable
  //////////////////////////////
  public clearLoginModal = (time:number) => {
    document.body.style.position = '';
    document.body.style.overflow = '';
    // wait (time)seconds then clear the activeForm
    const wait: ReturnType<typeof setTimeout> = setTimeout(() => this.changeActiveForm(''), time);
  }

  // Email Regexp
  public emailRegexp() {
    return '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,12}$';
  }

}
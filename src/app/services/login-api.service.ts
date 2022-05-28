import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginDataService } from './login-data.service';
import { environment } from '../../environments/environment';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class LoginApiService {

  constructor(private httpClient: HttpClient,
    private data: LoginDataService,
    private config: ConfigService) { }

  BASE_URL = this.config.getEnv() === 'production'
    ? 'https://api.zavvie.com/v1/api'
    : environment.overrideLoginServer
      ? environment.overrideLoginServer 
      : 'https://api-staging.zavvie.com/v1/api';

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    errorMessage = (error.error instanceof ErrorEvent)
      ? `Error: ${error.error.message}`
      : `Error Code: ${error.status}\nMessage: ${error.message}`;

    return throwError(errorMessage);
  }

  handleSignupError(error: HttpErrorResponse) {
    let errorObj:any = {};
    errorObj.problem = '';
    if (error.error instanceof ErrorEvent) {
      errorObj.message = error.message;
      errorObj.problem += 'Unknown error';
    } else {
      errorObj.code = error.status;
      errorObj.message = error.message;
      if (error.error.email) {
        errorObj.problem = error.error.email[0];
      } else if (error.error.first_name) {
        errorObj.problem = error.error.first_name[0];
      } else if (error.error.last_name) {
        errorObj.problem = error.error.last_name[0];
      } else if (error.error.phone) {
        errorObj.problem = error.error.phone[0];
      } else if (error.error.password) {
        errorObj.problem = error.error.password[0];
      } else {
        errorObj.problem = error.error.message || 'Something unexpected happened';
      }
    }
    return throwError(errorObj);
  }

  public sendSignupFormData() {
    const FirstName = this.data.getData('FirstName') || '';
    const LastName = this.data.getData('LastName') || '';
    const PhoneNumber = this.data.getData('PhoneNumber') || '';
    const MLS_ID = this.data.getData('MLS_ID') || '';
    const EmailAddress = this.data.getData('EmailAddress') || '';
    const Password = this.data.getData('Password') || '';

    const postBody = {
      "first_name": FirstName,
      "last_name": LastName,
      "email": EmailAddress,
      "password": Password,
      "phone": PhoneNumber?.replace(/[()\s\-]/g, ''),
      "mls_number": MLS_ID
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'zavvie-api-key': this.data.getData('api_key')
      })
    };

    const url = this.BASE_URL + '/register';
    return this.httpClient.post(url, postBody, httpOptions).pipe(catchError(this.handleSignupError));
  }

  // TODO: CONVERT THIS TO COMPONENT HANDLING
  handleCheckEmailError(error: HttpErrorResponse) {
    let errorObj:any = {};
    errorObj.problem = '';
    if (error.error instanceof ErrorEvent) {
      errorObj.message = error.message;
      errorObj.problem += 'Unknown error';
    } else {
      errorObj.code = error.status;
      errorObj.message = error.message;

      if (error.status === 403) {
        errorObj.problem = 'Invalid API Key';
      }

      if (error.status === 404 && error.error.message === 'No user found') {
        errorObj.problem = 'No problem';
      }

      if (error.status === 404 && error.error.message === 'API Key not found') {
        errorObj.problem = 'Invalid API Key';
      }

      if (error.status === 422) {
        if (error.error.email) {
          errorObj.problem = error.error.email[0];
        } else {
          errorObj.problem = 'Something unexpected happened';
        }
      }
    }
    return throwError(errorObj);
  }

  public async checkEmail(email: string): Promise<Response> {
    const url = this.BASE_URL + '/user-check?' + new URLSearchParams({
      email
    });
    const headers = {
      'Content-Type':  'application/json',
      'zavvie-api-key': this.data.getData('api_key')
    };
    return await fetch(url, {
      method: 'GET',
      headers
    });
  }

  public async login(email: string, password: string): Promise<Response> {
    const url = this.BASE_URL + '/login';
    const headers = {
      'Content-Type':  'application/json',
      'zavvie-api-key': this.data.getData('api_key')
    };
    const postBody = {
      email,
      password
    };
    return await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody)
    });
  }

  public storeJwtToken(jwtToken: string): void {
    localStorage.setItem('jwt-token', jwtToken);
  }

  public getJwtToken(): string | null {
    return localStorage.getItem('jwt-token');
  }

  public removeJwtToken(): void {
    localStorage.removeItem('jwt-token');
  }

  public isJwtTokenLoggedIn(): boolean {
    // If jwtToken doesn't exist, we're not logged in.
    const jwtToken = localStorage.getItem('jwt-token');
    if (!jwtToken) {
      return false;
    }
    // If jwtToken is expired, we're no longer logged in.
    const jwtPayload = jwtToken.split('.')[1];
    const jwtPayloadObj = JSON.parse(atob(jwtPayload));
    // Date.now() is milliseconds, JWT timestamp is seconds. Current time should be less than expiration.
    return (Date.now() / 1000) < jwtPayloadObj.exp;
  }

  public async forgotPassword(email: string): Promise<Response> {
    const url = this.BASE_URL + '/forgot-password';
    const headers = {
      'Content-Type':  'application/json'
    };
    const postBody = {
      email
    };
    return await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody)
    });
  }

  public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<Response> {
    const url = this.BASE_URL + '/change-password';
    const headers = {
      'Content-Type': 'application/json',
      'zavvie-api-key': this.data.getData('api_key')
    };
    const postBody = {
      email,
      old_password: oldPassword,
      new_password: newPassword
    };
    return await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(postBody)
    });
  }

  public async userProfile(bearerToken: string): Promise<Response> {
    const url = this.BASE_URL + '/user-profile';
    const headers = {
      'Content-Type':  'application/json',
      'zavvie-api-key': this.data.getData('api_key'),
      'Authorization': 'Bearer ' + bearerToken
    };
    return await fetch(url, {
      method: 'GET',
      headers
    });
  }

}

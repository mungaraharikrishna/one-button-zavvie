import { OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { throwError, Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ConfigService} from "./config.service";


@Injectable({
  providedIn: 'root'
})
export class AVMService {
 API_SERVER:string = '';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient,
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

  submitMapData(address1:any, address2:any) {
    let params = 'address1=' + encodeURIComponent(address1)
        + '&address2=' + encodeURIComponent(address2);
    this.API_SERVER = this.configService.getServer() + "/wp-json/avm/v2/pp/?" + params;
    return this.httpClient.get(this.API_SERVER , this.httpOptions).pipe(catchError(this.handleError));
  }
}

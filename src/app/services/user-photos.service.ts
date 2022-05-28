import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ConfigService} from "./config.service";

@Injectable({
  providedIn: 'root'
})
export class UserPhotosService {
  REST_API_SERVER:string = '';
  REST_API_REMOVE_SERVER = '';

  constructor(private httpClient: HttpClient,
              private configService: ConfigService) { }

  userPhotos:any = {
    uploaded: []
  }

  addPhoto = (name:string, id:number, size:any, success:any, path:any, reason:any) => {
    this.userPhotos.uploaded[name] = {
      'id': id,
      'size': size,
      'success': success,
      'path': path,
      'reason': reason
    }
  }

  getPhotos = () => this.userPhotos;
  getPhoto = (name:any) => this.userPhotos.uploaded[name];
  photoUploaded = (name:any) => this.userPhotos.uploaded[name] ? this.userPhotos.uploaded[name]['success'] : false;
  getReason = (name:any) => this.userPhotos.uploaded[name] ? this.userPhotos.uploaded[name]['reason'] : 'Not uploaded';
  getThumb = (name:any) => this.userPhotos.uploaded[name] ? this.userPhotos.uploaded[name]['path'] : 'Not uploaded';
  getId = (name:any) => this.userPhotos.uploaded[name] ? this.userPhotos.uploaded[name]['id'] : 'Not uploaded';

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

  public uploadFiles = (files:any, i:any, ppid:any) => {
    let pp_imgs = files;

    // pp_imgs.append('action', 'pp_upload_files');
    pp_imgs.append('post_id', ppid);
    pp_imgs.append('num_uploading', i);
    pp_imgs.append('contentType', false);
    pp_imgs.append('processData', false);

    this.REST_API_SERVER = this.configService.getServer() + "/wp-json/pps/v2/pp_upload_files";
    return this.httpClient.post(this.REST_API_SERVER, pp_imgs).pipe(catchError(this.handleError));
  }

  public deleteFile = (id:any) => {
    this.REST_API_REMOVE_SERVER = this.configService.getServer() + "/wp-json/pps/v2/pp_remove_files?id=" + id;
    return this.httpClient.get(this.REST_API_REMOVE_SERVER).pipe(catchError(this.handleError));
  }

}

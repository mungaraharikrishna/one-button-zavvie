import { Component, OnInit } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { ScrollDownService } from '../../../services/scroll-down.service';
import { UserPhotosService } from '../../../services/user-photos.service';
import { Router } from '@angular/router';
import { NavService } from 'src/app/services/nav.service';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {
  checkmsg = "";
  thankYouMessage = false;
  idVar:any;

  loading:boolean = false;
  showUploaded:boolean = false;
  
  closeCard = () => {
    this.thankYouMessage = !this.thankYouMessage;
    this.checkmsg = "";
  }

  constructor(
    private platformDataService: PlatformDataService,
    public scrollDownService: ScrollDownService,
    public userPhotos: UserPhotosService,
    private nav: NavService) { }

  addPhoto = (name:any, id:any, size:any, success:any, path:any, reason:any) => this.userPhotos.addPhoto(name, id, size, success, path, reason);
  getPhotos = () => this.userPhotos.getPhotos();
  getPhoto = (name:any) => this.userPhotos.getPhoto(name);
  photoUploaded = (name:any) => this.userPhotos.photoUploaded(name);
  getReason = (name:any) => this.userPhotos.getReason(name);
  getThumb = (name:any) => this.userPhotos.getThumb(name);
  getId = (name:any) => this.userPhotos.getId(name);

  nothingToUpload:boolean = true;

  imgTooBigMsg = (name:any) => name + ' file size too big.';
  payloadSizeOk = () => this.mockPayloadSize <= 8500000 ? true : false;
  sizeOk = (size:any) => size <= 5000000 ? true : false;
  pyldTooBigMsg:string = 'Total upload size too big.';

  payloadSize:any = 0;
  mockPayloadSize:any = 0;
  too_big_files:any = [];

  checkFiles = () => {
    let mock_files = [];
    this.too_big_files = [];
    // get files from the file input
    let tmpPayload:any = document.querySelectorAll('.upload-form .files-data');

    for (let u=0; u < tmpPayload.length; u+=1) {
      for (let f=0; f < tmpPayload[u].files.length; f+=1) {
        // add file name and size to mock_files array
        mock_files.push({ 'name': tmpPayload[u].files[f].name, 'size': tmpPayload[u].files[f].size });
        // add file sizes for this upload
        this.mockPayloadSize += tmpPayload[u].files[f].size;
        // make sure this file isn't too big
        // if it is too big, add the filename to too_big_files array
        !this.sizeOk(tmpPayload[u].files[f].size)
          ? this.too_big_files.push(this.imgTooBigMsg(tmpPayload[u].files[f].name))
          : this.nothingToUpload = false;
      }
    }
  }

  buttonUpload = (files:any) => {
    ([...files]).forEach(this.getFileInfo);
    ([...files]).forEach(this.getPayload);
  }

  handleFileDrop = (e:any) => {
    let dt = e.dataTransfer;
    let files = dt.files;
    ([...files]).forEach(this.getFileInfo);
    ([...files]).forEach(this.getPayload);
  }

  handleFileClick = (e:any) => {
    let files = e.target.files;
    ([...files]).forEach(this.getFileInfo);
    ([...files]).forEach(this.getPayload);
  }

  file_info:any = [];
  progress:any = {};
  uploadStatus:any = {};
  numUploading:any = 0;
  totalUploads:any = 0;
  totalDone:any = 0;

  // determine if duplicate upload
  getFileInfo = (file:any) => {
    let inthere = false;
    for (let img of this.file_info) {
      // check if this file name and size match existing files
      if (img.name == file.name && img.size == file.size) {
        // console.log('getFileInfo: img.name', img.name);
        // console.log('getFileInfo: img.size', img.size);
        // console.log('getFileInfo: file.name', file.name);
        // console.log('getFileInfo: file.size', file.size);
        inthere = true; // name and size match, it's in there
      }
    }

    if (!inthere) { // twasn't in there
      this.loading = true;
      this.progress[file.name] = 0;
      this.uploadStatus[file.name] = null;

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        this.file_info.push({ 'name': file.name, 'size': file.size, 'src': reader.result });
      }
      this.payloadSize += file.size;
      this.numUploading += 1;
      this.totalUploads += 1;
    }
    // console.log('this.file_info', this.file_info);
  }

  getPayload = (file_:any) => {
    let inthere = false;
    for (let img of this.file_info) {
      if (img.name == file_.name && img.size == file_.size) {
        // console.log('getPayload: img.name', img.name);
        // console.log('getPayload: img.size', img.size);
        // console.log('getPayload: file.name', file_.name);
        // console.log('getPayload: file.size', file_.size);
        inthere = true;
      }
    }

    if (!inthere) {
      let fd = new FormData();
      fd.append('files[' + 0 + ']', file_);
      this.uploadImages(fd);
    }
  };

  ppid:any = this.platformDataService.getData('ppid');
  // ppid:any = 32001;
  response: any = null;

  uploadImages = (files:any) => {
    this.showUploaded = true;
    this.nothingToUpload = true;
    // this.error = false;
    // console.log('uploading files');
    // console.log('this.numUploading', this.numUploading);

    this.userPhotos.uploadFiles(files, this.numUploading, this.ppid).subscribe((response:any) => {
      this.loading = false;
      this.response = response;
      // console.log('Success: xhr_img.response ', response);
      let resPayloadSize = 0;

      for ( let r = 0; r < response.length; r += 1 ) {
        // console.log('response.length ', response.length);
        resPayloadSize += response[r].size;
        this.progress[response[r].name] = 100;
        this.uploadStatus[response[r].name] = response[r].success == false
          ? 'not-uploaded'
          : 'uploaded';

        this.addPhoto(response[r].name, response[r].id, response[r].size, response[r].success, response[r].path, response[r].reason);
        this.numUploading -= 1;
        if (response[r].success) {
          this.totalDone += 1;
        }
        // console.log('this.numUploading', this.numUploading);
      }
      this.scrollDownService.doScroll(350, false);
    });
  }

  uploadProgress = (progress:any) => progress + '%';

  doneUploading = () => {
    // console.log('done clicked');
    this.platformDataService.changeSuccessMessage('thankYouMessage');
    this.nav.goto.success();
  }

  uploadMore = () => {
    this.showUploaded = false;
    this.idVar = setInterval(() => {
      this.checkForEl();
    }, 400);
  }

  removeImg = (id:any) => {
    // console.log('id', id);
    this.userPhotos.deleteFile(id).subscribe((response:any) => {
      // console.log('remove', response);
    }
  )}

  stopChecking = () => {
    clearInterval(this.idVar);
  }

  // find the drag/drop area
  checkForEl = () => {

    let dropArea = document.getElementById('upload-drop');

    if (dropArea) {
      this.stopChecking();
      // console.log('dropArea', dropArea);
      dropArea.addEventListener('drop', this.handleFileDrop, false);

      let preventDefaults = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
      };

      let highlight = (e:any) => dropArea!.classList.add('drag-highlight');
      let unhighlight = (e:any) => dropArea!.classList.remove('drag-highlight');

      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea!.addEventListener(eventName, preventDefaults, false);
      });

      ['dragenter', 'dragover'].forEach(eventName => {
        dropArea!.addEventListener(eventName, highlight, false);
      });
      
      ['dragleave', 'drop'].forEach(eventName => {
        dropArea!.addEventListener(eventName, unhighlight, false);
      });
    }
  }

  ngOnInit(): void {
    this.platformDataService.currentSuccessMessage.subscribe(currentSuccessMessage => this.checkmsg = currentSuccessMessage);
    // console.log(this.checkmsg);

    let propProWrapper = document.querySelector('.property-profiler');
    propProWrapper!.classList.add('upload');

    this.idVar = setInterval(() => { 
      this.checkForEl();
    }, 400);

  }

}

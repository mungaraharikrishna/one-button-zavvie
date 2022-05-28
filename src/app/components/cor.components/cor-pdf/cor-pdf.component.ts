import { Component } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FieldNameService } from 'src/app/services/field-name.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-cor-pdf',
  templateUrl: './cor-pdf.component.html',
  styleUrls: ['./cor-pdf.component.scss']
})
export class CorPdfComponent {

  constructor(public fns: FieldNameService,
  private pds: PlatformDataService) {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
      (pdfMake as any).fonts = {
        Avenir: {
          normal: 'Avenir-Roman.ttf',
          bold: 'Avenir-Black.ttf'
        }
      }
      this.pds.showPoweredByZavvie.subscribe(newstatus => this.showPoweredByZavvie = newstatus);
    }

  white:string = '#ffffff';
  gray:string = '#666666';
  highlight:string = this.pds.getData('highlight');
  agent:string = this.pds.getCORData('AgentFullName') || 'No agent';
  ppaddress:string = this.pds.getCORData('ppAddress') || 'Address not found';
  noBuyers:boolean = true;
  program_name:any = this.pds.getData('programName');

  logo:any = '';
  aa_logo:any = '';
  first:boolean = true;

  pdfMsg:string = 'Compiling Offer Summary data';
  pdfMsgs:any = [
    'Getting iBuyers',
    'Collating eligibility',
    'Adding eligibility messages',
    'Preparing file',
    'Building',
    'Sending'
  ];

  pdfRequested:boolean = false;

  runPdfLoader = () => {
    let curMsgIndex = -1;
    let changePdfMsg = () => setInterval(() => {
      ++curMsgIndex;
      if (curMsgIndex >= this.pdfMsgs.length) {
        clearInterval(changePdfMsg());
        this.pdfRequested = false;
        curMsgIndex = -1;
        return;
      }
      this.pdfMsg = this.pdfMsgs[curMsgIndex];
    }, 200);
    changePdfMsg();
  }

  docDefinition:any = {};
  showPoweredByZavvie:boolean = false;

  eligible:Array<any> = [];
  ineligible:Array<any> = [];
  aa:any;

  local4200:boolean = window.location.origin == 'http://localhost:4200';

  formatNumber = (num:any) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  pdfClicked = (e:any) => {
    e.preventDefault();
    let corData = this.pds.getCORData('corValues');
    this.pdfRequested = true;
    this.runPdfLoader();
    const labels = this.pds.getData('labels');

    let getBase64Image = (img:any) => {
      if (!img) { return; }
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx!.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    }

    this.logo = getBase64Image(document.querySelector("#hidden"));
    // pdfmake requires these to be different vars lol
    this.aa_logo = getBase64Image(document.querySelector("#hidden"));
    let buyerLogo = (id:any) => {
      let el = document.getElementsByClassName('vbid_' + id)[0];
      return this.local4200 ? this.logo : getBase64Image(el);
    }

    let today:any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    // Document Definitions
    let pageHead = () => {
      return this.first 
        ? {
          style: 'pageHeader_1',
          table: {
            widths: [page_two_margin, 120, 200, 260],
            body: [
              [
                { text: '', rowSpan: 2 },
                this.showPoweredByZavvie
                  ? { image: 'data:image/png;base64,' + this.logo, fit: [140, 48], margin: [0, 15, 0, 0], rowSpan: 2 }
                  : { image: 'data:image/png;base64,' + this.logo, fit: [120, 44], margin: [0, 0, 0, 0], rowSpan: 2 },
                { text: '', rowSpan: 2 },
                this.showPoweredByZavvie
                  ? { text: 'Confirmed Offer Report', margin: [5, 12, 0, 0], fontSize: 16, bold: true }
                  : { text: 'Confirmed Offer Report', margin: [0, 12, 0, 0], fontSize: 16, bold: true, rowSpan: 2 }
              ],
              [
                {},
                {},
                {},
                this.showPoweredByZavvie
                  ? { svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="39" viewBox="0 0 649 135"><defs><clipPath id="clip-Powered_by_zavvie"><rect width="649" height="135"/></clipPath></defs><g id="Powered_by_zavvie" data-name="Powered by zavvie" clip-path="url(#clip-Powered_by_zavvie)"><rect width="649" height="135" fill="#fff"/><text id="Powered_by" data-name="Powered by" transform="translate(13 89)" fill="#525252" font-size="56" font-family="Roboto-Regular, Roboto"><tspan x="0" y="0">Powered by</tspan></text><g id="Final_Shapes" transform="translate(321.6 18.5)"><path id="Path_10" data-name="Path 10" d="M150.5,39.5H131.3a3.3,3.3,0,0,0-2.2.8,2.583,2.583,0,0,0-.9,2.1,2.911,2.911,0,0,0,3.1,2.9h15.1c-3,4.1-6,8.1-8.8,12q-4.2,5.7-8.7,12a3.742,3.742,0,0,0-.8,2.5v1.7a3.233,3.233,0,0,0,3.1,2.9h19.2a2.747,2.747,0,0,0,2.9-2.9,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8H135.1c3.1-4.2,6.1-8.3,8.9-12.1s5.8-7.9,8.8-12.1a3.022,3.022,0,0,0,.5-1.6V42.5a2.973,2.973,0,0,0-.8-2A2.328,2.328,0,0,0,150.5,39.5Z" fill="#386099"/><path id="Path_11" data-name="Path 11" d="M181.5,40.2a10.862,10.862,0,0,0-3.4-.7H164.8a2.865,2.865,0,0,0-2.1.8,2.9,2.9,0,0,0,0,4.2,2.782,2.782,0,0,0,2.1.8h13.3a2.792,2.792,0,0,1,2.2.9,3.093,3.093,0,0,1,.9,2.4,6.445,6.445,0,0,1-.4,2.7c-.2.4-1,.6-1.6.6h-7.6a12.8,12.8,0,0,0-4.8.9,11.794,11.794,0,0,0-4,2.7,11.125,11.125,0,0,0-2.6,3.9,11.933,11.933,0,0,0-.9,4.7,11.172,11.172,0,0,0,1,4.8,11.95,11.95,0,0,0,6.5,6.5,12.8,12.8,0,0,0,4.8.9H175a12.485,12.485,0,0,0,6.4-1.7,2.8,2.8,0,0,0,2.9,1.7,3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1V48.7a8.84,8.84,0,0,0-5.7-8.5Zm-.3,24a5.894,5.894,0,0,1-1.9,4.6,4.831,4.831,0,0,1-2,1.4,6.874,6.874,0,0,1-2.4.5h-3.4a6.963,6.963,0,0,1-2.5-.5,5.579,5.579,0,0,1-2-1.4,5.328,5.328,0,0,1-1.3-2,6.963,6.963,0,0,1-.5-2.5,6.152,6.152,0,0,1,6.3-6.3h8.7a3.553,3.553,0,0,0,1-.2v6.4Z" fill="#386099"/><path id="Path_12" data-name="Path 12" d="M270.5,39.5a2.747,2.747,0,0,0-2.9,2.9v31a2.59,2.59,0,0,0,2.9,2.9,2.633,2.633,0,0,0,2.9-2.9v-31a2.583,2.583,0,0,0-.9-2.1A2.629,2.629,0,0,0,270.5,39.5Z" fill="#386099"/><path id="Path_13" data-name="Path 13" d="M282.2,48.5a15.1,15.1,0,0,0-1.1,5.6v7.6a13.545,13.545,0,0,0,1.2,5.7,14.9,14.9,0,0,0,3.1,4.6,14.358,14.358,0,0,0,4.6,3.1,15.625,15.625,0,0,0,5.7,1.1h7.7a3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8h-7.7a7.973,7.973,0,0,1-3.4-.7,9,9,0,0,1-4.7-4.7,7.973,7.973,0,0,1-.7-3.4V60.4h20.5a2.724,2.724,0,0,0,2.1-.9,2.878,2.878,0,0,0,.9-2.1V54a15.506,15.506,0,0,0-1.1-5.6,16.69,16.69,0,0,0-3.1-4.7,14.2,14.2,0,0,0-10.4-4.3,15.507,15.507,0,0,0-5.6,1.1A15.849,15.849,0,0,0,282.2,48.5Zm22.4,6.3H287v-.6a7.245,7.245,0,0,1,.7-3.3,9.1,9.1,0,0,1,1.9-2.9,8.814,8.814,0,0,1,12.3,0,8.123,8.123,0,0,1,1.9,2.9,9.765,9.765,0,0,1,.7,3.3v.6Z" fill="#386099"/><path id="Path_14" data-name="Path 14" d="M58.4,4.5a53,53,0,1,0,53,53A52.963,52.963,0,0,0,58.4,4.5Zm0,95.9a42.9,42.9,0,1,1,42.9-42.9A42.891,42.891,0,0,1,58.4,100.4Z" fill="#ccd67f"/><path id="Path_15" data-name="Path 15" d="M58.3,24.6A32.9,32.9,0,1,0,91.2,57.5,32.862,32.862,0,0,0,58.3,24.6Zm0,55.7A22.8,22.8,0,1,1,81.1,57.5,22.79,22.79,0,0,1,58.3,80.3Z" fill="#ccd67f"/><path id="Path_16" data-name="Path 16" d="M68.6,51V42.5H64.5V47l-5.4-5a.854.854,0,0,0-1.3,0L44.4,54.7a.867.867,0,0,0-.2,1.3h4.1V69.8a.882.882,0,0,0,.9.8H67.5a.817.817,0,0,0,.9-.8V56h4.1c.4-.4.2-.9-.2-1.3Z" fill="#ccd67f"/><path id="Path_17" data-name="Path 17" d="M220.7,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,220.7,39.8Z" fill="#386099"/><path id="Path_18" data-name="Path 18" d="M257,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,257,39.8Z" fill="#386099"/><circle id="Ellipse_2" data-name="Ellipse 2" cx="3.7" cy="3.7" r="3.7" transform="translate(266.8 29.6)" fill="#386099"/></g></g></svg>', fit: [120, 44], margin: [0, 0, 0, 10]
                } : { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        } : {
          style: 'pageHeader_1',
          pageBreak: 'before',
          table: {
            widths: [page_two_margin, 120, 200, 260],
            body: [
              [
                { text: '', rowSpan: 2 },
                this.showPoweredByZavvie
                  ? { image: 'data:image/png;base64,' + this.logo, fit: [140, 48], margin: [0, 15, 0, 0], rowSpan: 2 }
                  : { image: 'data:image/png;base64,' + this.logo, fit: [120, 44], margin: [0, 0, 0, 0], rowSpan: 2 },
                { text: '', rowSpan: 2 },
                this.showPoweredByZavvie
                  ? { text: 'Confirmed Offer Report', margin: [5, 12, 0, 0], fontSize: 16, bold: true }
                  : { text: 'Confirmed Offer Report', margin: [0, 12, 0, 0], fontSize: 16, bold: true, rowSpan: 2 }
              ],
              [
                {},
                {},
                {},
                this.showPoweredByZavvie
                  ? { svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="39" viewBox="0 0 649 135"><defs><clipPath id="clip-Powered_by_zavvie"><rect width="649" height="135"/></clipPath></defs><g id="Powered_by_zavvie" data-name="Powered by zavvie" clip-path="url(#clip-Powered_by_zavvie)"><rect width="649" height="135" fill="#fff"/><text id="Powered_by" data-name="Powered by" transform="translate(13 89)" fill="#525252" font-size="56" font-family="Roboto-Regular, Roboto"><tspan x="0" y="0">Powered by</tspan></text><g id="Final_Shapes" transform="translate(321.6 18.5)"><path id="Path_10" data-name="Path 10" d="M150.5,39.5H131.3a3.3,3.3,0,0,0-2.2.8,2.583,2.583,0,0,0-.9,2.1,2.911,2.911,0,0,0,3.1,2.9h15.1c-3,4.1-6,8.1-8.8,12q-4.2,5.7-8.7,12a3.742,3.742,0,0,0-.8,2.5v1.7a3.233,3.233,0,0,0,3.1,2.9h19.2a2.747,2.747,0,0,0,2.9-2.9,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8H135.1c3.1-4.2,6.1-8.3,8.9-12.1s5.8-7.9,8.8-12.1a3.022,3.022,0,0,0,.5-1.6V42.5a2.973,2.973,0,0,0-.8-2A2.328,2.328,0,0,0,150.5,39.5Z" fill="#386099"/><path id="Path_11" data-name="Path 11" d="M181.5,40.2a10.862,10.862,0,0,0-3.4-.7H164.8a2.865,2.865,0,0,0-2.1.8,2.9,2.9,0,0,0,0,4.2,2.782,2.782,0,0,0,2.1.8h13.3a2.792,2.792,0,0,1,2.2.9,3.093,3.093,0,0,1,.9,2.4,6.445,6.445,0,0,1-.4,2.7c-.2.4-1,.6-1.6.6h-7.6a12.8,12.8,0,0,0-4.8.9,11.794,11.794,0,0,0-4,2.7,11.125,11.125,0,0,0-2.6,3.9,11.933,11.933,0,0,0-.9,4.7,11.172,11.172,0,0,0,1,4.8,11.95,11.95,0,0,0,6.5,6.5,12.8,12.8,0,0,0,4.8.9H175a12.485,12.485,0,0,0,6.4-1.7,2.8,2.8,0,0,0,2.9,1.7,3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1V48.7a8.84,8.84,0,0,0-5.7-8.5Zm-.3,24a5.894,5.894,0,0,1-1.9,4.6,4.831,4.831,0,0,1-2,1.4,6.874,6.874,0,0,1-2.4.5h-3.4a6.963,6.963,0,0,1-2.5-.5,5.579,5.579,0,0,1-2-1.4,5.328,5.328,0,0,1-1.3-2,6.963,6.963,0,0,1-.5-2.5,6.152,6.152,0,0,1,6.3-6.3h8.7a3.553,3.553,0,0,0,1-.2v6.4Z" fill="#386099"/><path id="Path_12" data-name="Path 12" d="M270.5,39.5a2.747,2.747,0,0,0-2.9,2.9v31a2.59,2.59,0,0,0,2.9,2.9,2.633,2.633,0,0,0,2.9-2.9v-31a2.583,2.583,0,0,0-.9-2.1A2.629,2.629,0,0,0,270.5,39.5Z" fill="#386099"/><path id="Path_13" data-name="Path 13" d="M282.2,48.5a15.1,15.1,0,0,0-1.1,5.6v7.6a13.545,13.545,0,0,0,1.2,5.7,14.9,14.9,0,0,0,3.1,4.6,14.358,14.358,0,0,0,4.6,3.1,15.625,15.625,0,0,0,5.7,1.1h7.7a3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8h-7.7a7.973,7.973,0,0,1-3.4-.7,9,9,0,0,1-4.7-4.7,7.973,7.973,0,0,1-.7-3.4V60.4h20.5a2.724,2.724,0,0,0,2.1-.9,2.878,2.878,0,0,0,.9-2.1V54a15.506,15.506,0,0,0-1.1-5.6,16.69,16.69,0,0,0-3.1-4.7,14.2,14.2,0,0,0-10.4-4.3,15.507,15.507,0,0,0-5.6,1.1A15.849,15.849,0,0,0,282.2,48.5Zm22.4,6.3H287v-.6a7.245,7.245,0,0,1,.7-3.3,9.1,9.1,0,0,1,1.9-2.9,8.814,8.814,0,0,1,12.3,0,8.123,8.123,0,0,1,1.9,2.9,9.765,9.765,0,0,1,.7,3.3v.6Z" fill="#386099"/><path id="Path_14" data-name="Path 14" d="M58.4,4.5a53,53,0,1,0,53,53A52.963,52.963,0,0,0,58.4,4.5Zm0,95.9a42.9,42.9,0,1,1,42.9-42.9A42.891,42.891,0,0,1,58.4,100.4Z" fill="#ccd67f"/><path id="Path_15" data-name="Path 15" d="M58.3,24.6A32.9,32.9,0,1,0,91.2,57.5,32.862,32.862,0,0,0,58.3,24.6Zm0,55.7A22.8,22.8,0,1,1,81.1,57.5,22.79,22.79,0,0,1,58.3,80.3Z" fill="#ccd67f"/><path id="Path_16" data-name="Path 16" d="M68.6,51V42.5H64.5V47l-5.4-5a.854.854,0,0,0-1.3,0L44.4,54.7a.867.867,0,0,0-.2,1.3h4.1V69.8a.882.882,0,0,0,.9.8H67.5a.817.817,0,0,0,.9-.8V56h4.1c.4-.4.2-.9-.2-1.3Z" fill="#ccd67f"/><path id="Path_17" data-name="Path 17" d="M220.7,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,220.7,39.8Z" fill="#386099"/><path id="Path_18" data-name="Path 18" d="M257,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,257,39.8Z" fill="#386099"/><circle id="Ellipse_2" data-name="Ellipse 2" cx="3.7" cy="3.7" r="3.7" transform="translate(266.8 29.6)" fill="#386099"/></g></g></svg>', fit: [120, 44], margin: [0, 0, 0, 10]
                } : { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        }
    };

    const pageHeadColoredLine = {
      style: 'bottomBorder',
      table: {
        heights: [1],
        widths: [700],
        margin: [0, 0, 0, 20],
        body: [
          ['']
        ]
      },
      layout: 'noBorders'
    };

    let pageHeadCopy = () => {
      return {
        table: {
          widths: [20, 390, 190],
          body: [
            [
              { text: '' },
              { text:
                [
                  {
                    style: 'addressValue',
                    text: 'Agent: ' + this.agent, bold: true
                  }
                ],
                margin: [0, 15, 0, 0]
              },
              { text: today, margin: [0, 10, 30, 0], alignment: 'right' },
            ],
            [
              { text: '' },
              { text:
                [
                  {
                    style: 'addressValue',
                    text: 'Property Address: ' + this.ppaddress, bold: true
                  }
                ],
                margin: [0, 4, 0, 10]
              },
              { text: '' }
            ],
            [
              { text: '' },
              {
                style: 'addressHeading',
                marginTop: 10,
                fontSize: 10,
                colSpan: 2,
                text: [
                  {
                    style: 'addressValue',
                    text: 'On behalf of your Seller, the following inquires have been made with the ' + this.program_name + '. The Verified Buyers in your market have responded with the following:'
                  }
                ]
              },
              {}
            ],
            [
              { text: '' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      };
    };

    const pageTwoHeadCopy = () => {
      return {
        color: this.gray,
        table: {
          widths: [20, 390, 190],
          body: [
            [
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: '' },
              { text:
                [
                  {
                    style: 'addressValue',
                    text: 'Agent: ' + this.agent, bold: true
                  }
                ],
                margin: [0, 15, 0, 0]
              },
              { text: today, margin: [0, 10, 30, 0], alignment: 'right' },
            ],
            [
              { text: '' },
              { text:
                [
                  {
                    style: 'addressValue',
                    text: 'Property Address: ' + this.ppaddress, bold: true
                  }
                ],
                margin: [0, 4, 0, 10]
              },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    let showEligible = () => {

      let eligArr = [];
      for (let elig of this.eligible) {
        eligArr.push({
          color: this.gray,
          table: {
            widths: [160, 400],
            body: [
              [
                { image: 'data:image/png;base64,' + buyerLogo(elig), fit: [150, 56], margin: [5, 5, 5, 0], border: [false, false, false, true] },
                { 
                  table: {
                    width: ['*'],
                    heights: '1',
                    body: [
                      [
                        { text: 'Next steps: ', fontSize: '9', bold: true, margin: [1, 10, 0, 0] }
                      ],
                      [
                        elig.offer_link != ''
                          ? { text: 'Link to Preliminary Offer',
                            decoration: 'underline',
                            link: corData[elig].offer_link,
                            fontSize: '9',
                            bold: true,
                            margin: [1, 0, 0, 0] }
                          : { text: '' }
                      ],
                      [
                        { text: 'Contact: ' + corData[elig].contact_info, fontSize: '9', margin: [1, 0, 0, 0] }
                      ]
                    ]
                  },
                  layout: 'noBorders',
                  border: [false, false, false, true]
                },
              ]
            ]
          },
          layout: {
            vLineWidth: function (i:any, node:any) {
              return (i === 0 || i === node.table.widths.length) ? 2 : 1;
            },
            vLineColor: function (i:any, node:any) {
              return '#888888';
            },
            vLineStyle: function (i:any, node:any) {
              if (i === 0 || i === node.table.widths.length) {
                return null;
              }
              return {dash: {length: 4}};
            }
          }
        })
      }
      return eligArr;
    }
    let showIneligible = () => {
      let ineligArr = [];
      for (let elig of this.ineligible) {
        ineligArr.push({
          color: this.gray,
          table: {
            widths: '*',
            body: [
              [
                { text: '• ' + corData[elig].name },
              ]
            ]
          },
          layout: 'noBorders'
        })
      }
      return ineligArr;
    }

    const eligibleTable = () => {
      return [
        {
          color: this.gray,
          table: {
            widths: [20, 560, 20],
            body: [
              [
                { text: '' },
                { text: 'On behalf of your Seller, the following inquiries have been made with the Seller Solutions program. The Verified Buyers in your market have responded with the following:',
                  margin: [0, 10, 0, 10],
                  fontSize: 10
                },
                { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          color: this.gray,
          table: {
            widths: [20, 560, 20],
            body: [
              [
                { text: '' },
                {
                  color: this.gray,
                  heights: 70,
                  table: {
                    width: ['*'],
                    body: [
                      [ showEligible() ]
                    ]
                  },
                  layout: 'noBorders'
                },
                { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          color: this.gray,
          table: {
            widths: [20, 560, 20],
            body: [
              [
                { text: '' },
                { text: [
                    'This address was',
                    { text: ' not eligible ', bold: true },
                    'to be submitted at this time for the following verified buyer(s) due to the home not meeting their current purchasing criteria. (Some examples of this would be age of home, homes conditions, price point, home type, etc.)'
                  ],
                  margin: [0, 30, 0, 10],
                  fontSize: 11
                },
                { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        },
        {
          color: this.gray,
          table: {
            widths: [20, 560, 20],
            body: [
              [
                { text: '' },
                {
                  color: this.gray,
                  heights: 70,
                  table: {
                    width: ['*'],
                    body: [
                      [ showIneligible() ]
                    ]
                  },
                  layout: 'noBorders'
                },
                { text: '' }
              ]
            ]
          },
          layout: 'noBorders'
        }
      ]
    }


    let pageDisclaimer = (last:boolean) => {
      return last
        ? {
          style: 'disclaimerText',
          text: '*Disclaimer text',
          alignment: 'justify',
          absolutePosition: {
            x: 15,
            y: 755
          }
        } : {
          style: 'disclaimerText',
          text: '*Disclaimer text',
          alignment: 'justify',
          pageBreak: 'after',
          absolutePosition: {
            x: 15,
            y: 755
          }
        };
    };

    let om_table_heading = () => {
      return {
        text: 'Open Market Sale',
        fontSize: 18,
        color: this.gray,
        bold: true,
        absolutePosition: {
          x: 65,
          y: 215
        }
      }
    };
    let vb_table_heading = () => {
      return {
        text: 'Verified Buyer Sale',
        fontSize: 18,
        color: this.gray,
        bold: true,
        absolutePosition: {
          x: 345,
          y: 215
        }
      }
    };

    let table_Y = 245;
    let aaDataTable = (one_buyer:boolean) => {
      return {
        style: 'mmTable',
        margins: [0, 0, 5, 0],
        table: {
          widths: [110, 120],
          body: [
            [
              { text: '', margins: [0, 0, 0, 0] },
              { image: 'data:image/png;base64,' + this.aa_logo, fit: [110, 55], alignment: 'center', margins: [0, 0, 0, 0] }
            ],
            [
              { text: labels.aaTerm, style: 'tableHeading' },
              { text: '$' + this.formatNumber(this.aa.open_mkt_price), style: 'tableValue' }
            ],
            [
              { text: 'Service Fee', style: 'tableHeading' },
              { text: this.aa.service_fee_percent + ' - ' + '$' + this.formatNumber(this.aa.service_fee), style: 'tablePercValue' }
            ],
            [
              { text: 'Commissions', style: 'tableHeadingComm' },
              { text: '', style: 'tablePercValue' }
            ],
            [
              { text: 'Seller Agent', style: 'tableSubHeading'},
              { text: this.aa.seller_agent_percent + ' - ' + '$' + this.formatNumber(this.aa.seller_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Buyer Agent', style: 'tableSubHeading'},
              { text: this.aa.buyer_agent_percent + ' - ' + '$' + this.formatNumber(this.aa.buyer_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Prep and Repairs', style: 'tableHeading', marginTop: 10 },
              { text: this.aa.prep_repairs == "" ? 'TBD' : '$' + this.formatNumber(this.aa.prep_repairs), style: 'tableValue', marginTop: 10 }
            ],
            [
              { text: 'Closing Costs', style: 'tableHeading' },
              { text: this.aa.closing_costs == "" ? 'TBD' : '$' + this.formatNumber(this.aa.closing_costs), style: 'tableValue' }
            ],
            [
              { text: 'Cost of Selling', style: 'tableHeading' },
              { text: '$' + this.formatNumber(this.aa.cos),
                style: 'tableValue'
              }
            ],
            [
              { text: 'Net', style: 'tableHeadingFeature', margins: [0, 12, 0, 20] },
              { 
                text: '$' + this.formatNumber(this.aa.net),
                style: 'tableValueFeature',
                margins: [0, 10, 0, 20]
              }
            ],
            [
              { text: 'iBuyer Premium', style: 'tableHeadingHighlight' },
              { text: '$0', style: 'tableValueHighlight' }
            ]
          ]
        },
        layout: 'noBorders',
        absolutePosition: {
          x: 15,
          y: table_Y
        }
      }
    };

    let one_iBuyerTemplate_ioDataTable = (buyer_1:any) => {
      return {
        style: 'imTable',
        margins: [0, 0, 10, 0],
        table: {
          widths: [110, 120],
          body: [
            [
              { text: ''},
              { image: 'data:image/png;base64,' + buyerLogo(buyer_1.id), fit: [110, 55], alignment: 'center', margins: [0, 0, 0, 5] }
            ],
            [
              { text: labels.ioHeading, style: 'tableHeading' },
              { text: '$' + this.formatNumber(buyer_1.cash_funding), style: 'tableValue' }
            ],
            [
              { text: 'Service Fee', style: 'tableHeading' },
              { text: buyer_1.service_fee_percent + ' - ' + '$' + this.formatNumber(buyer_1.service_fee), style: 'tablePercValue' }
            ],
            [
              { text: 'Commissions', style: 'tableHeadingComm' },
              { text: '' }
            ],
            [
              { text: 'Seller Agent', style: 'tableSubHeading' },
              { text: buyer_1.seller_agent_percent + ' - ' + '$' + this.formatNumber(buyer_1.seller_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Buyer Agent', style: 'tableSubHeading' },
              { text: buyer_1.buyer_agent_percent + ' - ' + '$' + this.formatNumber(buyer_1.buyer_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Prep and Repairs', style: 'tableHeading', marginTop: 10 },
              { text: buyer_1.prep_repairs == "" ? 'TBD' : '$' + this.formatNumber(buyer_1.prep_repairs), style: 'tableValue', marginTop: 10 }
            ],
            [
              { text: 'Closing Costs', style: 'tableHeading' },
              { text: buyer_1.closing_costs == "" ? 'TBD' : '$' + this.formatNumber(buyer_1.closing_costs), style: 'tableValue' }
            ],
            [
              { text: 'Cost of Selling', style: 'tableHeading' },
              { text: '$' + this.formatNumber(buyer_1.cos), style: 'tableValue' }
            ],
            [
              { text: 'Estimated Net', style: 'tableHeadingFeature', margins: [0, 12, 0, 20] },
              { 
                text: '$' + this.formatNumber(buyer_1.net),
                style: 'tableValueFeature',
                margins: [0, 10, 0, 20]
              }
            ],
            [
              { text: true ? 'iBuyer Premium' : 'Additional Proceeds', style: 'tableHeadingHighlight' },
              { 
                text: '$' + this.formatNumber(buyer_1.net_diff),
                style: 'tableValueHighlight'
              }
            ]
          ]
        },
        layout: 'noBorders',
        absolutePosition: {
          x: 300,
          y: table_Y
        }
      }
    };

    let two_iBuyerTemplate_ioDataTable = (buyer_1:any, buyer_2:any) => {
      return {
        style: 'imTable',
        margins: [0, 0, 10, 0],
        table: {
          widths: [103, 105, 105],
          body: [
            [
              { text: '' },
              { image: 'data:image/png;base64,' + buyerLogo(buyer_1.id), fit: [100, 45], alignment: 'center', margins: [0, 0, 0, 5] },
              { image: 'data:image/png;base64,' + buyerLogo(buyer_2.id), fit: [100, 45], alignment: 'center', margins: [0, 0, 0, 5] }
            ],
            [
              { text: labels.ioHeading, style: 'tableHeading' },
              { text: '$' + this.formatNumber(buyer_1.cash_funding), style: 'tableValue' },
              { text: '$' + this.formatNumber(buyer_2.cash_funding), style: 'tableValue' }
            ],
            [
              { text: 'Service Fee', style: 'tableHeading' },
              { text: buyer_1.service_fee_percent + ' - ' + '$' + this.formatNumber(buyer_1.service_fee), style: 'tablePercValue' },
              { text: buyer_2.service_fee_percent + ' - ' + '$' + this.formatNumber(buyer_2.service_fee), style: 'tablePercValue' }
            ],
            [
              { text: 'Commissions', style: 'tableHeadingComm' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'Seller Agent', style: 'tableSubHeading' },
              { text: buyer_1.seller_agent_percent + ' - ' + '$' + this.formatNumber(buyer_1.seller_agent), style: 'tablePercValue' },
              { text: buyer_2.seller_agent_percent + ' - ' + '$' + this.formatNumber(buyer_2.seller_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Buyer Agent', style: 'tableSubHeading' },
              { text: buyer_1.buyer_agent_percent + ' - ' + '$' + this.formatNumber(buyer_1.buyer_agent), style: 'tablePercValue' },
              { text: buyer_2.buyer_agent_percent + ' - ' + '$' + this.formatNumber(buyer_2.buyer_agent), style: 'tablePercValue' }
            ],
            [
              { text: 'Prep and Repairs', style: 'tableHeading', marginTop: 10 },
              { text: buyer_1.prep_repairs == "" ? 'TBD' : '$' + this.formatNumber(buyer_1.prep_repairs), style: 'tableValue', marginTop: 10 },
              { text: buyer_2.prep_repairs == "" ? 'TBD' : '$' + this.formatNumber(buyer_2.prep_repairs), style: 'tableValue', marginTop: 10 }
            ],
            [
              { text: 'Closing Costs', style: 'tableHeading' },
              { text: buyer_1.closing_costs == "" ? 'TBD' : '$' + this.formatNumber(buyer_1.closing_costs), style: 'tableValue' },
              { text: buyer_2.closing_costs == "" ? 'TBD' : '$' + this.formatNumber(buyer_2.closing_costs), style: 'tableValue' }
            ],
            [
              { text: 'Cost of Selling', style: 'tableHeading' },
              { text: '$' + this.formatNumber(buyer_1.cos), style: 'tableValue' },
              { text: '$' + this.formatNumber(buyer_2.cos), style: 'tableValue' }
            ],
            [
              { text: 'Estimated Net', style: 'tableHeadingFeature', margins: [0, 12, 0, 20] },
              { 
                text: '$' + this.formatNumber(buyer_1.net),
                style: 'tableValueFeature',
                margins: [0, 10, 0, 20]
              },
              { 
                text: '$' + this.formatNumber(buyer_2.net),
                style: 'tableValueFeature',
                margins: [0, 10, 0, 20]
              }
            ],
            [
              { text: 'iBuyer Premium', style: 'tableHeadingHighlight' },
              { 
                text: '$' + this.formatNumber(buyer_1.net_diff),
                style: 'tableValueHighlight'
              },
              {
                text: '$' + this.formatNumber(buyer_2.net_diff),
                style: 'tableValueHighlight'
              }
            ]
          ]
        },
        layout: 'noBorders',
        absolutePosition: {
          x: 255,
          y: table_Y - 1
        }
      }
    };

    let zero_iBuyerTemplate = () => {
      return [
        pageHead,
        pageHeadColoredLine,
        pageHeadCopy(),
        {
          style: 'parentTable',
          table: {
            widths: [0, 210, 0, 370],
            margins: [10, 0, 10, 0],
            body: [
              [
                {
                  canvas: [
                    {
                      type: 'rect',
                      x: 175,
                      y: 15,
                      w: 215,
                      h: 590,
                      r: 5,
                      lineColor: this.gray
                    },
                  ]
                },
                aaDataTable(true)
              ]
            ]
          },
          layout: 'noBorders'
        },
        pageDisclaimer(true)
      ]
    };

    let one_iBuyerTemplate = (buyer_1:any) => {
      return [
        pageHead(),
        pageHeadColoredLine,
        pageHeadCopy(),
        om_table_heading(),
        vb_table_heading(),
        {
          style: 'parentTable',
          table: {
            widths: [260, 10, 310],
            margins: [0, 0, 0, 0],
            body: [
              [
                aaDataTable(true),
                { text: '' },
                one_iBuyerTemplate_ioDataTable(buyer_1)
              ]
            ]
          },
          layout: 'noBorders'
        },
        pageDisclaimer(true),
        pageTwoTemplate()
      ]
    };
    let two_iBuyerTemplate = (buyer_1:any, buyer_2:any, last:boolean) => {
      return [
        pageHead(),
        pageHeadColoredLine,
        pageHeadCopy(),
        om_table_heading(),
        vb_table_heading(),
        {
          style: 'parentTable',
          table: {
            widths: [250, 5, 400],
            margins: [0, 0, 0, 0],
            body: [
              [
                aaDataTable(false),
                two_iBuyerTemplate_ioDataTable(buyer_1, buyer_2),
              ]
            ]
          },
          layout: 'noBorders'
        },
        pageDisclaimer(true),
        last ? pageTwoTemplate() : { text: '' }
      ]
    };
    
    const pageTwoTemplate = () => {
      return [
        pageTwoHead,
        pageHeadColoredLine,
        pageTwoHeadCopy(),
        eligibleTable(),
        {
          fillColor: this.white,
          color: this.gray,
          table: {
            widths: [page_two_margin, '*'],
            body: [
              [
                { text: '' },
                { text: 'Note: A property returning as ineligible for a Verified Buyer may become eligible in the future depending on that Verified Buyer\'s policies.',
                  fontSize: 7,
                  absolutePosition: {
                    x: 15,
                    y: 755
                  }
                }
              ]
            ]
          },
          layout: 'noBorders'
        }
      ]
    }

    const page_two_margin = 20;

    const pageTwoHead = {
      fillColor: this.white,
      color: this.highlight,
      fontSize: 20,
      pageBreak: 'before',
      table: {
        widths: [page_two_margin, 120, 200, 260],
        body: [
          [
            { text: '', rowSpan: 2 },
            this.showPoweredByZavvie
              ? { image: 'data:image/png;base64,' + this.logo, fit: [140, 48], margin: [0, 15, 0, 0], rowSpan: 2 }
              : { image: 'data:image/png;base64,' + this.logo, fit: [120, 44], margin: [0, 0, 0, 0], rowSpan: 2 },
            { text: '', rowSpan: 2 },
            this.showPoweredByZavvie
              ? { text: 'Confirmed Offer Report', color: this.gray, margin: [5, 12, 0, 0], fontSize: 16, bold: true }
              : { text: 'Confirmed Offer Report', color: this.gray, margin: [0, 12, 0, 0], fontSize: 16, bold: true, rowSpan: 2 }
          ],
          [
            {},
            {},
            {},
            this.showPoweredByZavvie
              ? { svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="200" height="39" viewBox="0 0 649 135"><defs><clipPath id="clip-Powered_by_zavvie"><rect width="649" height="135"/></clipPath></defs><g id="Powered_by_zavvie" data-name="Powered by zavvie" clip-path="url(#clip-Powered_by_zavvie)"><rect width="649" height="135" fill="#fff"/><text id="Powered_by" data-name="Powered by" transform="translate(13 89)" fill="#525252" font-size="56" font-family="Roboto-Regular, Roboto"><tspan x="0" y="0">Powered by</tspan></text><g id="Final_Shapes" transform="translate(321.6 18.5)"><path id="Path_10" data-name="Path 10" d="M150.5,39.5H131.3a3.3,3.3,0,0,0-2.2.8,2.583,2.583,0,0,0-.9,2.1,2.911,2.911,0,0,0,3.1,2.9h15.1c-3,4.1-6,8.1-8.8,12q-4.2,5.7-8.7,12a3.742,3.742,0,0,0-.8,2.5v1.7a3.233,3.233,0,0,0,3.1,2.9h19.2a2.747,2.747,0,0,0,2.9-2.9,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8H135.1c3.1-4.2,6.1-8.3,8.9-12.1s5.8-7.9,8.8-12.1a3.022,3.022,0,0,0,.5-1.6V42.5a2.973,2.973,0,0,0-.8-2A2.328,2.328,0,0,0,150.5,39.5Z" fill="#386099"/><path id="Path_11" data-name="Path 11" d="M181.5,40.2a10.862,10.862,0,0,0-3.4-.7H164.8a2.865,2.865,0,0,0-2.1.8,2.9,2.9,0,0,0,0,4.2,2.782,2.782,0,0,0,2.1.8h13.3a2.792,2.792,0,0,1,2.2.9,3.093,3.093,0,0,1,.9,2.4,6.445,6.445,0,0,1-.4,2.7c-.2.4-1,.6-1.6.6h-7.6a12.8,12.8,0,0,0-4.8.9,11.794,11.794,0,0,0-4,2.7,11.125,11.125,0,0,0-2.6,3.9,11.933,11.933,0,0,0-.9,4.7,11.172,11.172,0,0,0,1,4.8,11.95,11.95,0,0,0,6.5,6.5,12.8,12.8,0,0,0,4.8.9H175a12.485,12.485,0,0,0,6.4-1.7,2.8,2.8,0,0,0,2.9,1.7,3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1V48.7a8.84,8.84,0,0,0-5.7-8.5Zm-.3,24a5.894,5.894,0,0,1-1.9,4.6,4.831,4.831,0,0,1-2,1.4,6.874,6.874,0,0,1-2.4.5h-3.4a6.963,6.963,0,0,1-2.5-.5,5.579,5.579,0,0,1-2-1.4,5.328,5.328,0,0,1-1.3-2,6.963,6.963,0,0,1-.5-2.5,6.152,6.152,0,0,1,6.3-6.3h8.7a3.553,3.553,0,0,0,1-.2v6.4Z" fill="#386099"/><path id="Path_12" data-name="Path 12" d="M270.5,39.5a2.747,2.747,0,0,0-2.9,2.9v31a2.59,2.59,0,0,0,2.9,2.9,2.633,2.633,0,0,0,2.9-2.9v-31a2.583,2.583,0,0,0-.9-2.1A2.629,2.629,0,0,0,270.5,39.5Z" fill="#386099"/><path id="Path_13" data-name="Path 13" d="M282.2,48.5a15.1,15.1,0,0,0-1.1,5.6v7.6a13.545,13.545,0,0,0,1.2,5.7,14.9,14.9,0,0,0,3.1,4.6,14.358,14.358,0,0,0,4.6,3.1,15.625,15.625,0,0,0,5.7,1.1h7.7a3.227,3.227,0,0,0,2.1-.8,2.865,2.865,0,0,0,.8-2.1,3.227,3.227,0,0,0-.8-2.1,2.865,2.865,0,0,0-2.1-.8h-7.7a7.973,7.973,0,0,1-3.4-.7,9,9,0,0,1-4.7-4.7,7.973,7.973,0,0,1-.7-3.4V60.4h20.5a2.724,2.724,0,0,0,2.1-.9,2.878,2.878,0,0,0,.9-2.1V54a15.506,15.506,0,0,0-1.1-5.6,16.69,16.69,0,0,0-3.1-4.7,14.2,14.2,0,0,0-10.4-4.3,15.507,15.507,0,0,0-5.6,1.1A15.849,15.849,0,0,0,282.2,48.5Zm22.4,6.3H287v-.6a7.245,7.245,0,0,1,.7-3.3,9.1,9.1,0,0,1,1.9-2.9,8.814,8.814,0,0,1,12.3,0,8.123,8.123,0,0,1,1.9,2.9,9.765,9.765,0,0,1,.7,3.3v.6Z" fill="#386099"/><path id="Path_14" data-name="Path 14" d="M58.4,4.5a53,53,0,1,0,53,53A52.963,52.963,0,0,0,58.4,4.5Zm0,95.9a42.9,42.9,0,1,1,42.9-42.9A42.891,42.891,0,0,1,58.4,100.4Z" fill="#ccd67f"/><path id="Path_15" data-name="Path 15" d="M58.3,24.6A32.9,32.9,0,1,0,91.2,57.5,32.862,32.862,0,0,0,58.3,24.6Zm0,55.7A22.8,22.8,0,1,1,81.1,57.5,22.79,22.79,0,0,1,58.3,80.3Z" fill="#ccd67f"/><path id="Path_16" data-name="Path 16" d="M68.6,51V42.5H64.5V47l-5.4-5a.854.854,0,0,0-1.3,0L44.4,54.7a.867.867,0,0,0-.2,1.3h4.1V69.8a.882.882,0,0,0,.9.8H67.5a.817.817,0,0,0,.9-.8V56h4.1c.4-.4.2-.9-.2-1.3Z" fill="#ccd67f"/><path id="Path_17" data-name="Path 17" d="M220.7,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,220.7,39.8Z" fill="#386099"/><path id="Path_18" data-name="Path 18" d="M257,39.8a2.937,2.937,0,0,0-2.7,1.8v.1c-.9,2.4-1.7,4.7-2.5,6.9s-1.5,4.3-2.3,6.4-1.5,4.2-2.3,6.4-1.6,4.5-2.5,6.9c-.9-2.4-1.7-4.8-2.5-6.9-.8-2.2-1.5-4.3-2.3-6.4s-1.5-4.2-2.3-6.4c-.8-2.1-1.6-4.4-2.5-6.9v-.1a2.745,2.745,0,0,0-2.7-1.8,2.9,2.9,0,0,0-2.9,2.9,3.553,3.553,0,0,0,.2,1l11.1,30.7a2.637,2.637,0,0,0,2.8,1.9h2.1a2.637,2.637,0,0,0,2.8-1.9l11.1-30.7a3.553,3.553,0,0,0,.2-1A2.758,2.758,0,0,0,257,39.8Z" fill="#386099"/><circle id="Ellipse_2" data-name="Ellipse 2" cx="3.7" cy="3.7" r="3.7" transform="translate(266.8 29.6)" fill="#386099"/></g></g></svg>', fit: [120, 44], margin: [0, 0, 0, 10]
            } : { text: '' }
          ]
        ]
      },
      layout: 'noBorders'
    }

    let showOfferComparisons = () => {
      this.eligible = [];
      this.ineligible = [];
      // console.log('corData:', corData);
      for (let buyer in corData) {
        if (buyer == 'aa') {
          this.aa = corData[buyer];
        } else if (buyer != 'aa' && buyer != 'trash' && corData[buyer].offer_status == "Received Offer") {
          this.eligible.push(buyer);
          corData[buyer].id = buyer;
        } else if (buyer != 'aa' && buyer != 'trash' && corData[buyer].offer_status == "Declined") {
          this.ineligible.push(buyer);
          corData[buyer].id = buyer;
        }
      }
      // console.log('this.eligible', this.eligible.length, this.eligible);
      let template = [];
      let index = 1;
      let prevBuyer:any;
      let isOdd = (num:number) => num % 2;
      let isLast = (i:number) => this.eligible.length - i == 0;
      for (let buyer of this.eligible) {
        // console.log('buyer', buyer);
        // console.log(this.eligible.length, index, isLast(index));
        if (isOdd(index)) {
          if (isLast(index)) { // no more buyers after this one
            template.push(one_iBuyerTemplate(corData[buyer]));
            this.first = false;
          } else { // at least one more buyer after this one
            prevBuyer = buyer;
          }
        } else { // even number buyer
          template.push(two_iBuyerTemplate(corData[prevBuyer], corData[buyer], isLast(index)));
          this.first = false;
        }
        index++;
      }
      return template;
    }
 
    this.docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'portrait',
      pageMargins: [ 0, 0, 0, 0 ],
      content:
      // where the magic happens
      showOfferComparisons(),
      defaultStyle: {
        font: 'Avenir',
        color: this.gray
      },
      styles: {
        disclaimerText: {
          fontSize: 6
        },
        na: {
          opacity: .4
        },
        naNotification: {
          opacity: 1,
          bold: true
        },
        aaTab: {
          color: this.white,
          fillColor: this.gray
        },
        empty: {
          color: this.gray,
          fontSize: 10,
          bold: true,
          alignment: 'center'
        },
        emptyValueHighlight: {
          bold: true,
          color: this.highlight,
          fillColor: this.gray,
          fontSize: 14,
          alignment: 'center',
          margins: [0, 12, 0, 8]
        },
        pageHeader_1: {
          fillColor: this.white,
          color: this.gray,
          fontSize: 10
        },
        addressHeading: {
          margins: [0, 10, 0, 2]
        },
        addressValue: {
          bold: false
        },
        bottomBorder: {
          fillColor: this.highlight
        },
        tableHeading: {
          alignment: 'right',
          bold: true,
          color: this.gray,
          fontSize: 11,
          marginBottom: 10
        },
        tableHeadingComm: {
          alignment: 'right',
          bold: true,
          color: this.gray,
          fontSize: 11,
          marginBottom: 0
        },
        tableSubHeading: {
          alignment: 'right',
          color: this.gray,
          fontSize: 9,
          marginBottom: 2
        },
        tableValue: {
          bold: true,
          color: this.gray,
          fontSize: 10,
          alignment: 'center',
          marginBottom: 10
        },
        tableSubValue: {
          bold: false,
          color: this.gray,
          fontSize: 9,
          alignment: 'center',
          marginBottom: 4
        },
        tablePercValue: {
          bold: false,
          color: this.gray,
          fontSize: 9,
          alignment: 'center',
          marginBottom: 4
        },
        tableHeadingHighlight: {
          bold: true,
          fillColor: this.highlight,
          color: this.white,
          fontSize: 10,
          alignment: 'right',
          margins: [0, 12, 0, 12]
        },
        tableValueHighlight: {
          bold: true,
          fillColor: this.highlight,
          color: this.white,
          height: 20,
          fontSize: 14,
          alignment: 'center',
          margins: [0, 12, 0, 8]
        },
        naTableHeadingHighlight: {
          bold: true,
          fillColor: '#a0a0a0',
          color: this.white,
          height: 20,
          fontSize: 9,
          alignment: 'right',
          margins: [0, 8, 0, 8],
          opacity: .4
        },
        naTableValueHighlight: {
          bold: true,
          fillColor: '#a0a0a0',
          color: this.white,
          fontSize: 14,
          alignment: 'center',
          margins: [0, 12, 0, 8],
          opacity: .4
        },
        tableValueFeature: {
          alignment: 'center',
          bold: true,
          color: this.gray,
          fontSize: 14,
          marginBottom: 10
        },
        tableHeadingFeature: {
          alignment: 'right',
          bold: true,
          color: this.gray,
          fontSize: 10
        },
        tableHeadingBottom: {
          alignment: 'right',
          bold: false,
          color: this.gray,
          fontSize: 8,
          light: true,
          marginBottom: 5
        },
        spacerStyle: {
          alignment: 'center',
          fillColor: this.highlight,
          border: [false, true, false, false]
        }
      }
    };

    let event = new Date();
    let filename = 'Confirmed Offer Report: ' + labels.ioHeading + ' ' + event.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    console.log('making PDF:', filename);
    pdfMake.createPdf(this.docDefinition).download(filename);
    this.first = true;
  }

}

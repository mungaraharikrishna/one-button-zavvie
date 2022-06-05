import { Component, Input } from '@angular/core';
import { PlatformDataService } from '../../../services/platform-data.service';
import { FieldNameService } from 'src/app/services/field-name.service';
import { FormBuilder } from '@angular/forms';
import { ResultBuyerComponent } from '../../../components/oo.components/result-buyer/result-buyer.component';
import { ResultSellerComponent } from '../../../components/oo.components/result-seller/result-seller.component';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { AUTO_STYLE } from '@angular/animations';

@Component({
  providers: [ResultBuyerComponent, ResultSellerComponent],
  selector: 'app-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss']
})
export class PdfComponent {

  constructor(
    public fns: FieldNameService,
    private platformDataService: PlatformDataService,
    private buyer: ResultBuyerComponent,
    private seller: ResultSellerComponent,
    private fb: FormBuilder) {
      (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
      (pdfMake as any).fonts = {
        Avenir: {
          normal: 'Avenir-Roman.ttf',
          bold: 'Avenir-Black.ttf'
        }
      }

      this.platformDataService.currentShowCashBuyerStatus.subscribe(newstatus => this.showCashBuyer = newstatus);
      this.platformDataService.currentShowLeaseBuyerStatus.subscribe(newstatus => this.showLeaseBuyer = newstatus);
      this.platformDataService.currentBuyerStatus.subscribe(newstatus => this.isBuyer = newstatus);
      this.platformDataService.currentSellerStatus.subscribe(newstatus => this.isSeller = newstatus);
      this.platformDataService.currentOpenMarketWarrantyStatus.subscribe(newstatus => this.warranty_om = newstatus);
      this.platformDataService.currentCashWarrantyStatus.subscribe(newstatus => this.warranty_cash = newstatus);
      this.platformDataService.currentBuyerVisitedStatus.subscribe(newstatus => this.buyerVisited = newstatus);

      // retrieve input cookies and prepopulate the form
      let cookieDataAgentFirstName = this.getCookie('AgentFirstName');
      let cookieDataAgentLastName = this.getCookie('AgentLastName');

      if( cookieDataAgentFirstName || cookieDataAgentLastName ) {

        if (cookieDataAgentFirstName) {
          this.platformDataService.addUserData(this.fns.FieldNames.generalInfo.AgentFirstName, cookieDataAgentFirstName);
          this.agentFirstNameDefault = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentFirstName);
        }
        if (cookieDataAgentLastName) {
          this.platformDataService.addUserData(this.fns.FieldNames.generalInfo.AgentLastName, cookieDataAgentLastName);
          this.agentLastNameDefault = this.platformDataService.getUserData(this.fns.FieldNames.generalInfo.AgentLastName);
        }

        this.pdfAgentName.patchValue({
          'AgentFirstName': this.agentFirstNameDefault,
          'AgentLastName': this.agentLastNameDefault
        });
      }
    }

  @Input() configured:any;
  @Input() showoo:any;

  buyerVisited:boolean = false;
  showCashBuyer:boolean = false;
  showLeaseBuyer:boolean = false;

  showHomeWarranty:boolean = false;
  warranty_om:boolean = false;
  warranty_cash:boolean = false;

  isBuyer:boolean = false;
  isSeller:boolean = false;

  platformType:string = '';

  homeCondition:any;
  values: any;
  buyervalues: any;

  pdfRequested:boolean = false;
  buttonClicked:boolean = false;
  modalOpen:boolean = false;

  white:string = '#ffffff';
  gray:string = '#666666';
  highlight:string = '#f9f9f9';

  logo:any = '';
  agent_logo:any = '';

  openMktImg:any;
  ioMktImg:any;
  aa_img:any;
  io_img:any;

  mortgage_img:any;
  concierge_img:any;
  home_warranty_img_1:any;
  home_warranty_img_2:any;

  info_items_aa:string = '';
  info_items_bridge:string = '';
  info_items_standard:string = '';
  info_items_asis:string = '';

  info_items_open_market:string = '';
  info_items_cash:string = '';
  info_items_lease:string = '';

  best_fit_aa:string = '';
  best_fit_bridge:string = '';
  best_fit_standard:string = '';
  best_fit_asis:string = '';

  best_fit_open_market:string = '';
  best_fit_cash:string = '';
  best_fit_lease:string = '';

  asIsSituation = () => this.homeCondition.id == 3;
  formatNumber = (num:any) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

  docDefinition:any = {};

  pdfAgentName = this.fb.group({
    'AgentFirstName': [],
    'AgentLastName': []
  });

  agentFirstNameDefault:any;
  agentFirstNameQuestionConfig = {
    inputlabel: "Agent first name",
    controlname: "AgentFirstName",
    placeholder: "First name",
    required: "true"
  }

  agentLastNameDefault:any;
  agentLastNameQuestionConfig = {
    inputlabel: "Last name",
    controlname: "AgentLastName",
    placeholder: "Last name",
    required: "true"
  }

  formValueChanged = (name:string, e:any) => {
    this.platformDataService.addUserData(name, e);
    name == 'AgentFirstName' && this.setCookie(name, e, 1);
    name == 'AgentLastName' && this.setCookie(name, e, 1);
  }

  setCookie = (name:any, value:any, days:any) => {
    let expires = '';
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/';
  }

  getCookie = (name:any) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match
      ? match[2]
      : '';
  };

  pdfMsg:string = 'Compiling iBuyer data';
  pdfMsgs:any = [
    'Getting location',
    'Factoring home condition',
    'Estimating home value',
    'Preparing file',
    'Building',
    'Sending'
  ];

  confirmAgentName = (e:any) => {
    e.preventDefault();
    this.buttonClicked = true;
    this.modalOpen = true;
  }

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

  sp_affinity:string = '';
  sp_affinity_type:string = '';
  sp_affinity_name:string = '';
  sp_affinity_logo:any = '';
  sp_affinity_description:string = '';
  sp_affinity_features:any = '';
  sp_features_1:Array<any> = [];
  sp_features_2:Array<any> = [];

  printPdf = (e:any) => {

    e.preventDefault();

    this.buttonClicked = false;
    this.pdfRequested = true;
    this.modalOpen = false;
    this.runPdfLoader();
    this.highlight = this.platformDataService.getData('highlight');
    let extraImagesExist:boolean = this.platformDataService.getData('aa_program_img_src') != null ? true : false;
    let showMortgageImg:boolean = this.platformDataService.getData('showMortgageLogo') || false;
    let showConciergeImg:boolean = this.platformDataService.getData('showConciergeImage') || false;
    this.showHomeWarranty = this.platformDataService.getData('showHomeWarranty') || false;
    let showHomeWarrantyImg_1:boolean = this.platformDataService.getData('showHomeWarrantyImage') || false;
    let showHomeWarrantyImg_2:boolean = this.platformDataService.getData('showHomeWarrantyImage_two') || false;

    if (this.isBuyer && !this.buyerVisited) {
      // if user is Buyer+Seller and hasn't viewed Buyer Solutions
      // then result-buyer comp hasn't initialized, so no Buyer values yet...
      // this func sets all the Buyer values in that case
      this.buyer.runBuyer();
    }

    // Solution Provider Affinity
    this.sp_affinity = this.platformDataService.getData('sp_affinity');
    if (this.sp_affinity === "1") {
      this.sp_affinity_type = this.platformDataService.getData('sp_affinity_type');
      this.sp_affinity_name = this.platformDataService.getData('sp_affinity_name');
      this.sp_affinity_logo = this.platformDataService.getData('sp_affinity_logo');
      this.sp_affinity_description = this.platformDataService.getData('sp_affinity_description');
      this.sp_affinity_description = this.sp_affinity_description.replace('<p>', '').replace('</p>', '');
      const sp_affinity_features = this.platformDataService.getData('sp_affinity_features');
      if (this.platformDataService.hasJsonStructure(sp_affinity_features)) {
        let parsed_features = JSON.parse(sp_affinity_features);
        let sp_index:number = 0;
        for (let feature of parsed_features) {
          if (sp_index < 3) {
            this.sp_features_1.push(feature.feature_item)
          } else if (sp_index < 6) {
            this.sp_features_2.push(feature.feature_item);
          }
          sp_index++;
        }
      }
    }

    let buyersolutions = this.platformDataService.getMarketData('buyersolutions');
    this.buyervalues = this.platformDataService.getHomeValueData('buyervalues');

    this.homeCondition = this.platformDataService.getHomeValueData('homeCondition');

    let market = this.platformDataService.getHomeValueData('market');
    this.values = this.platformDataService.getMarketData('values');

    let aa = this.platformDataService.getHomeValueData('aa');

    this.info_items_aa = this.platformDataService.getMarketData('info_items_aa');
    this.info_items_bridge = this.platformDataService.getMarketData('info_items_bridge');
    this.info_items_standard = this.platformDataService.getMarketData('info_items_standard');
    this.info_items_asis = this.platformDataService.getMarketData('info_items_asis');

    this.best_fit_aa = this.platformDataService.getMarketData('best_fit_aa');
    this.best_fit_bridge = this.platformDataService.getMarketData('best_fit_bridge');
    this.best_fit_standard = this.platformDataService.getMarketData('best_fit_standard');
    this.best_fit_asis = this.platformDataService.getMarketData('best_fit_asis');
    this.best_fit_open_market = this.platformDataService.getMarketData('best_fit_open_market');
    this.best_fit_cash = this.platformDataService.getMarketData('best_fit_cash_offer');
    this.best_fit_lease = this.platformDataService.getMarketData('best_fit_lease');


    let buyer_aa:any = {};
    let filtered = [];
    let numFiltered = 0;
    let iBuyersToShow: any[] = [];
    let buyersToShow: any[] = [];
    let bridge;
    let io;
    let asis;
    let extra;

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
    
    // this will always be the partner/PDF header logo
    // set by config.component
    this.logo = getBase64Image(document.querySelector("#hidden"));
    this.platformType = this.platformDataService.getData('platformType');

    if (this.platformType == 'zpro') {
      this.agent_logo = getBase64Image(document.querySelector("#hidden_agent"));
    }

    let percentValueHighLow = (val:any, val2:any) => {
      return (val !== 'NA' && val !== 'N/A')
        ? val + '% - ' + val2 + '%'
        : 'N/A';
    }

    let dollarValue = (sf:any) => {
      return (sf !== 'NA' && sf !== 'N/A')
        ? '$' + this.formatNumber(sf)
        : '$0';
    }

    let percentValue = (val:any) => {
      let realVal = (val === '' || val === null) ? 0 : val;
      return (realVal !== 'NA' && realVal !== 'N/A')
        ? realVal + '%'
        : this.formatNumber(realVal);
    }
  
    if (this.isBuyer) {
      if (buyersolutions) {
        for (let buyer of buyersolutions) {
          if (buyer.con_buyer_type == 'aa') {
            buyer_aa = buyer;
          } else {
            buyersToShow.push(buyer);
          }
        }
        console.log(buyersToShow);
      }
    }

    if (this.isSeller) {
      // need to determine how many ibuyers there are
      // and how many/which ones are filtered (don't display)
      // loop through all the iBuyers in the market
      if (market.con_offers) {
        for (let [index, ibuyer] of market.con_offers.entries()) {
          if (this.asIsSituation()) {
            (ibuyer.con_io_type == 'standard')
              ? (filtered.push(ibuyer), numFiltered += 1) // filter out if standard ibuyer
              : (filtered.push('iBuyer ' + index + ' not filtered.'), iBuyersToShow.push(ibuyer));
          } else {
            // No Major Reno iBuyers
            (ibuyer.con_io_type == 'asis')
              ? (filtered.push(ibuyer), numFiltered += 1) // filter out if asis ibuyer
              : (filtered.push('iBuyer ' + index + ' not filtered.'), iBuyersToShow.push(ibuyer));
          }
        }
      }

    } // if isSeller

    if (this.sp_affinity === "1") {
      this.sp_affinity_logo = getBase64Image(document.querySelector("#hidden_sp_affinity_img"));
    }

    if (extraImagesExist) {
      this.aa_img = getBase64Image(document.querySelector("#open_mkt_img"));
      this.io_img = getBase64Image(document.querySelector("#io_mkt_img"));
    }

    if (showMortgageImg) {
      this.mortgage_img = getBase64Image(document.querySelector("#mortgage_img"));
    }
  
    if (showConciergeImg) {
      this.concierge_img = getBase64Image(document.querySelector("#hidden_concierge"));;
    }

    if (showHomeWarrantyImg_1) {
      this.home_warranty_img_1 = getBase64Image(document.querySelector("#hidden_home_warranty_1"));;
    }

    if (showHomeWarrantyImg_2) {
      this.home_warranty_img_2 = getBase64Image(document.querySelector("#hidden_home_warranty_2"));;
    }

    // Document Definitions
    const page_margin = 30;

    // Seller defs
    const price_column_width = 220;
    const cost_column_width = 270;
    const net_column_width = 200;
    const cost_of_selling_widths = [95, 55, 15, 100];
    const estimated_price_widths = [120, 100];
    const estimated_price_table_widths = [70, 25, 70, 20];

    const labels = this.platformDataService.getData('labels');

    let fname = this.platformDataService.getUserData('AgentFirstName') ? this.platformDataService.getUserData('AgentFirstName') : this.agentFirstNameDefault;
    let lname = this.platformDataService.getUserData('AgentLastName') ? this.platformDataService.getUserData('AgentLastName') : this.agentLastNameDefault;
    const pageHead = {
      fillColor: this.white,
      color: this.gray,
      fontSize: 10,
      table: {
        widths: [page_margin, 120, 120, 300, 230],
        body: [
          [
            { text: '' },
            { image: 'data:image/png;base64,' + this.logo, fit: [200, 44], margins: this.platformDataService.getData('partnerName') == 'bhhsdrysdale' ? [0, 15, 0, 15] : [0, 0, 0, 0] },
            { text: '' },
            { text: '' },
            { text: 'Prepared by: ' + fname + ' ' + lname, margins: [0, 12, 0, 0]}
          ]
        ]
      },
      layout: 'noBorders'
    }

    const pageHeadColoredLine = {
      fillColor: this.highlight,
      table: {
        heights: [1],
        widths: [800],
        body: [
          ['']
        ]
      },
      layout: 'noBorders'
    }

    const ioRowMargin = (tm:any) => {
      return {
        columns: [
          {
            width: page_margin,
            text: '',
            margin: [0, tm, 0, 0]
          },
          {
            width: 710,
            text: '',
            margin: [0, tm, 0, 0]
          },
          {
            width: page_margin,
            text: '',
            margin: [0, tm, 0, 0]
          },
        ],
        columnGap: 0
      }
    }

    const ioLine = (width:any, color:string) => {
      return {
        table: {
          widths: [27, 710, 33],
          body: [
            [
              { text: '' },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 710, y2: 0,
                    lineWidth: width,
                    lineColor: color
                  }
                ]
              },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    const ioRowHeading = (heading:string, color:string, om:boolean) => {
      let suffix = om ? 'Sale' : '';

      return {
        columns: [
          {
            width: page_margin,
            text: ''
          },
          {
            width: 710,
            text: heading + ' ' + suffix,
            color: color,
            bold: true,
            marginLeft: 5
          },
          {
            width: page_margin,
            text: ''
          },
        ],
        columnGap: 0
      }
    }

    let infoItem = (item:string, symbol:string) => {
      let sym = symbol == 'dot'
        ? '• '
        : symbol == 'dash'
          ? '- '
          : '';

      return {
        table: {
          width: buyer_price_width,
          body: [
            [
              { text: sym + item, margin: [0, 1, 0, 0], alignment: 'left', style: 'tableSubHeading', fontSize: 7 }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    let spDescription = () => {
      return {
        table: {
          width: buyer_price_width,
          body: [
            [
              { text: this.sp_affinity_description, margin: [0, 1, 0, 0], alignment: 'left', style: 'tableSubHeading' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }
  
    let infoItems = (con_items:any) => {
      let items = [];
      for (let item of con_items) {
        items.push(infoItem(item, 'dash'));
      }
      return items;
    }

    let sellerInfoItems = (buyer:any) => {
      let items = [];
      let info_items = buyer.con_io_type == 'aa'
        ? this.info_items_aa
        : buyer.con_io_type == 'bridge'
          ? this.info_items_bridge
          : buyer.con_io_type == 'asis'
            ? this.info_items_asis
            : this.info_items_standard;
  
      for (let item of info_items) {
        items.push(infoItem(item, 'dot'));
      }
      return items;
    }

    let buyerInfoItems = (buyer:any) => {
      let items = [];
      for (let item of buyer.con_info_items) {
        items.push(infoItem(item, 'dot'));
      }
      return items;
    }

    let bestFitTextBuyer = (buyer:any) => {
      let text = '';
      if (buyer.con_buyer_type == 'aa') {
        text = this.best_fit_open_market;
      }
      if (buyer.con_buyer_type == 'cash') {
        text = this.best_fit_cash;
      }
      if (buyer.con_buyer_type == 'lease_to_own') {
        text = this.best_fit_lease;
      }
      return text;
    }

    let bestFitTextSeller = (buyer_type:any) => {
      let text = '';
      if (buyer_type == 'aa') {
        text = this.best_fit_aa;
      }
      if (buyer_type == 'bridge') {
        text = this.best_fit_bridge;
      }
      if (buyer_type == 'standard') {
        text = this.best_fit_standard;
      }
      if (buyer_type == 'asis') {
        text = this.best_fit_asis;
      }
      return text;
    }
  
    // Buyer
    const buyerPageHeadCopy = () => {
      return {
        table: {
          widths: [30, '*'],
          body: [
            [
              { text: '' },
              { text: '' }
            ],
            [
              { text: '' },
              {
                margin: [0, 10, 0, 2],
                text: [
                  'Buying Options Report: ',
                  {
                    bold: true,
                    text: ''
                  }
                ] 
              }
            ],
            [
              { text: '' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      };
    }

    // Buyer defs
    const buyer_price_column_width = 175;
    const buyer_cost_column_width = 175;
    const buyer_monthly_column_width = 175;
    const buyer_extra_column_width = 175;
    const buyer_price_width = 175;
    const cost_of_buying_widths = [10, 60, 55, 10 ];
    const monthly_costs_widths = [10, 40, 5, 50, 10 ];

    // Buyer
    let buyer_template_aaDataTable_headings = () => {
      return {
        table: {
          widths: [page_margin, buyer_price_column_width, buyer_cost_column_width, buyer_monthly_column_width, buyer_extra_column_width, page_margin],
          body: [
            [
              { text: '' },
              { text: 'Home Purchase Value', style: 'tableHeading' },
              { text: 'Cost of Home Purchase', style: 'tableHeading' },
              { text: 'Monthly Costs', style: 'tableHeading' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: '' },
              { text: '$' + this.formatNumber(this.buyervalues.aa.buyer_low_price) + ' - $' + this.formatNumber(this.buyervalues.aa.buyer_high_price), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.buyervalues.aa.costs_low) + ' - $' + this.formatNumber(this.buyervalues.aa.costs_high), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.buyervalues.aa.monthly_costs_low) + ' - $' + this.formatNumber(this.buyervalues.aa.monthly_costs_high), style: 'tableValue' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    // Buyer
    let buyer_template_aaDataTable_tables = (buyer:any) => {
      return {
        table: {
          widths: [page_margin, buyer_price_column_width, buyer_cost_column_width, buyer_monthly_column_width, buyer_extra_column_width, page_margin],
          body: [
            [
              { text: '' },
              { 
                table: {
                  width: buyer_price_width,
                  body: [
                    [
                      buyerInfoItems(buyer)
                    ],
                    [
                      {
                        table: {
                          widths: [50, '*'],
                          body: [
                            [
                              { text: 'Best Fit For:', margin: 0, bold: true, style: 'tableSubHeading', alignment: 'right', color: this.gray },
                              { text: bestFitTextBuyer(buyer), margin: 0, style: 'tableSubHeading', alignment: 'left', color: this.gray }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      },
                    ],
                    [
                      {
                        table: {
                          width: buyer_price_width,
                          body: [
                            [
                              { text: 'Eligibility: what you need to qualify', margin: 0, bold: true, style: 'tableSubHeading', alignment: 'center', color: this.gray },
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ],
                    [
                      infoItems(buyer.con_eligibility)
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: cost_of_buying_widths,
                  body: [
                    [
                      { text: '' },
                      { text: 'Down Payment', style: 'buyerTableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                    ],
                    [
                      { text: '' },
                      { text: percentValue(this.buyervalues.aa.down_payment_low_percent), style: 'buyerTableValue' },
                      { text: percentValue(this.buyervalues.aa.down_payment_high_percent), style: 'buyerTableValue' },
                      { text: '' }
                    ],
                    [
                      { text: '' },
                      { text: dollarValue(this.buyervalues.aa.down_payment_low), style: 'buyerTableValue' },
                      { text: dollarValue(this.buyervalues.aa.down_payment_high), style: 'buyerTableValue' },
                      { text: '' }
                    ],
                    [
                      { text: '' },
                      { text: 'Closing Costs', style: 'buyerTableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                    ],
                    [
                      { text: '' },
                      { colSpan: 2, text: dollarValue(this.buyervalues.aa.buyer_low_closing_costs) + ' - ' + dollarValue(this.buyervalues.aa.buyer_high_closing_costs), style: 'buyerTableValue' },
                      {},
                      { text: '' }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  width: 175,
                  body: [
                    [
                      { text: 'Mortgage (Principal & Interest)', style: 'buyerTableSubHeading', bold: true, alignment: 'center' }
                    ],
                    [
                      { text: dollarValue(this.buyervalues.aa.mortgage_low) + ' - ' + dollarValue(this.buyervalues.aa.mortgage_high), style: 'buyerTableValue', alignment: 'center' }
                    ],
                    [
                      {
                        table: {
                          widths: monthly_costs_widths,
                          body: [
                            [
                              { colSpan: 2, text: 'Taxes', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues.aa.taxes_low) + ' - ' + dollarValue(this.buyervalues.aa.taxes_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Insurance', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues.aa.ins_low) + ' - ' + dollarValue(this.buyervalues.aa.ins_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Utilities', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues.aa.utils_low) + ' - ' + dollarValue(this.buyervalues.aa.utils_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Maintenance', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues.aa.maintenance_low) + ' - ' + dollarValue(this.buyervalues.aa.maintenance_high), style: 'buyerTableValue' },
                              {}
                            ],
                            this.showHomeWarranty
                            ? [
                              { svg: svg_warranty_om, fit: [8, 8], alignment: 'right' },
                              { text: 'Home Warranty', style: 'buyerTableSubHeading', bold: true },
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues.aa.warranty_low) + ' - ' + dollarValue(this.buyervalues.aa.warranty_high), style: 'buyerTableValue' },
                              {}
                            ] : [
                              { text: '' },
                              { text: '' },
                              { text: '' },
                              { text: '' },
                              { text: '' }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: '*',
                  body: [
                    [
                      extraImagesExist ? { image: 'data:image/png;base64,' + this.aa_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                    ],
                    [
                      this.showHomeWarranty && showHomeWarrantyImg_1 ? { image: 'data:image/png;base64,' + this.home_warranty_img_1, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                    ],
                    [
                      this.showHomeWarranty && showHomeWarrantyImg_2 ? { image: 'data:image/png;base64,' + this.home_warranty_img_2, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                    ]
                  ]
                },
                layout: 'noBorders'
              }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    // Buyer
    let empty_buyerTemplate = (buyer:any, isLast:boolean) => {
      return [
        pageHead,
        pageHeadColoredLine,
        buyerPageHeadCopy(),
        {
          style: 'parentTable',
          table: {
            widths: ['*'],
            margins: [0],
            body: [
              [
                ioRowMargin(0)
              ],
              [
                ioLine(3, this.gray)
              ],
              [
                ioRowHeading(labels.openMarketBuyerHeading, this.gray, false)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_aaDataTable_headings()
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_aaDataTable_tables(buyer_aa)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ]
            ]
          },
          layout: 'noBorders'
        },
        buyerPageDisclaimer(isLast)
      ]
    }

    // Buyer
    let lumpy_buyerTemplate = (buyer:any, isLast:boolean) => {

      const use_sp_content = this.sp_affinity
        ? buyer.con_buyer_type === "cash" && this.sp_affinity_type === "cash" || buyer.con_buyer_type === "lease_to_own" && this.sp_affinity_type === "lease"
          ? true : false
        : false;

      return [
        pageHead,
        pageHeadColoredLine,
        buyerPageHeadCopy(),
        {
          style: 'parentTable',
          table: {
            widths: ['*'],
            margins: [0],
            body: [
              [
                ioRowMargin(0)
              ],
              [
                ioLine(3, this.gray)
              ],
              [
                ioRowHeading(labels.openMarketBuyerHeading, this.gray, false)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_aaDataTable_headings()
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_aaDataTable_tables(buyer_aa)
              ],
              [
                ioRowMargin(10)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                use_sp_content
                  ? ioRowHeading(this.sp_affinity_name, this.gray, false)
                  : buyer.con_buyer_type == 'cash'
                    ? ioRowHeading(labels.cashHeading, this.gray, false)
                    : ioRowHeading(labels.leaseToOwnHeading, this.gray, false)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_buyerDataTable_headings(buyer)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                buyer_template_buyerDataTable_tables(buyer)
              ]
            ]
          },
          layout: 'noBorders'
        },
        buyerPageDisclaimer(isLast)
      ]
    }

    let buyer_template_buyerDataTable_headings = (buyer:any) => {
      return {
        table: {
          widths: [page_margin, buyer_price_column_width, buyer_cost_column_width, buyer_monthly_column_width, buyer_extra_column_width, page_margin],
          body: [
            [
              { text: '' },
              { text: 'Home purchase value', style: 'tableHeading' },
              { text: 'Cost of Home Purchase', style: 'tableHeading' },
              { text: 'Monthly Costs', style: 'tableHeading' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: '' },
              { text: '$' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].buyer_low_price) + ' - $' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].buyer_high_price), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].costs_low) + ' - $' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].costs_high), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].monthly_costs_low) + ' - $' + this.formatNumber(this.buyervalues[buyer.con_buyer_type].monthly_costs_high), style: 'tableValue' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    let svg_empty = `<svg xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns="http://www.w3.org/2000/svg" xmlns:cc="http://creativecommons.org/ns#" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:svg="http://www.w3.org/2000/svg" id="svg2" viewBox="0 0 535 531">
        <g id="layer2" inkscape:label="Mark" inkscape:groupmode="layer" transform="translate(0 -521.36)">
          <path id="rect2816" style="stroke-linejoin:round;stroke:#666666;stroke-width:55;fill:none" d="m139.59 551.39h252.13c61.025 0 110.15 44.742 110.15 100.32v271.8c0 55.577-49.129 100.32-110.15 100.32h-252.13c-61.025 0-110.15-44.742-110.15-100.32v-271.8c0-55.577 49.129-100.32 110.15-100.32z"/>
        </g>
      </svg>`;
    
    let svg_checked = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24"><path fill="#666666" d="M20 12.194v9.806h-20v-20h18.272l-1.951 2h-14.321v16h16v-5.768l2-2.038zm.904-10.027l-9.404 9.639-4.405-4.176-3.095 3.097 7.5 7.273 12.5-12.737-3.096-3.096z"/></svg>`;

    let svg_warranty_om = this.warranty_om ? svg_checked : svg_empty;
    let svg_warranty_cash = this.warranty_cash ? svg_checked : svg_empty;

    let warrantySection = (buyer:any) => {
      return buyer.con_buyer_type == 'lease_to_own'
        ? [{ text: '' },{ text: '' },{ text: '' },{ text: '' },{ text: '' }]
        : [{ svg: svg_warranty_cash, fit: [8, 8], alignment: 'right' },
           { text: 'Home Warranty', style: 'buyerTableSubHeading', bold: true },
           showArrowSvg(13, 9, this.gray),
           { colSpan: 2, text: dollarValue(this.buyervalues[buyer.con_buyer_type].warranty_low) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].warranty_high), style: 'buyerTableValue' },
          ];
    }

    let handleBuyerImgs = (buyer:any) => {
      return buyer.con_buyer_type !== 'lease_to_own'
        ? {
        table: {
          widths: '*',
          body: [
            [
              extraImagesExist ? { image: 'data:image/png;base64,' + this.io_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
            ],
            [
              this.showHomeWarranty && showHomeWarrantyImg_1 ? { image: 'data:image/png;base64,' + this.home_warranty_img_1, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
            ],
            [
              this.showHomeWarranty && showHomeWarrantyImg_2 ? { image: 'data:image/png;base64,' + this.home_warranty_img_2, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
            ]
          ]
        },
        layout: 'noBorders'
      } : {
        table: {
          widths: '*',
          body: [
            [
              extraImagesExist ? { image: 'data:image/png;base64,' + this.io_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
            ]
          ]
        },
        layout: 'noBorders'
      }
    }
  
    let buyer_template_buyerDataTable_tables = (buyer:any) => {

      const use_sp_content = this.sp_affinity
        ? buyer.con_buyer_type === "cash" && this.sp_affinity_type === "cash" || buyer.con_buyer_type === "lease_to_own" && this.sp_affinity_type === "lease"
          ? true : false
        : false;

      return {
        table: {
          widths: [page_margin, buyer_price_column_width, buyer_cost_column_width, buyer_monthly_column_width, buyer_extra_column_width, page_margin],
          body: [
            [
              { text: '' },
              { 
                table: {
                  width: buyer_price_width,
                  body: [
                    [
                      use_sp_content ? spDescription() : buyerInfoItems(buyer)
                    ],
                    [
                      {
                        table: {
                          widths: [90, '*'],
                          body: [
                            use_sp_content ?
                            [
                              { image: 'data:image/png;base64,' + this.sp_affinity_logo, margins: [3, 0, 0, 0], fit: [90, 35], marginTop: 0 },
                              { }
                            ] : [
                              { text: 'Best Fit For:', margin: [0, 0, 0, 5], bold: true, style: 'tableSubHeading', alignment: 'right', color: this.gray },
                              { text: bestFitTextBuyer(buyer), margin: [0, 0, 0, 5], style: 'tableSubHeading', alignment: 'left', color: this.gray }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ],
                    [
                      use_sp_content ? {} : {
                        table: {
                          width: buyer_price_width,
                          body: [
                            [
                              { text: 'Eligibility: what you need to qualify', margin: 0, bold: true, style: 'tableSubHeading', alignment: 'center', color: this.gray },
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ],
                    [
                      use_sp_content
                      ? {
                        table: {
                          widths: [90, '*'],
                          body: [
                            [
                              infoItems(this.sp_features_1),
                              infoItems(this.sp_features_2)
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                      : infoItems(buyer.con_eligibility),
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: cost_of_buying_widths,
                  body: [
                    [
                      { text: '' },
                      { text: 'Down Payment', colSpan: 2, style: 'buyerTableSubHeading', bold: true, alignment: 'center' },
                      { text: '' },
                    ],
                    [
                      { text: '' },
                      { text: percentValue(this.buyervalues[buyer.con_buyer_type].down_payment_low_percent), style: 'buyerTableValue' },
                      { text: percentValue(this.buyervalues[buyer.con_buyer_type].down_payment_high_percent), style: 'buyerTableValue' },
                      { text: '' }
                    ],
                    [
                      { text: '' },
                      { text: dollarValue(this.buyervalues[buyer.con_buyer_type].down_payment_low), style: 'buyerTableValue' },
                      { text: dollarValue(this.buyervalues[buyer.con_buyer_type].down_payment_high), style: 'buyerTableValue' },
                      { text: '' }
                    ],
                    [
                      { text: '' },
                      { text: 'Closing Costs', style: 'buyerTableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                    ],
                    [
                      { text: '' },
                      { text: dollarValue(this.buyervalues[buyer.con_buyer_type].buyer_low_closing_costs) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].buyer_high_closing_costs), style: 'buyerTableValue', colSpan: 2 },
                      { text: '' }
                    ],
                    [
                      { text: '' },
                      { text: 'Service Fee', style: 'buyerTableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                    ],
                    [
                      { text: '' },
                      { text: dollarValue(this.buyervalues[buyer.con_buyer_type].buyer_low_servicefee) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].buyer_high_servicefee), style: 'buyerTableValue', colSpan: 2 },
                      { text: '' }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: cost_of_buying_widths,
                  body: [
                    [
                      { colSpan: 4, text: buyer.con_buyer_type == 'lease_to_own' ? 'Lease Amount' : 'Mortgage (Principal & Interest)', style: 'buyerTableSubHeading', bold: true, alignment: 'center' },
                      {},
                      {},
                      {}
                    ],
                    [
                      { text: '' },
                      { text: buyer.con_buyer_type == 'lease_to_own'
                        ? dollarValue(this.buyervalues[buyer.con_buyer_type].lease_low)
                        : dollarValue(this.buyervalues[buyer.con_buyer_type].mortgage_low), style: 'buyerTableValue' },
                      { text: buyer.con_buyer_type == 'lease_to_own'
                        ? dollarValue(this.buyervalues[buyer.con_buyer_type].lease_high)
                        : dollarValue(this.buyervalues[buyer.con_buyer_type].mortgage_high), style: 'buyerTableValue' },
                      { text: '' }
                    ],
                    [
                      {
                        colSpan: 4,
                        table: {
                          widths: monthly_costs_widths,
                          body: [
                            [
                              { colSpan: 2, text: 'Taxes', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues[buyer.con_buyer_type].taxes_low) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].taxes_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Insurance', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues[buyer.con_buyer_type].ins_low) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].ins_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Utilities', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues[buyer.con_buyer_type].utils_low) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].utils_high), style: 'buyerTableValue' },
                              {}
                            ],
                            [
                              { colSpan: 2, text: 'Maintenance', style: 'buyerTableSubHeading', bold: true },
                              {},
                              showArrowSvg(13, 9, this.gray),
                              { colSpan: 2, text: dollarValue(this.buyervalues[buyer.con_buyer_type].maintenance_low) + ' - ' + dollarValue(this.buyervalues[buyer.con_buyer_type].maintenance_high), style: 'buyerTableValue' },
                              {},
                            ],
                            this.showHomeWarranty
                              ? warrantySection(buyer)
                              : [
                                { text: '' },
                                { text: '' },
                                { text: '' },
                                { text: '' },
                                { text: '' }
                              ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ]
                  ]                    
                },
                layout: 'noBorders'
              },
              handleBuyerImgs(buyer),
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }
  
    // Seller
    const pageHeadCopy = () => {
      return {
        table: {
          widths: [30, '*'],
          body: [
            [
              { text: '' },
              { text: '' }
            ],
            [
              { text: '' },
              {
                margin: [0, 10, 0, 2],
                text: [
                  'Instant Offer Report: ',
                  {
                    bold: true,
                    text: this.platformDataService.getAddressData('formattedAddress') + '\n'
                  }
                ] 
              }
            ],
            [
              { text: '' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      };
    }

    // Seller
    const showArrowSvg = (width:number, height:number, color:string) => {
      return {
        svg: `
          <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 492 492"
            x="0px" y="0px"
            style="fill: ` + color + `; enable-background:new 0 0 492 492;"
            xml:space="preserve">
            <g>
              <g>
                <path d="M484.14,226.886L306.46,49.202c-5.072-5.072-11.832-7.856-19.04-7.856c-7.216,0-13.972,2.788-19.044,7.856l-16.132,16.136
                  c-5.068,5.064-7.86,11.828-7.86,19.04c0,7.208,2.792,14.2,7.86,19.264L355.9,207.526H26.58C11.732,207.526,0,219.15,0,234.002
                  v22.812c0,14.852,11.732,27.648,26.58,27.648h330.496L252.248,388.926c-5.068,5.072-7.86,11.652-7.86,18.864
                  c0,7.204,2.792,13.88,7.86,18.948l16.132,16.084c5.072,5.072,11.828,7.836,19.044,7.836c7.208,0,13.968-2.8,19.04-7.872
                  l177.68-177.68c5.084-5.088,7.88-11.88,7.86-19.1C492.02,238.762,489.228,231.966,484.14,226.886z"/>
              </g>
            </g>
          </svg>`,
        fit: [width, height]
      }
    }

    // Seller
    // const showHouseSvg = (width:number, height:number, color:string) => {
    //   return { 
    //     svg: `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
    //         viewBox="0 25 200 88"
    //         x="75px" y="0px"
    //         style="fill: ` + color + `;"
    //         xml:space="preserve">
    //         <g id="AI_home_1_">
    //           <path id="Path_307_1_" class="svg" d="M141.87,69.86l-10.46-30.86c-0.39-1.06-1.42-1.75-2.54-1.7h-9.47l-0.85-7.93
    //             c-0.14-1.53-1.43-2.7-2.97-2.68l0,0c-1.54-0.02-2.84,1.15-2.97,2.69l-0.85,7.93H70.65c-1.09,0.09-2.05,0.73-2.54,1.7
    //             c0,0.14,0,0.14-0.14,0.27c0,0.14,0,0.14-0.14,0.27L57.37,70.42v0.85c-0.09,1.62,1.08,3.03,2.68,3.26h7.91v31.85
    //             c0,2.97,2.4,5.37,5.37,5.38c0,0,0,0,0,0h52.99c2.97,0,5.37-2.41,5.37-5.38c0,0,0,0,0,0V74.53h7.63c1.8-0.23,3.07-1.88,2.84-3.67
    //             C142.12,70.51,142.02,70.17,141.87,69.86z M126.32,106.38H73.33V74.53h52.99V106.38z M126.32,69.15H83.35l-9.03-26.47h36.88
    //             l-0.85,7.93l9.89-6.09l-0.14-1.84h7.07l8.9,26.47L126.32,69.15z"/>
    //         </g>
    //       </svg>`,
    //     fit: [width, height]
    //   }
    // }
  
    // Seller
    let lumpy_iBuyerTemplate_aaDataTable_headings = () => {
      return {
        table: {
          widths: [page_margin, price_column_width, cost_column_width, net_column_width, page_margin],
          body: [
            [
              { text: '' },
              { text: 'Estimated ' + labels.aaHeading + ' Price', style: 'tableHeading' },
              { text: 'Cost of Selling', style: 'tableHeading' },
              { text: 'Estimated Net', style: 'tableHeading' },
              { text: '' }
            ],
            [
              { text: '' },
              { text: '$' + this.formatNumber(this.values.aa.open_mkt_price), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.values.aa.cos), style: 'tableValue' },
              { text: '$' + this.formatNumber(this.values.aa.net), style: 'tableValue' },
              { text: '' }
            ]
          ]
        },
        layout: 'noBorders'
      }
    }

    // Seller
    let lumpy_iBuyerTemplate_aaDataTable_tables = () => {
      return {
        table: {
          widths: [page_margin, price_column_width, cost_column_width, net_column_width, page_margin],
          body: [
            [
              { text: '' },
              {
                table: {
                  width: price_column_width,
                  body: [
                    [
                      sellerInfoItems(aa)
                    ],
                    [
                      {
                        table: {
                          widths: [50, '*'],
                          body: [
                            [
                              { text: 'Best Fit For:', margin: 0, bold: true, style: 'tableSubHeading', alignment: 'right', color: this.gray },
                              { text: bestFitTextSeller(aa.con_io_type), margin: 0, style: 'tableSubHeading', alignment: 'left', color: this.gray }
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: cost_of_selling_widths,
                  body: [
                    [
                      { text: '' },
                      { text: '' },
                      { text: '' },
                      { text: '' }
                    ],
                    [
                      { text: 'Service Fee:', style: 'tableSubHeading', bold: true },
                      { text: percentValue(this.values.aa.service_fee_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values.aa.service_fee), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Seller Agent:', style: 'tableSubHeading', bold: true },
                      { text: percentValue(this.values.aa.seller_agent_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values.aa.seller_agent), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Buyer Agent:', style: 'tableSubHeading', bold: true },
                      { text: percentValue(this.values.aa.buyer_agent_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values.aa.buyer_agent), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Prep & Repairs:', style: 'tableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                      { text: dollarValue(this.values.aa.prep_repairs), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Closing Costs:', style: 'tableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                      { text: dollarValue(this.values.aa.closing_costs), style: 'tableSubValue' }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: '*',
                  body: [
                    [
                      extraImagesExist ? { image: 'data:image/png;base64,' + this.aa_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                    ],
                    [
                      showConciergeImg ? { image: 'data:image/png;base64,' + this.concierge_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                    ]
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
    }

    // Seller
    let showBridgeEstimatedPrice = (io:any) => {
      return {
        text: '$' + this.formatNumber(this.values[io.con_io_type].bridge_mkt_price), style: 'tableValue'
      }
    }

    // Seller
    let showRangedMlot = (lowRangeVal:any, highRangeVal:any) => {
      let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
      let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;
      return '$' + this.formatNumber(Math.abs(realLowVal)) + ' - ' + '$' + this.formatNumber(Math.abs(realHighVal));
    }

    // Seller
    let lumpy_iBuyerTemplate_ioDataTable_headings = (io:any, isBridge:boolean) => {
      return {
        table: {
          widths: [page_margin, price_column_width, cost_column_width, net_column_width, page_margin],
          body: [
            [
              { text: '' },
              isBridge
                ? { text: 'Estimated ' + labels.bridgeHeading + ' Price', style: 'tableHeading' }
                : { text: 'Estimated ' + labels.ioHeading + ' Price', style: 'tableHeading' },
              { text: 'Cost of Selling', style: 'tableHeading' },
              { text: 'Estimated Net', style: 'tableHeading' },
              { text: '' }
            ],
            [
              { text: '' },
              isBridge ? showBridgeEstimatedPrice(io) : showRangedEstimatedPrice(io),
              {
                text: '$' + this.formatNumber(this.values[io.con_io_type].low_cos)
                 + ' - $' + this.formatNumber(this.values[io.con_io_type].high_cos), style: 'tableValue'
              },
              showRangedEstimatedNet(io),
              { text: '' }
            ],
          ]
        },
        layout: 'noBorders'
      }
    }

    // Seller
    let lumpy_iBuyerTemplate_ioDataTable_tables = (io:any) => {
      const use_sp_content = this.sp_affinity
        ? io.con_io_type === "bridge" && this.sp_affinity_type === "bridge" || io.con_io_type === "standard" && this.sp_affinity_type === "ibuyer"
          ? true : false
        : false;
  
      return {
        table: {
          widths: [page_margin, price_column_width, cost_column_width, net_column_width, page_margin],
          body: [
            [
              { text: '' },
              {
                table: {
                  width: price_column_width,
                  body: [
                    [
                      use_sp_content ? spDescription() : sellerInfoItems(io)
                    ],
                    [
                      {
                        table: {
                          widths: [90, '*'],
                          body: [
                          use_sp_content ?
                            [
                              { image: 'data:image/png;base64,' + this.sp_affinity_logo, margins:[3, 0, 0, 5], fit: [90, 35], marginTop: 0 },
                              {}
                            ] : [
                              { text: 'Best Fit For:', margin: 0, bold: true, style: 'tableSubHeading', alignment: 'right', color: this.gray },
                              { text: bestFitTextSeller(io.con_io_type), margin: 0, style: 'tableSubHeading', alignment: 'left', color: this.gray }
                            ]
                          ],
                        },
                        layout: 'noBorders'
                      }
                    ],
                    [
                      use_sp_content ? {
                        table: {
                          widths: [90, '*'],
                          body: [
                            [
                              infoItems(this.sp_features_1),
                              infoItems(this.sp_features_2)
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      } : {},
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: cost_of_selling_widths,
                  body: [
                    [
                      { text: '' },
                      { text: '' },
                      { text: '' },
                      { text: '' }
                    ],
                    [
                      { text: io.id == 77 ? 'Cost of Home Being Purchased': '', style: 'tableSubHeading', bold: true },
                      { text: io.id == 77 ? dollarValue(this.values[io.con_io_type].low_home_purchase_cost) : '', style: 'tableSubValue', alignment: 'center' },
                      io.id == 77 ? showArrowSvg(13, 9, this.gray) : '',
                      { text: io.id == 77 ? dollarValue(this.values[io.con_io_type].high_home_purchase_cost): '', style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Service Fee:', style: 'tableSubHeading', bold: true },
                      { text: percentValueHighLow(this.values[io.con_io_type].low_service_fee_percent, this.values[io.con_io_type].high_service_fee_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values[io.con_io_type].low_service_fee) + ' - ' + dollarValue(this.values[io.con_io_type].high_service_fee), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Seller Agent:', style: 'tableSubHeading', bold: true },
                      { text: percentValue(this.values[io.con_io_type].seller_agent_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values[io.con_io_type].low_seller_agent) + ' - ' + dollarValue(this.values[io.con_io_type].high_seller_agent), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Buyer Agent:', style: 'tableSubHeading', bold: true },
                      { text: percentValue(this.values[io.con_io_type].buyer_agent_percent), style: 'tableSubValue', alignment: 'center' },
                      showArrowSvg(13, 9, this.gray),
                      { text: dollarValue(this.values[io.con_io_type].low_buyer_agent) + ' - ' + dollarValue(this.values[io.con_io_type].high_buyer_agent), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Prep & Repairs:', style: 'tableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                      { text: dollarValue(this.values[io.con_io_type].low_prep_repairs) + ' - ' + dollarValue(this.values[io.con_io_type].high_prep_repairs), style: 'tableSubValue' }
                    ],
                    [
                      { text: 'Closing Costs:', style: 'tableSubHeading', bold: true },
                      { text: '' },
                      { text: '' },
                      { text: dollarValue(this.values[io.con_io_type].low_closing_costs) + ' - ' + dollarValue(this.values[io.con_io_type].high_closing_costs), style: 'tableSubValue' }
                    ]
                  ]
                },
                layout: 'noBorders'
              },
              {
                table: {
                  widths: [net_column_width],
                  body: [
                    [
                      {
                        table: {
                          widths: '*',
                          body: [
                            [
                              extraImagesExist ? { image: 'data:image/png;base64,' + this.io_img, fit: [120, 45], alignment: 'center', marginTop: 0 } : { text: '' },
                            ]
                          ]
                        },
                        layout: 'noBorders'
                      }
                    ],
                    [
                      { text: 'Net Difference:', alignment: 'center', marginTop: 10 }
                    ],
                    [
                      { text: showRangedMlot(this.values[io.con_io_type].mlot_low, this.values[io.con_io_type].mlot_high), alignment: 'center', color: this.gray, bold: true, }
                    ]
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
    }

    // Seller
    let lumpy_iBuyerTemplate = (ibuyer:any, isBridge:boolean) => {
      const use_sp_content = this.sp_affinity
        ? ibuyer.con_io_type === "bridge" && this.sp_affinity_type === "bridge" || ibuyer.con_io_type === "standard" && this.sp_affinity_type === "ibuyer"
          ? true : false
        : false;

      return [
        pageHead,
        pageHeadColoredLine,
        pageHeadCopy(),
        {
          style: 'parentTable',
          table: {
            widths: ['*'],
            margins: [0],
            body: [
              [
                ioRowMargin(15)
              ],
              [
                ioLine(3, this.highlight)
              ],
              [
                ioRowHeading(labels.aaHeading, this.gray, true)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_aaDataTable_headings()
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_aaDataTable_tables()
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioLine(3, this.gray),
              ],
              [
                use_sp_content
                  ? ioRowHeading(this.sp_affinity_name, this.gray, false)
                  : isBridge
                    ? ioRowHeading(labels.bridgeTerm, this.gray, false)
                    : ibuyer.con_io_type == 'asis'
                      ? ioRowHeading(labels.asIsTerm, this.gray, false)
                      : ioRowHeading(labels.ioTerm, this.gray, false)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_ioDataTable_headings(ibuyer, isBridge)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_ioDataTable_tables(ibuyer)
              ]
            ]
          },
          layout: 'noBorders'
        },
        sellerPageDisclaimer(use_sp_content ? 25 : 50)
      ]
    }
  
    // Seller
    let empty_iBuyerTemplate = () => {
      return [
        pageHead,
        pageHeadColoredLine,
        pageHeadCopy(),
        {
          style: 'parentTable',
          table: {
            widths: ['*'],
            margins: [0],
            body: [
              [
                ioRowMargin(15)
              ],
              [
                ioLine(3, this.gray)
              ],
              [
                ioRowHeading(labels.aaHeading, this.gray, true)
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_aaDataTable_headings()
              ],
              [
                ioLine(1, this.gray)
              ],
              [
                lumpy_iBuyerTemplate_aaDataTable_tables()
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                ioRowMargin(30)
              ],
              [
                {}
              ],
              [
                {}
              ]
            ]
          },
          layout: 'noBorders'
        },
        sellerPageDisclaimer(50)
      ]
    }

    // Buyer
    const buyerPageDisclaimer = (more:boolean) => {
      // if this is the last buyer and there are no Sellers to show
      // we need to NOT use a pageBreak, it will generate a blank last page
      return !more
        ? {
            fontSize: 6,
            margin: [page_margin, 10, page_margin, 0],
            text: '*These offers, selling processes, and cost estimates are representative of market specific internal and publicly available industry data. This report is a tool designed for comparison purposes only. OFFER OPTIMIZER™ IS NOT AFFILIATED WITH, SPONSORED BY, OR ENDORSED BY ANY OF THE NATIONAL IBUYERS WHOSE OFFERS ARE REFERENCED IN THIS REPORT. THIS REPORT GATHERS AND COMPILES PUBLICLY AVAILABLE INFORMATION ABOUT OFFERS AND SALES FROM DIFFERENT, UNAFFILIATED COMPETITORS FOR COMPARISON PURPOSES ONLY, AND CONSUMERS MAY INDEPENDENTLY EVALUATE AND VERIFY DIFFERENT OFFERS FROM DIFFERENT NATIONAL IBUYERS BEFORE MAKING A DECISION.',
            alignment: 'justify'
          }
        : {
            fontSize: 6,
            margin: [page_margin, 10, page_margin, 0],
            text: '*These offers, selling processes, and cost estimates are representative of market specific internal and publicly available industry data. This report is a tool designed for comparison purposes only. OFFER OPTIMIZER™ IS NOT AFFILIATED WITH, SPONSORED BY, OR ENDORSED BY ANY OF THE NATIONAL IBUYERS WHOSE OFFERS ARE REFERENCED IN THIS REPORT. THIS REPORT GATHERS AND COMPILES PUBLICLY AVAILABLE INFORMATION ABOUT OFFERS AND SALES FROM DIFFERENT, UNAFFILIATED COMPETITORS FOR COMPARISON PURPOSES ONLY, AND CONSUMERS MAY INDEPENDENTLY EVALUATE AND VERIFY DIFFERENT OFFERS FROM DIFFERENT NATIONAL IBUYERS BEFORE MAKING A DECISION.',
            alignment: 'justify',
            pageBreak: 'after'
          };
    }
  
    // Seller
    const sellerPageDisclaimer = (topmargin:number) => {
      return {
          fontSize: 6,
          margin: [page_margin, topmargin, page_margin, 0],
          text: '*These offers, selling processes, and cost estimates are representative of market specific internal and publicly available industry data. This report is a tool designed for comparison purposes only. OFFER OPTIMIZER™ IS NOT AFFILIATED WITH, SPONSORED BY, OR ENDORSED BY ANY OF THE NATIONAL IBUYERS WHOSE OFFERS ARE REFERENCED IN THIS REPORT. THIS REPORT GATHERS AND COMPILES PUBLICLY AVAILABLE INFORMATION ABOUT OFFERS AND SALES FROM DIFFERENT, UNAFFILIATED COMPETITORS FOR COMPARISON PURPOSES ONLY, AND CONSUMERS MAY INDEPENDENTLY EVALUATE AND VERIFY DIFFERENT OFFERS FROM DIFFERENT NATIONAL IBUYERS BEFORE MAKING A DECISION.',
          alignment: 'justify'
        }
    }

    // Seller / Buyer
    let showRangedEstimatedPrice = (io:any) => {
      let lowRangeVal = this.values[io.con_io_type].low_open_mkt_price;
      let highRangeVal = this.values[io.con_io_type].high_open_mkt_price;
  
      let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
      let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;
    
      return {
        text: '$' + this.formatNumber(realLowVal) + ' - $' + this.formatNumber(realHighVal), style: 'tableValue'
      }
    }
  
    // Seller / Buyer
    let showRangedEstimatedNet = (io:any) => {
      let lowRangeVal = this.values[io.con_io_type].low_net;
      let highRangeVal = this.values[io.con_io_type].high_net;
      let realLowVal = lowRangeVal < highRangeVal ? lowRangeVal : highRangeVal;
      let realHighVal = lowRangeVal < highRangeVal ? highRangeVal : lowRangeVal;
      return {
        text: '$' + this.formatNumber(realLowVal) + ' - $' + this.formatNumber(realHighVal), style: 'tableValue'
      }
    }

    // Seller / Buyer
    let showIbuyerTemplates = () => {
      let template = [];
      let last:boolean = false;
      let more:boolean = true;
      if (this.isBuyer) {
        if (buyersToShow.length > 0) {
          // fill the template Array with a template per buyersToShow
          let index = 0;
          for (let buyer of buyersToShow) {
            // if this is the last buyer and there are no Sellers to show
            // we need to let the disclaimer know not to use a pageBreak
            (buyer == buyersToShow[buyersToShow.length-1] && !iBuyersToShow.length)
              ? template.push(lumpy_buyerTemplate(buyer, last))
              : template.push(lumpy_buyerTemplate(buyer, more));
            ++index;
          }
        } else {
          template.push(empty_buyerTemplate(buyer_aa, last));
        }
      }
  
      if (iBuyersToShow.length > 0) {
        // fill the template Array with a template per iBuyersToShow
        for (let ibuyer of iBuyersToShow) {
          ibuyer.con_io_type == 'bridge'
            ? template.push(lumpy_iBuyerTemplate(ibuyer, true))
            : template.push(lumpy_iBuyerTemplate(ibuyer, false));
        }
      }
      
      return template;
    }

    this.docDefinition = {
      pageSize: 'LETTER',
      pageOrientation: 'landscape',
      pageMargins: [ 0, 0, 0, 0 ],
      content:
        showIbuyerTemplates(),
        defaultStyle: {
          font: 'Avenir',
          color: this.gray
        },
      styles: {
        pageHeadName: {
          alignment: 'left',
          bold: true,
          color: this.gray,
          fontSize: 12
        },
        tableHeading: {
          alignment: 'center',
          bold: false,
          color: this.gray,
          fontSize: 12
        },
        tableSubHeading: {
          alignment: 'right',
          color: this.gray,
          fontSize: 8
        },
        tableValue: {
          bold: true,
          color: this.gray,
          fontSize: 12,
          alignment: 'center'
        },
        tableSubValue: {
          bold: false,
          color: this.gray,
          fontSize: 9,
          alignment: 'left'
        },
        buyerTableSubHeading: {
          alignment: 'left',
          bold: true,
          color: this.gray,
          fontSize: 8
        },
        buyerTableValue: {
          bold: false,
          color: this.gray,
          fontSize: 9,
          alignment: 'center'
        }
      }
    }
    
    let event = new Date();
    let filename = labels.ioHeading + ' Report ' + event.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    console.log('making PDF:', filename);
    pdfMake.createPdf(this.docDefinition).download(filename);
    this.pdfRequested = false;
  }

}

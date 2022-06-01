import { enableProdMode, NgModule } from '@angular/core';
import { LoginModule } from './login.module';
import { SharedModule } from './shared.module';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { CurrencyPipe, PercentPipe, DecimalPipe } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OfferOptimizerComponent } from './components/oo.components/offer-optimizer/offer-optimizer.component';
import { ConfigService } from './services/config.service';
import { PlatformDataService } from './services/platform-data.service';
import { ScrollDownService } from './services/scroll-down.service';
import { AVMService } from './services/avm.service';
import { NavService } from './services/nav.service';
import { ConfigComponent } from './components/oo.components/config/config.component';
import { PdfComponent } from './components/oo.components/pdf/pdf.component';
import { AgmCoreModule } from '@agm/core';
import { TransbtnsComponent } from './components/pp.components/transbtns/transbtns.component';
import { ResultsComponent } from './components/oo.components/results/results.component';
import { AddressComponent } from './components/pp.components/address/address.component';
import { ResultSellerComponent } from './components/oo.components/result-seller/result-seller.component';
import { ResultBuyerComponent } from './components/oo.components/result-buyer/result-buyer.component';
import { PercDollarInputsComponent } from './components/oo.components/oo-result-components/perc-dollar-inputs/perc-dollar-inputs.component';
import { OneButtonComponent } from './components/one-button/one-button.component';
import { RangedPercDollarInputsComponent } from './components/oo.components/oo-result-components/ranged-perc-dollar-inputs/ranged-perc-dollar-inputs.component';
import { NextbackbtnComponent } from './components/pp.components/nextbackbtn/nextbackbtn.component';
import { routingComponents } from './app-routing.module';
import { ValidateNumberDirective } from './validate-number.directive';
import { SimpleInputPercentComponent } from './components/oo.components/oo-result-components/simple-input-percent/simple-input-percent.component';
import { AltInputPercentComponent } from './components/oo.components/oo-result-components/alt-input-percent/alt-input-percent.component';
import { RangedSimpleInputPercentComponent } from './components/oo.components/oo-result-components/ranged-simple-input-percent/ranged-simple-input-percent.component';
import { RangedAltInputPercentComponent } from './components/oo.components/oo-result-components/ranged-alt-input-percent/ranged-alt-input-percent.component';
import { RangedDoublePercentDollarInputsComponent } from './components/oo.components/oo-result-components/ranged-double-percent-dollar-inputs/ranged-double-percent-dollar-inputs.component';
import { BridgeHybridRangedDoublePercentDollarInputsComponent } from './components/oo.components/oo-result-components/bridge-hybrid-ranged-double-percent-dollar-inputs/bridge-hybrid-ranged-double-percent-dollar-inputs.component';
import { NumberIncrementComponent } from './components/pp.components/number-increment/number-increment.component';
import { SelectOptionComponent } from './components/pp.components/select-option/select-option.component';
import { MultiSelectCheckboxComponent } from './components/pp.components/multi-select-checkbox/multi-select-checkbox.component';
import { RadioTrueFalseComponent } from './components/pp.components/radio-true-false/radio-true-false.component';
import { SimpleTextComponent } from './components/pp.components/simple-text/simple-text.component';
import { RadioWithImgComponent } from './components/pp.components/radio-with-img/radio-with-img.component';
import { SimpleNumberTextComponent } from './components/pp.components/simple-number-text/simple-number-text.component';
import { WpApiService } from './services/wp-api.service';
import { FieldNameService } from './services/field-name.service';
import { UserPhotosService } from './services/user-photos.service';
import { CurrencyDirective } from './currency.directive';
import { PpPageTitleComponent } from './components/pp.components/pp-page-title/pp-page-title.component';
import { DownPaymentComponent } from './components/oo.components/oo-result-components/down-payment/down-payment.component';
import { MonthlyRangedSimpleInputPercentComponent } from './components/oo.components/oo-result-components/monthly-ranged-simple-input-percent/monthly-ranged-simple-input-percent.component';
import { BuyerMarketService } from './services/buyer-market.service';
import { SimpleTextSmComponent } from './components/pp.components/simple-text-sm/simple-text-sm.component';
import { SellerEmailComponent } from './components/pp.components/seller-email/seller-email.component';
import { LeftNavComponent } from './components/left-nav/left-nav.component';
import { FilterPipe } from './filter.pipe';
import { OrderByPipe } from './order-by.pipe';
import { OpenMarketComponent } from './components/cor.components/open-market/open-market.component';
import { VerifyBuyerComponent } from './components/cor.components/verify-buyer/verify-buyer.component';
import { PreviewPdfComponent } from './components/cor.components/preview-pdf/preview-pdf.component';
import { PercAmountComponent } from './components/cor.components/perc-amount/perc-amount.component';
import { DollarAmountComponent } from './components/cor.components/dollar-amount/dollar-amount.component';
import { CorPdfComponent } from './components/cor.components/cor-pdf/cor-pdf.component';
import { MortgageInfoComponent } from './components/lo.components/mortgage-info/mortgage-info.component';
import { FinancialInfoComponent } from './components/lo.components/financial-info/financial-info.component';

enableProdMode();
declare global {
  interface Window {
    zavvie_national_market: any[];
    dataLayer: any[];
  }
}

@NgModule({
  declarations: [
    AppComponent,
    OfferOptimizerComponent,
    ConfigComponent,
    PdfComponent,
    TransbtnsComponent,
    ResultsComponent,
    ResultSellerComponent,
    ResultBuyerComponent,
    PercDollarInputsComponent,
    AddressComponent,
    OneButtonComponent,
    RangedPercDollarInputsComponent,
    NextbackbtnComponent,
    routingComponents,
    ValidateNumberDirective,
    RangedPercDollarInputsComponent,
    SimpleInputPercentComponent,
    AltInputPercentComponent,
    RangedSimpleInputPercentComponent,
    RangedAltInputPercentComponent,
    RangedDoublePercentDollarInputsComponent,
    BridgeHybridRangedDoublePercentDollarInputsComponent,
    NumberIncrementComponent,
    SelectOptionComponent,
    MultiSelectCheckboxComponent,
    RadioTrueFalseComponent,
    SimpleTextComponent,
    RadioWithImgComponent,
    SimpleNumberTextComponent,
    CurrencyDirective,
    PpPageTitleComponent,
    DownPaymentComponent,
    MonthlyRangedSimpleInputPercentComponent,
    SimpleTextSmComponent,
    SellerEmailComponent,
    LeftNavComponent,
    FilterPipe,
    OpenMarketComponent,
    VerifyBuyerComponent,
    PreviewPdfComponent,
    PercAmountComponent,
    DollarAmountComponent,
    OrderByPipe,
    CorPdfComponent,
    MortgageInfoComponent,
    FinancialInfoComponent
  ],
  imports: [
    SharedModule,
    LoginModule,
    AppRoutingModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8mKzp331nnB78q_Zqr_p17Z2x0bNRTEs',
      language: 'en',
      libraries: ['geometry', 'places']
    })
  ],
  providers: [
    ConfigService,
    PlatformDataService,
    AVMService,
    CurrencyPipe,
    PercentPipe,
    DecimalPipe,
    ScrollDownService,
    WpApiService,
    FieldNameService,
    UserPhotosService,
    BuyerMarketService,
    NavService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [
    LoadingSpinnerComponent
  ],
  imports: [
    HttpClientModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    HttpClientModule,
    BrowserModule,
    LoadingSpinnerComponent,
    NgxMaskModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { VendorsModule } from 'projects/vendors/src/public-api';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Wf1NewUserService } from './service/wf1-new-user.service';
import { TranslatePipe } from '@ngx-translate/core';

var SERVICES = [
  Wf1NewUserService
]
var PIPES = [
  DatePipe, TranslatePipe
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    VendorsModule
  ],
  providers: [
    ...SERVICES,
    ...PIPES,
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

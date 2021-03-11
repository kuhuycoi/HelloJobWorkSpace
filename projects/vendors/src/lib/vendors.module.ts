import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgModule } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { VendorsComponent } from './vendors.component';
import { MY_DATE_FORMATS } from './class/my-date-adapter';
import { DataPickerModule } from './data-picker/data-picker.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MaterialModule } from './material.module';

import { InjectionToken, FactoryProvider } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LightboxModule } from 'ngx-lightbox';
import { NouisliderModule } from 'ng2-nouislider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export const WINDOW = new InjectionToken<Window>('window');

const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: () => window
};

export const WINDOW_PROVIDERS = [
  windowProvider
]

const MODULES = [MaterialModule, DataPickerModule, RouterModule, FormsModule, ReactiveFormsModule, CommonModule,
  LightboxModule, TranslateModule, CarouselModule, NgbModule, NouisliderModule]
@NgModule({
  declarations: [VendorsComponent],
  imports: [
    ...MODULES, TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }, defaultLanguage: 'vi'
    })
  ],
  exports: [...MODULES],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ]
})
export class VendorsModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
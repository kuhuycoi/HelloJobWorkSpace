import { PublicModule } from './public/public.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { VerifiedModule } from './verified/verified.module';
import { RequestInterceptor } from './interceptor/request.interceptor';
import { KhaiPhomModule } from './khai-phom/khai-phom.module';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SharedModule } from './shared/shared.module';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { NotifyComponent } from './notify/notify.component';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { VendorsModule, WINDOW_PROVIDERS } from 'projects/vendors/src/public-api';
import { ToolModule } from 'projects/tools/src/lib/tool.module';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const LAYOUT_COMPONENTS = [AppComponent, HeaderComponent, SidebarComponent];

@NgModule({
  declarations: [
    LAYOUT_COMPONENTS,
    BottomNavComponent,
    NotifyComponent
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule,
    VerifiedModule,
    PublicModule,
    KhaiPhomModule,
    SharedModule,
    ToolModule,
    VendorsModule,
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy'
    })
  ],
  exports: [],
  providers: [WINDOW_PROVIDERS, {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true,
  }, {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }

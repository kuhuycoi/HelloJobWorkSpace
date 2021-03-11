import { OrderContractComponent } from './order-contract/order-contract.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { PublicComponent } from './public.component';
import { Error404Component } from './error404/error404.component';
import { OrderContractDetailComponent } from './order-contract-detail/order-contract-detail.component';
import { ApplyComponent } from './apply/apply.component';
import { SharedModule } from '../shared/shared.module';
import { PublicCvComponent } from './public-cv/public-cv.component';
import { TermComponent } from './term/term.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PublicCvMobileComponent } from './public-cv/public-cv-mobile/public-cv-mobile.component';
import { OrderContractNbComponent } from './order-contract/order-contract-nb/order-contract-nb.component';
import { OrderContractTnComponent } from './order-contract/order-contract-tn/order-contract-tn.component';
import { OrderContractDlComponent } from './order-contract/order-contract-dl/order-contract-dl.component';
import { ToolModule } from 'projects/tools/src/lib/tool.module';
import { VendorsModule } from 'projects/vendors/src/public-api';

const LAYOUT_COMPONENTS = [PublicComponent, IndexComponent, OrderContractComponent,
  Error404Component, OrderContractDetailComponent, ApplyComponent, PublicCvComponent,
  TermComponent, PrivacyComponent, PublicCvMobileComponent];

const ENTRY_COMPONENTS = [];

@NgModule({
  declarations: [LAYOUT_COMPONENTS, ENTRY_COMPONENTS, OrderContractNbComponent, OrderContractTnComponent, OrderContractDlComponent],
  imports: [
    SharedModule,
    ToolModule,
    VendorsModule
  ],
  exports: [],
  entryComponents: []
})
export class PublicModule { }

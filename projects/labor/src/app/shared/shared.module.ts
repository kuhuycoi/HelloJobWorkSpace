import { PageActionComponent } from './pager-action/page-action.component';
import { OrderContractGalleryComponent } from './order-contract-gallery/order-contract-gallery.component';
import { HotCustomerComponent } from './hot-customer/hot-customer.component';
import { NgModule } from '@angular/core';
import { CustomerQuestionTableHeaderComponent } from './customer-question-table-header/customer-question-table-header.component';
import { IconPhoneAnimateComponent } from './icon-phone-animate/icon-phone-animate.component';
import { HjVerifiedComponent } from '../hj-verified/hj-verified.component';
import { HotOrderComponent } from './hot-order/hot-order.component';
import { SocialsSharedComponent } from './socials-shared/socials-shared.component';
import { ShareReferralComponent, ShareReferralRoleComponent } from '../shared/share-referral/share-referral.component';
import { SimpleSearchComponent } from './simple-search/simple-search.component';
import { NotyDialogComponent } from './noty-dialog/noty-dialog.component';
import { TreeSelectDataComponent, TreeSelectDataDialogComponent } from './tree-select-data/tree-select-data.component';
import { FooterComponent } from '../footer/footer.component';
import { DownloadComponent } from '../public/download/download.component';
import { FilterContractComponent } from '../public/filter-contract/filter-contract.component';
import { VendorsModule } from 'projects/vendors/src/public-api';
import { ToolModule } from 'projects/tools/src/lib/tool.module';
const LAYOUT_COMPONENTS = [
  CustomerQuestionTableHeaderComponent, DownloadComponent, IconPhoneAnimateComponent,
  FooterComponent, HjVerifiedComponent, HotOrderComponent, SocialsSharedComponent,
  SimpleSearchComponent, HotCustomerComponent, OrderContractGalleryComponent,
  PageActionComponent, TreeSelectDataComponent
];
const ENTRY_COMPONENTS = [FilterContractComponent, ShareReferralComponent, ShareReferralRoleComponent,
  NotyDialogComponent, TreeSelectDataDialogComponent];
@NgModule({
  declarations: [LAYOUT_COMPONENTS, ENTRY_COMPONENTS],
  imports: [
    VendorsModule,
    ToolModule
  ],
  providers: [],
  entryComponents: [ENTRY_COMPONENTS],
  exports: [LAYOUT_COMPONENTS, ENTRY_COMPONENTS]
})
export class SharedModule { }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { VendorsModule, WINDOW_PROVIDERS } from 'projects/vendors/src/public-api';
import { ToolModule } from 'projects/tools/src/lib/tool.module';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { RequestInterceptor } from './interceptor/request.interceptor';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageActionComponent } from './pager-action/page-action.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PartnerInfoComponent } from './pages/partner-info/partner-info.component';
import { PostJobComponent } from './pages/post-job/post-job.component';
import { MyJobComponent } from './pages/my-job/my-job.component';
import { ListRecruitmentComponent } from './pages/list-recruitment/list-recruitment.component';
import { MyReferralsComponent } from './pages/my-referrals/my-referrals.component';
import { RegisterReferralComponent } from './pages/register-referral/register-referral.component';
import { MyAffiliateComponent } from './pages/my-affiliate/my-affiliate.component';
import { CustomerWishComponent } from './pages/customer-wish/customer-wish.component';
import { AdvancePostComponent } from './pages/post-job/advance-post/advance-post.component';
import { QuickPostComponent } from './pages/post-job/quick-post/quick-post.component';
import { FavouriteRecuitmentComponent } from './pages/favourite-recuitment/favourite-recuitment.component';
import { EvaluatePartnerComponent } from './pages/evaluate-partner/evaluate-partner.component';
import { VocabularySharedComponent } from './pages/vocabulary-shared/vocabulary-shared.component';
import { PostJobDlComponent } from './pages/post-job/post-job-dl/post-job-dl.component';
import { PostJobTnComponent } from './pages/post-job/post-job-tn/post-job-tn.component';
import { PostJobNbComponent } from './pages/post-job/post-job-nb/post-job-nb.component';
import { RecruitmentDetailComponent } from './pages/recruitment-detail/recruitment-detail.component';
import { FilterWishComponent } from './pages/filter-wish/filter-wish.component';
import { FilterReferralsComponent } from './pages/filter-referrals/filter-referrals.component';
import { FilterRecruitmentComponent } from './pages/filter-recruitment/filter-recruitment.component';
import { ReportTableComponent } from './pages/report-table/report-table.component';
import { SelectIframeComponent } from './pages/register-referral/select-iframe/select-iframe.component';
import { RecruitmentChooseComponent } from './pages/recruitment-choose/recruitment-choose.component';
import { EvaluatePartnerAddComponent } from './pages/evaluate-partner/evaluate-partner-add/evaluate-partner-add.component';
import { ShareReferralComponent, ShareReferralRoleComponent } from './pages/share-referral/share-referral.component';
import { FilterContractComponent } from './pages/filter-contract/filter-contract.component';
import { NotyDialogComponent } from './notify/noty-dialog/noty-dialog.component';
import { HotOrderComponent } from './pages/hot-order/hot-order.component';
import { HotCustomerComponent } from './pages/hot-customer/hot-customer.component';
import { SimpleSearchComponent } from './pages/simple-search/simple-search.component';
import { NotifyComponent } from './notify/notify.component';
import { Error404Component } from './pages/error404/error404.component';
import { SidebarComponent } from './pages/sidebar/sidebar.component';
import { IndexComponent } from './pages/index/index.component';

const LAYOUT_COMPONENTS = [AppComponent, BottomNavComponent, NotifyComponent, PageActionComponent, HeaderComponent, FooterComponent,
  PartnerInfoComponent, PostJobComponent, MyJobComponent, ListRecruitmentComponent,
  QuickPostComponent, AdvancePostComponent, CustomerWishComponent, MyReferralsComponent, RegisterReferralComponent,
  FavouriteRecuitmentComponent, EvaluatePartnerComponent, VocabularySharedComponent, MyAffiliateComponent,
  PostJobNbComponent, PostJobTnComponent, PostJobDlComponent, ShareReferralComponent, HotOrderComponent, HotCustomerComponent,
  Error404Component, SimpleSearchComponent, SidebarComponent, IndexComponent];
const ENTRY_COMPONENTS = [RecruitmentDetailComponent, FilterWishComponent, FilterReferralsComponent, FilterRecruitmentComponent, FilterContractComponent,
  EvaluatePartnerAddComponent, RecruitmentChooseComponent, SelectIframeComponent, ReportTableComponent, ShareReferralRoleComponent, NotyDialogComponent];

@NgModule({
  declarations: [
    LAYOUT_COMPONENTS, ENTRY_COMPONENTS
  ],
  imports: [
    BrowserModule, BrowserAnimationsModule,
    HttpClientModule,
    ToolModule,
    VendorsModule,
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy'
    })
  ],
  entryComponents: [...ENTRY_COMPONENTS],
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

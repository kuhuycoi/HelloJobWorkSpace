
import { Routes } from '@angular/router';
import { CustomerWishComponent } from './pages/customer-wish/customer-wish.component';
import { Error404Component } from './pages/error404/error404.component';
import { FavouriteRecuitmentComponent } from './pages/favourite-recuitment/favourite-recuitment.component';
import { CustomerWishGuard } from './pages/guard/customer-wish.guard';
import { EditReferralGuard } from './pages/guard/edit-referral.guard';
import { PartnerGuard } from './pages/guard/partner.guard';
import { IndexComponent } from './pages/index/index.component';
import { ListRecruitmentComponent } from './pages/list-recruitment/list-recruitment.component';
import { MyAffiliateComponent } from './pages/my-affiliate/my-affiliate.component';
import { MyJobComponent } from './pages/my-job/my-job.component';
import { MyReferralsComponent } from './pages/my-referrals/my-referrals.component';
import { PartnerInfoComponent } from './pages/partner-info/partner-info.component';
import { PostJobDlComponent } from './pages/post-job/post-job-dl/post-job-dl.component';
import { PostJobNbComponent } from './pages/post-job/post-job-nb/post-job-nb.component';
import { PostJobTnComponent } from './pages/post-job/post-job-tn/post-job-tn.component';
import { PostJobComponent } from './pages/post-job/post-job.component';
import { QuickPostComponent } from './pages/post-job/quick-post/quick-post.component';
import { RegisterReferralComponent } from './pages/register-referral/register-referral.component';
import { VocabularySharedComponent } from './pages/vocabulary-shared/vocabulary-shared.component';

export const routes: Routes = [
  { path: '', redirectTo: 'trang-chu',pathMatch:'full' },
  { path: 'trang-chu', component: IndexComponent },
  { path: 'lao-dong-tim-viec', component: CustomerWishComponent, canActivate: [CustomerWishGuard], runGuardsAndResolvers: 'always' },
  {
    path: 'tuyen-dung', canActivate: [PartnerGuard], canActivateChild: [PartnerGuard], children: [
      { path: 'thong-tin', component: PartnerInfoComponent },
      { path: 'gioi-thieu-tham-gia', component: MyAffiliateComponent },
      { path: 'dang-don-hang-nhat-ban', component: PostJobNbComponent },
      { path: 'dang-don-hang-dai-loan', component: PostJobDlComponent },
      { path: 'dang-don-hang-trong-nuoc', component: PostJobTnComponent },
      { path: 'dang-don-hang-nhanh', component: QuickPostComponent },
      { path: 'dang-don-hang', component: PostJobComponent },
      { path: 'sua-don-hang/:id', component: PostJobComponent },
      { path: 'don-hang-da-dang', component: MyJobComponent },
      { path: 'danh-sach-ung-tuyen', component: ListRecruitmentComponent },
      { path: 'lao-dong-cua-toi', component: MyReferralsComponent },
      { path: 'gioi-thieu-lao-dong', component: RegisterReferralComponent },
      { path: 'sua-lao-dong/:id', component: RegisterReferralComponent, canActivate: [EditReferralGuard] },
      { path: 'lao-dong-quan-tam', component: FavouriteRecuitmentComponent },
      { path: 'form-duoc-chia-se', component: VocabularySharedComponent },
    ]
  },
  { path: '**', component: Error404Component }
];

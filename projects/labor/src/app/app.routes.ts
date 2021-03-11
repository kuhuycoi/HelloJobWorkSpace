import { OrderContractDetailComponent } from './public/order-contract-detail/order-contract-detail.component';
import { PublicComponent } from './public/public.component';
import { OrderContractComponent } from './public/order-contract/order-contract.component';
import { IndexComponent } from './public/index/index.component';
import { Routes } from '@angular/router';
import { VerifiedComponent } from './verified/verified.component';
import { VerifiedGuard } from './verified/guard/verified.guard';
import { ProfileComponent } from './verified/profile/profile.component';
import { ApplyComponent } from './public/apply/apply.component';
import { KhaiPhomComponent } from './khai-phom/khai-phom.component';
import { QuestionComponent } from './khai-phom/question/question.component';
import { ChangePasswordComponent } from './verified/change-password/change-password.component';
import { CompleteComponent } from './khai-phom/complete/complete.component';
import { HistoryRecruitmentComponent } from './verified/history-recruitment/history-recruitment.component';
import { FavouriteOrderContractComponent } from './verified/favourite-order-contract/favourite-order-contract.component';
import { CvComponent } from './verified/cv/cv.component';
import { MyWishComponent } from './verified/my-wish/my-wish.component';
import { SettingComponent } from './verified/setting/setting.component';
import { TermComponent } from './public/term/term.component';
import { PrivacyComponent } from './public/privacy/privacy.component';
import { OrderContractTnComponent } from './public/order-contract/order-contract-tn/order-contract-tn.component';
import { OrderContractNbComponent } from './public/order-contract/order-contract-nb/order-contract-nb.component';
import { OrderContractDlComponent } from './public/order-contract/order-contract-dl/order-contract-dl.component';
import { Error404Component } from './public/error404/error404.component';

export const routes: Routes = [
  {
    path: 'khai-phom', component: KhaiPhomComponent, children: [
      { path: '', redirectTo: 'thong-tin', pathMatch: 'full' },
      { path: 'thong-tin', component: QuestionComponent },
      { path: 'thanh-cong', component: CompleteComponent },
    ]
  },
  {
    path: 'tai-khoan', component: VerifiedComponent, canActivate: [VerifiedGuard], children: [
      { path: 'thong-tin', component: ProfileComponent },
      { path: 'cai-dat', component: SettingComponent },
      { path: 'doi-mat-khau', component: ChangePasswordComponent },
      { path: 'lich-su-ung-tuyen', component: HistoryRecruitmentComponent },
      { path: 'don-hang-quan-tam', component: FavouriteOrderContractComponent },
      { path: 'cv', component: CvComponent },
      { path: 'nhu-cau-tim-viec', component: MyWishComponent }
    ]
  },
  { path: 'dang-ky-ung-tuyen/:id', component: ApplyComponent },
  {
    path: '', component: PublicComponent,
    children: [
      { path: '', redirectTo: 'trang-chu', pathMatch: 'full' },
      { path: 'trang-chu', component: IndexComponent },
      { path: 'quy-dinh-bao-mat', component: PrivacyComponent },
      { path: 'thoa-thuan-su-dung', component: TermComponent },
      { path: 'don-hang', component: OrderContractComponent },
      { path: 'don-hang-trong-nuoc', component: OrderContractTnComponent },
      { path: 'don-hang-nhat-ban', component: OrderContractNbComponent },
      { path: 'don-hang-dai-loan', component: OrderContractDlComponent },
      { path: 'don-hang/:id', component: OrderContractDetailComponent },
      // { path: 'lao-dong-tim-viec', component: CustomerWishComponent, canActivate: [CustomerWishGuard], runGuardsAndResolvers: 'always' },
      // { path: 'cv/:id', component: PublicCvComponent, canActivate: [CanViewCvGuard] },
      // { path: 'danh-gia-nha-moi-gioi/:id', component: EvaluatePartnerComponent },
      { path: '**', component: Error404Component },
    ]
  },
];

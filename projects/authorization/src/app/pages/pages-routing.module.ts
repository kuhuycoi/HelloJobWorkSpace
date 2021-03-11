import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Hj10HometownComponent } from 'projects/authorization/src/app/pages/labor/hj10-hometown/hj10-hometown.component';
import { Hj11GenderComponent } from 'projects/authorization/src/app/pages/labor/hj11-gender/hj11-gender.component';
import { Hj12HeightComponent } from 'projects/authorization/src/app/pages/labor/hj12-height/hj12-height.component';
import { Hj13WeightComponent } from 'projects/authorization/src/app/pages/labor/hj13-weight/hj13-weight.component';
import { Hj14MarriageComponent } from 'projects/authorization/src/app/pages/labor/hj14-marriage/hj14-marriage.component';
import { Hj15SchoolComponent } from 'projects/authorization/src/app/pages/labor/hj15-school/hj15-school.component';
import { Hj17CharacteristicsComponent } from 'projects/authorization/src/app/pages/labor/hj17-characteristics/hj17-characteristics.component';
import { Hj18ExperiencesComponent } from 'projects/authorization/src/app/pages/labor/hj18-experiences/hj18-experiences.component';
import { Hj19FindWorkComponent } from 'projects/authorization/src/app/pages/labor/hj19-find-work/hj19-find-work.component';
import { Hj2AccountTypeComponent } from 'projects/authorization/src/app/pages/labor/hj2-account-type/hj2-account-type.component';
import { Hj20AvatarComponent } from 'projects/authorization/src/app/pages/labor/hj20-avatar/hj20-avatar.component';
import { Hj21ProfileComponent } from 'projects/authorization/src/app/pages/labor/hj21-profile/hj21-profile.component';
import { Hj3ConfirmPhoneComponent } from 'projects/authorization/src/app/pages/labor/hj3-confirm-phone/hj3-confirm-phone.component';
import { Hj4OtpVerificationComponent } from 'projects/authorization/src/app/pages/labor/hj4-otp-verification/hj4-otp-verification.component';
import { Hj5EmailComponent } from 'projects/authorization/src/app/pages/labor/hj5-email/hj5-email.component';
import { Hj6LinkSnsComponent } from 'projects/authorization/src/app/pages/labor/hj6-link-sns/hj6-link-sns.component';
import { Hj7GreetingComponent } from 'projects/authorization/src/app/pages/labor/hj7-greeting/hj7-greeting.component';
import { Hj8AccountNameComponent } from 'projects/authorization/src/app/pages/labor/hj8-account-name/hj8-account-name.component';
import { Hj9BirthdayComponent } from 'projects/authorization/src/app/pages/labor/hj9-birthday/hj9-birthday.component';
import { Hj1WelcomeComponent } from './hj1-welcome/hj1-welcome.component';
import { LoginStep1Component } from './login/login-step1/login-step1.component';
import { LoginStep2Component } from './login/login-step2/login-step2.component';
const routes: Routes = [
  { path: '', component: Hj1WelcomeComponent },
  {
    path: 'dang-nhap', children: [
      { path: '', component: LoginStep1Component },
      { path: 'xac-nhan-otp', component: LoginStep2Component },
    ]
  },
  {
    path: 'dang-ky', children: [
      { path: '', component: Hj2AccountTypeComponent },
      {
        path: 'ung-vien', children: [
          { path: 'so-dien-thoai', component: Hj3ConfirmPhoneComponent },
          { path: 'xac-nhan-otp', component: Hj4OtpVerificationComponent },
          { path: 'email', component: Hj5EmailComponent },
          { path: 'mang-xa-hoi', component: Hj6LinkSnsComponent },
          { path: 'dam-bao-thong-tin', component: Hj7GreetingComponent },
          { path: 'ho-ten', component: Hj8AccountNameComponent },
          { path: 'ngay-sinh', component: Hj9BirthdayComponent },
          { path: 'que-quan', component: Hj10HometownComponent },
          { path: 'gioi-tinh', component: Hj11GenderComponent },
          { path: 'chieu-cao', component: Hj12HeightComponent },
          { path: 'can-nang', component: Hj13WeightComponent },
          { path: 'tinh-trang-hon-nhan', component: Hj14MarriageComponent },
          { path: 'bang-cap', component: Hj15SchoolComponent },
          { path: 'tinh-cach', component: Hj17CharacteristicsComponent },
          { path: 'kinh-nghiem', component: Hj18ExperiencesComponent },
          { path: 'mong-muon', component: Hj19FindWorkComponent },
          { path: 'anh-dai-dien', component: Hj20AvatarComponent },
          { path: 'xac-nhan', component: Hj21ProfileComponent }
        ]
      },
    ]
  }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {

}

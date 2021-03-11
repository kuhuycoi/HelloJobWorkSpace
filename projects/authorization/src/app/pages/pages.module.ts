import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { Hj2AccountTypeComponent } from './labor/hj2-account-type/hj2-account-type.component';
import { Hj3ConfirmPhoneComponent } from './labor/hj3-confirm-phone/hj3-confirm-phone.component';
import { Hj4OtpVerificationComponent } from './labor/hj4-otp-verification/hj4-otp-verification.component';
import { Hj5EmailComponent } from './labor/hj5-email/hj5-email.component';
import { Hj6LinkSnsComponent } from './labor/hj6-link-sns/hj6-link-sns.component';
import { Hj7GreetingComponent } from './labor/hj7-greeting/hj7-greeting.component';
import { Hj14MarriageComponent } from './labor/hj14-marriage/hj14-marriage.component';
import { Hj11GenderComponent } from './labor/hj11-gender/hj11-gender.component';
import { Hj12HeightComponent } from './labor/hj12-height/hj12-height.component';
import { Hj13WeightComponent } from './labor/hj13-weight/hj13-weight.component';
import { Hj15SchoolComponent } from './labor/hj15-school/hj15-school.component';
import { Hj17CharacteristicsComponent } from './labor/hj17-characteristics/hj17-characteristics.component';
import { Hj19FindWorkComponent } from './labor/hj19-find-work/hj19-find-work.component';
import { Hj20AvatarComponent } from './labor/hj20-avatar/hj20-avatar.component';
import { Hj21ProfileComponent } from './labor/hj21-profile/hj21-profile.component';
import { Hj18ExperiencesComponent, ExperienceSelectingDialog } from './labor/hj18-experiences/hj18-experiences.component';
import { Hj9BirthdayComponent } from './labor/hj9-birthday/hj9-birthday.component';
import { Hj8AccountNameComponent } from './labor/hj8-account-name/hj8-account-name.component';
import { Hj10HometownComponent } from './labor/hj10-hometown/hj10-hometown.component';

import { PagesRoutingModule } from './pages-routing.module';
import { VendorsModule } from 'projects/vendors/src/public-api';
import { Hj1WelcomeComponent } from './hj1-welcome/hj1-welcome.component';
import { CommonModule } from '@angular/common';
import { LoginStep1Component } from './login/login-step1/login-step1.component';
import { LoginStep2Component } from './login/login-step2/login-step2.component';

var COMPONENTS = [
  Hj1WelcomeComponent,
  Hj2AccountTypeComponent,
  Hj3ConfirmPhoneComponent,
  Hj4OtpVerificationComponent,
  Hj5EmailComponent,
  Hj6LinkSnsComponent,
  Hj7GreetingComponent,
  Hj8AccountNameComponent,
  Hj9BirthdayComponent,
  Hj10HometownComponent,
  Hj14MarriageComponent,
  Hj11GenderComponent,
  Hj12HeightComponent,
  Hj13WeightComponent,
  Hj14MarriageComponent,
  Hj15SchoolComponent,
  Hj17CharacteristicsComponent,
  Hj18ExperiencesComponent,
  Hj19FindWorkComponent,
  Hj20AvatarComponent,
  Hj21ProfileComponent,
  ExperienceSelectingDialog, 
  LoginStep1Component, 
  LoginStep2Component
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    VendorsModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }

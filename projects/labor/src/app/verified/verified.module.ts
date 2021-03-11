import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { VerifiedComponent } from './verified.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HistoryRecruitmentComponent } from './history-recruitment/history-recruitment.component';
import { FavouriteOrderContractComponent } from './favourite-order-contract/favourite-order-contract.component';
import { CvComponent } from './cv/cv.component';
import { MyWishComponent } from './my-wish/my-wish.component';
import { ProfileNavComponent } from './profile-nav/profile-nav.component';
import { SettingComponent } from './setting/setting.component';
import { VendorsModule } from 'projects/vendors/src/public-api';
import { ToolModule } from 'projects/tools/src/lib/tool.module';


const LAYOUT_COMPONENTS = [VerifiedComponent, ProfileComponent,
  ChangePasswordComponent, CvComponent, HistoryRecruitmentComponent,
  FavouriteOrderContractComponent, MyWishComponent, ProfileNavComponent, SettingComponent];
const ENTRY_COMPONENTS = [];
const DIRECTIVES = [];
@NgModule({
  declarations: [LAYOUT_COMPONENTS, ENTRY_COMPONENTS, DIRECTIVES],
  imports: [
    SharedModule,
    ToolModule,
    VendorsModule
  ],
  providers: [
  ],
  entryComponents: [ENTRY_COMPONENTS],
  exports: []
})
// export class VerifiedModule { };

export class VerifiedModule{}

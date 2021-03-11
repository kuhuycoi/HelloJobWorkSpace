import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUtils } from './utils/common-utils.service';
import { SpinnerService } from './services/spinner.service';
import { UserService } from './services/user.service';
import { HoldableDirective } from './directives/holdable.directive';
import { DevelopingFunctionDirective } from './directives/developing-function.directive';
import { BackToTopDirective } from './directives/back-to-top.directive';
import { ZoomImageDirective } from './directives/zoom-image.directive';
import { ZoomGalleryDirective } from './directives/zoom-gallery.directive';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MicOverlayComponent } from './components/mic-overlay/mic-overlay.component';
import { NameI18nPipe } from './pipe/name-i18n.pipe';
import { FbCommentComponent } from './components/fb-comment/fb-comment.component';
import { TrustHTMLPipe } from './pipe/trust-html.pipe';
import { AgePipe } from './pipe/age.pipe';
import { CurrencyStringPipe } from './pipe/currency-string.pipe';


const DIRECTIVES = [
  HoldableDirective, DevelopingFunctionDirective,
  ZoomImageDirective, BackToTopDirective,
  ZoomGalleryDirective
];
const PROVIDERS = [UserService, SpinnerService, CommonUtils];

const COMPONENTS = [FbCommentComponent];
const ENTRY_COMPONENTS = [GalleryComponent, MicOverlayComponent];
const PIPES = [AgePipe, NameI18nPipe, TrustHTMLPipe,CurrencyStringPipe];

@NgModule({
  declarations: [...DIRECTIVES, ENTRY_COMPONENTS, COMPONENTS, PIPES],
  imports: [
    CommonModule
  ],
  providers: [PROVIDERS],
  exports: [...DIRECTIVES, ENTRY_COMPONENTS, COMPONENTS, PIPES]
})
export class ToolModule { }

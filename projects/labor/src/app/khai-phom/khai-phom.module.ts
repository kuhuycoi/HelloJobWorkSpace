import { NgModule } from '@angular/core';
import { KhaiPhomComponent } from './khai-phom.component';
import { DefaultComponent } from './default/default.component';
import { QuestionComponent } from './question/question.component';
import { SharedModule } from '../shared/shared.module';
import { CompleteComponent } from './complete/complete.component';
import { BasicFormComponent } from './question/basic-form/basic-form.component';
import { StepByStepFormComponent } from './question/step-by-step-form/step-by-step-form.component';
import { ToolModule } from 'projects/tools/src/lib/tool.module';
import { VendorsModule } from 'projects/vendors/src/public-api';

const LAYOUT_COMPONENTS = [KhaiPhomComponent, DefaultComponent, QuestionComponent, CompleteComponent,
  BasicFormComponent, StepByStepFormComponent];


@NgModule({
  declarations: [LAYOUT_COMPONENTS],
  imports: [SharedModule, ToolModule, VendorsModule],
  exports: [LAYOUT_COMPONENTS],
  entryComponents: []
})
export class KhaiPhomModule { }

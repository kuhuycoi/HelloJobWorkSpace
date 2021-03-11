import { NgModule } from '@angular/core';

// Material Module
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
// tslint:disable-next-line:max-line-length
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, NativeDateModule, MAT_DATE_LOCALE, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatBadgeModule } from '@angular/material/badge';

const MATERIAL_MODULE = [
  MatMenuModule, MatButtonModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, MatDialogModule, MatTabsModule,
  MatSidenavModule, MatExpansionModule, MatInputModule, MatSelectModule, MatButtonToggleModule, MatListModule, MatDividerModule,
  MatCheckboxModule, MatProgressSpinnerModule, MatSnackBarModule, MatDatepickerModule, NativeDateModule, MatNativeDateModule,
  MatTableModule, MatCardModule, MatChipsModule, MatAutocompleteModule, MatToolbarModule, MatStepperModule, MatRadioModule,
  MatFormFieldModule, MatProgressBarModule, MatPaginatorModule, MatTreeModule, MatBottomSheetModule, MatSortModule,
  MatStepperModule, MatBadgeModule, MatRippleModule
];
@NgModule({
  declarations: [],
  imports: [
    MATERIAL_MODULE,
  ],
  providers: [],
  entryComponents: [],
  exports: [MATERIAL_MODULE]
})
export class MaterialModule { }
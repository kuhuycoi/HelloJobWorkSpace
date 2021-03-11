import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ShareReferralComponent } from 'projects/labor/src/app/shared/share-referral/share-referral.component';
import { VocabularySharedService } from 'projects/tools/src/lib/services/vocabulary-shared.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
})
export class SettingComponent implements OnInit {
  currentCustomer;
  constructor(
    private vocabularySharedService: VocabularySharedService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    if (this.userService.currentCustomer) {
      this.currentCustomer = this.userService.currentCustomer.value;
    }
  }
  form = new FormGroup({
    roleType: new FormControl('PUBLIC'),
  });
  get roleType() {
    return this.form.get('roleType');
  }
  ngOnInit(): void {
    this.roleType.setValue(this.currentCustomer.isPublicCV);
  }
  changePublicPhonenumber(val) {
    this.userService.changePublicPhonenumber().subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      }
    });
  }

  // changeRole() {
  //   this.bottomSheet.open(ShareReferralRoleComponent, { data: { customerID: this.currentCustomer } });
  // }

  changeRole() {
    this.vocabularySharedService
      .getCustomerWishInfo()
      .subscribe((res: ResponseApi) => {
        if (res.success) {
          const item = res.data;
          const diaglogRef = this.dialog.open(ShareReferralComponent, {
            width: '100%',
            height: '100%',
            maxHeight: '100%',
            panelClass: 'full-width-dialog',
            data: { referral: item, isMyinfo: true },
          });
          diaglogRef.afterClosed().subscribe((data) => {
            this.currentCustomer.isPublicCV = item.customerID.isPublicCV;
          });
        }
      });
  }
}

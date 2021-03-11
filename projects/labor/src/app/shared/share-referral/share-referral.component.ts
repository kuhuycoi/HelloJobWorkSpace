import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatBottomSheetRef,
  MatBottomSheet,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

import { MatSnackBar } from '@angular/material/snack-bar';
import { VocabularySharedService } from 'projects/tools/src/lib/services/vocabulary-shared.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-share-referral',
  templateUrl: './share-referral.component.html',
  styleUrls: ['./share-referral.component.scss'],
})
export class ShareReferralComponent implements OnInit {
  listShared = [];
  currentPartner;
  urlCV;
  form = new FormGroup({
    username: new FormControl(null, [Validators.required]),
  });
  get username() {
    return this.form.get('username');
  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private vocabularySharedService: VocabularySharedService,
    public dialogRef: MatDialogRef<ShareReferralComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {
    this.currentPartner = this.userService.currentPartner.value;
  }
  ngOnInit(): void {
    this.reload();
    this.urlCV = 'https://choxkld.com/cv/' + this.data.referral.customerID.id;
  }

  reload() {
    this.vocabularySharedService
      .listSharedByCustomerWish(this.data.referral.id)
      .subscribe((res: ResponseApi) => {
        this.listShared = res.data;
      });
  }
  changeRole() {
    this.bottomSheet.open(ShareReferralRoleComponent, {
      data: {
        customerID: this.data.referral.customerID,
        isMyinfo: this.data?.isMyinfo,
      },
    });
  }

  onSubmit() {
    const customerWishID = this.data.referral?.id;
    const phonenumber = this.username.value;
    this.vocabularySharedService
      .shareInfo(customerWishID, phonenumber)
      .subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500,
          });
          this.reload();
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500,
          });
        }
      });
  }

  deleteShare(item) {
    if (!confirm('Bạn có muốn xóa chia sẻ với người này?')) {
      return;
    }
    this.vocabularySharedService
      .vocabularyShareDelete(item.id)
      .subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500,
          });
          this.reload();
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500,
          });
        }
      });
  }
}

@Component({
  selector: 'app-share-referral-role',
  templateUrl: 'share-referral-role.component.html',
  styleUrls: ['./share-referral-role.component.scss'],
})
export class ShareReferralRoleComponent {
  form = new FormGroup({
    roleType: new FormControl(this.data.customerID.isPublicCV),
  });
  get roleType() {
    return this.form.get('roleType');
  }
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private bottomSheetRef: MatBottomSheetRef<ShareReferralRoleComponent>
  ) {}

  onSubmit() {
    this.bottomSheetRef.dismiss(this.roleType.value);
    if (confirm('Bạn chắc chắn muốn thực hiện hành động này?')) {
      if (this.data.isMyinfo) {
        this.userService
          .changePublicCV(this.roleType.value)
          .subscribe((res: ResponseApi) => {
            if (res.success) {
              this.snackBar.open(res.message, 'x', {
                panelClass: ['style-success'],
                duration: 2500,
              });
              this.data.customerID.isPublicCV = this.roleType.value;
              this.bottomSheetRef.dismiss();
            } else {
              this.snackBar.open(res.message, 'x', {
                panelClass: ['style-error'],
                duration: 2500,
              });
            }
          });
      } else {
        this.userService
          .myReferralChangePublicCV(
            this.roleType.value,
            this.data.customerID.id
          )
          .subscribe((res: ResponseApi) => {
            if (res.success) {
              this.snackBar.open(res.message, 'x', {
                panelClass: ['style-success'],
                duration: 2500,
              });
              this.data.customerID.isPublicCV = this.roleType.value;
              this.bottomSheetRef.dismiss();
            } else {
              this.snackBar.open(res.message, 'x', {
                panelClass: ['style-error'],
                duration: 2500,
              });
            }
          });
      }
    }
  }
}

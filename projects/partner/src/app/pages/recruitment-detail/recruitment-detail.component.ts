import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-recruitment-detail',
  templateUrl: './recruitment-detail.component.html',
  styleUrls: ['./recruitment-detail.component.scss']
})
export class RecruitmentDetailComponent implements OnInit {

  recruitment;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService, private snackBar: MatSnackBar) {
    this.recruitment = data.recruitment;
  }

  ngOnInit(): void {
  }
  get localStorage() {
    return localStorage;
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  accept() {
    if (!confirm('Bạn muốn duyệt đơn hàng này?')) {
      return;
    }
    this.userService.acceptRecruitment(this.recruitment.id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.recruitment.status = 1;
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
      return;
    });
  }
  deny() {
    if (!confirm('Bạn muốn từ chối đơn hàng này?')) {
      return;
    }
    this.userService.refuseRecruitment(this.recruitment.id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.recruitment.status = 2;
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
      return;
    });
  }
}

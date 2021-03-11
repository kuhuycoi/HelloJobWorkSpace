import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserReportService } from 'projects/tools/src/lib/services/user-report.service';
import { UserReportReasonService } from 'projects/tools/src/lib/services/user-report-reason.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';

@Component({
  selector: 'app-report-table',
  templateUrl: './report-table.component.html',
  styleUrls: ['./report-table.component.scss']
})
export class ReportTableComponent implements OnInit {
  reasonList = [];
  otherReason = false;
  constructor(
    private snackBar: MatSnackBar,
    private userReportReasonService: UserReportReasonService,
    public dialogRef: MatDialogRef<ReportTableComponent>,
    private userReportService: UserReportService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
  }
  form = new FormGroup({
    reportReasonID: new FormControl(null, [Validators.required]),
    content: new FormControl(null)
  });

  get reportReasonID() {
    return this.form.get('reportReasonID');
  }
  get content() {
    return this.form.get('content');
  }
  ngOnInit(): void {
    this.userReportReasonService.getAllAvaiable().subscribe((res: ResponseApi) => {
      this.reasonList = res.data;
    });
    this.reportReasonID.valueChanges.subscribe(value => {
      //C78D63F8-9B53-4EA0-9975-7F02A7C5F9FA ID khác
      if (value === 'C78D63F8-9B53-4EA0-9975-7F02A7C5F9FA') {
        this.otherReason = true;
        this.content.setValidators(Validators.required);
      } else {
        this.otherReason = false;
        this.content.setValidators(null);
        this.content.setValue(null);
      }
    });
  }

  getError(control) {
    if (control.hasError('required')) {
      return 'Vui lòng nhập trường này';
    } else if (control.hasError('pattern')) {
      return 'Không đúng định dạng';
    } else {
      return 'Vui lòng nhập lại';
    }
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    data.refID = this.data.report.refID;
    data.type = this.data.report.type;
    data.userReportedID = this.data.report.userReportedID;
    const formData = CommonUtils.buildParams(data);
    this.userReportService.report(formData).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.dialogRef.close();
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    })
  }
}

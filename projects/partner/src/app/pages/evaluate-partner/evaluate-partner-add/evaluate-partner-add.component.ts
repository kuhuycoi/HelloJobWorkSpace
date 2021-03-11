import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvaluatePartnerService } from 'projects/tools/src/lib/services/evaluate-partner';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';
import { Pager } from 'projects/tools/src/lib/types/pager';

@Component({
  selector: 'app-evaluate-partner-add',
  templateUrl: './evaluate-partner-add.component.html',
  styleUrls: ['./evaluate-partner-add.component.scss']
})
export class EvaluatePartnerAddComponent implements OnInit {
  partner;
  pager: Pager;
  form = new FormGroup({
    content: new FormControl(null),
    vote: new FormControl(null),
  });
  get content() {
    return this.form.get('content');
  }
  get vote() {
    return this.form.get('vote');
  }
  constructor(
    private snackBar: MatSnackBar,
    private evaluatePartnerService: EvaluatePartnerService,
    public dialogRef: MatDialogRef<EvaluatePartnerAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    let form = this.form.value;
    form.partnerCompanyID = this.data.id;
    form.vote = 5;
    const params = CommonUtils.buildParams(form);
    this.evaluatePartnerService.evaluatePartnerCompanyInsert(params).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.dialogRef.close(true);
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    });
  }
}

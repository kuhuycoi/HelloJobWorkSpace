import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JobProvinceService } from 'projects/tools/src/lib/services/job-province.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';

@Component({
  selector: 'app-my-wish',
  templateUrl: './my-wish.component.html',
  styleUrls: ['./my-wish.component.scss'],
})
export class MyWishComponent implements OnInit {
  jobProvinces = [];
  form: FormGroup = new FormGroup({
    customerID: new FormControl(null),
    salaryFrom: new FormControl(null, [Validators.min(0)]),
    salaryTo: new FormControl(null, [Validators.min(0)]),
    // address: new FormControl(null),
    moduleIDs: new FormControl([]),
    note: new FormControl(null),
    isActive: new FormControl(null),
    jobProvinceID: new FormControl(null),
  });
  @Input() websiteModules = [];
  constructor(
    private jobProvinceService: JobProvinceService,
    private userService: UserService,
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}
  get f() {
    return this.form.controls;
  }
  ngOnInit(): void {
    this.jobProvinceService
      .findAllAvaiable('ja')
      .subscribe((res: ResponseApi) => {
        this.jobProvinces = res.data;
      });
    this.publicService
      .findAllOrderContractGroup()
      .subscribe((res: ResponseApi) => {
        this.websiteModules = res.data;
      });
    this.userService.findOneCustomerWish().subscribe((res: ResponseApi) => {
      if (res.data != null) {
        if (res.data.moduleIDs != null) {
          res.data.moduleIDs = res.data.moduleIDs
            .split(',')
            .filter((item) => item !== '')
            .map((item) => {
              return parseInt(item, 10);
            });
        }
        this.setFormValue(res.data);
        if (!this.f.note.value) {
          this.f.note.setValue('Tôi đang có nhu cầu tìm việc');
        }
        if (res.data.jobProvinceID) {
          this.f.jobProvinceID.setValue(res.data.jobProvinceID.id);
        }
      }
    });
    this.f.salaryFrom.valueChanges.subscribe((value) => {
      if (value) {
        this.f.salaryTo.setValidators([Validators.min(value)]);
      } else {
        this.f.salaryTo.setValidators([Validators.min(0)]);
      }
    });
  }
  public setFormValue(data?: any) {
    this.form.setValue(CommonUtils.copyProperties(this.form.value, data));
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const form = this.form.value;
    if (form.moduleIDs != null) {
      if (form.moduleIDs.indexOf(4) < 0) {
        form.moduleIDs.push(4);
      }
      if (!Array.isArray(form.moduleIDs)) {
        form.moduleIDs = form.moduleIDs
          .split(',')
          .filter((item) => item !== '')
          .map((item) => {
            return parseInt(item, 10);
          });
      }
      form.moduleIDs = ',' + form.moduleIDs.join(',') + ',';
    }
    const body = CommonUtils.buildParams(form);
    this.userService.customerWishEdit(body).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
        // this.router.navigate(['/doi-tac/don-hang-da-dang']);
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      }
      return;
    });
  }
  changePostType(event) {
    this.f.isActive.setValue(event);
  }

  cancel() {
    this.router.navigate(['/']);
  }
}

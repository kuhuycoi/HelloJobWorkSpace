import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateAdapter } from '@angular/material/core';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { removeUnicode } from 'projects/tools/src/lib/utils/string-utils';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';

@Component({
  selector: 'app-advance-post',
  templateUrl: './advance-post.component.html',
  styleUrls: ['./advance-post.component.scss']
})
export class AdvancePostComponent implements OnInit, AfterViewInit {
  form: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    nameAscii: new FormControl(null),
    description: new FormControl(null),
    content: new FormControl(null),
    createdDate: new FormControl(null),
    lang: new FormControl(null),
    orderDisplay: new FormControl(null),
    seoDescription: new FormControl(null),
    seoKeyword: new FormControl(null),
    seoTitle: new FormControl(null),
    isHome: new FormControl(null),
    isHot: new FormControl(null),
    viewed: new FormControl(null),
    moduleIDs: new FormControl(null, [Validators.required]),
    moduleTypeCode: new FormControl(null),
    contentSource: new FormControl(null),
    contractQuantity: new FormControl(null),
    contractAddress: new FormControl(null, [Validators.required]),
    contractSalary: new FormControl(null, [Validators.required]),
    contractRequire: new FormControl(null),
    contractWelfare: new FormControl(null),
    contractTimeline: new FormControl(null),
    contractPartnerInfo: new FormControl(null),
    contractDate: new FormControl(null),
    orderContractID: new FormControl(null),
    partnerCompanyID: new FormControl(null),
    duration: new FormControl(null),
    contractSalaryExact: new FormControl(null),
    contractSalaryFrom: new FormControl(null),
    contractSalaryTo: new FormControl(null),
    urlApply: new FormControl(null),
    urlAvatar: new FormControl(null),
    phonenumber: new FormControl(null, [Validators.pattern(/^\+[\d]{6,}|0[\d]{9,10}$/)]),
    zaloContact: new FormControl(null),
  });
  file = new FormControl();
  fileName = '';
  @Input() isEdit = false;
  @Input() websiteModules = [];
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private adapter: DateAdapter<any>) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    if (id) {
      this.f.id.setValue(id);
    }
    this.adapter.setLocale('vi');
    if (this.isEdit) {
      this.userService.findOneWebsiteOrderContract(this.f.id.value).subscribe((res: ResponseApi) => {
        if (res.success) {
          if (res.data == null) {
            this.router.navigate(['/']);
          } else {
            res.data.moduleIDs = res.data.moduleIDs.split(',').filter(item => item !== '').map(item => {
              return parseInt(item, 10);
            });
            this.setFormValue(res.data);
          }
        }
      });
    } else {
      const partner = this.userService.currentPartner.value;
      if (partner) {
        this.f.contractPartnerInfo.setValue(partner.description);
        this.f.phonenumber.setValue(partner.mobile);
        this.f.zaloContact.setValue(partner.zaloContact);
      }
    }
  }

  get f() {
    return this.form.controls;
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const formData = new FormData();
    const form = this.form.value;
    if (form.moduleIDs.indexOf(4) < 0) {
      form.moduleIDs.push(4);
    }
    form.moduleIDs = ',' + form.moduleIDs.join(',') + ',';
    form.nameAscii = '/' + removeUnicode(form.name, '-', false);
    formData.append('websiteOrderContract', new Blob([JSON.stringify(form)], {
      type: 'application/json;charset=UTF-8',
    }));
    formData.append('file', this.file.value);

    if (!this.isEdit) {
      this.userService.websiteOrderContractInsert(formData).subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          this.router.navigate(['/doi-tac/don-hang-da-dang']);
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500
          });
        }
        return;
      });
    } else {
      this.userService.websiteOrderContractEdit(formData).subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          this.router.navigate(['/doi-tac/don-hang-da-dang']);
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500
          });
        }
      });
    }
  }

  public setFormValue(data?: any) {
    this.form.setValue(CommonUtils.copyProperties(this.form.value, data));
  }
  ngAfterViewInit() {
    // this.spinnerService.isLoading.next(false);
  }

  isChecked(id) {
    const checkedModules = this.f.moduleIDs.value;
    return checkedModules && checkedModules.indexOf(',' + id + ',') >= 0;
  }

  onFileChange(event) {
    if (event.target.files && event.target.files.length) {
      const files = event.target.files;
      const selectedFile = files[0];
      this.fileName = selectedFile.name + ' - ' + parseInt((selectedFile.size / 1024).toString(), 10) + 'kb';
      this.file.setValue(selectedFile);
    }
  }

  getError(control) {
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName)) {
        if (control.hasError('required')) {
          return 'Vui lòng nhập trường này';
        } else if (control.hasError('pattern')) {
          return 'Không đúng định dạng';
        } else {
          return 'Vui lòng nhập lại';
        }
      }
    }
    return undefined;
  }

}

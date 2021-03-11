import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPhoneCodeEntity } from 'projects/tools/src/lib/types/categories.types';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

@Component({
  selector: 'app-hj3-confirm-phone',
  templateUrl: './hj3-confirm-phone.component.html',
  styleUrls: ['./hj3-confirm-phone.component.scss'],
})
export class Hj3ConfirmPhoneComponent implements OnInit, AfterViewInit {
  public identifier: string = 'so-dien-thoai';
  public isReady: boolean = true;

  public phone_codes: IPhoneCodeEntity[] = [
    {
      key: 'JP',
      country: 'Nhật Bản',
      phone_code: '+81',
      default: false,
      rules: {
        minLength: 8,
        maxLength: 10,
      },
    },
    {
      key: 'VN',
      country: 'Việt Nam',
      phone_code: '+84',
      default: true,
      rules: {
        minLength: 8,
        maxLength: 10,
      },
    },
  ];
  public phone_number: string = '';

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private cdref: ChangeDetectorRef,
    private publicService: PublicService,
    private snackbar: MatSnackBar
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  public formFields = {
    number: {
      control: new FormControl('', [
        Validators.required,
        Validators.pattern(/[1-9]\d{8}$/),
        Validators.max(999999999),
      ]),
      errors: {
        required: 'Cần phải nhập số điện thoại',
        minLength: 'Số điện thoại cần chứa 9 chữ số',
        maxLength: 'Số điện thoại cần chứa 9 chữ số',
        pattern: 'Không phải là số điện thoại',
      },
    },
  };

  ngOnInit(): void {
    this.loadCacheData();
  }
  ngAfterViewInit() {
    this.cdref.detectChanges();
  }

  private loadCacheData() {
    if (this.service.userInfo.phoneNumber) {
      this.phone_number = this.service.userInfo.phoneNumber;
    } else {
      this.phone_number = '';
    }
  }

  public get processPercent() {
    return this.service.getProcessPercent();
  }

  public validate() {
    return this.phone_number && this.phone_number.length;
  }

  public moveNext(event: Event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.phoneNumber = this.phone_number;
    const data = { phoneNumber: this.phone_number };
    this.publicService
      .initOTP(CommonUtils.buildParams(data))
      .subscribe((res: ResponseApi) => {
        if (res.code === 1) {
          this.service.nextStep(this.router);
          this.snackbar.open(res.message, 'x', {
            duration: 5000,
          });
        } else {
          this.snackbar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 5000,
          });
        }
      });
  }
  public goBack() {
    this.service.goBack(this.router);
  }
}

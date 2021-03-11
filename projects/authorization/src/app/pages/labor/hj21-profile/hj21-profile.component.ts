import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';

@Component({
  selector: 'app-hj21-profile',
  templateUrl: './hj21-profile.component.html',
  styleUrls: ['./hj21-profile.component.scss'],
})
export class Hj21ProfileComponent implements OnInit {
  public identifier: string = 'xac-nhan';
  constructor(
    private router: Router,
    private datepipe: DatePipe,
    private service: Wf1NewUserService,
    private translate: TranslateService,
    private publicService: PublicService,
    private snackbar: MatSnackBar
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {}

  public get processPercent() {
    return this.service.getProcessPercent();
  }

  private validate() {
    return true;
  }

  public moveNext(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

  public uploadProfile(event: Event) {
    if (confirm('Mọi thông tin bạn cung cấp đã chính xác?')) {
      // alert('Đăng ký tài khoản thành công');      if (this.service.userInfo) {
      const data = {
        avatar: this.service.userInfo.avatar,
        character: this.service.userInfo.character,
        dateOfBirth: this.service.userInfo.dateOfBirth,
        email: this.service.userInfo.email,
        fullName: this.service.userInfo.fullName,
        gender: this.service.userInfo.gender,
        height: this.service.userInfo.height,
        highSchoolID: this.service.userInfo.highSchoolID,
        jobExperience: this.service.userInfo.jobExperience,
        jobWant: this.service.userInfo.jobWant,
        maritalStatus: this.service.userInfo.maritalStatus,
        otp: this.service.userInfo.otp,
        phoneNumber: this.service.userInfo.phoneNumber,
        provinceID: this.service.userInfo.provinceID,
        type: this.service.userInfo.type,
        weight: this.service.userInfo.weight,
      };
      console.log(data);
      const body = CommonUtils.buildParams(data);
      this.publicService
        .registerStepByStep(body)
        .subscribe((res: ResponseApi) => {
          if (res.success) {
            this.snackbar.open(res.message, 'x', {
              panelClass: ['style-success'],
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
  }

  public get basicInfo() {
    var y = new Date().getFullYear();
    var uy = this.service.userInfo.dateOfBirth
      ? new Date(this.service.userInfo.dateOfBirth).getFullYear()
      : 0;
    return {
      fullName: this.service.userInfo.fullName,
      dateOfBirth: this.datepipe.transform(
        this.service.userInfo.dateOfBirth,
        'dd/MM/yyyy'
      ),
      age: y - uy,
      gender: this.service.userInfo.gender,
      height: this.service.userInfo.height,
      weight: this.service.userInfo.weight,
      provinceID: this.service.userInfo.provinceID,
      maritalStatus: this.service.userInfo.maritalStatus,
      highSchoolID: this.service.userInfo.highSchoolID,
    };
  }

  public get avatar() {
    return this.service.userInfo.avatar;
  }

  public get jobExperience() {
    return this.service.userInfo.jobExperience
      ? this.service.userInfo.jobExperience
      : [];
  }

  public get characteristics() {
    return this.service.userInfo.character
      ? this.service.userInfo.character
      : [];
  }

  public get jobWant() {
    return this.service.userInfo.jobWant ? this.service.userInfo.jobWant : [];
  }

  public getMarialStatus(status) {
    return this.translate.get(`marialStatus.${status}`);
  }
}

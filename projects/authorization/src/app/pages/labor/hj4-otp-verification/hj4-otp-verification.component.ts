import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { AnnouncerService } from 'projects/tools/src/lib/services/announcer.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
declare var window: any;

@Component({
  selector: 'app-hj4-otp-verification',
  templateUrl: './hj4-otp-verification.component.html',
  styleUrls: ['./hj4-otp-verification.component.scss'],
})
export class Hj4OtpVerificationComponent implements OnInit {
  public identifier: string = 'xac-nhan-otp';
  @ViewChildren('inpNumber') inputs: QueryList<ElementRef>;
  public isReady: boolean = true;
  private isValidOTP = false;

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private announcer: AnnouncerService,
    private publicService: PublicService,
    private snackbar: MatSnackBar
  ) {
    this.service.moveTo(this.identifier, this.router);
    if (!this.service.userInfo.phoneNumber) {
      this.service.goBack(this.router);
    }
  }

  ngOnInit(): void {}

  public get processPercent() {
    return this.service.getProcessPercent();
  }

  public verifyOTP() {
    var otp = '';
    for (var i = 0; i < this.inputs.length; i++) {
      var v = ('' + this.inputs.get(i).nativeElement.value).trim();
      otp += v;
    }
    if (otp.length != this.inputs.length) return;

    try {
      const phone = this.service.userInfo.phoneNumber;
      const dataSMS = {
        phoneNumber: phone,
        otp,
      };
      this.publicService
        .checkOTP(CommonUtils.buildParams(dataSMS))
        .subscribe((res: ResponseApi) => {
          if (res.success) {
            this.isValidOTP = true;
          } else {
            this.snackbar.open(res.message, 'x', {
              panelClass: ['style-error'],
              duration: 5000,
            });
            this.isValidOTP = false;
          }
        });
    } catch (error) {}
  }

  public validate() {
    return this.isValidOTP;
  }

  public moveNext() {
    if (!this.validate()) {
      return;
    }
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

  public get phone() {
    try {
      var num = this.service.userInfo.phoneNumber;
      return num;
    } catch (error) {
      return null;
    }
  }

  public onFocus(event: Event, index: number) {
    this.inputs.get(index).nativeElement.value = '';
    this.isValidOTP = false;
  }

  public onKeyPress(event: KeyboardEvent, index: number) {
    try {
      event.preventDefault();
      const key = event.key;
      var str = this.inputs.get(index).nativeElement.value as string;
      if (key === 'Backspace' && !str?.length && index > 0) {
        this.inputs.get(index - 1).nativeElement.focus();
        return;
      }
      const isNumber = /^[0-9]$/i.test(key);
      if (!isNumber) {
        return;
      }
      if (str.length > 1) {
        this.inputs.get(index).nativeElement.setValue(str.charAt(0));
      }
      if (index + 1 < this.inputs.length) {
        this.inputs.get(index + 1).nativeElement.focus();
      }
      this.verifyOTP();
    } catch (error) {}
  }
  public onPaste(event: ClipboardEvent) {
    try {
      event.preventDefault();
      event.stopPropagation();
      let clipboardData = event.clipboardData || window.clipboardData;
      let pastedText = clipboardData.getData('text');
      let textSplits = pastedText.split('');
      this.inputs.forEach((item, index) => {
        if (index < textSplits.length) {
          item.nativeElement.value = textSplits[index];
        }
      });
    } catch (error) {}
  }

  public reSend(event: Event) {
    try {
      const phone = this.service.userInfo.phoneNumber;
      const data = { phoneNumber: phone };
      console.log(data);
      this.publicService
        .initOTP(CommonUtils.buildParams(data))
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
    } catch (error) {}
  }
}

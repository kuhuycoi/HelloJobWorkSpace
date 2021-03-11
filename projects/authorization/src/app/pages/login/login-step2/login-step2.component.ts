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
import { Wf1LoginUserService } from '../../../service/wf1-login-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
declare var window: any;

@Component({
  selector: 'app-login-step2',
  templateUrl: './login-step2.component.html',
  styleUrls: ['./login-step2.component.scss']
})
export class LoginStep2Component implements OnInit {
  public identifier: string = 'xac-nhan-otp';
  @ViewChildren('inpNumber') inputs: QueryList<ElementRef>;
  public isReady: boolean = true;
  private isValidOTP = false;

  constructor(
    private router: Router,
    private service: Wf1LoginUserService,
    private publicService: PublicService,
    private snackbar: MatSnackBar
  ) {
    if (!this.service.userInfo.phoneNumber) {
      this.router.navigateByUrl('/dang-nhap');
    }
  }

  ngOnInit(): void { }

  public get processPercent() {
    return 100;
  }

  public verifyOTP() {
    var otp = '';
    for (var i = 0; i < this.inputs.length; i++) {
      var v = ('' + this.inputs.get(i).nativeElement.value).trim();
      otp += v;
    }
    if (otp.length != this.inputs.length) return;

    try {
      const phoneNumber = this.service.userInfo.phoneNumber;
      const dataSMS = {
        phoneNumber,
        otp,
      };
      this.publicService
        .checkOTPForlogin(CommonUtils.buildParams(dataSMS))
        .subscribe((res: ResponseApi) => {
          if (res.success) {
            this.isValidOTP = true;
            this.snackbar.open(res.message, 'x', {
              panelClass: ['style-success'],
              duration: 5000,
            });
            window.location.href = `${localStorage.getItem('redirectUrl')}?token=${res.data}`;
          } else {
            this.snackbar.open(res.message, 'x', {
              panelClass: ['style-error'],
              duration: 5000,
            });
            this.isValidOTP = false;
          }
        });
    } catch (error) { }
  }

  public validate() {
    return this.isValidOTP;
  }

  public moveNext() {
    if (!this.validate()) {
      return;
    }
  }

  public goBack() {
    this.router.navigateByUrl('/dang-nhap');
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
    } catch (error) { }
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
    } catch (error) { }
  }

  public reSend() {
    try {
      const data = { phoneNumber: this.service.userInfo.phoneNumber };
      console.log(data);
      this.publicService
        .initOTPForLogin(CommonUtils.buildParams(data))
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
    } catch (error) { }
  }
}
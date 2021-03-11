import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserService } from 'projects/tools/src/lib/services/user.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  currentCustomer;
  haveSubmited = false;
  form = new FormGroup({
    oldPassword: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{6,12}$/),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9]{6,12}$/),
    ]),
    reTypePassword: new FormControl(null, [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private titleService: Title
  ) {
    if (this.userService.currentCustomer) {
      this.currentCustomer = this.userService.currentCustomer.value;
    }
    titleService.setTitle('Hello Job | Đăng ký');
  }
  get oldPassword() {
    return this.form.get('oldPassword');
  }
  get reTypePassword() {
    return this.form.get('reTypePassword');
  }
  get password() {
    return this.form.get('password');
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

  ngOnInit(): void {}
  public onSubmit() {
    this.haveSubmited = true;
    if (
      this.form.invalid ||
      this.password.value !== this.reTypePassword.value
    ) {
      return;
    }
    this.userService
      .changePassword(this.form.value)
      .subscribe((res: ResponseApi) => {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500,
          });
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500,
          });
        }
      });
  }
}

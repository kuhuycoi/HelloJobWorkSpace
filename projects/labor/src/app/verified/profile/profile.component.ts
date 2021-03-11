import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { DateAdapter } from '@angular/material/core';
import moment from 'moment';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { CommonUtils } from 'projects/tools/src/lib/utils/common-utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  haveSubmited = false;
  currentUser;
  currentCustomer;
  form = new FormGroup({
    phonenumber: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^\+[\d]{6,}|0[\d]{9,10}$/),
    ]),
    // tslint:disable-next-line: max-line-length
    email: new FormControl(null, [
      Validators.pattern(
        /^((([^#<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}));{0,1})+$/
      ),
    ]),
    dateOfBirth: new FormControl(null),
    fullName: new FormControl(null, Validators.required),
    gender: new FormControl(null),
    address: new FormControl(null),
  });
  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private adapter: DateAdapter<any>
  ) {
    if (this.userService.currentUser) {
      this.currentUser = this.userService.currentUser.value;
    }
    if (this.userService.currentCustomer) {
      this.currentCustomer = this.userService.currentCustomer.value;
      this.phonenumber.setValue(this.currentCustomer.phonenumber);
      this.email.setValue(this.currentCustomer.email);
      this.fullName.setValue(this.currentCustomer.fullName);
      this.gender.setValue(this.currentCustomer.gender);
      this.address.setValue(this.currentCustomer.address);
      if (this.currentCustomer.dateOfBirth) {
        this.dateOfBirth.setValue(moment(this.currentCustomer.dateOfBirth));
      }
    }
  }
  get dateOfBirth() {
    return this.form.get('dateOfBirth');
  }
  get phonenumber() {
    return this.form.get('phonenumber');
  }
  get email() {
    return this.form.get('email');
  }
  get fullName() {
    return this.form.get('fullName');
  }
  get address() {
    return this.form.get('address');
  }
  get gender() {
    return this.form.get('gender');
  }
  get localStorage() {
    return localStorage;
  }

  ngOnInit(): void {
    this.adapter.setLocale('vi');
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
    this.haveSubmited = true;
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    const body = CommonUtils.buildParams(data);
    this.userService.updateInfo(body).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
        if (res.data) {
          localStorage.setItem('CURRENT_USER', res.data);
        }
        this.userService.loaded.next(false);
        this.userService.loadUserInfo();
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      }
      return;
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}

import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
declare var $: any;

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  statistic;
  customOptions: OwlOptions = {
    loop: true,
    margin: 8,
    items: 2,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplaySpeed: 1000,
    responsive: {
      991: {
        items: 5,
      },
      768: {
        items: 3,
      },
      0: {
        items: 2,
      },
    },
  };
  favouriteList = [];
  form = new FormGroup({
    phoneNumber: new FormControl(null, [Validators.required]),
    fullName: new FormControl(null),
    wishlist: new FormControl(null),
  });
  get phoneNumber() {
    return this.form.get('phoneNumber');
  }
  get localStorage() {
    return localStorage;
  }
  get fullName() {
    return this.form.get('fullName');
  }
  get wishlist() {
    return this.form.get('wishlist');
  }
  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.userService.activeBottomNav.next(0);
  }

  ngOnInit() {
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
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  get isLoggedIn() {
    return (
      typeof localStorage.getItem('CURRENT_USER') !== 'undefined' &&
      localStorage.getItem('CURRENT_USER') != null
    );
  }
  public onSubmit() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    if (this.route.snapshot.queryParams.ref) {
      data.partnerCompanyID = { username: this.route.snapshot.queryParams.ref };
    }
    this.publicService
      .afiliate(this.form.value)
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
  scrollToAffiliateForm() {
    if ($(window).width() < 768) {
      $('#content .scroll').animate({ scrollTop: 550 }, 300);
    } else {
      $('#content .scroll').animate({ scrollTop: 0 }, 300);
    }
  }
}

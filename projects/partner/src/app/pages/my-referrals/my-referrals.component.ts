import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterWishComponent } from '../filter-wish/filter-wish.component';
import { CustomerWishPager } from 'projects/tools/src/lib/types/pager';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';
import { ShareReferralComponent } from '../share-referral/share-referral.component';


@Component({
  selector: 'app-my-referrals',
  templateUrl: './my-referrals.component.html',
  styleUrls: ['./my-referrals.component.scss']
})
export class MyReferralsComponent implements OnInit {
  pager: CustomerWishPager = new CustomerWishPager();
  items = [];
  lang = 'vi';
  constructor(
    private route: ActivatedRoute,
    private router: Router, private userService: UserService,
    public dialog: MatDialog, private titleService: Title,
    private snackBar: MatSnackBar, private translateService: TranslateService) {
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe(data => {
      this.lang = data.lang;
    });
    this.titleService.setTitle('Hello Job | Lao động của tôi');
    this.route.queryParams.subscribe((params: Params) => {
      window.scrollTo(0, 0);
      this.pager = new CustomerWishPager();
      this.pager.orderColumn = 'createdDate';
      this.pager.asc = false;
      const place = params.p;
      if (place) {
        this.pager.place = place;
      }
      const moduleId = params.m;
      if (moduleId) {
        try {
          this.pager.moduleId = parseInt(moduleId, 10);
        } catch {
        }
      }
      const orderColumn = params.o;
      if (orderColumn) {
        this.pager.orderColumn = orderColumn;
      }
      const asc = params.a;
      if (typeof asc !== 'undefined' && asc != null) {
        this.pager.asc = Boolean(JSON.parse(asc));
      }
      const gender = params.g;
      if (typeof gender !== 'undefined' && gender != null) {
        this.pager.gender = gender;
      }
      const currentPage = params.c;
      if (currentPage) {
        try {
          this.pager.currentPage = parseInt(currentPage, 10);
        } catch {
        }
      }
      const salaryFrom = params.sf;
      if (salaryFrom) {
        try {
          this.pager.salaryFrom = parseInt(salaryFrom, 10);
        } catch {
        }
      }
      const salaryTo = params.st;
      if (salaryTo) {
        try {
          this.pager.salaryTo = parseInt(salaryTo, 10);
        } catch {
        }
      }
      const ageFrom = params.af;
      if (ageFrom) {
        try {
          this.pager.ageFrom = parseInt(ageFrom, 10);
        } catch {
        }
      }
      const ageTo = params.at;
      if (ageTo) {
        try {
          this.pager.ageTo = parseInt(ageTo, 10);
        } catch {
        }
      }
      this.paging();
    });
  }

  ngOnInit() {
  }
  get localStorage() {
    return localStorage;
  }

  paging() {
    const params: { [key: string]: any } = {};
    params.currentPage = this.pager.currentPage;
    params.orderColumn = this.pager.orderColumn;
    params.asc = this.pager.asc;
    params.displayPerPage = this.pager.displayPerPage;
    if (this.pager.keyword) {
      params.keyword = this.pager.keyword;
    }
    this.userService.pagerMyReferrals(params).subscribe((res: ResponsePaging) => {
      this.items = res.items;
      this.pager.totalPage = res.pager.totalPage;
      this.pager.totalResult = res.pager.totalResult;
    });
  }
  get queryParams() {
    const params: Params = {};
    if (this.pager.keyword) {
      params.k = this.pager.keyword;
    }
    if (this.pager.place) {
      params.p = this.pager.place;
    }
    if (this.pager.moduleId) {
      params.m = this.pager.moduleId;
    }
    if (this.pager.salaryFrom) {
      params.sf = this.pager.salaryFrom;
    }
    if (this.pager.salaryTo) {
      params.st = this.pager.salaryTo;
    }
    if (this.pager.ageFrom) {
      params.af = this.pager.ageFrom;
    }
    if (this.pager.ageTo) {
      params.at = this.pager.ageTo;
    }
    if (this.pager.gender) {
      params.g = this.pager.gender;
    }
    if (this.pager.orderColumn) {
      params.o = this.pager.orderColumn;
    }
    if (typeof this.pager.asc !== 'undefined' && this.pager.asc != null) {
      params.a = this.pager.asc;
    }
    return params;
  }
  reload() {
    const params = this.queryParams;
    if (this.pager.currentPage !== 1) {
      params.c = this.pager.currentPage;
    }
    this.router.navigate(['/doi-tac/lao-dong-cua-toi'], { queryParams: params });
  }

  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
  }
  advanceFilter() {
    const dialogRef = this.dialog.open(FilterWishComponent, {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      autoFocus: !this.pager.keyword && !this.pager.place,
      data: { pager: this.pager }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.pager.currentPage = 1;
        this.reload();
      }
    });
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }

  deleteReferral(id) {
    if (!confirm('Bạn chắc chắn xóa lao động này?')) {
      return;
    }
    this.userService.deleteReferral(id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        this.paging();
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    });

  }
  shareReferral(item) {
    this.dialog.open(ShareReferralComponent, {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      data: { referral: item }
    });
  }
}


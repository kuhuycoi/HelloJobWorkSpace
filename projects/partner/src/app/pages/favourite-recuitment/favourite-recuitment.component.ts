import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FilterWishComponent } from '../filter-wish/filter-wish.component';
import { CustomerWishPager } from 'projects/tools/src/lib/types/pager';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-favourite-recuitment',
  templateUrl: './favourite-recuitment.component.html',
  styleUrls: ['./favourite-recuitment.component.scss']
})
export class FavouriteRecuitmentComponent implements OnInit {

  pager: CustomerWishPager = new CustomerWishPager();
  items = [];
  constructor(
    route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog, private titleService: Title, private snackBar: MatSnackBar
  ) {
    this.titleService.setTitle('Hello Job | Lao động đã lưu');
    route.queryParams.subscribe((params: Params) => {
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

  paging() {
    const params: { [key: string]: any } = {};
    params.currentPage = this.pager.currentPage;
    params.orderColumn = this.pager.orderColumn;
    params.asc = this.pager.asc;
    params.displayPerPage = this.pager.displayPerPage;
    if (this.pager.place) {
      params.place = this.pager.place;
    }
    if (this.pager.moduleId) {
      params.moduleId = this.pager.moduleId;
    }
    if (this.pager.salaryFrom) {
      params.salaryFrom = this.pager.salaryFrom;
    }
    if (this.pager.salaryTo) {
      params.salaryTo = this.pager.salaryTo;
    }
    if (this.pager.ageFrom) {
      params.ageFrom = this.pager.ageFrom;
    }
    if (this.pager.ageTo) {
      params.ageTo = this.pager.ageTo;
    }
    if (this.pager.gender) {
      params.gender = this.pager.gender;
    }
    this.userService.favouriteRecruitments(params).subscribe((res: ResponsePaging) => {
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
    params.k = this.pager.keyword;
    if (this.pager.currentPage !== 1) {
      params.c = this.pager.currentPage;
    }
    this.router.navigate(['/doi-tac/lao-dong-quan-tam'], { queryParams: params });
  }

  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
  }
  get localStorage() {
    return localStorage;
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  save(id) {
    this.snackBar.dismiss();
    this.userService.insertFavouriteRecruitment(id).subscribe((res: ResponseApi) => {
      if (res.code === 2) {
        this.paging();
      } else if (!res.code) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
    });
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
  getPublicPhonenumber(cus) {
    if (cus.isPublicPhonenumber && cus.phonenumber != null) {
      return cus.phonenumber;
    } else if (cus.partnerCompanyID != null && cus.partnerCompanyID.mobile) {
      return cus.partnerCompanyID.mobile;
    } else if (!cus.isPublicPhonenumber && cus.phonenumber != null && cus.phonenumber.length > 6) {
      let phonenumber = cus.phonenumber.substring(0, 3);
      for (let i = 0; i < cus.phonenumber.length - 4; i++) {
        phonenumber += 'x';
      }
      return phonenumber;
    }
    return null;
  }
  recruitmentChoose(id) {
  }
}

import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { RecruitmentDetailComponent } from '../recruitment-detail/recruitment-detail.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterRecruitmentComponent } from '../filter-recruitment/filter-recruitment.component';
import { RecruitmentInfoPager } from 'projects/tools/src/lib/types/pager';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-list-recruitment',
  templateUrl: './list-recruitment.component.html',
  styleUrls: ['./list-recruitment.component.scss']
})
export class ListRecruitmentComponent implements OnInit {

  pager: RecruitmentInfoPager = new RecruitmentInfoPager();
  items = [];
  groupContract;
  groupContracts = [];
  countRecruit: any;
  countTotalResult = 0;
  constructor(
    route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) {
    this.titleService.setTitle('Hello Job | Danh sách ứng tuyển');
    route.queryParams.subscribe((params: Params) => {
      window.scrollTo(0, 0);
      this.pager = new RecruitmentInfoPager();
      this.pager.orderColumn = 'createdDate';
      this.pager.asc = false;
      const keyword = params.k;
      if (keyword) {
        this.pager.keyword = keyword;
      }
      const status = params.s;
      if (typeof status !== 'undefined') {
        this.pager.status = status;
      }
      const orderID = params.m;
      if (orderID) {
        try {
          this.pager.orderID = parseInt(orderID, 10);
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
      const currentPage = params.c;
      if (currentPage) {
        try {
          this.pager.currentPage = parseInt(currentPage, 10);
        } catch {
        }
      }
      this.paging();
    });
  }

  get localStorage() {
    return localStorage;
  }
  ngOnInit() {
    this.countRecruitmentInfo();
  }
  countRecruitmentInfo() {
    this.userService.countRecruitmentInfo().subscribe((res: ResponseApi) => {
      this.countRecruit = res.data;
      // tslint:disable-next-line: radix
      this.countTotalResult = res.data?.wait + res.data?.accepted + res.data?.refuse;
    });
  }

  paging() {
    const params: { [key: string]: any } = {};
    params.currentPage = this.pager.currentPage;
    params.orderColumn = this.pager.orderColumn;
    params.asc = this.pager.asc;
    params.displayPerPage = this.pager.displayPerPage;
    params.status = this.pager.status;
    if (this.pager.keyword) {
      params.keyword = this.pager.keyword;
    }
    if (this.pager.orderID) {
      params.orderID = this.pager.orderID;
    }
    if (typeof this.pager.status !== 'undefined') {
      params.status = this.pager.status;
    }
    this.userService.getListRecruitmentByPartner(params).subscribe((res: ResponsePaging) => {
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
    if (this.pager.orderID) {
      params.m = this.pager.orderID;
    }
    if (this.pager.orderColumn) {
      params.o = this.pager.orderColumn;
    }
    if (typeof this.pager.asc !== 'undefined' && this.pager.asc != null) {
      params.a = this.pager.asc;
    }
    if (typeof this.pager.status !== 'undefined') {
      params.s = this.pager.status;
    }
    return params;
  }
  reload() {
    const params = this.queryParams;
    if (this.pager.currentPage !== 1) {
      params.c = this.pager.currentPage;
    }
    this.router.navigate(['/doi-tac/danh-sach-ung-tuyen'], { queryParams: params });
  }

  changeOrderID(orderID: number) {
    this.pager.currentPage = 1;
    this.pager.orderID = orderID;
    this.reload();
  }

  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
  }
  accept(item) {
    if (!confirm('Bạn muốn duyệt đơn hàng này?')) {
      return;
    }
    this.userService.acceptRecruitment(item.id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        item.status = 1;
        this.countRecruitmentInfo();
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
      return;
    });
  }
  deny(item) {
    if (!confirm('Bạn muốn từ chối đơn hàng này?')) {
      return;
    }
    this.userService.refuseRecruitment(item.id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500
        });
        item.status = 2;
        this.countRecruitmentInfo();
      } else {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500
        });
      }
      return;
    });
  }
  detail(item) {
    this.dialog.open(RecruitmentDetailComponent, {
      data: { recruitment: item },
      width: '100%',
      // height: '100%',
      maxHeight: '85vh',
      panelClass: ['no-pd-dialog', 'recruiment-dialog']
    });
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  filterStatus(status) {
    this.pager.status = status;
    this.reload();
  }
  advanceFilter() {
    const dialogRef = this.dialog.open(FilterRecruitmentComponent, {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      autoFocus: !this.pager.keyword,
      data: { pager: this.pager }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.pager.currentPage = 1;
        this.reload();
      }
    });
  }
}




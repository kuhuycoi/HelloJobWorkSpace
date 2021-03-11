import { RecruitmentInfoPager } from '../../../../../tools/src/lib/types/pager';
import {
  ResponsePaging,
  ResponseApi,
} from 'projects/tools/src/lib/types/response-api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { FilterContractComponent } from 'projects/labor/src/app/public/filter-contract/filter-contract.component';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-history-recruitment',
  templateUrl: './history-recruitment.component.html',
  styleUrls: ['./history-recruitment.component.scss'],
})
export class HistoryRecruitmentComponent implements OnInit {
  pager: RecruitmentInfoPager = new RecruitmentInfoPager();
  items = [];
  groupContract;
  groupContracts = [];
  constructor(
    route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private titleService: Title
  ) {
    this.titleService.setTitle('Hello Job | Lịch sử ứng tuyển');
    route.queryParams.subscribe((params: Params) => {
      window.scrollTo(0, 0);
      this.pager = new RecruitmentInfoPager();
      this.pager.orderColumn = 'createdDate';
      this.pager.asc = false;
      const keyword = params.k;
      if (keyword) {
        this.pager.keyword = keyword;
      }
      const place = params.p;

      if (place) {
        this.pager.place = place;
      }

      const orderID = params.m;
      if (orderID) {
        try {
          this.pager.orderID = parseInt(orderID, 10);
        } catch {}
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
        } catch {}
      }
      this.paging();
    });
  }

  ngOnInit() {}

  paging() {
    const params: { [key: string]: any } = {};
    params.currentPage = this.pager.currentPage;
    params.orderColumn = this.pager.orderColumn;
    params.asc = this.pager.asc;
    params.displayPerPage = this.pager.displayPerPage;
    if (this.pager.keyword) {
      params.keyword = this.pager.keyword;
    }
    if (this.pager.orderID) {
      params.orderID = this.pager.orderID;
    }
    if (this.pager.place) {
      params.place = this.pager.place;
    }
    this.userService
      .historyRecuitment(params)
      .subscribe((res: ResponsePaging) => {
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
    if (this.pager.orderID) {
      params.m = this.pager.orderID;
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
    this.router.navigate(['/tai-khoan/lich-su-ung-tuyen'], {
      queryParams: params,
    });
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
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }

  advanceFilter() {
    const dialogRef = this.dialog.open(FilterContractComponent, {
      width: '100%',
      height: '100%',
      maxHeight: '100%',
      panelClass: 'full-width-dialog',
      autoFocus: !this.pager.keyword && !this.pager.place,
      data: { pager: this.pager },
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.pager.currentPage = 1;
        this.reload();
      }
    });
  }
}

import { OrderContractPager } from '../../../../../tools/src/lib/types/pager';
import {
  ResponsePaging,
  ResponseApi,
} from 'projects/tools/src/lib/types/response-api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FilterContractComponent } from 'projects/labor/src/app/public/filter-contract/filter-contract.component';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-favourite-order-contract',
  templateUrl: './favourite-order-contract.component.html',
  styleUrls: ['./favourite-order-contract.component.scss'],
})
export class FavouriteOrderContractComponent implements OnInit {
  pager: OrderContractPager = new OrderContractPager();
  items = [];
  currentPartner;
  constructor(
    route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private titleService: Title,
    private snackBar: MatSnackBar
  ) {
    this.titleService.setTitle('Hello Job | Đơn hàng đã lưu');
    this.userService.currentPartner.subscribe((partner) => {
      if (partner) {
        this.currentPartner = partner;
      }
    });
    route.queryParams.subscribe((params: Params) => {
      window.scrollTo(0, 0);
      this.pager = new OrderContractPager();
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
      const moduleId = params.m;
      if (moduleId) {
        try {
          this.pager.moduleId = parseInt(moduleId, 10);
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
      const time = params.t;
      if (time) {
        try {
          this.pager.time = parseInt(time, 10);
        } catch {}
      }
      this.paging();
    });
  }

  save(favouriteContract) {
    this.snackBar.dismiss();
    if (!favouriteContract.website_OrderContractID) {
      return;
    }
    this.userService
      .save(favouriteContract.website_OrderContractID.id)
      .subscribe((res: ResponseApi) => {
        if (!res.code) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500,
          });
        } else if (res.code === 2) {
          this.paging();
        }
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
    if (this.pager.place) {
      params.place = this.pager.place;
    }
    if (this.pager.moduleId) {
      params.moduleId = this.pager.moduleId;
    }
    if (this.pager.time) {
      params.time = this.pager.time;
    }
    this.userService.favourite(params).subscribe((res: ResponsePaging) => {
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
    if (this.pager.time) {
      params.t = this.pager.time;
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
    this.router.navigate(['/tai-khoan/don-hang-quan-tam'], {
      queryParams: params,
    });
  }

  changeModuleID(moduleId: number) {
    this.pager.currentPage = 1;
    this.pager.moduleId = moduleId;
    this.reload();
  }

  changeTime(time: number) {
    this.pager.currentPage = 1;
    this.pager.time = time;
    this.reload();
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
  expand(event, btnExpand, contractDesc) {
    event.preventDefault();
    event.stopPropagation();
    btnExpand.remove();
    contractDesc.classList.remove('d-none');
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

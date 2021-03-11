import { Component, OnInit } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
declare var $:any;
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { OrderContractPager } from 'projects/tools/src/lib/types/pager';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';
import { FilterContractComponent } from '../filter-contract/filter-contract.component';

@Component({
  selector: 'app-my-job',
  templateUrl: './my-job.component.html',
  styleUrls: ['./my-job.component.scss']
})
export class MyJobComponent implements OnInit {
  pager: OrderContractPager = new OrderContractPager();
  items = [];
  groupContract;
  groupContracts = [];
  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private publicService: PublicService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    window.addEventListener('scroll', (event) => {
      if ($('#btn-post-job').length) {
        const check = document.getElementById('employer').offsetTop - document.getElementById('content-scroll').offsetTop;
        const current = $('#content-scroll').scrollTop() + $(window).height();
        if (current >= check) {
          $('#btn-post-job').addClass('not-show');
        } else {
          $('#btn-post-job').removeClass('not-show');
        }
      }
    }, true);
    this.route.queryParams.subscribe((params: Params) => {
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
      const time = params.t;
      if (time) {
        try {
          this.pager.time = parseInt(time, 10);
        } catch {
        }
      }
      this.paging();
      this.publicService.findAllOrderContractGroup().subscribe((res: ResponseApi) => {
        this.groupContracts = res.data;
        this.groupContract = this.groupContracts.find(item => {
          return item.id === this.pager.moduleId;
        });
      });
    });
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
    if (this.pager.place) {
      params.place = this.pager.place;
    }
    if (this.pager.moduleId) {
      params.moduleId = this.pager.moduleId;
    }
    if (this.pager.time) {
      params.time = this.pager.time;
    }
    this.userService.websiteOrderContractPosted(params).subscribe((res: ResponsePaging) => {
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
  reload() {
    const params = this.queryParams;
    if (this.pager.currentPage !== 1) {
      params.c = this.pager.currentPage;
    }
    this.router.navigate(['/doi-tac/don-hang-da-dang'], { queryParams: params });
  }

  delete(id) {
    if (confirm('Bạn có chắc chắn xóa đơn hàng này ?') && id) {
      this.userService.websiteOrderContractDelete(id).subscribe((res: ResponseApi) => {
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
        return;
      });
    }
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
      data: { pager: this.pager }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.pager.currentPage = 1;
        this.reload();
      }
    });
  }

  stopRecruitment(item) {
    const id = item.id;
    if (!confirm(item.isStop ? 'Bạn có chắc chắn muốn dừng tuyển đơn hàng này?' : 'Bạn có muốn tuyển dụng cho đơn hàng này?')) {
      return;
    }
    this.userService.stopRecruitment(id).subscribe((res: ResponseApi) => {
      if (res.success) {
        if (res.success) {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-success'],
            duration: 2500
          });
          item.isStop = !item.isStop;
        } else {
          this.snackBar.open(res.message, 'x', {
            panelClass: ['style-error'],
            duration: 2500
          });
        }
      }
    });
  }  

  getModuleName(item) {
    if (!item.moduleIDs || !this.groupContracts) {
      return null;
    }
    let moduleIDs: number[] = item.moduleIDs.split(',').filter(Boolean);
    return this.groupContracts.filter(item => moduleIDs.indexOf(item.id.toString()) > -1).map(item=>item.name).join(', ');
  }

  // shareToMarket(order) {
  //   const dialogRef = this.dialog.open(ShareToMarketComponent, {
  //     width: '100%',
  //     height: '100%',
  //     maxHeight: '100%',
  //     panelClass: 'full-width-dialog',
  //     data: {
  //       refID: order.id, refName: order.name, saleType: 'NEED_BUY',
  //       contentType: 'ORDER', content: `<b class="color-blue">Đơn hàng</b> - ${order.name}`
  //     }
  //   });
  // }
}

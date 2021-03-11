import { OrderContractPager } from 'projects/tools/src/lib/types/pager';
import { FilterContractComponent } from 'projects/labor/src/app/public/filter-contract/filter-contract.component';
import {
  ResponsePaging,
  ResponseApi,
} from 'projects/tools/src/lib/types/response-api';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
// import { ReportTableComponent } from 'projects/labor/src/app/partner/report-table/report-table.component';

@Component({
  selector: 'app-order-contract-tn',
  templateUrl: './order-contract-tn.component.html',
  styleUrls: ['./order-contract-tn.component.scss'],
})
export class OrderContractTnComponent implements OnInit {
  pager: OrderContractPager = new OrderContractPager();
  items = [];
  favouriteList = [];
  groupContract;
  groupContracts = [];
  isLoggedIn = false;
  currentPartner;
  imgExt = ['bmp', 'gif', 'jpg', 'jpeg', 'png'];
  videoExt = ['mp4', 'avi', 'm4v', 'mpg'];
  lang = 'vi';
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private publicService: PublicService,
    private userService: UserService,
    public dialog: MatDialog,
    private titleService: Title,
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.userService.activeBottomNav.next(1);
    this.titleService.setTitle('HelloJob | Chợ XKLĐ Online');
    this.userService.currentPartner.subscribe((partner) => {
      if (partner) {
        this.currentPartner = partner;
      }
    });
    this.publicService
      .findAllOrderContractGroup()
      .subscribe((res: any) => (this.groupContracts = res.data));
    this.route.queryParams.subscribe((params: Params) => {
      if (localStorage.getItem('CURRENT_USER')) {
        this.isLoggedIn = true;
      }
      this.lang = this.translateService.currentLang;
      window.scrollTo(0, 0);
      this.pager = new OrderContractPager();
      this.pager.orderColumn = 'createdDate';
      this.pager.asc = false;
      this.pager.contractType = 'TN';
      const keyword = params.k;
      if (keyword) {
        this.pager.keyword = keyword;
      }
      const place = params.p;
      if (place) {
        this.pager.place = place;
      }
      const examDateFrom = params.exf;
      if (examDateFrom) {
        this.pager.examDateFrom = parseInt(examDateFrom, 10);
      }
      const examDateTo = params.ext;
      if (examDateTo) {
        this.pager.examDateTo = parseInt(examDateTo, 10);
      }
      const gender = params.g;
      if (gender) {
        this.pager.gender = parseInt(gender, 10);
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
    this.translateService.onLangChange.subscribe((data) => {
      this.lang = data.lang;
      this.paging();
    });
  }
  get localStorage() {
    return localStorage;
  }

  getModuleName(item) {
    if (!item.moduleIDs || !this.groupContracts) {
      return null;
    }
    let moduleIDs: number[] = item.moduleIDs.split(',').filter(Boolean);
    return this.groupContracts
      .filter((item) => moduleIDs.indexOf(item.id.toString()) > -1)
      .map((item) => item.name)
      .join(', ');
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
    if (this.pager.gender) {
      params.gender = this.pager.gender;
    }
    if (this.pager.examDateFrom) {
      params.examDateFrom = this.pager.examDateFrom;
    }
    if (this.pager.examDateTo) {
      params.examDateTo = this.pager.examDateTo;
    }
    if (this.pager.gender) {
      params.gender = this.pager.gender;
    }
    params.langCode = this.lang;
    this.publicService
      .orderContract(params)
      .subscribe((res: ResponsePaging) => {
        this.items = res.items;
        this.pager.totalPage = res.pager.totalPage;
        this.pager.totalResult = res.pager.totalResult;
        if (this.isLoggedIn) {
          const ids = this.items.map((item) => item.id);
          this.userService
            .checkWebsiteOrderContractList(ids)
            .subscribe((resCheck: ResponseApi) => {
              this.favouriteList = resCheck.data;
            });
        }
      });
  }
  getGalleryUrls(urls: string) {
    if (urls && urls.trim().length) {
      return urls.split('#gl#').map((item) => {
        const exactUrl = localStorage.getItem('ServerUrl') + item;
        let exactType = 'img';
        const extSplit = item.split('.')[1];
        if (this.videoExt.indexOf(extSplit) > -1) {
          exactType = 'video';
        }
        return { url: exactUrl, type: exactType };
      });
    } else {
      return [];
    }
  }
  getExt(url: string) {
    const splits = url.split('.');
    return splits[splits.length - 1];
  }
  get queryParams() {
    const params: Params = {};
    if (this.pager.keyword) {
      params.k = this.pager.keyword;
    }
    if (this.pager.place) {
      params.p = this.pager.place;
    }
    if (this.pager.examDateFrom) {
      params.exf = this.pager.examDateFrom;
    }
    if (this.pager.examDateTo) {
      params.ext = this.pager.examDateTo;
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
    if (this.pager.gender) {
      params.g = this.pager.gender;
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
    this.router.navigate(['/don-hang'], { queryParams: params });
  }
  isSaved(id) {
    return this.favouriteList && this.favouriteList.indexOf(id) > -1;
  }
  save(id) {
    this.snackBar.dismiss();
    this.userService.save(id).subscribe((res: ResponseApi) => {
      if (res.success) {
        this.favouriteList.push(id);
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-success'],
          duration: 2500,
        });
      } else if (!res.code) {
        this.snackBar.open(res.message, 'x', {
          panelClass: ['style-error'],
          duration: 2500,
        });
      } else {
        const index = this.favouriteList.indexOf(id);
        if (index > -1) {
          this.favouriteList.splice(index, 1);
        }
      }
    });
  }

  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
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
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  expand(event, btnExpand, contractDesc) {
    event.preventDefault();
    event.stopPropagation();
    btnExpand.remove();
    contractDesc.classList.remove('d-none');
  }
  verified() {
    this.snackBar.open('Nhà môi giới đã được HJ kiểm duyệt', 'x', {
      panelClass: ['style-info'],
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'right',
    });
  }
  getUrlShare(id) {
    return `https://choxkld.com/don-hang/${id}`;
  }

  report(item) {
    // let report = new UserReport();
    // report.refID = item.id;
    // report.type = "ORDER"
    // report.userReportedID = item.partnerCompanyID.id;
    // const dialogRef = this.dialog.open(ReportTableComponent, {
    //   width: '500px',
    //   // height: '25%',
    //   data: { report: report }
    // });
  }
}

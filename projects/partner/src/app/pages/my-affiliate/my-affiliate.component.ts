import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, Inject } from '@angular/core';
import { Md5 } from 'ts-md5';
import { AffiliatePager } from 'projects/tools/src/lib/types/pager';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { HistoryAffiliateService } from 'projects/tools/src/lib/services/history-affiliate.service';
import { WINDOW } from 'projects/vendors/src/public-api';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';
declare var $: any;

@Component({
  selector: 'app-my-affiliate',
  templateUrl: './my-affiliate.component.html',
  styleUrls: ['./my-affiliate.component.scss']
})
export class MyAffiliateComponent implements OnInit {
  pager: AffiliatePager = new AffiliatePager();
  items = [];
  currentUser;
  constructor(
    private route: ActivatedRoute,
    private router: Router, private historyAffiliateService: HistoryAffiliateService,
    public dialog: MatDialog, private titleService: Title,
    private userService: UserService,
    private snackBar: MatSnackBar, private translateService: TranslateService, @Inject(WINDOW) private window: Window) {
    this.titleService.setTitle('Hello Job | Giới thiệu tham gia Hello Job');
    this.userService.currentUser.subscribe(user => this.currentUser = user);
    this.route.queryParams.subscribe((params: Params) => {
      window.scrollTo(0, 0);
      this.pager = new AffiliatePager();
      this.pager.orderColumn = 'isCheck';
      this.pager.asc = true;
      const isCheck = params.ch;
      if (isCheck) {
        this.pager.isCheck = isCheck;
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

  ngOnInit() {
  }
  get localStorage() {
    return localStorage;
  }
  get refUrl() {
    const protocol = this.window.location.protocol;
    const domain = this.window.location.hostname;    
    const md5 = new Md5();
    return `${protocol}//${domain}?ref=${md5.appendStr(this.currentUser?.username).end().toString()}`;
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
    this.historyAffiliateService.pager(params).subscribe((res: ResponsePaging) => {
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
    if (this.pager.isCheck) {
      params.ch = this.pager.isCheck;
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
    this.router.navigate(['/doi-tac/gioi-thieu-tham-gia'], { queryParams: params });
  }

  changePage(page: number) {
    this.pager.currentPage = page;
    this.reload();
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }

  deleteAffiliate(item) {
    if (!confirm('Bạn chắc chắn xóa lao động này?')) {
      return;
    }
    if (!item || item?.isCheck) {
      return;
    }
    this.historyAffiliateService.deleteAffiliate(item.id).subscribe((res: ResponseApi) => {
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
  checkAffiliate(item) {
    if (!item || item?.isCheck) {
      return;
    }
    this.historyAffiliateService.checkAffiliate(item.id).subscribe((res: ResponseApi) => {
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
  get isIOS() {
    return navigator.userAgent.match(/ipad|iphone/i);
  }
  copyRefLink() {
    if (this.isIOS) {
      var range, selection;
      var textArea: any = document.getElementById('invite-link');
      range = document.createRange();
      range.selectNodeContents(textArea);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textArea.setSelectionRange(0, 999999999);
    } else {
      $('#invite-link').select();
    }
    document.execCommand("copy"); 
    this.snackBar.open('Đã copy', 'x', {
      panelClass: ['style-success'],
      duration: 2500
    });
  }
}

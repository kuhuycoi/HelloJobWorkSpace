import { Component, OnInit } from '@angular/core';
import { Router, Params } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotyDialogComponent } from '../shared/noty-dialog/noty-dialog.component';
import { Pager } from 'projects/tools/src/lib/types/pager';
import { DataHelperService } from 'projects/tools/src/lib/services/data-helper.service';
import { UserNotificationService } from 'projects/tools/src/lib/services/user-notification.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { ResponseApi, ResponsePaging } from 'projects/tools/src/lib/types/response-api';
@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss'],
})
export class NotifyComponent implements OnInit {
  items = [];
  pager: Pager = new Pager();
  constructor(
    private dataHelperService: DataHelperService,
    private userNotificationService: UserNotificationService,
    private userService: UserService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pager.displayPerPage = 10;
    this.pager.asc = false;
    this.userService.currentUser.subscribe((currentUser) => {
      if (currentUser != null) {
        this.dataHelperService.totalNotification.subscribe((value) => {
          this.pagingCheck();
        });
      }
    });
  }
  closeNotify() {
    this.userService.isOpenedNotify.next(false);
  }

  pagingCheck() {
    this.userNotificationService
      .userNotificationPager(this.pager)
      .subscribe((res: ResponsePaging) => {
        if (res.items) {
          this.items = res.items;
          this.pager = res.pager;
        }
      });
  }

  paging() {
    this.userNotificationService
      .userNotificationPager(this.pager)
      .subscribe((res: ResponsePaging) => {
        if (res.items) {
          this.items = this.items.concat(res.items);
          this.pager = res.pager;
        }
      });
  }

  check(item) {
    item.isCheck = true;
    this.userNotificationService
      .check(item.id)
      .subscribe((res: ResponseApi) => {
        this.dataHelperService.totalNotification.next(true);
      });
    const category = item.category;
    if (category === 'RECRUITMENT_FOR_PARNER') {
      const params: Params = {};
      this.router.navigate(['/doi-tac/danh-sach-ung-tuyen'], {
        queryParams: params,
      });
    } else if (
      category === 'HAS_RECRUITMENT' ||
      category === 'RECRUITMENT_SUCCESS' ||
      category === 'RECRUITMENT_FAIL'
    ) {
      this.router.navigate(['/don-hang/' + item.refID]);
    } else if (
      category === 'SALENEWS_INSERT_SALE_SUCCESS' ||
      category === 'SALENEWS_INSERT_BUY_SUCCESS' ||
      category === 'SALE_FORM_SEND_MINE' ||
      category === 'BUY_FORM_SEND_MINE'
    ) {
      this.router.navigate(['/doi-tac/cho-rao-vat']);
    } else if (
      category === 'BUY_FORM_SEND_OWNER' ||
      category === 'SEND_FOR_OWNER_NEED_BUY_FORM' ||
      category === 'SEND_FOR_OWNER_NEED_SALE_FORM' ||
      category === 'SEND_AGREE_FOR_OWNER_NEED_BUY_FORM' ||
      category === 'SEND_AGREE_FOR_OWNER_NEED_SALE_FORM' ||
      category === 'SEND_REFUSE_FOR_OWNER_NEED_BUY_FORM' ||
      category === 'SEND_REFUSE_FOR_OWNER_NEED_SALE_FORM'
    ) {
      this.router.navigate(['/doi-tac/tin-da-rao']);
    } else if (
      category === 'SEND_FOR_USER_NEED_SALE_FORM' ||
      category === 'SEND_AGREE_FOR_USER_NEED_SALE_FORM' ||
      category === 'SEND_REFUSE_FOR_USER_NEED_SALE_FORM'
    ) {
      this.router.navigate(['/doi-tac/ban-form']);
    } else if (
      category === 'SEND_FOR_USER_NEED_BUY_FORM' ||
      category === 'SEND_AGREE_FOR_USER_NEED_BUY_FORM' ||
      category === 'SEND_REFUSE_FOR_USER_NEED_BUY_FORM'
    ) {
      this.router.navigate(['/doi-tac/mua-form']);
    }

    this.pagingCheck();
    this.closeNotify();
  }

  loadMore() {
    this.pager.currentPage++;
    this.paging();
  }
  accepted() {
    const dialogRef = this.dialog.open(NotyDialogComponent, {
      width: '100%',
      height: 'auto',
      maxHeight: '100%',
      data: {
        btnSubmit: true,
        title: 'ĐÀM PHÁN THÀNH CÔNG',
        titleClass: 'text-success',
        notyMessage: `Nguyễn Văn A đã <b>ĐỒNG Ý</b> với đàm phán mà bạn đưa ra`,
        imgUrl: '/assets/img/negotiation-accepted.png',
        bgImgClass: 'bg-success',
        iconClass: 'fas fa-check-circle text-success',
      },
    });
  }
  rejected() {
    const dialogRef = this.dialog.open(NotyDialogComponent, {
      width: '100%',
      height: 'auto',
      maxHeight: '100%',
      data: {
        btnSubmit: true,
        title: 'ĐÀM PHÁN KHÔNG THÀNH CÔNG',
        titleClass: 'text-danger',
        notyMessage: `Nguyễn Văn A đã <b>TỪ CHỐI</b> với đàm phán mà bạn đưa ra`,
        imgUrl: '/assets/img/negotiation-rejected.png',
        bgImgClass: 'bg-danger',
        iconClass: 'fas fa-times-circle text-danger',
      },
    });
  }
}

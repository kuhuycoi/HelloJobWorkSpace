import { TranslateService } from '@ngx-translate/core';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DataHelperService } from 'projects/tools/src/lib/services/data-helper.service';
import { UserNotificationService } from 'projects/tools/src/lib/services/user-notification.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { CookieService } from 'projects/tools/src/lib/services/cookie.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, AfterViewInit {
  currentCustomer;
  fixed;
  websiteLanguages = [];
  currentLang;
  totalNotification;
  constructor(
    private dataHelperService: DataHelperService,
    private userNotificationService: UserNotificationService,
    private userService: UserService,
    private publicService: PublicService,
    private translateService: TranslateService,
    private cookieService: CookieService
  ) {
    this.currentCustomer = this.userService.currentCustomer.value;
    this.userService.fixedHeader.subscribe((fixed) => (this.fixed = fixed));
    this.publicService
      .getWebsiteLanguage(false)
      .subscribe((res: ResponseApi) => {
        if (res) {
          this.websiteLanguages = res.data;
        }
      });
    if (this.cookieService.getCookie('lang')) {
      this.useLanguage(this.cookieService.getCookie('lang'));
    } else {
      this.useLanguage('vi');
    }
  }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.getTotalNotification();
    }
    this.dataHelperService.totalNotification.subscribe((value) => {
      if (value) {
        this.getTotalNotification();
      }
    });
  }
  ngAfterViewInit() {
    $('#content-scroll').on('scroll', (e) => {
      if ($('#content-scroll').scrollTop() > 87) {
        $('body').addClass('fixed-header');
      } else {
        $('body').removeClass('fixed-header');
      }
    });
  }
  openMenu() {
    this.userService.isOpenedSidenav.next(true);
  }

  getTotalNotification() {
    this.userNotificationService
      .totalNotification()
      .subscribe((res: ResponseApi) => {
        this.totalNotification = res.data;
      });
  }
  get localStorage() {
    return localStorage;
  }
  get isLoggedIn() {
    return (
      typeof localStorage.getItem('CURRENT_USER') !== 'undefined' &&
      localStorage.getItem('CURRENT_USER') != null
    );
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  openNotify() {
    this.userService.isOpenedNotify.next(true);
  }
  signOut() {
    this.userService.signOut();
  }

  useLanguage(lang) {
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.cookieService.setCookie('lang', lang);
    this.cookieService.setCookie('lang', lang, 1, '/');
    this.translateService.use(lang);
    this.userService.isOpenedSidenav.next(false);
  }
}

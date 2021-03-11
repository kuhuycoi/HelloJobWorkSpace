import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $:any;
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
import { CookieService } from 'projects/tools/src/lib/services/cookie.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { environment } from 'projects/partner/src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  currentCustomer;
  currentPartner;
  websiteLanguages = [];
  currentLang;
  constructor(
    private snackBar: MatSnackBar,
    private publicService: PublicService,
    private userService: UserService,
    private translateService: TranslateService,
    private cookieService: CookieService) {
    this.publicService.getWebsiteLanguage(false).subscribe((res: ResponseApi) => {
      if (res) {
        this.websiteLanguages = res.data;
      }
    });
    if (this.cookieService.getCookie('lang')) {
      this.useLanguage(this.cookieService.getCookie('lang'));
    } else {
      this.useLanguage('vi');
    }
    this.userService.currentCustomer.subscribe((cus) => {
      this.currentCustomer = cus;
    });
    this.userService.currentPartner.subscribe((partner) => {
      this.currentPartner = partner;
    });
    // $(document).on('click', '#side-menu ul.main-menu>li', (e) => {
    //   if ($(e.currentTarget).children('ul').length) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     if (!$(e.currentTarget).hasClass('open')) {
    //       $('#side-menu ul.main-menu>li ul').slideUp(300, () => {
    //         $('#side-menu ul.main-menu>li').removeClass('open');
    //         $(e.currentTarget).children('ul').slideDown(300);
    //         $(e.currentTarget).addClass('open');
    //       });
    //     }else{
    //       $(e.currentTarget).children('ul').slideUp(300);
    //       $(e.currentTarget).removeClass('open');
    //     }
    //   }
    // });
  }

  ngOnInit(): void {}
  toggleParent(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const $parent = $(event.target).parent('li');
    if ($parent.hasClass('open')) {
      $parent.removeClass('open');
      $parent.children('ul').slideUp(300);
    } else {
      $('#side-menu ul.main-menu>li.open ul').slideToggle(300);
      $('#side-menu ul.main-menu>li.open').removeClass('open');
      $parent.children('ul').slideDown(300);
      $parent.addClass('open');
    }
  }

  openSubiz() {
    if ($('#subiz .chat-button').length) {
      $('#subiz .chat-button').click();
      this.userService.isOpenedSidenav.next(false);
    }
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
  waitingCheck() {
    this.snackBar.open('Hello Job đang kiểm duyệt thông tin của bạn', 'x', {
      panelClass: ['style-error'],
      duration: 2500,
    });
  }
  signOut() {
    this.userService.signOut();
    this.userService.isOpenedSidenav.next(false);
  }

  get urlLabor() {
    return environment.mainDomain;
  }

  get urlAccount() {
    return `${environment.accountDomain}?r=${environment.currentDomain}`;
  }
  useLanguage(lang) {
    if (this.currentLang === lang) {
      return;
    }
    this.currentLang = lang;
    this.cookieService.setCookie('lang', lang);
    this.translateService.use(lang);
    this.userService.isOpenedSidenav.next(false);
  }
  closeSidenav() {
    this.userService.isOpenedSidenav.next(false);
  }
}

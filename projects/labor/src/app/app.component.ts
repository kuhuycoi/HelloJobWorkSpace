import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { Meta } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import defaultLanguage from 'projects/labor/src/assets/i18n/vi.json';
declare var $:any;
import { environment } from 'projects/labor/src/environments/environment';
import { RoutingStateService } from 'projects/tools/src/lib/services/routing-state.service';
import { SpinnerService } from 'projects/tools/src/lib/services/spinner.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';
declare var FB: any;

export class Config {
  ServerUrl?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild(MatSidenav) sidenav: MatSidenav;
  private readonly apiUrl = './assets/json/config.json';
  isShowHeader = true;
  btnApplyScrollTop;
  currentCustomer;
  currentPartner;
  loaded;
  isLoading = true;
  isOpenedSidenav = false;
  isOpenedNotify = false;
  headerHeight;
  constructor(
    private router: Router,
    private routingState: RoutingStateService,
    private activatedRoute: ActivatedRoute,
    public spinnerService: SpinnerService, private http: HttpClient,
    private userService: UserService, private meta: Meta, private translate: TranslateService) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      const token = params['token'];
      if (token && token.startsWith('Bearer')) {
        localStorage.setItem('CURRENT_USER', token);
        window.location.href = '/';
        return;
      }
    });
    this.routingState.loadRouting();
    $(document).on('focus', '#filter .current-filter input', () => {
      // $(this).css()
      $('body').addClass('overlay');
    });
    $(document).on('blur', '#filter .current-filter input', () => {
      // $(this).css()
      $('body').removeClass('overlay');
    });
    this.translate.setTranslation('vi', defaultLanguage);
    this.translate.setDefaultLang('vi');
    this.meta.addTag({ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' });
    this.spinnerService.isLoading.subscribe(loading => {
      setTimeout(() => this.isLoading = loading, 0);
    });
    localStorage.setItem('ServerUrl', environment.serverUrl);
    this.userService.loadUserInfo();
    this.userService.isBlank.subscribe(value => {
      this.isShowHeader = !value;
    });
    this.userService.loaded.subscribe(loaded => {
      this.loaded = loaded;
    });

    this.userService.isOpenedSidenav.subscribe(isOpened => this.isOpenedSidenav = isOpened);
    this.userService.isOpenedNotify.subscribe(isOpened => this.isOpenedNotify = isOpened);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        FB.XFBML.parse();
        this.userService.previousUrl = event.url;
        // this.userService.isOpenedSidenav.next(false);
        this.userService.isOpenedNotify.next(false);
        $('#content-scroll').scrollTop(0);
        const currentURL = this.router.url;
        this.userService.fixedHeader.next(false);
        // if (currentURL.startsWith('/trang-chu') || currentURL.startsWith('/don-hang') || currentURL === '/') {
        //   this.userService.fixedHeader.next(false);
        // } else {
        //   this.userService.fixedHeader.next(true);
        // }
      }
    });
  }
  openSidenav() {
    this.userService.isOpenedSidenav.next(false);
  }
  sideNavOpenedChange(opened) {
    this.userService.isOpenedSidenav.next(opened);
  }
  onContentScroll(event) {
    // const $target = $(event.target);
    // // if (currentURL.startsWith('/trang-chu') || currentURL.startsWith('/don-hang') || currentURL === '/') {
    // const currentScroll = $('#content-scroll').scrollTop();
    // if (!this.headerHeight) {
    //   this.headerHeight = $('header').height();
    // }
    // if (currentScroll >= $target.height() / 3) {
    //   this.userService.fixedHeader.next(true);
    // } else {
    //   this.userService.fixedHeader.next(false);
    // }
    // }
    // const pinPosition = document.querySelector('#pin-position');
    // if (!pinPosition) {
    //   return;
    // }
    // const btnApplyWrapper = document.querySelector('#btn-apply-wrapper');
    // const verticalOffset = document.querySelector('.mat-sidenav-content').scrollTop + window.outerHeight;
    // if (typeof this.btnApplyScrollTop === 'undefined') {
    //   this.btnApplyScrollTop = pinPosition.getBoundingClientRect().top + window.scrollY;
    // }
    // if (verticalOffset >= this.btnApplyScrollTop + 60) {
    //   btnApplyWrapper.classList.remove('fixed');
    // } else {
    //   btnApplyWrapper.classList.add('fixed');
    // }
  }
  ngAfterViewChecked() {
    // this.cdref.detectChanges();
  }
  toggleSidenav() {
    this.sidenav.open();
  }
  get localStorage() {
    return localStorage;
  }
}

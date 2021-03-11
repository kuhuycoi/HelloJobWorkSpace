import { ActivatedRoute, Params } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { initMetaShare } from 'projects/tools/src/lib/utils/share-utils';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-order-contract-detail',
  templateUrl: './order-contract-detail.component.html',
  styleUrls: ['./order-contract-detail.component.scss'],
})
export class OrderContractDetailComponent implements OnInit, AfterViewInit {
  id;
  orderContract;
  isFixed = true;
  btnApplyScrollTop;
  recStatus = -1;
  @ViewChild('pinPosition') pinPosition: ElementRef;
  urlShare;
  currentPartner;
  groupContracts = [];
  constructor(
    private route: ActivatedRoute,
    private publicService: PublicService,
    private titleService: Title,
    private metaService: Meta,
    private userService: UserService
  ) {
    this.userService.currentPartner.subscribe((partner) => {
      if (partner) {
        this.currentPartner = partner;
      }
    });
    this.userService.activeBottomNav.next(1);
    this.titleService.setTitle('Hello Job | Đơn hàng');
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      this.paging();
    });
  }
  ngAfterViewInit() {}

  get isLoggedIn() {
    return (
      typeof localStorage.getItem('CURRENT_USER') !== 'undefined' &&
      localStorage.getItem('CURRENT_USER') != null
    );
  }

  paging() {
    this.publicService
      .findAllOrderContractGroup()
      .subscribe((res: any) => (this.groupContracts = res.data));
    this.publicService.detail(this.id).subscribe((res: ResponseApi) => {
      this.orderContract = res.data;
      this.titleService.setTitle('Hello Job | ' + this.orderContract.name);
      this.urlShare = location.href;
      this.urlShare = this.urlShare.replace(
        'http://localhost:4200/',
        localStorage.getItem('ServerUrl')
      );
      const title = this.orderContract.name;
      const description =
        'Đơn hàng mới nhất, hot nhất từ Hello Job. Click để tham gia ngay!';
      let image = null;
      if (this.orderContract.urlAvatar) {
        image =
          localStorage.getItem('ServerUrl') + this.orderContract.urlAvatar;
      }
      initMetaShare(this.metaService, this.urlShare, title, description, image);
    });
  }
  // @HostListener('scroll', ['$event'])
  // onWindowScroll() {
  //   console.log('scroll')
  //   // do some stuff here when the window is scrolled
  //   const verticalOffset = document.querySelector('.mat-sidenav-content').scrollTop || 0 + window.outerHeight;
  //   if (typeof this.btnApplyScrollTop === 'undefined') {
  //     this.btnApplyScrollTop = this.pinPosition.nativeElement.getBoundingClientRect().top + window.scrollY;
  //   }
  //   if (verticalOffset >= this.btnApplyScrollTop + 40) {
  //     this.isFixed = false;
  //   } else {
  //     this.isFixed = true;
  //   }
  // }
  get localStorage() {
    return localStorage;
  }
  ngOnInit() {
    if (this.isLoggedIn) {
      this.userService
        .getRecruitmentStatusByUsername(this.id)
        .subscribe((res: ResponseApi) => {
          if (res.success && res.data) {
            this.recStatus = res.data.status;
          }
        });
    }
  }
  isEmpty(input: string) {
    return !input;
    // return !input || !input.trim().length;
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

  getUrlShare(id) {
    return `https://choxkld.com/don-hang/${id}`;
  }
}

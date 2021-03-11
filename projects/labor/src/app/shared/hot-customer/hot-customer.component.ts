import { TranslateService } from '@ngx-translate/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit } from '@angular/core';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-hot-customer',
  templateUrl: './hot-customer.component.html',
  styleUrls: ['./hot-customer.component.scss'],
})
export class HotCustomerComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    margin: 0,
    items: 5,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    // autoplay: true,
    autoplayTimeout: 3500,
    autoplaySpeed: 1000,
    // center: true,
    responsive: {
      991: {
        items: 7,
      },
      768: {
        items: 6,
      },
      480: {
        items: 5,
      },
      300: {
        items: 4,
      },
      0: {
        items: 3,
      },
    },
  };
  hotCustomers = [];
  lang;
  constructor(
    private publicService: PublicService,
    private translateService: TranslateService
  ) {
    this.lang = this.translateService.currentLang;
    this.translateService.onLangChange.subscribe((data) => {
      this.lang = data.lang;
    });
    this.publicService.getListCustomer(10).subscribe((res: ResponseApi) => {
      this.hotCustomers = res.data;
    });
  }
  get localStorage() {
    return localStorage;
  }

  ngOnInit(): void {}

  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
  getLastName(fullName) {
    if (fullName) {
      const names = fullName.split(' ');
      return (
        (names.length > 1 ? names[0] + ' ' : '') +
        names[names.length - 1].toLowerCase()
      );
    } else {
      return fullName;
    }
  }
}

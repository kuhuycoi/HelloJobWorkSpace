import { Component, OnInit } from '@angular/core';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

@Component({
  selector: 'app-hot-order',
  templateUrl: './hot-order.component.html',
  styleUrls: ['./hot-order.component.scss'],
})
export class HotOrderComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    margin: 8,
    items: 3,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplaySpeed: 1000,
    // center: true,
    responsive: {
      991: {
        items: 6,
      },
      768: {
        items: 5,
      },
      480: {
        items: 4,
      },
      0: {
        items: 3,
      },
    },
  };
  hotOrders = [];
  constructor(private publicService: PublicService) {
    this.publicService
      .getListWebsiteOrderContract(5, true)
      .subscribe((res: ResponseApi) => {
        this.hotOrders = res.data;
      });
  }

  ngOnInit(): void {}
  get localStorage() {
    return localStorage;
  }
  isEmpty(input: string) {
    return !input || !input.trim().length;
  }
}

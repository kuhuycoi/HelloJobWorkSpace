import { OwlOptions } from 'ngx-owl-carousel-o';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-contract-gallery',
  templateUrl: './order-contract-gallery.component.html',
  styleUrls: ['./order-contract-gallery.component.scss']
})
export class OrderContractGalleryComponent implements OnInit {
  
  customOptions: OwlOptions = {
    autoWidth:true,
    // loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 200,
    smartSpeed: 0,
    fluidSpeed: false,
    navText: ['<span class="material-icons">arrow_back</span>', '<span class="material-icons">arrow_forward</span>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      },
      1200: {
        items: 5
      }
    },
    nav: true
  }
  @Input() gallery = [];

  constructor(public sanitizer: DomSanitizer, private modalService: NgbModal) { }

  ngOnInit(): void {
  }
  open(content) {
    this.modalService.open(content);
  }
  get localStorage() {
    return localStorage;
  }
}

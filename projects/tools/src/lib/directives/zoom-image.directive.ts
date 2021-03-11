import { Directive, HostListener, Input } from '@angular/core';
import { Lightbox } from 'ngx-lightbox';

@Directive({
  selector: '[appZoomImage]'
})
export class ZoomImageDirective {

  @Input('appZoomImage') imgSrc;
  // tslint:disable-next-line: no-input-rename
  @Input('zoomCaption') caption;
  constructor(private lightbox: Lightbox) { }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.imgSrc) {
      this.lightbox.open([{
        src: this.imgSrc,
        caption: this.caption,
        thumb: this.imgSrc
      }], 0, {
        centerVertically: 1,
        fadeDuration: 0.3,
        enableTransition: 0,
        resizeDuration: 0
      });
    }
  }

}

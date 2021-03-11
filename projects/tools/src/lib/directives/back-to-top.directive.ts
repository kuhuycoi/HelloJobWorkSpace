import { Directive, HostListener } from '@angular/core';
declare var $:any;

@Directive({
  selector: '[appBackToTop]'
})
export class BackToTopDirective {

  constructor() {
  }

  @HostListener('click', ['$event'])
  onClick(event) {
    $('#content-scroll').animate({ scrollTop: 0 }, 600);
  }
}

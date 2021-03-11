import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-icon-phone-animate',
  templateUrl: './icon-phone-animate.component.html',
  styleUrls: ['./icon-phone-animate.component.scss']
})
export class IconPhoneAnimateComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    (this.elementRef.nativeElement as HTMLElement).classList.add('icon-phone-animate');
  }

}

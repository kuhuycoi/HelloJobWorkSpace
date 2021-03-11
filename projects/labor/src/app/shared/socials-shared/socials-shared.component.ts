import { Component, OnInit, Input, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-socials-shared',
  templateUrl: './socials-shared.component.html',
  styleUrls: ['./socials-shared.component.scss']
})
export class SocialsSharedComponent implements OnInit, AfterViewInit {

  @Input() urlSharing;
  @Input() vertical = false;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }
  get url() {
    return encodeURI(this.urlSharing ? this.urlSharing : location.href);
  }
}

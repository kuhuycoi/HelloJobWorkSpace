import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
declare var FB: any;

@Component({
  selector: 'app-fb-comment',
  templateUrl: './fb-comment.component.html',
  styleUrls: ['./fb-comment.component.scss']
})
export class FbCommentComponent implements OnInit, AfterViewInit {
  @ViewChild('fbComments') fbComments: ElementRef;
  constructor() {
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
    FB.XFBML.parse(document.querySelector('fb-comments'));
  }
  get currentHref() {
    let url = location.href;
    url = url.replace('http://localhost:4200', localStorage.getItem('ServerUrl'));
    return url;
  }

}

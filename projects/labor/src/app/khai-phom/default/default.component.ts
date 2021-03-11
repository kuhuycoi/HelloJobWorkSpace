import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

  get isLoggedIn() {
    return typeof localStorage.getItem('CURRENT_USER') !== 'undefined'
      && localStorage.getItem('CURRENT_USER') != null;
  }
}

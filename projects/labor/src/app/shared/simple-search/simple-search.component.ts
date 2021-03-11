import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-search',
  templateUrl: './simple-search.component.html',
  styleUrls: ['./simple-search.component.scss']
})
export class SimpleSearchComponent implements OnInit {
  @Input() searchAction;
  @Input() keyword = 'k';
  @Input() placeholder;
  @Input() value = null;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  get formAction() {
    if (!this.searchAction) {
      const currentRoute = this.router.url.split('?')[0];
      return currentRoute;
    } else {
      return this.searchAction;
    }
  }
}

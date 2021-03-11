import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  formType;
  constructor(private router: Router, private route: ActivatedRoute) {
    let params = route.snapshot.queryParams;
    if (params.t) {
      this.formType = params.t;
    } else {
      this.formType = 'B';
    }
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        params = route.snapshot.queryParams;
        if (params.t) {
          this.formType = params.t.toUpperCase();
        } else {
          this.formType = 'B';
        }
      }
    });
  }
  ngOnInit() {
  }
}

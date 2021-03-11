import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {
  isNew = true;
  currentUser;
  constructor(
    private userService: UserService, private router: ActivatedRoute
  ) {
    this.currentUser = this.userService.currentUser.value;
  }

  ngOnInit() {
    this.router.queryParams.subscribe(params => {
      this.isNew = (params.n === 'true');
    });
  }
  get localStorage() {
    return localStorage;
  }

}

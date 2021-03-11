import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.scss']
})
export class VerifiedComponent implements OnInit {
  isShowFooter = true;
  constructor(private userService: UserService) {
    this.userService.isBlank.subscribe(value => {
      this.isShowFooter = !value;
    });
    this.userService.activeBottomNav.next(3);
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-khai-phom',
  templateUrl: './khai-phom.component.html',
  styleUrls: ['./khai-phom.component.scss']
})
export class KhaiPhomComponent implements OnInit {
  constructor(private userService: UserService) {
    this.userService.activeBottomNav.next(3);
  }

  ngOnInit() {
  }

}

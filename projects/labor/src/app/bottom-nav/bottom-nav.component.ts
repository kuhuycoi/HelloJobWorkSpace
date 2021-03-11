import { Component, OnInit } from '@angular/core';
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-bottom-nav',
  templateUrl: './bottom-nav.component.html',
  styleUrls: ['./bottom-nav.component.scss']
})
export class BottomNavComponent implements OnInit {

  activeBottomNav = 0;
  constructor(
    private userService: UserService) {
    this.userService.activeBottomNav.subscribe(index => this.activeBottomNav = index);
  }

  ngOnInit(): void {
  }

  openMenu() {
    this.userService.isOpenedSidenav.next(true);
  }

}

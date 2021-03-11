import { Component, OnInit } from '@angular/core';
declare var $:any;
import { UserService } from 'projects/tools/src/lib/services/user.service';

@Component({
  selector: 'app-page-action',
  templateUrl: './page-action.component.html',
  styleUrls: ['./page-action.component.scss']
})
export class PageActionComponent implements OnInit {
  currentPartner;
  constructor(public userService: UserService) {
    userService.currentPartner.subscribe(cur => this.currentPartner = cur);
  }

  ngOnInit(): void {
    window.addEventListener('scroll', (event) => {
      if ($('#page-action').length && $('#employer').length) {
        const check = document.getElementById('employer').offsetTop - document.getElementById('content-scroll').offsetTop;
        const current = $('#content-scroll').scrollTop() + $(window).height();
        if (current >= check) {
          $('#page-action').addClass('not-show');
        } else {
          $('#page-action').removeClass('not-show');
        }
      }
    }, true);
  }

}

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Wf1LoginUserService } from './service/wf1-login-user.service';
import { Wf1NewUserService } from './service/wf1-new-user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'authorization';

  constructor(
    private translate: TranslateService,
    private newUserService: Wf1NewUserService,
    private loginUserService: Wf1LoginUserService
  ) { }
  ngOnInit() {
    this.translate.setDefaultLang('vi');
    this.translate.use('vi');
    try {
      if (localStorage.getItem('CURRENT_REGISTER')) {
        this.newUserService.userInfo = JSON.parse(
          localStorage.getItem('CURRENT_REGISTER')
        );
      }
      if (localStorage.getItem('CURRENT_LOGIN')) {
        this.loginUserService.userInfo = JSON.parse(
          localStorage.getItem('CURRENT_LOGIN')
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}

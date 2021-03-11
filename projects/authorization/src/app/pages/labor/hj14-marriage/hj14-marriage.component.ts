import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

@Component({
  selector: 'app-hj14-marriage',
  templateUrl: './hj14-marriage.component.html',
  styleUrls: ['./hj14-marriage.component.scss']
})
export class Hj14MarriageComponent implements OnInit {
  public identifier: string = 'tinh-trang-hon-nhan';
  public marriageInfoHelper;
  public selectedStatus;

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private translate: TranslateService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.loadCacheData();
  }

  private loadCacheData() {
    if (this.service.userInfo?.maritalStatus) {
      this.selectedStatus = this.service.userInfo.maritalStatus;
    }
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  public validate() {
    return this.selectedStatus;
  }

  public choose(event: Event, status: string) {
    event.preventDefault(); event.stopPropagation();
    this.selectedStatus = status;
    this.service.userInfo.maritalStatus = status;
  }


  public moveNext(event: Event) {
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }

    this.service.userInfo.maritalStatus = this.selectedStatus;
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

  public get maritalStatus() {
    return [
      'notMaried', 'maried', 'divorced', 'widowed', 'noChildren', 'haveChildren'
    ];
  }
  public getStatus(status) {
    return this.translate.get(`marialStatus.${status}`);
  }
}

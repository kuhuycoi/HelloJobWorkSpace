import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
@Component({
  selector: 'app-hj11-gender',
  templateUrl: './hj11-gender.component.html',
  styleUrls: ['./hj11-gender.component.scss']
})
export class Hj11GenderComponent implements OnInit {
  public identifier: string = 'gioi-tinh';
  public genders = ['Nam', 'Nữ', 'Khác'];

  constructor(
    private router: Router,
    private service: Wf1NewUserService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  private validate() {
    return true;
  }

  public moveNext(gender: string) {
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.gender = gender;
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }
  public get selectedGender() {
    return this.service.userInfo.gender;
  }
}

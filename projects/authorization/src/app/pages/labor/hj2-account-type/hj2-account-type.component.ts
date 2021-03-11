import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { AnnouncerService } from 'projects/tools/src/lib/services/announcer.service';
import { AccountEnum } from 'projects/tools/src/lib/types/profile.type';

@Component({
  selector: 'app-hj2-account-type',
  templateUrl: './hj2-account-type.component.html',
  styleUrls: ['./hj2-account-type.component.scss']
})
export class Hj2AccountTypeComponent implements OnInit {
  public identifier: string = 'dang-ky';
  constructor(
    private router: Router,
    private service: Wf1NewUserService,
    private announcer:AnnouncerService
  ) { 
    this.service.moveTo(this.identifier, this.router);
  }  
  
  ngOnInit(): void {
  }

  public get processPercent(){ return this.service.getProcessPercent();}

  private validate(){
    return true;
  }

  public continueAsJobSeeker(event: Event){
    event.preventDefault();
    event.stopPropagation();
    this.moveNext(AccountEnum.JobSeeker);
  }

  public continueAsRecuiter(event: Event){
    event.preventDefault();
    event.stopPropagation();
    //TODO: Implement recuiter workflow
    this.announcer.alert("Đang được xây dựng!")
    this.moveNext(AccountEnum.Recruiter);
  }

  public continueAsCollaborator(event: Event){
    event.preventDefault();
    event.stopPropagation();
    //TODO: Implement collaborator workflow
    this.announcer.alert("Đang được xây dựng!")
    this.moveNext(AccountEnum.Collaborator);
  }

  public moveNext(type: AccountEnum = AccountEnum.JobSeeker){    
    if (!this.validate()) {
      return;
    }
    switch (type){
      case AccountEnum.Recruiter:
        this.service.userInfo.type = AccountEnum.JobSeeker;
        //TODO: Implement recuiter workflow
        break;
      case AccountEnum.Collaborator:
        this.service.userInfo.type = AccountEnum.JobSeeker;
        //TODO: Implement collaborator workflow
        break;
      case AccountEnum.JobSeeker:
      default:
        this.service.userInfo.type = AccountEnum.JobSeeker;
        this.service.nextStep(this.router);
    }    
  }

  public goBack(){
    this.service.goBack(this.router);
  }
}

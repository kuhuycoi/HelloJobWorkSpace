import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
@Component({
  selector: 'app-hj6-link-sns',
  templateUrl: './hj6-link-sns.component.html',
  styleUrls: ['./hj6-link-sns.component.scss']
})
export class Hj6LinkSnsComponent implements OnInit {
  public identifier: string = 'mang-xa-hoi';
  constructor(
    private router: Router,
    private service: Wf1NewUserService
  ) {    
    this.service.moveTo(this.identifier, this.router);
  }  
  
  ngOnInit(): void {
  }

  public get processPercent(){ return this.service.getProcessPercent();}

  private validate(){
    return true;
  }

  public continueWithGoogle(event: Event){
  }

  public continueWithFacebook(event: Event){
  }

  public moveNext(event: Event){
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (!this.validate()) {
      return;
    }
    this.service.nextStep(this.router);
  }

  public goBack(){
    this.service.goBack(this.router);
  }
}

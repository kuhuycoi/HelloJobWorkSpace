import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

@Component({
  selector: 'app-hj7-greeting',
  templateUrl: './hj7-greeting.component.html',
  styleUrls: ['./hj7-greeting.component.scss']
})
export class Hj7GreetingComponent implements OnInit {
  public identifier: string = 'dam-bao-thong-tin';
  constructor(
    private router: Router,
    private service: Wf1NewUserService,
  ) { 
    this.service.moveTo(this.identifier, this.router);
  }  
  
  ngOnInit(): void {
  }

  public get processPercent(){ return this.service.getProcessPercent();}

  private validate(){
    return true;
  }

  public moveNext(event: Event){
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.nextStep(this.router);
  }

  public goBack(){
    this.service.goBack(this.router);
  }

}

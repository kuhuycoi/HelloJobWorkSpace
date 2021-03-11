import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

@Component({
  selector: 'app-hj5-email',
  templateUrl: './hj5-email.component.html',
  styleUrls: ['./hj5-email.component.scss']
})
export class Hj5EmailComponent implements OnInit {
  public identifier: string = 'email';
  public email: string = '';

  constructor(
    private router: Router,
    private service: Wf1NewUserService,
  ) { 
    this.service.moveTo(this.identifier, this.router);
    this.loadCacheData();
  }  
  
  ngOnInit(): void {    
  }

  private loadCacheData(){
    this.email = this.service.userInfo.email;
  }

  public formFields = {
    email: {
      control: new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      errorMessages: {
        required: 'Cần phải nhập email',
        email: 'Sai định dạng email'
      }
    }
  }

  public get processPercent(){ return this.service.getProcessPercent();}

  public validate(){
    return !this.formFields.email.control.errors;
  }

  public moveNext(event: Event){
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.email = this.email;
    this.service.nextStep(this.router);
  }

  public goBack(){
    this.service.goBack(this.router);
  }
}

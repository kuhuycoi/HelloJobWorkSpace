import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

@Component({
  selector: 'app-hj8-account-name',
  templateUrl: './hj8-account-name.component.html',
  styleUrls: ['./hj8-account-name.component.scss']
})
export class Hj8AccountNameComponent implements OnInit {
  public identifier: string = 'ho-ten';  
  public isBusy: boolean = false;

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
    this.formFields.name.control.setValue(this.service.userInfo.fullName);
  }

  public formFields = {
    name: {
      control: new FormControl('',[
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(255),
      ]),
      errorMessages: {
        required: 'Cần phải nhập họ và tên',
        minLength: 'Tên tối thiểu phải có 2 chữ cái',
        maxLength: 'Tên quá dài'
      }
    }
  }
  
  public get processPercent(){ return this.service.getProcessPercent();}

  public validate(){
    return !this.formFields.name.control.errors;
  }

  public lostFocus(event: any){
    if (this.isBusy) return;
    this.isBusy = true;    
    var value = this.formFields.name.control.value;
    this.formFields.name.control.setValue(this.normalize(value));
    this.isBusy = false;
  }

  public normalize(name: string){    
    var words = name.trim().split(' ');
    var ret = '';
    for(var i = 0; i < words.length; i++){
      if (words[i] === '') continue;
      ret = ret.concat(' ', words[i].charAt(0).toUpperCase() + words[i].slice(1).toLowerCase());
    }
    return ret.trim();
  }

  public moveNext(event: Event){
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.fullName = this.formFields.name.control.value;
    this.service.nextStep(this.router);
  }

  public goBack(){
    this.service.goBack(this.router);
  }

}

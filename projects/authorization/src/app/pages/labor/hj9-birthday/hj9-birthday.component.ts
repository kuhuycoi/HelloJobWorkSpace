import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';

import * as moment from 'moment';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

@Component({
  selector: 'app-hj9-birthday',
  templateUrl: './hj9-birthday.component.html',
  styleUrls: ['./hj9-birthday.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class Hj9BirthdayComponent implements OnInit {
  public identifier: string = 'ngay-sinh';

  constructor(
    private router: Router,
    private datePipe: DatePipe,
    private service: Wf1NewUserService,
  ) { 
    this.service.moveTo(this.identifier, this.router);
    this.loadCacheData();
  }  
  
  ngOnInit(): void {
  }

  private loadCacheData(){
    if (this.service.userInfo.dateOfBirth){
      this.formFields.birthday.control.setValue(this.service.userInfo.dateOfBirth);
    }
  }

  public formFields = {
    birthday : {
      control: new FormControl('', [    
        Validators.required,
        (control: AbstractControl): {[key: string]: any} | null => {
          var year = new Date(control.value).getFullYear();
          let check = new Date().getFullYear() - year;
          if (check < 18) return { 'age': true };
          return null;
        }
      ]),
      errorMessages: {
        required: "Cần phải nhập ngày sinh",
        age: "Chưa đến tuổi lao động"
      }
    }    
  }

  public get processPercent(){ return this.service.getProcessPercent();}

  public validate(){
    return !this.formFields.birthday.control.errors;
  }

  public moveNext(event: Event){
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.dateOfBirth = this.formFields.birthday.control.value;
    this.service.nextStep(this.router);
  }

  public goBack(){
    this.service.goBack(this.router);
  }

}

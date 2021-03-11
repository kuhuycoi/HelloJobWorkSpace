import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { FormControl, Validators } from '@angular/forms';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import { PublicService } from 'projects/tools/src/lib/services/public.service';

export interface ExperienceData {
  group: string;
  key: string;
  year: number;
  min: number;
  max: number;
}


@Component({
  selector: 'app-hj18-experiences',
  templateUrl: './hj18-experiences.component.html',
  styleUrls: ['./hj18-experiences.component.scss']
})
export class Hj18ExperiencesComponent implements OnInit {
  public identifier: string = 'kinh-nghiem';
  public experiences = [];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private service: Wf1NewUserService,
    private publicService: PublicService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.publicService.findAllWebsiteModule({ lang: 'vi', haveROOT: false }).subscribe((res: ResponseApi) => this.experiences = res.data);
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  public get selectedExperiences(): any[] {
    return this.service.userInfo.jobExperience;
  }

  public choose(item) {
    const index = this.selectedExperiences?.findIndex(char => char.id === item.id);
    if (index > -1) {
      this.selectedExperiences.splice(index, 1);
    } else {
      this.selectedExperiences.push(item);
    }
  }
  public validate() {
    return this.selectedExperiences?.length;
  }

  public moveNext(event: Event) {
    event.preventDefault(); event.stopPropagation();
    if (this.validate()) {
      this.service.nextStep(this.router);
    }
  }

  public goBack() {
    this.service.goBack(this.router);
  }
  public isChecked(id: number) {
    return this.selectedExperiences?.findIndex(item => item.id === id) > -1;
  }
}


@Component({
  selector: 'experience-selecting-dialog',
  templateUrl: 'experience-dialog.component.html',
})
export class ExperienceSelectingDialog {

  constructor(
    public dialogRef: MatDialogRef<ExperienceSelectingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ExperienceData) {

    this.formFields = {
      year: {
        control: new FormControl('', [
          Validators.required,
          Validators.min(data.min),
          Validators.max(data.max)
        ]),
        errorMessages: {
          required: 'Cần nhập dữ liệu năm kinh nghiệm',
          min: 'Số năm kinh nghiệm không hợp lệ',
          max: 'Số năm kinh nghiệm lớn hơn tuổi của bạn'
        }
      }
    }
  }

  public formFields = null;
  public validate() {
    if (!this.formFields) return false;
    return !this.formFields.year.control.errors;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
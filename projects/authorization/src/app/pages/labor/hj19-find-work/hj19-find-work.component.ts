import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-hj19-find-work',
  templateUrl: './hj19-find-work.component.html',
  styleUrls: ['./hj19-find-work.component.scss']
})
export class Hj19FindWorkComponent implements OnInit {
  public identifier: string = 'mong-muon';
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
    return this.service.userInfo.jobWant;
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

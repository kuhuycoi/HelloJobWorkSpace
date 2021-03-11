import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { HJUserMeasure } from 'projects/vendors/src/lib/class/hj-user-measure';
import { PickerDataModel } from 'projects/vendors/src/lib/data-picker/data-picker.models';

@Component({
  selector: 'app-hj12-height',
  templateUrl: './hj12-height.component.html',
  styleUrls: ['./hj12-height.component.scss']
})
export class Hj12HeightComponent implements OnInit {
  public identifier: string = 'chieu-cao';
  public data: PickerDataModel<HJUserMeasure>[] = null;
  public selectedIndex = 60;

  constructor(
    private router: Router,
    private service: Wf1NewUserService
  ) {
    this.service.moveTo(this.identifier, this.router);
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData() {
    const list = [];
    for (let i = 100; i < 250; i++) {
      list.push(new HJUserMeasure(i, 'cm'))
    }
    const height = this.service.userInfo.height;

    this.selectedIndex = height ? height - 100 : this.selectedIndex;
    this.data = [{
      currentIndex: this.selectedIndex,
      list,
      textAlign: 'center'
    }]
  }

  public get processPercent() { return this.service.getProcessPercent(); }

  private validate() {
    return true;
  }

  public moveNext(event: Event) {
    event.preventDefault(); event.stopPropagation();
    if (!this.validate()) {
      return;
    }
    this.service.userInfo.height = this.data[0].list[this.selectedIndex].measure;
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

  public change(event: any) {
    var iIndex = event.iIndex;
    this.selectedIndex = iIndex;
  }

}

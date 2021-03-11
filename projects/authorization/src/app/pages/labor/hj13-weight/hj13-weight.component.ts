import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wf1NewUserService } from 'projects/authorization/src/app/service/wf1-new-user.service';
import { HJUserMeasure } from 'projects/vendors/src/lib/class/hj-user-measure';
import { PickerDataModel } from 'projects/vendors/src/lib/data-picker/data-picker.models';

@Component({
  selector: 'app-hj13-weight',
  templateUrl: './hj13-weight.component.html',
  styleUrls: ['./hj13-weight.component.scss']
})
export class Hj13WeightComponent implements OnInit {
  public identifier: string = 'can-nang';
  public data: PickerDataModel<HJUserMeasure>[] = null;
  private selectedIndex = 30;
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
    for (let i = 30; i < 120; i++) {
      list.push(new HJUserMeasure(i, 'kg'))
    }
    const weight = this.service.userInfo.weight;
    this.selectedIndex = weight ? weight - 30 : this.selectedIndex;
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
    this.service.userInfo.weight = this.data[0].list[this.selectedIndex].measure;
    this.service.nextStep(this.router);
  }

  public goBack() {
    this.service.goBack(this.router);
  }

  public change(event: any) {
    var gIndex = event.gIndex;
    var iIndex = event.iIndex;
    this.selectedIndex = iIndex;
  }

}

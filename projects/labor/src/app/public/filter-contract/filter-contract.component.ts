import { FormControl } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';
import moment from 'moment';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { OrderContractPager } from 'projects/tools/src/lib/types/pager';

@Component({
  selector: 'app-filter-contract',
  templateUrl: './filter-contract.component.html',
  styleUrls: ['./filter-contract.component.scss'],
})
export class FilterContractComponent implements OnInit {
  pager: OrderContractPager;
  groupContracts = [];
  keyword = new FormControl(null);
  place = new FormControl(null);
  examDateFrom = new FormControl(null);
  examDateTo = new FormControl(null);
  constructor(
    public dialogRef: MatDialogRef<FilterContractComponent>,
    private publicService: PublicService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.publicService
      .findAllOrderContractGroup()
      .subscribe((res: ResponseApi) => {
        this.groupContracts = res.data;
        // this.groupContract = this.groupContracts.find(item => {
        //   return item.id === this.pager.moduleId;
        // });
      });
    this.pager = this.data.pager;
    this.keyword.setValue(this.pager.keyword);
    this.place.setValue(this.pager.place);
    if (this.pager.examDateFrom) {
      this.examDateFrom.setValue(moment(new Date(this.pager.examDateFrom)));
    }
    if (this.pager.examDateTo) {
      this.examDateTo.setValue(moment(new Date(this.pager.examDateTo)));
    }
  }

  changeOrderColumn(column) {
    if (this.pager.orderColumn !== column) {
      this.pager.orderColumn = column;
    }
  }
  changeGender(gender) {
    if (this.pager.gender !== null) {
      this.pager.gender = gender;
    }
  }
  changeTime(time) {
    if (this.pager.time !== time) {
      this.pager.time = time;
    }
  }
  changeModuleID(moduleId) {
    if (this.pager.moduleId !== moduleId) {
      this.pager.moduleId = moduleId;
    }
  }
  changeAsc(asc) {
    if (this.pager.asc !== asc) {
      this.pager.asc = asc;
    }
  }
  onSubmit() {
    this.pager.keyword = this.keyword.value;
    this.pager.place = this.place.value;
    if (this.examDateFrom.value) {
      this.pager.examDateFrom = this.examDateFrom.value.toDate().getTime();
    }

    if (this.examDateTo.value) {
      this.pager.examDateTo = this.examDateTo.value.toDate().getTime();
    }
    this.dialogRef.close(true);
  }
}

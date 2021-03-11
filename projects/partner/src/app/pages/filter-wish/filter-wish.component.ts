import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CustomerWishPager } from 'projects/tools/src/lib/types/pager';
import { PublicService } from 'projects/tools/src/lib/services/public.service';
import { ResponseApi } from 'projects/tools/src/lib/types/response-api';

@Component({
  selector: 'app-filter-wish',
  templateUrl: './filter-wish.component.html',
  styleUrls: ['./filter-wish.component.scss']
})
export class FilterWishComponent implements OnInit {

  pager: CustomerWishPager;
  orders: { text: string, orderColumn: string, asc: boolean }[] = [
    { text: 'label.earliest', orderColumn: 'createdDate', asc: false },
    { text: 'label.joinEarliest', orderColumn: 'createdDate', asc: true },
    { text: 'label.fullNameAsc', orderColumn: 'fullName', asc: true },
    { text: 'label.fullNameDesc', orderColumn: 'fullName', asc: false },
    { text: 'label.youngest', orderColumn: 'dateOfBirth', asc: false },
    { text: 'label.oldest', orderColumn: 'dateOfBirth', asc: true }
  ];
  selectedOrder;
  groupContracts = [];
  form = new FormGroup({
    keyword: new FormControl(null),
    ageFrom: new FormControl(null),
    ageTo: new FormControl(null),
    place: new FormControl(null),
    gender: new FormControl(null),
    moduleID: new FormControl(null),
    salaryFrom: new FormControl(null),
    salaryTo: new FormControl(null),
  });
  get keyword() {
    return this.form.get('keyword');
  }
  get gender() {
    return this.form.get('gender');
  }
  get place() {
    return this.form.get('place');
  }
  get ageFrom() {
    return this.form.get('ageFrom');
  }
  get moduleID() {
    return this.form.get('moduleID');
  }
  get ageTo() {
    return this.form.get('ageTo');
  }
  get salaryFrom() {
    return this.form.get('salaryFrom');
  }
  get salaryTo() {
    return this.form.get('salaryTo');
  }
  constructor(
    private publicService: PublicService,
    private translate: TranslateService,
    public dialogRef: MatDialogRef<FilterWishComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.pager = this.data.pager;
    this.keyword.setValue(this.pager.keyword);
    this.gender.setValue(this.pager.gender);
    this.place.setValue(this.pager.place);
    this.ageFrom.setValue(this.pager.ageFrom);
    this.ageTo.setValue(this.pager.ageTo);
    this.salaryFrom.setValue(this.pager.salaryFrom);
    this.salaryTo.setValue(this.pager.salaryTo);
    this.selectedOrder = this.orders.find(order => order.orderColumn === this.pager.orderColumn && order.asc === this.pager.asc);
    this.publicService.findAllOrderContractGroup().subscribe((res: ResponseApi) => {
      this.groupContracts = res.data;
      this.moduleID.setValue(this.pager.moduleId);
    });
  }

  changeOrder(order: { orderColumn: string, asc: boolean }) {
    if (order) {
      this.pager.orderColumn = order.orderColumn;
      this.pager.asc = order.asc;
    }
  }
  onSubmit() {
    this.pager.keyword = this.keyword.value;
    this.pager.ageFrom = this.ageFrom.value;
    this.pager.ageTo = this.ageTo.value;
    this.pager.gender = this.gender.value;
    this.pager.moduleId = this.moduleID.value;
    this.pager.place = this.place.value;
    this.pager.salaryFrom = this.salaryFrom.value;
    this.pager.salaryTo = this.salaryTo.value;
    this.dialogRef.close(true);
  }
}

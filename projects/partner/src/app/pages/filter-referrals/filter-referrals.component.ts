import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomerWishPager } from 'projects/tools/src/lib/types/pager';

@Component({
  selector: 'app-filter-referrals',
  templateUrl: './filter-referrals.component.html',
  styleUrls: ['./filter-referrals.component.scss']
})
export class FilterReferralsComponent implements OnInit {

  pager: CustomerWishPager;
  form = new FormGroup({
    keyword: new FormControl(null)
  });
  get keyword() {
    return this.form.get('keyword');
  }
  constructor(
    public dialogRef: MatDialogRef<FilterReferralsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.pager = this.data.pager;
    this.keyword.setValue(this.pager.keyword);
  }

  changeOrderColumn(column) {
    if (this.pager.orderColumn !== column) {
      this.pager.orderColumn = column;
    }
  }
  changeAsc(asc) {
    if (this.pager.asc !== asc) {
      this.pager.asc = asc;
    }
  }
  onSubmit() {
    this.pager.keyword = this.keyword.value;
    this.dialogRef.close(true);
  }
}

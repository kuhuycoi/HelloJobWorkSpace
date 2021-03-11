import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-noty-dialog',
  templateUrl: './noty-dialog.component.html',
  styleUrls: ['./noty-dialog.component.scss']
})
export class NotyDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (this.data.btnCancel) {
      this.btnCancel = true;
    }
    if (this.data.btnSubmit) {
      this.btnSubmit = true;
    }
    if (this.data.titleClass) {
      this.titleClass = this.data.titleClass;
    }
    if (this.data.title) {
      this.title = this.data.title;
    }
    if (this.data.notyMessage) {
      this.notyMessage = this.data.notyMessage;
    }
    if (this.data.imgUrl) {
      this.imgUrl = this.data.imgUrl
    }
    if (this.data.bgImgClass) {
      this.bgImgClass = this.data.bgImgClass;
    }
    if (this.data.iconClass) {
      this.iconClass = this.data.iconClass;
    }
  }
  btnCancel = false;
  btnSubmit = false;
  title;
  titleClass = 'text-primary';
  notyMessage = '';
  imgUrl;
  bgImgClass = 'bg-primary';
  iconClass;
  ngOnInit(): void {
  }

}

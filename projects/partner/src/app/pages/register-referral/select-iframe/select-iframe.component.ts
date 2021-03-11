import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-iframe',
  templateUrl: './select-iframe.component.html',
  styleUrls: ['./select-iframe.component.scss']
})
export class SelectIframeComponent implements OnInit {
  form = new FormGroup({
    linkIframe: new FormControl(null, Validators.required)
  });
  constructor(
    public dialogRef: MatDialogRef<SelectIframeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }
  get linkIframe() {
    return this.form.get('linkIframe');
  }
  getError(control) {
    if (control.hasError('required')) {
      return 'Vui lòng nhập trường này';
    } else if (control.hasError('pattern')) {
      return 'Không đúng định dạng';
    } else {
      return 'Vui lòng nhập lại';
    }
  }
  onSubmit() {
    this.dialogRef.close({ fileType: 'iframe', url: this.linkIframe.value });
  }
}

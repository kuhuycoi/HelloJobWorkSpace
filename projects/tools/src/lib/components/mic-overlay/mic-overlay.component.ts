import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-mic-overlay',
  templateUrl: './mic-overlay.component.html',
  styleUrls: ['./mic-overlay.component.scss']
})
export class MicOverlayComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<MicOverlayComponent>) { }

  ngOnInit() {
  }
  close() {
    this.dialogRef.close();
  }

}

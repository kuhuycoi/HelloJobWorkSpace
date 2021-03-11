import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';
declare var $;

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  gallery = [];
  index = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GalleryComponent>) {
  }

  ngOnInit(): void {
    this.gallery = this.data.gallery ? this.data.gallery : [];
    this.index = this.data.index ? this.data.index : 0;
  }
  get localStorage() {
    return localStorage;
  }
  get currentSlide() {
    return this.gallery[this.index];
  }
  prevSlide() {
    if (this.index === 0) {
      this.index = this.gallery.length - 1;
    } else {
      this.index--;
    }
  }
  nextSlide() {
    if (this.index === this.gallery.length - 1) {
      this.index = 0;
    } else {
      this.index++;
    }
  }
  close() {
    this.dialogRef.close();
  }
}

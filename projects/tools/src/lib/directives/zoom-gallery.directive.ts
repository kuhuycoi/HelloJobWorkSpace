import { GalleryComponent } from '../components/gallery/gallery.component';
import { MatDialog } from '@angular/material/dialog';
import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appZoomGallery]'
})
export class ZoomGalleryDirective {

  @Input('appZoomGallery') gallery: { url: string, type: 'video' | 'img' }[] = [];
  @Input() appZoomIndex = 0;
  constructor(private diaglog: MatDialog) { }

  @HostListener('click', ['$event'])
  onClick(event) {
    if (this.gallery && this.gallery.length) {
      this.diaglog.open(GalleryComponent, {
        width: '1000px',
        maxWidth: '100%',
        maxHeight: '80vh',
        panelClass: 'gallery-dialog',
        data: {
          gallery: this.gallery,
          index: this.appZoomIndex
        }
      });
    }
  }

}

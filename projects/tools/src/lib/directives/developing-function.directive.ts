import { Directive, HostListener } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Directive({
  selector: '[appDevelopingFunction]'
})
export class DevelopingFunctionDirective {

  constructor(private snackBar: MatSnackBar) {
  }

  @HostListener('click')
  onClick() {
    this.snackBar.open('Chức năng này đang được phát triển', 'x', {
      panelClass: ['style-warning'],
      duration: 2500
    });
  }

}

import { DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trustHTML'
})
export class TrustHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

}

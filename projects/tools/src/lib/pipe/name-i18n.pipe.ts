import { Pipe, PipeTransform } from '@angular/core';
import { Customer } from '../types/customer';

@Pipe({
  name: 'nameI18n'
})
export class NameI18nPipe implements PipeTransform {
  transform(value: Customer, ...args: any[]): unknown {
    if (!value) {
      return null;
    }
    let lang;
    if (args && args.length) {
      lang = args[0];
    }
    switch (lang) {
      case 'ja': {
        return value.fullNameJP;
      }
      default: {
        return value.fullName;
      }
    }
  }

}

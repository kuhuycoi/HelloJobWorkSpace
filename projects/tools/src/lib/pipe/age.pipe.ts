import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: Date): number {
    if (!value) {
      return null;
    }
    const today = moment();
    const birthdate = moment(value);
    const years = today.diff(birthdate, 'years');
    return !years ? 1 : years;
  }

}

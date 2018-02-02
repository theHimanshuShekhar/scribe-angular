import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({name: 'dateFormatPipe'})
export class DateFormatPipe implements PipeTransform {
  transform(value: string, type?: string) {
    const datePipe = new DatePipe('en-US');
    if (!type) {
      value = datePipe.transform(value, 'MMM d');
    }
    if (type === 'long') {
      value = datePipe.transform(value, 'h:mm a - d MMM yyy');
    }
    if (type === 'month') {
      value = datePipe.transform(value, 'MMM yyy');
    }
    return value;
 }
}

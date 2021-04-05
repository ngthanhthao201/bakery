import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'vnphone'
})
export class VnPhonePipe implements PipeTransform {

  transform(value: string): string {
    if(value && value.length == 10){
      return `${value.substring(0,3)} ${value.substring(3,6)} ${value.substring(6,10)}`
    }

    return value;
  }

}
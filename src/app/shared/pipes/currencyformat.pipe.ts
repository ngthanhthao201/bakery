import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyformat'
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number, currencyCode: string = 'VND', symbolDisplay: 'code'|'symbol'|'symbol-narrow'|boolean = 'symbol-narrow' , digits?: string): string {
    if (!value) {
      value = 0;
    }

    let currencyPipe: CurrencyPipe = new CurrencyPipe('vi-VN');

    let newValue: string = new Intl.NumberFormat('vi-VN').format(value) ;
    if(currencyCode != 'trim'){
      newValue += " đ";
    }
    return newValue;
  }

}
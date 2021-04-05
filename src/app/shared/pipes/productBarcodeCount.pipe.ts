import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'productBarcodeCount'
})
export class ProductBarcodeCountPipe implements PipeTransform {

  transform(array: any[], field:string): string {

    if (!array || array.length ==0) {
      return '';
    }
    var result = '';

    if(field === 'notSold'){
        result = "Còn " + _.filter(array,{isSold:false , isActive:true} as any).length;
    }
    if(field === 'sold'){
        result = "Đã bán " + _.filter(array,{isSold:true, isActive: true} as any).length;
    }
    if(field === 'inActive'){
        result = "Đã hủy " +_.filter(array,{isActive:false} as any).length;
    }
    
    
    return result;
    
  }

}
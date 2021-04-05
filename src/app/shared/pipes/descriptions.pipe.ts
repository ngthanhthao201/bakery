import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'descriptions'
})
export class DescriptionsPipe implements PipeTransform {

  transform(value: any[], field:string): string {
    if (!value || value.length ==0) {
      return '';
    }
    var result ="";

    if(field === 'description'){
          if(value.length ==1 ){
            return value[0][field] || '--';
        }else{
            _.each(value, i=>{
                if(i[field]){
                    result += i[field] + ", "
                }
            })
            result =  result.slice(0, -2);
        }
    }
    else if(field === 'quantitydescription'){
        if(value.length ==1 ){
          return value[0]["quantity"]+ " x " + value[0]["description"] || '--';
      }else{
          _.each(value, i=>{
              if(i["description"]){
                  result += (i["quantity"] + " x " + i["description"] + ", ")
              }
          })
          result =  result.slice(0, -2);
      }
  }
    else if(field === 'materialProvider'){
      if(value.length ==1 ){
          var row = value[0];
          return (row.materialBuyingHistory.quantity || '') + ' ' + (row.materialBuyingHistory.material.unit ||'') + ' ' + (row.materialBuyingHistory.material.name || '') ;
      }else{
          _.each(value, i=>{
              var row = i;
              
                  result += (row.materialBuyingHistory.quantity || '') + ' ' + (row.materialBuyingHistory.material.unit ||'') + ' ' + (row.materialBuyingHistory.material.name || '')  + ", "
              
          })
          result =  result.slice(0, -2);
      }
    }

    
    

    return result || '--';
  }

}
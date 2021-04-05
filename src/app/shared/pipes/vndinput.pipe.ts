import { Pipe, PipeTransform } from '@angular/core';
/*
 * Capitalize the first letter of the string
 * Takes a string as a value.
 * Usage:
 *  value | capitalizefirst
 * Example:
 *  // value.name = daniel
 *  {{ value.name | capitalizefirst  }}
 *  fromats to: Daniel
*/
@Pipe({
  name: 'vndinput'
})
export class VndInputPipe implements PipeTransform {
    transform(value:any) {
        if (value<1000) {
            return value * 1000;
        }
        return value;
    }
}
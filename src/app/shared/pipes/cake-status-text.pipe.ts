import {Pipe, PipeTransform,ChangeDetectorRef} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser";
import { OrderStatus } from "../models/order-status.enum";
import { Order } from "../models/order.model";
import { OrderCakeStatus } from "../models/order-cake-status.model";
import { CakeStatus } from "../models/cake-status.enum";

@Pipe({
    name: 'cakeStatusText',
    pure: false
})
export class CakeStatusTextPipe implements  PipeTransform
{

    constructor( private sanitized: DomSanitizer)
    {
       
    }


    transform(obj:OrderCakeStatus)
    {
        try {
           switch(obj.cakeStatus){
            case CakeStatus.Done:
            return "Bánh Đã Xong";
            case CakeStatus.InProcess:
            return "Chưa Xong";
            case CakeStatus.New:
            return "Chưa Xong";
           }
          
        } catch (e) {
            return  obj;
        }

        
    };
}
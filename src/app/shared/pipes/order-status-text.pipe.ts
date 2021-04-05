import {Pipe, PipeTransform,ChangeDetectorRef} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser";
import { OrderStatus } from "../models/order-status.enum";
import { Order } from "../models/order.model";

@Pipe({
    name: 'orderStatusText',
    pure: false
})
export class OrderStatusTextPipe implements  PipeTransform
{

    constructor( private sanitized: DomSanitizer)
    {
       
    }


    transform(obj:OrderStatus)
    {
        try {
           switch(obj){
            case OrderStatus.Waiting:
            return "Đang chờ giao nhận";
            case OrderStatus.Done:
            return "Đã giao";
            case OrderStatus.Skipped:
            return "Đã hủy";
           }
          
        } catch (e) {
            return  obj;
        }

        
    };
}
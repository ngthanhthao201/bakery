import { Pipe, PipeTransform, ChangeDetectorRef, ElementRef } from "@angular/core";
import { ShopService } from '../../shared/services/shop.service';
import { Order } from "../models/order.model";
import { OrderStatus } from "../models/order-status.enum";
declare var $: any;

@Pipe({
    name: 'orderActiveStep',
    pure: false
})
export class OrderActiveStepPipe implements PipeTransform {
    constructor( private shopService : ShopService)
    {
       
    }
    transform(order: Order, parameter: string,  elem:ElementRef) {

        
        try {
            if (parameter == "0") {
                if (order.status == OrderStatus.Waiting) {
                    return "Tiếp Nhận";
                } 
                if(order.status == OrderStatus.Done) {
                    return "Đã giao";
                }
                else if (order.orderCakeStatus.cakeStatus == 1) {
                    return "Đang Làm Bánh";
                } else if (order.orderCakeStatus.cakeStatus == 2) {
                    return "Làm Xong";
                }
            }
            if (parameter == "1"){    
                if (order.status == OrderStatus.Waiting || order.status == OrderStatus.Done) {      
                    return order.member.image || "https://i.imgur.com/AgCHnkP.png";   
                }    else{
                    return order.orderCakeStatus.member.image || "https://i.imgur.com/AgCHnkP.png";   
                }        
            }
            if (parameter == "2"){          
                if(order.status == OrderStatus.Waiting || order.status == OrderStatus.Done)    {
                    return   order.member.name || "";     
                }else{
                    return   order.orderCakeStatus.member.name || "";     
                }
                          
            }
            if (parameter == "3") {
                if (order.status == OrderStatus.Waiting) {
                    return "";
                } 
                if(order.status == OrderStatus.Done) {
                    return "success";
                }
                else if (order.orderCakeStatus.cakeStatus == 1) {
                    return "";
                } else if (order.orderCakeStatus.cakeStatus == 2) {
                    return "";
                }
            }
        } catch (e) {
            console.log(e)
            return "";
        }

    };
}
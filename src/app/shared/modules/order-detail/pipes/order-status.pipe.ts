import { Pipe, PipeTransform, ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { CakeStatus } from "../../../models/cake-status.enum";
import { Order } from '../../../models/order.model';
import { DatePipe } from '@angular/common';



@Pipe({
    name: 'orderStatus',
    pure: false
})
export class OrderStatusPipe implements PipeTransform {

    transform(value: Order, field: string, elem:ElementRef): any {


        if (field == "statusText") {
            if (value.orderCakeStatus.cakeStatus == CakeStatus.InProcess) {
                return "Bánh bắt đầu làm lúc"
            }
            else if (value.orderCakeStatus.cakeStatus == CakeStatus.Done) {
                return "Bánh đã làm xong lúc"
            }
        }

        else if (field == "statusValue") {
            if (value.orderCakeStatus.cakeStatus == CakeStatus.InProcess) {
                return 30;
            }
            else if (value.orderCakeStatus.cakeStatus == CakeStatus.Done) {
                return 100;
            }
        }

        else if (field == "statusDateTime") {
            if (value.orderCakeStatus.cakeStatus != CakeStatus.New)
                return new DatePipe('vi-VN').transform(value.orderCakeStatus.updatedDate, 'short') ;
        }


        return "";
    }


}


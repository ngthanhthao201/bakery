import { Pipe, PipeTransform, ChangeDetectorRef } from "@angular/core";
import { ShopService } from '../services/shop.service';
import { Order } from "../models/order.model";
import { OrderStatus } from "../models/order-status.enum";
import { CakeStatus } from "../models/cake-status.enum";
import { RunStatus } from "../models/run-status.enum";

@Pipe({
    name: 'orderStatusIcon',
    pure: false
})
export class OrderStatusIconPipe implements PipeTransform {
    constructor(private shopService: ShopService) {

    }
    transform(order: Order, parameter: string) {


        try {
            if (parameter == "0") //Cake Status
            {
                if (order.orderCakeStatus.cakeStatus == CakeStatus.InProcess) {
                    return "ft-life-buoy fa fa-spin";
                }
                else {
                    return "ft-life-buoy";
                }
            }
            if (parameter == "1") {
                switch (order.runStatus) {
                    case RunStatus.New:
                        return "../../../../../../assets/icons/deliveryByMotorBike.png";
                    case RunStatus.InProcess:
                        return "../../../../../../assets/icons/deliveryByMotorBike.png";
                    case RunStatus.Done:
                        return "../../../../../../assets/icons/box_success.png";
                    case RunStatus.Failed:
                        return "../../../../../../assets/icons/box_cancel.png";
                }
            }

        } catch (e) {
            return order;
        }

    };
}
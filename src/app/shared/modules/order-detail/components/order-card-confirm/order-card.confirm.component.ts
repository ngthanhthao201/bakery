import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SnotifyService } from "ng-snotify";
import { OrderDetailComponent } from "../order-detail/order-detail.component";
import { Order } from "../../../../models/order.model";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { ApiService } from "../../../../services/api.service";
import { PrintService } from "../../../../services/print.service";
import { Utilities } from "../../../../services/utilities";
import { Router } from "@angular/router";
import { ShopService } from "../../../../services/shop.service";
import { OrderConfirmNoDialog } from "./order-confirm-no/order-confirm-no.component";


@Component({
  selector: 'order-card-confirm',
  templateUrl: './order-card-confirm.component.html',
  styleUrls: ['./order-card-confirm.component.scss']

})
export class OrderCardConfirmComponent {
  @Input() order: Order;

  constructor(public orderService: OrderService, private dialog: MatDialog, private apiService: ApiService,
    private snotifyService: SnotifyService, private bottomSheet: MatBottomSheet,
    private router: Router,
    private printService: PrintService,
    private shopService: ShopService) {
  }

  ngOnInit() {
  }

  ok() {
    let dialogRef = this.dialog.open(OrderDetailComponent, {
      panelClass: 'col-md-6',
      data: {
        order: this.order
      }
    });
    dialogRef.afterClosed().subscribe(result => {
    });

  }

  cancelOrder() {
    let dialogRef = this.dialog.open(OrderConfirmNoDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        order: this.order
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      //   dialogRef.close();
      //   this.orderService.ordersChanged.emit(null);
      // }
    });
  }

  openOrderDetail(order) {
    if (event.type === 'click') {
      console.log(order)
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: order
        }
      });
    }
  }

  // linkToChatOrder() {
  //   var roomName = Utilities.buildRoomNameFromOrder(this.order, this.order.shopId)
  //   this.router.navigate(['chats'], { queryParams: { roomName: roomName } });
  // }

}


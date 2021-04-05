import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from "@angular/router";
import { Order } from "../../../../../models/order.model";
import { ApiService } from "../../../../../services/api.service";
import { OrderService } from "../../../../../../layout/orders/services/order.service";
import { OrderStatus } from "../../../../../models/order-status.enum";


@Component({
  selector: 'order-confirm-no-dialog',
  templateUrl: 'order-confirm-no.component.html',
  styleUrls: ['./order-confirm-no.component.scss'],
})
export class OrderConfirmNoDialog {
  order: Order;
  selectedReason: string;
  reasons = [
    'Không liên hệ được!',
    'Khách muốn đặt lại!',
    'Khác',
  ];
  constructor(private apiService: ApiService, private router: Router, private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderConfirmNoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = data.order;
  }

  ngOnInit() {

  }

  refuse() {
    this.order.status = OrderStatus.Skipped;
    this.apiService.updateOrder(this.order).subscribe(r => {
      this.dialogRef.close(this.order);
    })
    console.log(this.order);

  }

  selectedReasonChanged() {
    if (this.selectedReason == 'Khác') {
      this.order.skippedComment = '';
    }

  }



}
import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl} from '@angular/forms';
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from "@angular/router";
import { Order } from "../../../../models/order.model";
import { ApiService } from "../../../../services/api.service";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { OrderStatus } from "../../../../models/order-status.enum";

@Component({
  selector: 'order-skip-confirm-dialog',
  templateUrl: 'order-skip-confirm.component.html',
  styleUrls: ['./order-skip-confirm.component.scss'],
})
export class OrderSkipConfirmDialog {
  order: Order;

  constructor( private apiService: ApiService, private router: Router,private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderSkipConfirmDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.order = data.order;
  }

  chips = [
    'Khách hàng hủy đơn!',
    'Sai thông tin đơn hàng!',
    'Khách hàng đặt nhầm sản phẩm. Khách hàng muốn hủy bỏ đơn hàng để đặt lại.',
    'Khách hàng đặt hàng 02 lần/ đơn hàng. Nhân viên cần hủy bớt 01 đơn trùng.',
    'Do thời gian giao của cửa hàng vượt quá thời gian cho phép nhận hàng của khách hàng.',
    'Người giao không giao được đơn hàng cho khách hàng, người giao chuyển gửi trả đơn hàng về cửa hàng. Nhân viên cần xác nhận động thời hủy bỏ đơn hàng.',
    
  ];

  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    


  }

  ok(){
    this.order.status = OrderStatus.Skipped;
    console.log(this.order);

    this.apiService.updateOrder(this.order).subscribe(r=>{

      this.dialogRef.close(this.order);

      this.router.navigateByUrl('/orders');

    })

  }

  

}
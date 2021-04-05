import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Router } from "@angular/router";
import { Order } from "../../../../models/order.model";
import { ApiService } from "../../../../services/api.service";
import { OrderService } from "../../../../../layout/orders/services/order.service";
import { OrderStatus } from "../../../../models/order-status.enum";
import { DriverRun } from "../../../../models/driver-run.model";
import { ShopService } from "../../../../services/shop.service";
import { Driver } from "../../../../models/driver.model";

@Component({
  selector: 'order-driver-dialog',
  templateUrl: 'order-driver-dialog.component.html',
  styleUrls: ['./order-driver-dialog.component.scss'],
})
export class OrderDriverDialog {
  order: Order;
  newDriverRun: DriverRun = new DriverRun();
  drivers: Driver[];
  currentDriver: Driver;
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };

  constructor(private apiService: ApiService, private shopService: ShopService, private orderService: OrderService,
    public dialogRef: MatDialogRef<OrderDriverDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.order = data.order;
  }

  ngOnInit() {
    this.getDrivers();

  }

  getDrivers() {
    this.apiService.getDriversByShop(this.shopService.currentShop.id).subscribe(r => {
      this.drivers = r;
    });
  }

  choseDriver(driver) {
    this.currentDriver = driver;
    this.newDriverRun.driverId = driver.id;
    this.newDriverRun.orderId = this.order.id;
    console.log(this.newDriverRun);
  }

  ok() {
    this.newDriverRun.scheduledDatetime = this.order.deliveryPickupTime;
    this.apiService.createDriverRun(this.newDriverRun).subscribe(r => {
      this.dialogRef.close(r);
    });

  }





}
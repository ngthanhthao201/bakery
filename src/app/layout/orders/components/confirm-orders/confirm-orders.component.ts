import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-confirm-orders',
  templateUrl: './confirm-orders.component.html',
  styleUrls: ['./confirm-orders.component.scss']
})
export class ConfirmOrdersComponent implements OnInit {

  orders = [];

  constructor(private apiService: ApiService,
    public shopService: ShopService,
    public orderService: OrderService, ) {
  }

  ngOnInit() {

    this.apiService.getOrdersStatusNew(this.shopService.currentShop.id).subscribe(r => {
      console.log(r)
      this.orders = r;
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../../../shared/models/order.model';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';

@Component({
  selector: 'app-done-orders',
  templateUrl: './done-orders.component.html',
  styleUrls: ['./done-orders.component.scss']
})
export class DoneOrdersComponent implements OnInit {
  orders: Observable<Order[]>;
  constructor(private apiService: ApiService, private shopService: ShopService) {
    this.orders = this.apiService.getDoneOrders(shopService.currentShop.id);
   }

  ngOnInit() {
  }

}

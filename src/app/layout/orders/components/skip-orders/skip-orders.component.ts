import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../../../shared/models/order.model';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
@Component({
  selector: 'app-skip-orders',
  templateUrl: './skip-orders.component.html',
  styleUrls: ['./skip-orders.component.scss']
})
export class SkipOrdersComponent implements OnInit {

  orders: Observable<Order[]>;
  constructor(private apiService: ApiService, private shopService: ShopService) {
    this.orders = this.apiService.getSkipOrders(shopService.currentShop.id);
   }

  ngOnInit() {
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Order } from '../../../../models/order.model';

@Component({
  selector: 'app-order-details-info',
  templateUrl: './order-details-info.component.html',
  styleUrls: ['./order-details-info.component.scss']
})
export class OrderDetailsInfoComponent implements OnInit {
  @Input() order: Order;
  constructor() { }

  ngOnInit() {
  }

}

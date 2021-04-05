import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './components/orders/orders.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { OrderDetailModule } from '../../shared/modules/order-detail/order-detail.module';
import { DoneOrdersComponent } from './components/done-orders/done-orders.component';
import { SkipOrdersComponent } from './components/skip-orders/skip-orders.component';
import { OverOrdersComponent } from './components/over-orders/over-orders.component';
import { NgbModule, NgbCollapseModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OrdersRoutingModule,
    OrderDetailModule,
    NgbModule,
    NgbCollapseModule,
    NgbAccordionModule,
    NgxDatatableModule
  ],
  declarations: [OrdersComponent, DoneOrdersComponent, SkipOrdersComponent, OverOrdersComponent]
})
export class OrdersModule { }

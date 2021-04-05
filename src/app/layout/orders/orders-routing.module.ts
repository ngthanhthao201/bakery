import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { DoneOrdersComponent } from './components/done-orders/done-orders.component';
import { SkipOrdersComponent } from './components/skip-orders/skip-orders.component';
import { OverOrdersComponent } from './components/over-orders/over-orders.component';

const routes: Routes = [
  {
      path: '', component: OrdersComponent,
  },
  {
    path: 'done', component: DoneOrdersComponent,
  },
  {
    path: 'skip', component: SkipOrdersComponent,
  },
  {
    path: 'over', component: OverOrdersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }

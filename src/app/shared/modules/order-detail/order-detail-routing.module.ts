import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

const routes: Routes = [
    {
        path: '',
        component: OrderDetailComponent,
    }
    
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderDetailRoutingModule {}

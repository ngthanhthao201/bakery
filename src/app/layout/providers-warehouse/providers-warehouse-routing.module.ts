import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvidersWarehouseComponent } from './providers-warehouse.component';

const routes: Routes = [{
  path:'', component: ProvidersWarehouseComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvidersWarehouseRoutingModule { }

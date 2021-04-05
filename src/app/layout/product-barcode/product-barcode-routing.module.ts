import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductBarcodeComponent } from './product-barcode.component';

const routes: Routes = [
  {
      path: '', component: ProductBarcodeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductBarcodeRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StuffBarcodeComponent } from './stuff-barcode.component';

const routes: Routes = [{
  path: '', component: StuffBarcodeComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StuffBarcodeRoutingModule { }

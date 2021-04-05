import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputProductDialogComponent } from './input-product-dialog.component';

const routes: Routes = [
  {
      path: '', component: InputProductDialogComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputProductDialogRoutingModule { }
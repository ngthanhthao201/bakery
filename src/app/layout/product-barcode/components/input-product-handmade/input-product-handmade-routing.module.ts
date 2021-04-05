import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputProductHandmadeComponent } from './input-product-handmade.component';

const routes: Routes = [
  {
      path: '', component: InputProductHandmadeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InputProductHandmadeRoutingModule { }
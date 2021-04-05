import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { HardProductBarcodesComponent } from './components/hard-product-barcodes/hard-product-barcodes.component';

const routes: Routes = [
    {
        path: '', component: DashboardComponent
    },
    {
        path: 'tab', component: HardProductBarcodesComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {
}

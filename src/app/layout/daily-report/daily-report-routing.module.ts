import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DailyReportComponent } from './daily-report.component';
import { ProductBarcodeReportComponent } from './components/product-barcode-report/product-barcode-report.component';
import { StuffBarcodeReportComponent } from './components/stuff-barcode-report/stuff-barcode-report.component';
import { GeneralReportComponent } from './components/general-report/general-report.component';

const routes: Routes = [
  {
    path: '', component: DailyReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyReportRoutingModule { }

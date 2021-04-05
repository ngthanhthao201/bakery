import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyReportRoutingModule } from './daily-report-routing.module';
import { DailyReportComponent } from './daily-report.component';
import { GeneralReportComponent } from './components/general-report/general-report.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { ProductBarcodeReportComponent } from './components/product-barcode-report/product-barcode-report.component';
import { ReportTransactionDetail } from './components/report-transaction-detail/report-transaction-detail';
import { ReportProductBarcodeDetail } from './components/report-product-barcode-detail/report-product-barcode-detail';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StuffBarcodeReportComponent } from './components/stuff-barcode-report/stuff-barcode-report.component';
import { DownloadReportComponent } from './components/download-report-bottom-sheet/download-report-bottom-sheet';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    DailyReportRoutingModule,
    NgbModule
  ],
  declarations: [DailyReportComponent, ProductBarcodeReportComponent, StuffBarcodeReportComponent,GeneralReportComponent, 
    ReportTransactionDetail, ReportProductBarcodeDetail, DownloadReportComponent, ],
    entryComponents:[DownloadReportComponent, ReportProductBarcodeDetail, ReportTransactionDetail, ]

})
export class DailyReportModule { }

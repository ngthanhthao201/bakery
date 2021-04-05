import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialRoutingModule } from './financial-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { FinancialComponent } from './financial.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsModule } from 'ng2-charts';
import { IncomeDayDetailDialog } from './dialogs/income-day-detail.component';
import { HeadersDetailDialog } from './dialogs/headers-detail.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    ChartsModule,
    FinancialRoutingModule
  ],
  declarations: [FinancialComponent, IncomeDayDetailDialog, HeadersDetailDialog],
  entryComponents:[IncomeDayDetailDialog, HeadersDetailDialog]
})
export class FinancialModule { }

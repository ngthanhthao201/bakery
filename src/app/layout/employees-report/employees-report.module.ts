import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/modules/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeesReportComponent } from './employees-report.component';
import { EmployeesReportRoutingModule } from './employees-report-routing.module';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    EmployeesReportRoutingModule,
    NgbModule,
    ChartsModule
  ],
  declarations: [EmployeesReportComponent],
    entryComponents:[]

})
export class EmployeesReportModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { PageHeaderModule, SharedPipesModule } from '../../shared';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ChartsModule } from 'ng2-charts';
import { NewEditCustomerDialog } from '../../shared/dialogs/new-edit-customer.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerService } from '../../shared/services/customer.service';

@NgModule({
    imports: [CommonModule, CustomersRoutingModule, PageHeaderModule,
            SharedModule
        , NgxDatatableModule,
        ChartsModule],
    declarations: [CustomersComponent, NewEditCustomerDialog, CustomerDetailComponent],
    entryComponents: [NewEditCustomerDialog, CustomerDetailComponent],
    providers: [CustomerService]
    
})
export class CustomersModule {}

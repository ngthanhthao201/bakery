import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProvidersWarehouseRoutingModule } from './providers-warehouse-routing.module';
import { ProvidersWarehouseComponent } from './providers-warehouse.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { EditProviderDialog } from './dialogs/edit-provider.component';
import { MaterialHistoryDialog } from './dialogs/material-history.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ProvidersWarehouseRoutingModule,
    NgxDatatableModule
  ],
  declarations: [ProvidersWarehouseComponent, EditProviderDialog, MaterialHistoryDialog],
  entryComponents:[EditProviderDialog, MaterialHistoryDialog]
})
export class ProvidersWarehouseModule { }

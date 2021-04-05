import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VouchersRoutingModule } from './vouchers-routing.module';
import { VouchersComponent } from './vouchers.component';
import { NewVouchersDialogComponent } from './new-vouchers-dialog/new-vouchers-dialog.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  imports: [
    CommonModule,
    VouchersRoutingModule,
    SharedModule,
    CurrencyMaskModule
  ],
  declarations: [VouchersComponent, NewVouchersDialogComponent],
  entryComponents:[NewVouchersDialogComponent]
})
export class VouchersModule { }

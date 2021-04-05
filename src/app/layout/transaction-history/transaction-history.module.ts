import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransactionHistoryRoutingModule } from './transaction-history-routing.module';
import { TransactionHistoryComponent } from './transaction-history.component';
import { TransactionHistoryDetailComponent } from './transaction-history-detail/transaction-history-detail.component';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TransactionHistoryRoutingModule
  ],
  declarations: [TransactionHistoryComponent, TransactionHistoryDetailComponent],
  entryComponents:[TransactionHistoryDetailComponent]
})
export class TransactionHistoryModule { }

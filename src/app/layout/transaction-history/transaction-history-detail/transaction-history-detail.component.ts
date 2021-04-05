import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify';
import { IncomeContainer } from '../../../shared/models/income-container.model';
import { ShopService } from '../../../shared/services/shop.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import * as moment from 'moment';
import { IncomeTransaction } from '../../../shared/models/IncomeTransaction';

@Component({
  selector: 'app-transaction-history-detail',
  templateUrl: './transaction-history-detail.component.html',
  styleUrls: ['./transaction-history-detail.component.scss']
})
export class TransactionHistoryDetailComponent implements OnInit {

  incomeContainer: IncomeContainer;
  destroyedReason = "";
  constructor(private apiService: ApiService, public shopService: ShopService, private ngZone: NgZone, private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<TransactionHistoryDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, ) {
    this.incomeContainer = data.incomeContainer;
  }

  ngOnInit() {

  }

  removeIncomeTransactions() {
    var ids = _.map(this.incomeContainer.incomeTransactions, i => {
      return i.id;
    });

    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?", "", {
      buttons: [
        {
          text: "Ok",
          action: () => {
            this.apiService.deactiveTransactions(ids, this.destroyedReason, this.shopService.currentShop.id).subscribe(r => {
              this.snotifyService.success("Xóa giao dịch thành công! 1 tin nhắn đã gửi tới quản trị viên.", "");
              this.ngOnInit();
              var deactiveTransactions =
                [
                  this.incomeContainer.incomeTransactions[0].isActive = false,
                  this.incomeContainer.incomeTransactions[0].destroyedReason = this.destroyedReason
                ]
              this.dialogRef.close(deactiveTransactions);
            });
            this.snotifyService.clear();
          }
        }, {
          text: "Cancel",
          action: () => {
            this.snotifyService.clear();
          }
        }
      ]
    });

  }

}

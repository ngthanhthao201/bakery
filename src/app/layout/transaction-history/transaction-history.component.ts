import { Component, OnInit, NgZone } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ShopService } from '../../shared/services/shop.service';
import { IncomeHeader } from '../../shared/models/income-header.model';
import { IncomeContainer } from '../../shared/models/income-container.model';
import * as moment from 'moment';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { TransactionHistoryDetailComponent } from './transaction-history-detail/transaction-history-detail.component';
import { Utilities } from '../../shared/services/utilities';
import { SnotifyService } from 'ng-snotify';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {

  incomeHeaders: Array<IncomeHeader> =[];
  incomeContainers: Array<IncomeContainer> = [];
  selectedDate: Date = new Date();
  constructor(private dialog: MatDialog, private apiService: ApiService, public shopService: ShopService, private ngZone: NgZone, private snotifyService: SnotifyService, ) { }

  ngOnInit() {
    this.getByDate();
  }

  dateChange(e) {
    this.incomeHeaders = []
    this.getByDate(this.selectedDate);
  }

  getByDate(date = new Date()) {
    this.apiService.getIncomeHeadersByShop(this.shopService.currentShop.id, moment(date).startOf('day').toDate(), moment(date).endOf('day').toDate()).subscribe(r => {
      this.incomeHeaders = r;

      // this.incomeHeader.incomeTransactions = this.incomeHeader.incomeTransactions.reverse();

      // var groups = _.groupBy(this.incomeHeader.incomeTransactions, 'incomeContainerIdNumber');
      // var _this = this;
      // Object.keys(groups) // get the keys as array
      //   .forEach(function (lengthKey) { // iterate the sorted keys' array
      //     var incomecontainer = new IncomeContainer();
      //     incomecontainer.incomeTransactions = groups[lengthKey];
      //     incomecontainer.date = incomecontainer.incomeTransactions[0].createdDate;
      //     incomecontainer.memberId = incomecontainer.incomeTransactions[0].memberId;
      //     incomecontainer.idNumber = lengthKey;
      //     _this.incomeContainers.push(incomecontainer);
      //   });
    })
  }

  openTransactionDetail(incomeContainer: IncomeContainer) {
    if (incomeContainer.incomeTransactions[0].isActive == true) {
      let dialogRef = this.dialog.open(TransactionHistoryDetailComponent, {
        data: {
          incomeContainer: incomeContainer,
        }
      });

      dialogRef.afterClosed().subscribe(r => {
      });
    } else {
      this.snotifyService.error("","Đã hủy!");
      
    }
  }

  orderByTotal() {
    this.incomeHeaders = _.orderBy(this.incomeHeaders, 'amount').reverse();
  }

  orderByTime() {
    this.incomeHeaders = _.orderBy(this.incomeHeaders, 'dateCreated').reverse();
  }


  myFilter = (d: Date): boolean => {
    return Utilities.withInMonthFilter(d);
  }
}

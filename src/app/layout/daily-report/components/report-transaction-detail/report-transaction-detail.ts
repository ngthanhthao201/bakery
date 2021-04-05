import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { IncomeTransaction } from "../../../../shared/models/IncomeTransaction";
import { ApiService } from "../../../../shared/services/api.service";
import { IncomeDialog } from "../../../../shared/dialogs/income-dialog.component";
import { TransactionsDetailDialog } from "../../../financial/dialogs/transactions-detail.component";

@Component({
    selector: 'report-transaction-detail',
    templateUrl: 'report-transaction-detail.html',
    styleUrls: ['report-transaction-detail.scss'],
  })
  export class ReportTransactionDetail {
    incomeTransactions:Array<IncomeTransaction>=[];
    constructor(private matDialog: MatDialog,private apiService:ApiService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<ReportTransactionDetail>) {

        this.incomeTransactions = data.incomeTransactions.reverse();


    }

    viewHeader(headerId){
      this.apiService.getIncomeHeader(headerId).subscribe(r=>{
        console.log(r)
        this.matDialog.open(TransactionsDetailDialog, {
          panelClass: 'col-md-6',
          data:{
            header: r,
            transactions: r.incomeTransactions
          }
        })
      });
    }


  }
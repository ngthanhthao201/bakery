import { Component, OnInit, Inject } from '@angular/core';
import { QzTrayService } from '../../services/qz-tray.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-printers',
  templateUrl: './connect-printers.component.html',
  styleUrls: ['./connect-printers.component.scss']
})
export class ConnectPrintersComponent implements OnInit {
  printers = [];
  connectedPrinter = '';
  isPrinter: boolean;
  receiptCount: number;
  constructor(private qzService: QzTrayService,
    public dialogRef: MatDialogRef<ConnectPrintersComponent>, @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.connectedPrinter = localStorage.getItem('connectedPrinter');
      this.printers = data.printers;
    }

  ngOnInit() {
    var _isPrinter = localStorage.getItem('isPrinter');
    if (_isPrinter) {
      this.isPrinter = true;
    }

    this.receiptCount = parseInt(localStorage.getItem('receiptCount')) || 2;
  }
  
  select(p){
    this.dialogRef.close(p);
  }

  isPrinterChanged() {
    if (this.isPrinter) {
      localStorage.setItem('isPrinter', this.isPrinter.toString());
    } else {
      localStorage.removeItem('isPrinter');
    }

  }

    minusReceiptCount(){
      if(this.receiptCount > 1){
          this.receiptCount --;
          localStorage.setItem('receiptCount', this.receiptCount.toString());
      }
      
  }

  plusReceiptCount(){
      if(this.receiptCount < 5){
          this.receiptCount ++;
          localStorage.setItem('receiptCount', this.receiptCount.toString());
      }
  }

}

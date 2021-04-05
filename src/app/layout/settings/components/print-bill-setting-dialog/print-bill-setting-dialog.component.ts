import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-print-bill-setting-dialog',
  templateUrl: './print-bill-setting-dialog.component.html',
  styleUrls: ['./print-bill-setting-dialog.component.scss']
})
export class PrintBillSettingDialogComponent implements OnInit {

  currentShop: Shop;
  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<PrintBillSettingDialogComponent>, private snotifyService: SnotifyService) {
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    console.log(this.currentShop);
   }

  ngOnInit() {
  }

  saveOpenClosetTime(){
    this.apiService.saveOpenCloseTime(this.currentShop).subscribe(r=>{
      this.snotifyService.success("Saved successfully", "" );
      this.currentShop = r;
      localStorage.setItem('currentShop', JSON.stringify(r));
      this.dialogRef.close();
    });
  }


}

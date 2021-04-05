import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-open-close-time-dialog',
  templateUrl: './open-close-time-dialog.component.html',
  styleUrls: ['./open-close-time-dialog.component.scss']
})
export class OpenCloseTimeDialogComponent implements OnInit {

  currentShop: Shop;
  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<OpenCloseTimeDialogComponent>, private snotifyService: SnotifyService) {
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

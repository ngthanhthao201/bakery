import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { CakeSizeType } from '../../../../shared/models/cake-size-type.model';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-cake-size-type-dialog',
  templateUrl: './cake-size-type-dialog.component.html',
  styleUrls: ['./cake-size-type-dialog.component.scss']
})
export class CakeSizeTypeDialogComponent implements OnInit {
  cakeSizeTypes :CakeSizeType[] =[];
  currentShop: Shop;
  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<CakeSizeTypeDialogComponent>, private snotifyService: SnotifyService) {
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
   }

  ngOnInit() {
    this.getTypes();
  }

  getTypes(){
    this.apiService.getCakeSizeTypes(this.currentShop.id).subscribe(r=>{
      this.cakeSizeTypes = r;
    });
  }

  saveCakeSizeTypes(){
    this.apiService.saveCakeSizeTypes(this.cakeSizeTypes).subscribe(r=>{
      this.snotifyService.success("Saved successfully", "");
      this.dialogRef.close();
    });
  }

  addType(){
    var newType = new CakeSizeType();
    newType.shopId = this.currentShop.id;
    this.cakeSizeTypes.push(newType);
  }

}

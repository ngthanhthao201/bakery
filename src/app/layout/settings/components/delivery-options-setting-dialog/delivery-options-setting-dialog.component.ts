import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { DeliveryOption } from '../../../../shared/models/delivery-option.model';

@Component({
  selector: 'app-delivery-options-setting-dialog',
  templateUrl: './delivery-options-setting-dialog.component.html',
  styleUrls: ['./delivery-options-setting-dialog.component.scss']
})
export class DeliveryOptionsSettingDialogComponent implements OnInit {
  deliveryOptions :DeliveryOption[] =[];
  currentShop: Shop;
  currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };
  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<DeliveryOptionsSettingDialogComponent>, private snotifyService: SnotifyService) {
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
   }

  ngOnInit() {
    this.getDeliveryOptions();
  }

  getDeliveryOptions(){
    this.apiService.getDeliveryOptions(this.currentShop.id).subscribe(r=>{
      this.deliveryOptions = r;
    });
  }

  saveDeliveryOptions(){
    this.apiService.saveDeliveryOptions(this.deliveryOptions).subscribe(r=>{
      this.snotifyService.success("Saved successfully", "");
      this.dialogRef.close();
    });
  }

  addType(){
    var newType = new DeliveryOption();
    newType.shopId = this.currentShop.id;
    this.deliveryOptions.push(newType);
  }

}

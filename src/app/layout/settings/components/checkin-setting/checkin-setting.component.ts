import { Component, OnInit } from '@angular/core';
import { CustomerType } from '../../../../shared/models/customer-type.model';
import { CustomerCampaign } from '../../../../shared/models/customer-campaign.model';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { MatDialogRef } from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-checkin-setting',
  templateUrl: './checkin-setting.component.html',
  styleUrls: ['./checkin-setting.component.scss']
})
export class CheckinSettingComponent implements OnInit {
  customerCampaign: CustomerCampaign ={} as any;



  constructor(private apiService: ApiService, private shopService: ShopService,
    public dialogRef: MatDialogRef<CheckinSettingComponent>, private snotifyService: SnotifyService
    ) {
        this.apiService.getCustomerCampaign("CheckInCampaign", this.shopService.currentShop.id).subscribe(r=>{
          this.customerCampaign = r;
        })
   }

  ngOnInit() {
  }

  save(){
    this.apiService.updateCustomerCampaign(this.customerCampaign).subscribe(r=>{
      this.snotifyService.success("Saved successfully", "");
      this.dialogRef.close();
    })
  }

}

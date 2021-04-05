import { Component, ChangeDetectorRef } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Inject } from "@angular/core";
import { BarcodeService } from "../../../../shared/services/barcode.service";
import { QuickOrderService } from "../../../../shared/services/quick-order.service";

@Component({
    selector: 'sell-cake-settings',
    templateUrl: 'sell-cake-settings.component.html',
  })
  export class SellCakeSettingsComponent {
    labels = [];
    constructor(public quickOrderService: QuickOrderService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<SellCakeSettingsComponent>) {
      this.labels = Object.keys(quickOrderService.membersSellCaleSettings);
    }
  
    openLink(event: MouseEvent): void {
      this.bottomSheetRef.dismiss();
      event.preventDefault();
    }

    
  ngAfterViewInit() {

  }

    updateSettings(l){
       this.quickOrderService.membersSellCaleSettings = {...this.quickOrderService.membersSellCaleSettings};
    }

    apply(){
      window.location.reload();
    }

  }
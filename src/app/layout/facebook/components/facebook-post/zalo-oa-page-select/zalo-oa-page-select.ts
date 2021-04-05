import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { Inject } from "@angular/core";
import { ApiService } from "../../../../../shared/services/api.service";
import { ShopService } from "../../../../../shared/services/shop.service";
declare var jquery: any;
declare var $: any;

@Component({
  selector: 'zalo-oa-page-select',
  templateUrl: 'zalo-oa-page-select.html',
})
export class ZaloOAPageSelectSheet {

    pages = [];
  constructor( private ref : MatBottomSheetRef,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private apiService : ApiService, private shopService: ShopService){
    this.apiService.getZaloOAPages(shopService.currentShop.id).subscribe(r=>{
        this.pages = r;
    })
  }

  selectPage(p){
    this.ref.dismiss(p.id);
  }

}





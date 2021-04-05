import { Component, OnInit } from '@angular/core';
import { ZaloOAPage } from '../../../../shared/models/zalo-oa-page.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';

@Component({
  selector: 'app-zalo-oa-manager',
  templateUrl: './zalo-oa-manager.component.html',
  styleUrls: ['./zalo-oa-manager.component.scss']
})
export class ZaloOaManagerComponent implements OnInit {


  zaloOAPages: Array<ZaloOAPage>=[];

  constructor(private spinner: NgxSpinnerService, private apiService: ApiService, private shopService: ShopService) {
    
    //this.spinner.show();
  }

  ngOnInit() {
    this.apiService.getZaloOAPagesIncludePosts(this.shopService.currentShop.id).subscribe(r=>{
      this.zaloOAPages = r;
      console.log(r);
    });
  }

  loginZlOA(){
      localStorage.setItem('zaloTokenType', 'zaloOA');
    window.location.href = "https://oauth.zaloapp.com/v3/oa/permission?app_id=43860413461215279&redirect_uri=https://admin.tiembanhngon.com/zalo_login_response";
  }

  postNow(zaloOAPost){
    this.apiService.postZaloOANow(zaloOAPost).subscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route } from '../../../../node_modules/@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { Http } from '../../../../node_modules/@angular/http';
import { ZaloPageShop } from '../../shared/models/zalo-page-shop.model';
import { Router } from '@angular/router';
import { SnotifyService } from 'ng-snotify';
import { ZaloOAPage } from '../../shared/models/zalo-oa-page.model';
import { ShopService } from '../../shared/services/shop.service';
declare var Zalo:any;
@Component({
  selector: 'app-zalo-login-response',
  templateUrl: './zalo-login-response.component.html',
  styleUrls: ['./zalo-login-response.component.scss']
})
export class ZaloLoginResponseComponent implements OnInit {

  uid: string;
  code: string;
  constructor(private router: Router, private route: ActivatedRoute, private apiService: ApiService, private http : Http,
    snotifyService: SnotifyService, private shopService: ShopService) { 
    var currentShop =  shopService.currentShop;

    var zaloTokenType = localStorage.getItem('zaloTokenType');

    if(zaloTokenType == 'zalo'){
      
    route.queryParams.subscribe(r=>{
      this.code = r["code"];
      var zaloPageShop = new ZaloPageShop();
      zaloPageShop.accessToken = this.code;
      zaloPageShop.shopId = currentShop.id;

      Zalo.getLoginStatus(function(response) {
        if (response.status === 'connected') {
          Zalo.api('/me',
            'GET',
            {
              fields: 'id,name,picture'
            },
            function (response) {
              zaloPageShop.name = response.name;
              zaloPageShop.pageId = response.id;
              zaloPageShop.image = response.picture.data.url;
              apiService.createZaloPageShop(zaloPageShop).subscribe(rZalo=>{
                snotifyService.success("Thêm trang Zalo thành công","");
                  router.navigateByUrl("/settings?tab=zalo");          
              }, err=>{
                snotifyService.success("Trang Zalo đã được thêm","");
                router.navigateByUrl("/settings?tab=zalo");
              })
            }
          );
        } else {
          //Zalo.login("not_connected");
        }
      });

    });

    }else if(zaloTokenType == 'zaloOA'){
      route.queryParams.subscribe(r=>{
        var oaId = r["oaId"];
        var access_token = r["access_token"];

        var newZaloOAPage = new ZaloOAPage();
        newZaloOAPage.shopId = currentShop.id;
        newZaloOAPage.accessToken = access_token;


          this.apiService.createZaloOAPage(newZaloOAPage).subscribe(rZalo=>{
            snotifyService.success("Thêm trang Zalo OA thành công", "");
              router.navigateByUrl("/settings?tab=zaloOA");          
          }, err=>{
            snotifyService.success("Trang Zalo OA đã được thêm", "");
            router.navigateByUrl("/settings?tab=zaloOA");
          })

        })
    }

  }

  ngOnInit() {
  }

}

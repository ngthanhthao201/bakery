import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import *  as _ from 'lodash';
import *  as moment from 'moment';
import { SnotifyService } from 'ng-snotify';
import { FacebookService, LoginResponse } from 'ngx-facebook';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-add-facebook-page',
  templateUrl: './add-facebook-page.component.html',
  styleUrls: ['./add-facebook-page.component.scss']
})
export class AddFacebookPageComponent implements OnInit {

  shop :any ={};
  facebookPages =[];
  facebookPagesLinked = []
  uniqueId;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private fb: FacebookService,
    private snotifyService: SnotifyService
  ) {
      this.uniqueId = activatedRoute.snapshot.params["uniqueId"];
      this.apiService.getFacebookPageShopsByUniqueId(this.uniqueId).subscribe(r=>{
        this.shop = r.shop;
        this.facebookPagesLinked = r.facebookPages;
      })
   }

  ngOnInit() {
    
  }

  loginFb() {

    this.fb.getLoginStatus().then(response => {
      if (response.status === 'connected') {
        this.fb.logout().then(r => {

        })
      }
    });
    // this will cause popup rejected
    //window.setTimeout(() => {
      var opts = { scope: 'email,pages_manage_engagement,pages_manage_metadata,pages_manage_posts,pages_messaging' };
      this.fb.login(opts).then(r => {
        var loginResponse = r as LoginResponse;
        console.log(loginResponse.authResponse.userID);
        this.fb.api('/' + loginResponse.authResponse.userID + '/accounts').then(accounts => {
          // if(accounts.data && accounts.data.length > 0){

          // }
          this.facebookPages = accounts.data;
          _.each(this.facebookPages, p => {
            p.image = 'http://graph.facebook.com/' + p.id + '/picture?type=small';
            var existing = _.find(this.facebookPages, { pageId: p.id })
            if (existing) {
              this.getLongLiveToken(p);
            }
          });
        })
      })
    //}, 1000);
  }

  getLongLiveToken(p) {
    var AppId = "2079540132308914";
    var AppSecret = "b0fdfd1a6f2d47c79eeb6ab9132363b6";


    var url = "/oauth/access_token?";
    url += ("client_id=" + AppId);
    url += ("&client_secret=" + AppSecret);
    url += "&grant_type=fb_exchange_token&";
    url += "fb_exchange_token=" + p.access_token;
    this.fb.api(url).then(longToken => {
      var t = new Date();
      t.setSeconds(t.getSeconds() + longToken.expires_in);

      var fbPageShop = {
        accessToken: longToken.access_token,
        name: p.name,
        shopId: this.shop.id,
        pageId: p.id,
        image: p.image,
        postCount: 0,
        expiredTime: moment().add('day', 60).toDate()

      } as any;

      var existing = _.find(this.facebookPagesLinked, { pageId: fbPageShop.pageId }) as any;
      if (!existing) {
        this.apiService.createFacebookPageShop(fbPageShop).subscribe(r => {
          if (r) {
            //this.getFacebookPageShops();
            this.snotifyService.success("Thêm trang thành công", "");
          }
        }, err => {
          console.log(err);
          this.snotifyService.error(err._body, "");
        });
      } else {
        existing.accessToken = longToken.access_token;
        existing.expiredTime = fbPageShop.expiredTime;
        existing.name = fbPageShop.name;
        this.apiService.updateFacebookPageShop(existing).subscribe(r => {
          if (r) {
            //this.getFacebookPageShops();
            this.snotifyService.success("Làm mới thành công", "");
          }
        }, err => {
          console.log(err);
          this.snotifyService.error(err._body, "");
        });
      }

    })
  }

}

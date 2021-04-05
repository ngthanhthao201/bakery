import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MemberService } from '../../shared/services/member.service';
import { OrderService } from '../orders/services/order.service';
import { FacebookService, LoginResponse, InitParams } from 'ngx-facebook';
import { Router } from '@angular/router';
import { ShopService } from '../../shared/services/shop.service';
import { MatDialog } from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';
import { FacebookPost } from '../../shared/models/facebook-post.model';
import { Observable } from 'rxjs';
import { FacebookPageShop } from '../../shared/models/facebook-page-shop.model';
import * as _ from 'lodash';
import { FacebookPostService } from './services/facebook.service';
import * as moment from 'moment';

@Component({
  selector: 'app-facebook',
  templateUrl: './facebook.component.html',
  styleUrls: ['./facebook.component.scss']
})
export class FacebookComponent implements OnInit {
  facebookPages = [];
  facebookPageShops: FacebookPageShop[];
  activeSeason: any = {};
  seasons = [];
  today = moment(new Date());

  constructor(private apiService: ApiService,
    public memberService: MemberService,
    private orderService: OrderService,
    private fb: FacebookService, private route: Router,
    private facebookPostService: FacebookPostService,
    public shopService: ShopService,
    public dialog: MatDialog, private snotifyService: SnotifyService) { }

  ngOnInit() {

    this.getActiveSeason();

    Observable.forkJoin(
      [this.facebookPostService.getSeasons(),
      this.apiService.getFacebookPageShops(this.shopService.currentShop.id)]
    ).subscribe(r => {
      this.seasons = r[0];
      this.facebookPageShops = r[1] as any;
      _.each(this.facebookPageShops, (p: any) => {
        p.chartData = {
          labels: _.map(this.seasons, i => { return i.name }),
          values: _.map(this.seasons, s => {
            var total = 0;
            _.each(p.facebookPosts, (post: any) => {
              _.each(post.seasonIds, (a: any) => {
                if (a === s.id) {
                  total++;
                }
              })
            })
            return total;
          }),
        }

        p.facebookPostsTemp = _.clone(p.facebookPosts);

        var expireDate = moment(p.expiredTime);
        p.expireDaysYet = expireDate.diff(this.today,'days');

    
      })
    })
  }

  chartClicked(e) {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        // get the internal index of slice in pie chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        var season = _.find(this.seasons, { name: label })

        _.each(this.facebookPageShops, (p: any) => {
          p.facebookPostsTemp = _.filter(p.facebookPosts, post => {
            return post.seasonIds.indexOf(season.id) > -1;
          })
        })

      }
    }
  }

  showAll() {
    _.each(this.facebookPageShops, (p: any) => {
      p.facebookPostsTemp = p.facebookPosts
    })
  }

  showEmptySeasons() {
    _.each(this.facebookPageShops, (p: any) => {
      p.facebookPostsTemp = _.filter(p.facebookPosts, post => {
        return post.seasonIds.length == 0;
      })

    })
  }

  getActiveSeason() {
    this.facebookPostService.getActiveSeason().subscribe(r => {
      this.activeSeason = r;
    })
  }


  openCreateFacebookPost(fbPage) {
    // let dialogRef = this.dialog.open(FacebookPostComponent, {
    //     width: '800px',
    //     data: {
    //         facebookPageShopId: fbPage.id
    //     }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         this.getFacebookPageShops();
    //         this.snotifyService.success('Tạo post facebook thành công!', '');
    //     }
    // });
    this.route.navigateByUrl("/facebook/fbp/" + fbPage.id)
  }

  editFacebookPost(fbPost, fbPage) {
    // let dialogRef = this.dialog.open(CreateFacebookDialogDialogComponent, {
    //     width: '800px',
    //     data: {
    //         facebookPost: fbPost,
    //         facebookPageShopId: fbPage.id
    //     }
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         this.getFacebookPageShops();
    //         this.snotifyService.success('Sửa post facebook thành công!', '');
    //     }
    // });

    this.route.navigateByUrl("/facebook/fbp/" + fbPage.id + "/" + fbPost.id)
  }


  isNotExisting(id) {
    return _.findIndex(this.facebookPageShops, { pageId: id }) < 0;
  }

  deleteFacebookPost(fbPage) {
    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa post này?", "", {
      buttons: [
        {
          text: "Ok",
          action: () => {
            this.apiService.deleteFacebookPost(fbPage).subscribe(r => {
              //this.getFacebookPageShops();
              this.snotifyService.success('Xóa post thành công!', '');
            });
            this.snotifyService.clear();
          }
        }, {
          text: "Cancel",
          action: () => {
            this.snotifyService.clear();
          }
        }
      ]

    });
  }



  postFacebookNow(post: FacebookPost) {
    this.snotifyService.warning('Chờ tới khi có thông báo "Post thành công"', 'Đang xử lý');
    const successAction = Observable.create(observer => {
      observer.next({
        title: 'Đang post',
      });
      setTimeout(() => {
        observer.next({
          title: 'Post thành công',
          config: {
            closeOnClick: true,
            timeout: 1000,
            showProgressBar: true
          }
        });
        observer.complete();
      }, 1000);
    });

    this.apiService.postFacebookNow(post).subscribe(r => {
      this.snotifyService.async('', successAction);
    })
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
        shopId: this.shopService.currentShop.id,
        pageId: p.id,
        image: p.image,
        postCount: 0,
        expiredTime: moment().add('day', 60).toDate()

      } as any;

      var existing = _.find(this.facebookPageShops, { pageId: fbPageShop.pageId }) as any;
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


  facebookPostTimeChange(fbPageShop: FacebookPageShop) {
    this.apiService.updateFacebookPageShop(fbPageShop).subscribe(r => {
      this.snotifyService.success("Cài đặt thời gian thành công", "");
    });
  }

  loginFb() {

    this.fb.getLoginStatus().then(response => {
      if (response.status === 'connected') {
        this.fb.logout().then(r => {

        })
      }
    });
    window.setTimeout(() => {
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
            var existing = _.find(this.facebookPageShops, { pageId: p.id })
            if (existing) {
              this.getLongLiveToken(p);
            }
          });
        })
      })
    }, 1000);
  }

  refreshPage(fbPageShop: FacebookPageShop) {
    // this.apiService.removeFacebookPageShop(fbPageShop).subscribe(r => {
    //     if (r) {
    //         this.getFacebookPageShops();
    //     }
    // });
    this.loginFb();
  }

}

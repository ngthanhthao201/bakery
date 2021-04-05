import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ROUTES } from './sidebar-routes.config';
import { RouteInfo } from "./sidebar.metadata";
import { Router, ActivatedRoute } from "@angular/router";
import { ShopService } from '../../../shared/services/shop.service';
import { MemberService } from '../../../shared/services/member.service';
import * as _ from 'lodash';
import { ApiService } from '../../../shared/services/api.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { BlockAndWarningComponent } from '../../dashboard/components/block-and-warning/block-and-warning.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';


declare var $: any;
@Component({
    // moduleId: module.id,
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']

})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    today = moment(new Date());
    expireDaysYet = 0;
    public promotionDate : any;
    public expirationDate  = false;
    public dueDate = false;
    public static updateBadgeAction: EventEmitter<any>=  new EventEmitter();

    constructor(private router: Router, public shopService: ShopService,
        private memberService: MemberService,
        private route: ActivatedRoute,
        private apiService: ApiService,
        private sanitized: DomSanitizer, 
        public dialog : MatDialog,
        public translateService: TranslateService
        ) {
    }

    openModal() {
        this.shopService.currentShop = JSON.parse(localStorage.getItem('currentShop'));
        let today = moment();
        // this.shopService.currentShop.expiredDate ="2020-12-18"
         let expiredDate = moment(this.shopService.currentShop.expiredDate);
        //let expiredDate = moment().add(1,'days');
       if(expiredDate.diff(today,'days') <= 0 ) { // expiredDate
        this.expirationDate =  true;  
       } else if(expiredDate.diff(today,'days') > 0 && expiredDate.diff(today,'days') <=7 ){ // less than 7 days 
        this.dueDate = true
        this.promotionDate = expiredDate.diff(today,'days')
       } else   { // from 7 days above
           return       
       }
         this.dialog.open(BlockAndWarningComponent,{
            panelClass: "col-md-4",       
            data: {             
                promotionDate : this.promotionDate,
                expirationDate : this.expirationDate,
                dueDate : this.dueDate
            },
            disableClose: true,
        });  
        
      } 
    
    ngOnInit() {
        //this.openModal()
        $.getScript('./assets/js/app-sidebar.js');
        this.menuItems = ROUTES.filter(menuItem => {
            if (menuItem.requiredClaim) {
                return this.memberService.hasPermission(menuItem.requiredClaim, this.shopService.currentShop.id)
            }
            return true;
        });
        this.menuItems.forEach(i => {
            i.submenu = _.filter(i.submenu, s => {
                if (s.requiredClaim) {
                    return this.memberService.hasPermission(s.requiredClaim, this.shopService.currentShop.id)
                }
                return true;
            });

            _.forEach(i.submenu, async sb => {

                // Observable.forkJoin(
                //     this.apiService.getActiveOrdersToday(this.shopService.currentShop.id),
                //     this.apiService.getOrdersStatusNew(this.shopService.currentShop.id),
                // ).subscribe(res => {
                //     if (sb.path == '/orders') {
                //         this.ordersCount = sb.badge = res[0].length.toString();
                //     }
                //     if (sb.path == '/confirm-orders') {
                //         sb.badge = res[1].length.toString();
                //         if (i.title == 'Đơn') {
                //             i.badge = this.ordersCount + ` + ` + sb.badge;
                //         }
                //     }

                // });
                if (sb.path == '/orders') {
                    sb.title = await this.translateService.get('sidebar.order_label').toPromise();
                }

                if (sb.path == '/facebook') {
                    this.apiService.getFacebookPageShops(this.shopService.currentShop.id).subscribe(r => {
                        _.forEach(r, fbPageShop => {
                            var expireDate = moment(fbPageShop.expiredTime);
                            this.expireDaysYet = expireDate.diff(this.today, 'days');
                        })
                    });
                    if (this.expireDaysYet <= 14) {
                        sb.class = 'facebook-expire-style';
                        sb.title = "Facebook (Cần làm mới)";
                    }
                }


            })
        })

        SidebarComponent.updateBadgeAction.subscribe(r=>{
            this.updateBadge(r.path, r.number)
        })
    }

    public updateBadge(path, number: number, badgeClass="badge badge-pill badge-danger mt-1"){

    this.menuItems.forEach(i => {
        i.submenu = _.filter(i.submenu, s => {
            if (s.requiredClaim) {
                return this.memberService.hasPermission(s.requiredClaim, this.shopService.currentShop.id)
            }
            return true;
        });

        _.forEach(i.submenu, sb => {
                if (sb.path == path) {
                    sb.badge = number;
                    i.badge+= number
                    sb.badgeClass =badgeClass
                }
        })
        if(i.badge> 0){ 
            i.badgeClass =badgeClass
        }

    })
    }

}

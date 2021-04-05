import { EventEmitter, Injectable } from "@angular/core";
import { Shop } from "../models/shop.model";
import { ApiService } from "./api.service";
import { ProductBarcode } from "../models/product-barcode.model";
import { ProductCategory } from "../models/product-category.model";
import * as _ from "lodash";
import { MbSignalRService } from "./mbSignalR.service";
import { HardProductBarcode } from "../models/hard-product-barcode.model";
import { ShopService } from "./shop.service";
import { SnotifyService } from 'ng-snotify'; 
import { ProductBarcodeService } from "../../layout/product-barcode/services/product-barcode.service";
import { Observable } from "rxjs";
import { CommonService } from "./common.service";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { SidebarComponent } from "../../layout/components/sidebar-v2/sidebar.component";

@Injectable({
    providedIn: 'root'
})
export class MbNotificationsService {

    public mbNotification : any ={};

    constructor(private shopService: ShopService, private commonService: CommonService, private productBarcodeService: ProductBarcodeService,
        private snotifyService: SnotifyService,  private http: Http) {

    }



      getNotifications(shopId): Observable<any>{
        return this
            .http
            .get(this.commonService.baseUrl + "api/notifications/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
      }
    
      public async fetchNotifications(){
        this.getNotifications(this.shopService.currentShop.id).subscribe(r=>{
            this.mbNotification = r;
            console.log(r)
            if(r.notReplyRoomsCount > 0){
                SidebarComponent.updateBadgeAction.emit({path: "/chats", number: r.notReplyRoomsCount});
            }
            if(r.newOrdersCount > 0){
                SidebarComponent.updateBadgeAction.emit({path: "/confirm-orders", number: r.newOrdersCount});
            }

        })
      }
     

}
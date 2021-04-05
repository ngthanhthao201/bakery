import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { CommonService } from "../../../services/common.service";
import { OrderDetail } from "../../../models/order-detail.model";

@Injectable({
    providedIn: 'root'
})
export class OrderDetailService {
    constructor(private http: Http, private commonService: CommonService) {

    }

    updateOrderDetail(od){
        return this
            .http
            .put(this.commonService.baseUrl + "api/orderDetail", od, this.commonService.getAuthHeader(true))
            .map((response: Response) => {   
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    
}
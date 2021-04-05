import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import * as _ from "lodash";
import { CommonService } from "../../shared/services/common.service";


@Injectable({
    providedIn: 'root'
})
export class LalamoveService {

    constructor(private http: Http, private commonService: CommonService) {

    }

    getQuote(shopId, lalamoveVM): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/lalamove/quote/" + shopId, lalamoveVM , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    placeOrder(shopId, orderId,lalamoveVM): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/lalamove/place-order/" + shopId + "/" + orderId,lalamoveVM , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrderDetail(orderRef: string): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/lalamove/order/" + orderRef , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDriverDetail(orderRef : string, driverId: string): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/lalamove/order/" + orderRef +"/driver/" + driverId , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getDriverLocation(orderRef : string, driverId: string): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/lalamove/order/" + orderRef +"/driver/" + driverId +"/location" , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

}
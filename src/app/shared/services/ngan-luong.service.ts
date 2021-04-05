import { EventEmitter, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import * as _ from "lodash";
import { MbSignalRService } from "./mbSignalR.service";
import { JwtHelper } from "./jwt-helper";
import { Router } from "@angular/router";
import { Customer } from "../models/customer.model";
import { Observable, Subscription } from "rxjs";
import { share } from "rxjs/operators";
import { SnotifyService } from "ng-snotify";
import { CommonService } from "./common.service";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { CandidateCustomer } from "../models/candidate-customer.model";
import { CustomerCandidateAudit } from "../models/customer-candidate-audit.model";

@Injectable()
export class NganLuongService {


    constructor(private commonService: CommonService,
        private snotifyService: SnotifyService, private http: Http
    ) {
      

    }

    
    getRequestField(payment_method: string): Observable<any[]> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/nganLuong/getRequestField/" ,{payment_method: payment_method}, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

        
    setExpressCheckoutShop(shopId, setExpressCheckoutParams: any): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/nganLuong/setExpressCheckoutShop/"+ shopId, setExpressCheckoutParams, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

 
}


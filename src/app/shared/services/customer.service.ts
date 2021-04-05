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
export class CustomerService {


    constructor(private commonService: CommonService,
        private snotifyService: SnotifyService, private http: Http
    ) {
      

    }



 
    
    searchCandidateOrders(shopId: number): Observable<CandidateCustomer[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/search-candidate-orders/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

        
    searchCandidateIncomes(shopId: number): Observable<CandidateCustomer[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/search-candidate-incomes/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    saveCustomerCandidateAudit(customerCandidateAudit: CustomerCandidateAudit): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/customer/save-customer-candidate-audit/", customerCandidateAudit, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }
 
}


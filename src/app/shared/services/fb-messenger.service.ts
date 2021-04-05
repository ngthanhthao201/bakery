import { EventEmitter, Injectable } from "@angular/core";
import { CommonService } from "./common.service";
import { Observable, Subscription } from "rxjs";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { SendFbMessage } from "../models/sendFbMessage.model";

@Injectable({
    providedIn: 'root'
})
export class FbMessengerService {


    constructor(
        private commonService: CommonService, private http: Http
       ) {

    }

   
    getConversations(shopId): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/facebookMessenger/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getMessages(pageId, threadId): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + `api/facebookMessenger/${pageId}/${threadId}`, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    sendMessage(sendFbMessageVM: SendFbMessage): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + `api/facebookMessenger/send`, sendFbMessageVM,this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

}


import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import * as _moment from 'moment';
import * as _ from "lodash";
import { CommonService } from "../../../shared/services/common.service";


@Injectable({
    providedIn: 'root'
})
export class FacebookPostService {

    constructor(private http: Http, private commonService: CommonService) {

    }

    getFacebookPost(id): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/facebookPost/" + id , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getActiveSeason(): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/season/active" , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getSeasons(): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/season/" , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    addPostSeason(ps){
        return this
        .http
        .post(this.commonService.baseUrl + "api/facebookPost/add-post-season" ,ps, this.commonService.getAuthHeader(true))
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.commonService.handleError);
    }

    deletePostSeason(ps){
        return this
        .http
        .post(this.commonService.baseUrl + "api/facebookPost/delete-post-season" , ps, this.commonService.getAuthHeader(true))
        .map((response: Response) => {
            return response.json();
        })
        .catch(this.commonService.handleError);
    }

}
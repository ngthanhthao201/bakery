import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { CommonService } from "../../../shared/services/common.service";


@Injectable({
    providedIn: 'root'
})
export class DailyReportService {
    constructor(private http: Http, private commonService: CommonService) {

    }

        //shiftSnapShot

        getPreviousSnapShotByShiftAndDate(shopId : number, date: string): Observable<any> {
            return this
                .http
                .get(this.commonService.baseUrl + "api/shiftSnapShot/previous/" + shopId +"/" + date, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json();
                })
                .catch(this.commonService.handleError);
        }

        getPreviousSnapShotByShiftAndDate4BigCake(shopId : number, date: string): Observable<any> {
            return this
                .http
                .get(this.commonService.baseUrl + "api/shiftSnapShot/previous-big/" + shopId +"/" + date, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json();
                })
                .catch(this.commonService.handleError);
        }

        getReportDailySmall(shopId: number, date: string): Observable<any>{
            return this
                .http
                .get(this.commonService.baseUrl + "api/report/daily-small/" + shopId +"/" + date, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json();
                })
                .catch(this.commonService.handleError);
        }
}
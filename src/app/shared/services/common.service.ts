import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { environment } from "../../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    accessToken: any = {};
    private options: RequestOptions;
    private _baseUrl = "";
    
    constructor(private http: Http, ) {
        this._baseUrl = environment.baseURl
        this.options = new RequestOptions();

        if(localStorage.getItem('openIdTokenParams')){
            var openIdTokenParams = JSON.parse(localStorage.getItem('openIdTokenParams'));
            if (openIdTokenParams && openIdTokenParams.access_token) {
                this.accessToken = openIdTokenParams.access_token;
            }
        }else{
            this.accessToken = localStorage.getItem('accessToken');
        }


    }

    public get baseUrl (){
        return this._baseUrl;
    }

    public getAuthHeader(includeJsonContentType?: boolean, ): RequestOptions {
        if (!this.accessToken) {
            if(localStorage.getItem('openIdTokenParams')){
                var openIdTokenParams = JSON.parse(localStorage.getItem('openIdTokenParams'));
                if (openIdTokenParams && openIdTokenParams.access_token) {
                    this.accessToken = openIdTokenParams.access_token;
                }
            }else{
                this.accessToken = localStorage.getItem('accessToken');
            }
        }
        let headers = new Headers({ 'Authorization': 'Bearer ' + this.accessToken });

        if (includeJsonContentType)
            headers.append("Content-Type", "application/json");

        headers.append("Accept", `application/json, text/plain, */*`);

        return new RequestOptions({ headers: headers });
    }



    public handleError(error: Response) {
        if (error.status === 401 && window.location.href.indexOf('/login') < 0) {
            console.log('handleError login');
            window.location.href = "/login";

        }
        return Observable.throw(error);
    }




    
}
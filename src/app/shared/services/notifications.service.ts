import { Injectable } from '@angular/core';
import { Response, Http, RequestOptions } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { map, filter, switchMap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationsService {
    private options: RequestOptions;
    private _baseURL =  "https://api-cms.dotnets.org/";

    constructor(private http: Http) {

    }

    private handleError(error: Response) {
        return throwError(error);
    }

    getNotificationArticles() {
        return this
            .http
            .get(this._baseURL + "api/public-articles")
            .pipe(map((response: Response) => {
                return response.json();
            }))
            .pipe(catchError(this.handleError));
    }

    getNotificationCategories() {
        return this
            .http
            .get(this._baseURL + "api/public-categories")
            .pipe(map((response: Response) => {
                return response.json();
            }))
            .pipe(catchError(this.handleError));
    }

    getNotificationArticleById(id: any) {
        return this
            .http
            .get(this._baseURL + "api/public-article/" + id)
            .pipe(map((response: Response) => {
                return response.json();
            }))
            .pipe(catchError(this.handleError));
    }

}
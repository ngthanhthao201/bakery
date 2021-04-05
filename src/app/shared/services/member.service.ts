import { EventEmitter, Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import * as _ from "lodash";
import { MbSignalRService } from "./mbSignalR.service";
import { JwtHelper } from "./jwt-helper";
import { Router } from "@angular/router";
import { Member } from "../models/member.model";
import { Observable, Subscription } from "rxjs";
import { share } from "rxjs/operators";
import { SnotifyService } from "ng-snotify";
import { CommonService } from "./common.service";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { MemberShop } from "../models/member-shop.model";

@Injectable({
    providedIn: 'root'
})
export class MemberService {
    _currentMember: Member;
    public memberChanged: EventEmitter<Member> = new EventEmitter();
    hasSellCake = true;
    hasBarcodeInput = true;
    hasShowcase = true;
    hasCustomer = false;
    hasFinancial = false;
    roleAsync: Observable<{}>;

    constructor(private router: Router, private apiService: ApiService, private commonService: CommonService,
        private snotifyService: SnotifyService, private http: Http
    ) {
        this._currentMember = JSON.parse(localStorage.getItem("currentMember"));

    }

    public get currentMember() {
        return this._currentMember;
    }

    public set currentMember(value) {
    }

    public async getMember() {
        this._currentMember = await this.apiService.getCurrentMember().toPromise();
        if (this._currentMember && this._currentMember.id) {
            this.hasSellCake = this.hasPermission('shop.sellcake');
            this.hasBarcodeInput = this.hasPermission('shop.barcodeinput');
            this.hasShowcase = this.hasPermission('shop.showcase');
            this.hasCustomer = this.hasPermission('shop.customer');
            this.hasFinancial = this.hasPermission('shop.financial');
            localStorage.setItem('currentMember', JSON.stringify(this._currentMember));
            this.snotifyService.success("Welcome " + this._currentMember.name + " !")
        } else {
            this.router.navigateByUrl('/login');
        }
    }

    public hasPermissionByMember(member, permission, shopId = null) {
        if (!shopId) {
            return _.find(member.memberClaims, { claimValue: permission }) != null;
        } else {
            return _.find(member.memberClaims, { claimValue: permission, 'shopId': shopId }) != null;
        }
    }

    public hasPermission(permission, shopId = null) {
        if (!shopId) {
            return _.find(this.currentMember.memberClaims, { claimValue: permission }) != null;
        }

        else {
            return _.find(this.currentMember.memberClaims, { claimValue: permission, 'shopId': shopId }) != null;
        }
    }

    createMemberShop(memberShop: MemberShop): Observable<MemberShop> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/memberShop/", memberShop, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateMemberShop(memberShop: MemberShop): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/memberShop/", memberShop, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deleteMemberShop(memberId: number, shopId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/memberShop/" + memberId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateMember(shopId, member: Member): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/member/" + member.id + "/" + shopId, member, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createMember(shopId, member: Member): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/member/" + shopId, member, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }
}


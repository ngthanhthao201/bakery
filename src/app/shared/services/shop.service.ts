import { EventEmitter, Injectable } from "@angular/core";
import { Shop } from "../models/shop.model";
import { ApiService } from "./api.service";
import * as _ from "lodash";
import { MbSignalRService } from "./mbSignalR.service";
import { JwtHelper } from "./jwt-helper";
import { Router } from "@angular/router";
import { ShopConfig } from "../models/shop-config.model";
import { Member } from "../models/member.model";
import { NgxSpinnerService } from "ngx-spinner";
import { MemberService } from "./member.service";
import { Driver } from "../models/driver.model";

@Injectable({
    providedIn: 'root'
})
export class ShopService {
    private _currentShop: Shop;
    private _shops: Shop[];
    private _shopConfigs: ShopConfig[];
    private _members: Member[];
    private _drivers: Driver[];
    private _sellMembers: Member[];
    public shopChanged: EventEmitter<Shop> = new EventEmitter();
    public membersChanged: EventEmitter<any> = new EventEmitter();
    private _memberSellShowHideSettings: any;

    constructor(
        private memberService: MemberService,
        private spinner: NgxSpinnerService, private apiService: ApiService) {

    }

    public get currentShop() {
        return this._currentShop || JSON.parse(localStorage.getItem('currentShop'));
    }

    public set currentShop(value) {
        if (value && value.id) {
            this._currentShop = value;
            localStorage.setItem('currentShop', JSON.stringify(value));
            this.shopChanged.emit(value);
            this.getShopConfigs();
            this.refreshMembers();
        }

    }

    public refreshShop() {
        this.apiService.getShopById(this._currentShop.id).subscribe(r => {
            this._currentShop = r;
        })
    }

    public refreshMembers() {
        this.apiService.getMembersByShop(this.currentShop.id).subscribe(r => {
            this._members = r.reverse();
            this.membersChanged.emit();
        })

        this.apiService.getSellMembersByShop(this.currentShop.id).subscribe(r => {

            this._sellMembers = r || [];

        })

    }
    
    public showAll(customSwitch, tab, all) {
        if(!customSwitch.checked){
            // alert('on');
            tab.style.display = "block";
        }else{
            // alert('off');
            tab.style.display = "none";
        }
    }

    public set members(value) {
        this._members = value;
    }

    public get members() {
        return this._members;
    }

    public get sellMembers() {
        return this._sellMembers;
    }

    public getNameShort(name){
        return _.last(name.split(" "))
        // let res = name.split(" ");
        // var k = "";

        // for(let i = 0; i <= res.length - 2; i++){
        //     k += res[i].charAt(0) + ".";
        // }
        // let q = res[res.length - 1];
        // let kq = k + q;
        // return kq;
    }

    public getMemberNameById(id) {
        var member = _.find(this._members, { 'id': id }) as any;
        if (member) {
            return member.name;
        }
        return "";
    }

    public getMemberImageById(id) {
        var member = _.find(this._members, { 'id': id }) as any;
        if (member) {
            return member.image;
        }
        return "";
    }

    getShopConfigs() {
        this.apiService.getShopConfigs(this.currentShop.id).subscribe(r => {
            this._shopConfigs = r;
        })
    }

    public getShopConfigByName(name: string) {
        var config = _.find(this._shopConfigs, { "name": name })
        if (!config) return "";
        return config.value;
    }

    public get memberSellShowHideSettings() {
        if (!this._memberSellShowHideSettings || Object.keys(this._memberSellShowHideSettings).length === 0) {
            this._memberSellShowHideSettings = JSON.parse(localStorage.getItem('_memberSellShowHideSettings' + this.currentShop.id));
        }
        if (!this._memberSellShowHideSettings || Object.keys(this._memberSellShowHideSettings).length === 0) {
            if (!this._memberSellShowHideSettings) this._memberSellShowHideSettings = {};
            // _.each(this.hardProductBarcodeLabels, l=>{
            //     this._memberSellShowHideSettings[l] = true;
            // })

        }
        return this._memberSellShowHideSettings;
    }

    public set memberSellShowHideSettings(value) {
        this._memberSellShowHideSettings = value;
        localStorage.setItem('_memberSellShowHideSettings' + this.currentShop.id, JSON.stringify(this._memberSellShowHideSettings));
    }

    public refreshDrivers() {
        this.apiService.getDriversByShop(this._currentShop.id).subscribe(r => {
            this._drivers = r;
        })
    }

    public set drivers(value) {
        this._drivers = value;
    }

    public get drivers() {
        return this._drivers;
    }

}



import { EventEmitter, Injectable } from "@angular/core";
import { Shop } from "../models/shop.model";
import { IncomeTransaction } from "../models/IncomeTransaction";
import * as _ from "lodash";
import { SellMode } from "../models/sell-mode.enum";
import { IncomeHeader } from "../models/income-header.model";
import { ShopService } from "./shop.service";
import { MbSignalRService } from "./mbSignalR.service";
import { ApiService } from "./api.service";
import { SaleType } from "../models/sale-type.enum";

@Injectable({
    providedIn: 'root'
})
export class QuickOrderService {

    public incomeTransactionChanged$: EventEmitter<IncomeTransaction>;
    public sellCakeMapChanged$: EventEmitter<any>;
    public incomeHeader: IncomeHeader = new IncomeHeader();
    public checkoutRequested$: EventEmitter<any>;
    public isOrderRequested$: EventEmitter<any>;
    public sellMode: SellMode = SellMode.Normal;
    private _membersSellCaleSettings = {};

    public sellCakeMap: any;

    constructor(private shopService: ShopService, private mbSignalRService: MbSignalRService) {
        this.incomeTransactionChanged$ = new EventEmitter();
        this.sellCakeMapChanged$ = new EventEmitter();
        this.checkoutRequested$ = new EventEmitter();
        this.isOrderRequested$ = new EventEmitter();
        this.incomeHeader.incomeTransactions = [];

        if (this.shopService.members) {
            this.initMembersSellCake();

        } else {
            this.shopService.membersChanged.subscribe(() => {
                this.initMembersSellCake();
            })
        }
    }

    public get membersSellCaleSettings() {
        if (!this._membersSellCaleSettings || Object.keys(this._membersSellCaleSettings).length === 0) {
            this._membersSellCaleSettings = JSON.parse(localStorage.getItem('membersSellCaleSettings' + this.shopService.currentShop.id));
        }

        if (!this._membersSellCaleSettings || Object.keys(this._membersSellCaleSettings).length === 0 || Object.keys(this._membersSellCaleSettings).length != this.shopService.members.length) {
            this._membersSellCaleSettings = {};
            _.each(this.shopService.members, m => {
                this._membersSellCaleSettings[m.name] = false;
            })

            localStorage.setItem('membersSellCaleSettings' + this.shopService.currentShop.id, JSON.stringify(this._membersSellCaleSettings));
        }
        return this._membersSellCaleSettings;
    }

    public set membersSellCaleSettings(value) {
        this._membersSellCaleSettings = value;
        localStorage.setItem('membersSellCaleSettings' + this.shopService.currentShop.id, JSON.stringify(this._membersSellCaleSettings));
    }


    public initMembersSellCake() {
        this.sellCakeMap = {};
        _.each(this.shopService.members, m => {

            if (this.membersSellCaleSettings[m.name]) {
                var sellCakeGroupName = m.id + "-SellCake-" + this.shopService.currentShop.id;
                this.mbSignalRService.joinRoom(sellCakeGroupName);
                var cloneIncomeHeader = new IncomeHeader();
                cloneIncomeHeader.incomeTransactions = [];
                cloneIncomeHeader.dateCreated = new Date();
                cloneIncomeHeader.idNumber = "Sell" + cloneIncomeHeader.dateCreated.getDate() + (parseInt(cloneIncomeHeader.dateCreated.getMonth().toString()) + 1) + cloneIncomeHeader.dateCreated.getFullYear();
                cloneIncomeHeader.description = "Bán trong ngày " + cloneIncomeHeader.dateCreated.getDate() + "-" + (parseInt(cloneIncomeHeader.dateCreated.getMonth().toString()) + 1);
                this.sellCakeMap[sellCakeGroupName] = cloneIncomeHeader;
            } else {
                this._membersSellCaleSettings[m.name] = false;
            }



        })
    }

    public list(): IncomeTransaction[] {
        return this.incomeHeader.incomeTransactions;
    }

    public get hasItemsFromMobile(): boolean {
        if (!this.sellCakeMap) return false;
        var result = false;
        _.forOwn(this.sellCakeMap, function (value) {
            if (value.incomeTransactions.length > 0) {
                result = true;
                return false;
            }
        });
        return result;
    }

    public empty() {
        this.incomeHeader.incomeTransactions = [];
        this.incomeTransactionChanged$.emit();
    }

    public checkBarcodeExisted(barcode) {
        return _.find(this.incomeHeader.incomeTransactions, { 'barcode': barcode }) != null;
    }

    public increaseQuantityBarcodeExisted(barcode, quantity = 1) {
        var t = _.find(this.incomeHeader.incomeTransactions, { 'barcode': barcode }) as any;
        if (t) {
            t.quantity += quantity;
            t.amount = t.quantity * t.unitPrice;
        }
    }

    public checkDiscountExisted() {
            return (_.find(this.incomeHeader.incomeTransactions, { 'discountType': SaleType.DiscountMoney}) != null || _.find(this.incomeHeader.incomeTransactions, { 'discountType': SaleType.DiscountPercent}) != null); 
    }

    public getQuantityByBarcode(barcode) {
        var t = _.find(this.incomeHeader.incomeTransactions, { 'barcode': barcode }) as any;
        if (t) {
            return t.quantity;
        }
        return 0;
    }

    public add(item: IncomeTransaction, emit: boolean = true): void {
        this.incomeHeader.incomeTransactions.push(item);
        this.incomeHeader.incomeTransactions = _.orderBy(this.incomeHeader.incomeTransactions, 'discountType') ;
        
        if (emit) {
            this.incomeTransactionChanged$.emit(item);
        }

    }

    public addTransactionFromMobile(groupName, transaction: IncomeTransaction) {
        this.sellCakeMap[groupName].incomeTransactions.push(transaction);
        this.sellCakeMapChanged$.emit();
    }

    public updateTransactionFromMobile(groupName, transaction: IncomeTransaction) {
        var existing = _.find(this.sellCakeMap[groupName].incomeTransactions, { barcode: transaction.barcode }) as IncomeTransaction;
        existing.quantity = transaction.quantity;
        existing.unitPrice = transaction.unitPrice;
        existing.amount = transaction.amount;
        if (existing.quantity == 0) {
            var index = this.sellCakeMap[groupName].incomeTransactions.indexOf(existing);
            this.sellCakeMap[groupName].incomeTransactions.splice(index, 1);
        }
        this.sellCakeMapChanged$.emit();
    }

    public clearTransactionFromMobile(groupName) {
        this.sellCakeMap[groupName].incomeTransactions = [];
        this.sellCakeMapChanged$.emit();
    }


    public remove(transaction: IncomeTransaction, emit: boolean = true): void {

        var index = this.incomeHeader.incomeTransactions.indexOf(transaction);
        this.incomeHeader.incomeTransactions.splice(index, 1);
        if (emit) {
            this.incomeTransactionChanged$.emit();
        }

        if (this.incomeHeader.incomeTransactions.length == 0) {
            //
        }

    }

    getTotal() { 
        var total = 0;
        if (!this.incomeHeader || !this.incomeHeader.incomeTransactions) return total;
        this.incomeHeader.incomeTransactions.forEach(element => {
                total += element.amount;
        });
        return total;
    }

    reCaclPercent(){
        var existingList = this.list();
        var total = _.sumBy(existingList, i=>{
            if(i.amount > 0){
                return i.amount;
            }
        });
        for(var i = 0; i< existingList.length; i++){
            if (existingList[i].discountType == SaleType.DiscountPercent) {
                var newPrice = (existingList[i].discountPercent * total)/100 ;
                existingList[i].unitPrice =  newPrice  ;
                existingList[i].amount = existingList[i].unitPrice *  existingList[i].quantity;
             }
        }
    }

    getDiscountPriceByDiscountpercent() {
        var discountPrice = 0;
        var discount = 0;
        var total = 0;
        if (!this.incomeHeader || !this.incomeHeader.incomeTransactions) return discountPrice;
        this.incomeHeader.incomeTransactions.forEach(element => {
            if (element.discountType != 4) {
                total += element.amount;
            }
            if (element.discountType == 4) {
                discount += element.amount/100;
            }
            discountPrice = total*discount;
        });
        return  discountPrice;
    }

    public checkout() {
        this.checkoutRequested$.emit();
    }

    requestIsOrder(arg0: any): any {
        this.isOrderRequested$.emit(arg0);
    }

    createIncomeHeaderFromSCM(groupName) {
        var incomeHeader = new IncomeHeader();
        incomeHeader.shopId = this.shopService.currentShop.id;
        incomeHeader.memberId = parseInt(_.first(groupName.split('-')));
        incomeHeader.incomeTransactions = this.sellCakeMap[groupName].incomeTransactions;
        incomeHeader.dateCreated = new Date();
        incomeHeader.idNumber = "Sell" + incomeHeader.dateCreated.getDate() + (parseInt(incomeHeader.dateCreated.getMonth().toString()) + 1) + incomeHeader.dateCreated.getFullYear();
        incomeHeader.description = "Bán trong ngày " + incomeHeader.dateCreated.getDate() + "-" + (parseInt(incomeHeader.dateCreated.getMonth().toString()) + 1);
        return incomeHeader;
    }
}

import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/catch';
import { unescape } from "querystring";
import { Router } from '@angular/router';
import { Order } from "../models/order.model";
import { ProductCategory } from "../models/product-category.model";
import { Product } from "../models/product.model";
import { ExpenseHeader } from "../models/expense-header.model";
import { IncomeHeader } from "../models/income-header.model";
import { MaterialProvider } from "../models/material-provider.model";
import { Material } from "../models/material.model";
import * as _moment from 'moment';
import { ChatMessage } from "../models/chat-message.model";
import { Member } from "../models/member.model";
import { MemberShop } from "../models/member-shop.model";
import { MemberClaim } from "../models/member-claim.model";
import { ShopRole } from "../models/shop-role.model";
import { ProductSample } from "../models/product-sample.model";
import { CakeSizeType } from "../models/cake-size-type.model";
import { Shop } from "../models/shop.model";
import { OrderDetail } from "../models/order-detail.model";
import { DeliveryOption } from "../models/delivery-option.model";
import { WebsiteConfig } from "../models/website-config.model";
import * as _ from "lodash";
import { Review } from "../models/review.model";
import { Customer } from "../models/customer.model";
import { ProductBarcode } from "../models/product-barcode.model";
import { environment } from "../../../environments/environment";
import { HardProductBarcode } from "../models/hard-product-barcode.model";
import { HardBlockProductBarcode } from "../models/hard-block-product-barcode.model";
import { FacebookPost } from "../models/facebook-post.model";
import { ZaloPost } from "../models/zalo-post.model";

import { OrderCakeStatus } from "../models/order-cake-status.model";
import { HardSetProductBarcode } from "../models/hard-set-product-barcode.model";
import { ZaloOAPost } from "../models/zalo-oa-post.model";
import { MemberShift } from "../models/member-shift.model";
import { CommonService } from "./common.service";
import { OnlineOfflineService } from "./offline.service";
import { SnotifyService } from "ng-snotify";
import { MyBakeryDb } from "../models/my-bakery-db.model";
import { Utilities } from "./utilities";
import { CustomerSearchResult } from "../models/customer-search-result.model";
import { CustomerCampaign } from "../models/customer-campaign.model";
import { IncomeTotalDate } from "../models/income-total-date.model";
import { CustomerShop } from "../models/customer-shop.model";
import { Driver } from "../models/driver.model";
import { DriverRun } from "../models/driver-run.model";
import { NganLuongTransaction } from "../models/nganLuong-transaction.model";


const moment = _moment;
//import { ReplaySubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private cache = {
        productCategories: []
    }
    private db: any;
    constructor(private http: Http, private router: Router,
        private snotifyService: SnotifyService,
        private onlineOfflineService: OnlineOfflineService,
        private commonService: CommonService) {
        this.registerToEvents(onlineOfflineService);
        this.createDatabase();
    }

    private registerToEvents(onlineOfflineService: OnlineOfflineService) {
        console.log('registerToEvents');
        onlineOfflineService.connectionChanged.subscribe(online => {
            if (online) {
                console.log('went online');
                console.log('sending all stored items');
                this.sendItemsFromIndexedDb();
            } else {
                console.log('went offline, storing in indexdb');
            }
        });
    }

    private createDatabase() {
        this.db = new MyBakeryDb();
    }

    public addToIndexedDb(incomeCustomer: any) {
        this.db.incomeCustomers
            .add({ id: Utilities.uniqueId(), incomeCustomerJson: JSON.stringify(incomeCustomer) })
            .then(async () => {
                const allItems: any[] = await this.db.incomeCustomers.toArray();
                console.log('saved in DB, DB is now', allItems);
            })
            .catch(e => {
                console.log('Error: ' + (e.stack || e));
            });
    }

    private async sendItemsFromIndexedDb() {
        const allItems: any[] = await this.db.incomeCustomers.toArray();

        allItems.forEach((item: any) => {
            // send items to backend...

            this.createIncomeCustomer(JSON.parse(item.incomeCustomerJson)).subscribe();

            this.db.incomeCustomers.delete(item.id).then(() => {
                console.log(`item ${item.id} sent and deleted locally`);
            });
        });
    }

    loginLocal(localVM) {
        var headers = new Headers();
        headers.set('Content-Type', "application/x-www-form-urlencoded");
        let searchParams = new URLSearchParams();
        searchParams.append('username', localVM.username);
        searchParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:username_password');
        searchParams.append('scope', 'openid email phone profile offline_access roles');
        searchParams.append('resource', window.location.origin);
        searchParams.append('password', localVM.password);

        let requestBody = searchParams.toString();
        return this.http.post(this.commonService.baseUrl + "connect/token", requestBody, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);

    }

    getToken(socialToken: string, accessCode: string, provider: string): Observable<any> {
        var headers = new Headers();
        headers.set('Content-Type', "application/x-www-form-urlencoded");
        let searchParams = new URLSearchParams();
        searchParams.append('assertion', socialToken);
        searchParams.append('grant_type', 'urn:ietf:params:oauth:grant-type:' + provider + '_access_token');
        searchParams.append('scope', 'openid email phone profile offline_access roles');
        searchParams.append('resource', window.location.origin);
        searchParams.append('user_type', "member");
        searchParams.append('access_code', accessCode);

        let requestBody = searchParams.toString();
        return this
            .http
            .post(this.commonService.baseUrl + "connect/token", requestBody, { headers: headers })
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Shops

    getShopById(shopId): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getShopsByMemberId(memberId: any): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shop/by-member/" + memberId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateShopImage(shop: Shop): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/shop/admin-image/", shop, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                localStorage.setItem('currentShop', JSON.stringify(response.json()));
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getShopsByMember(memberId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shop/by-member/" + memberId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    saveShop(shop: Shop): Observable<any> {
        delete shop.productCategories;
        delete shop.websiteConfigs;
        return this
            .http
            .put(this.commonService.baseUrl + "api/shop/admin", shop, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                localStorage.setItem('currentShop', JSON.stringify(response.json()));
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //ProductCategory

    createProductCategory(productcategory: ProductCategory): Observable<any> {

        return this
            .http
            .post(this.commonService.baseUrl + "api/productcategory/", productcategory, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);

    }

    updateProductCategory(productCategory: ProductCategory) {
        return this.http.put(this.commonService.baseUrl + "api/productCategory/", productCategory, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    deleteProductCategory(productCategoryId: number) {
        return this.http.delete(this.commonService.baseUrl + "api/productCategory/" + productCategoryId, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    getProductCategoriesByShop(shopId: number, forceRefresh?: boolean): Observable<any> {
        if (this.cache.productCategories.length > 0) {
            return Observable.of(this.cache.productCategories);
        }

        return this
            .http
            .get(this.commonService.baseUrl + "api/productcategory/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                var result = response.json()
                _.each(result, i => {
                    if (i.image && i.image.indexOf('mybakerystorage') > -1) {
                        i.image = i.image.replace('https://mybakerystorage.blob.core.windows.net/', 'https://mybakeryadmin.azurewebsites.net/') + '?w=255&h=237&autorotate=true';
                    }
                })
                return result;
            })
            .catch(this.commonService.handleError);

    }

    getProductCategoriesByShopWithBarcode(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/productcategory/by-shop-with-barcode/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                var result = response.json()
                return result;
            })
            .catch(this.commonService.handleError);

    }

    private dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    }

    uploadCategoryImage(dataURL: any, shopCode: string, productCategoryId): Observable<any> {

        var options = this.commonService.getAuthHeader(false);
        //options.headers.append('Content-Type', "multipart/form-data");

        var blob = this.dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("canvasImage.jpg", blob, "canvasImage.jpg");
        return this
            .http
            .post(this.commonService.baseUrl + "api/productcategory/image/" + shopCode + "/" + productCategoryId, fd, options)
            .map((response: Response) => {
                return response;
            })
            .catch(this.commonService.handleError);
    }


    getProductCategoryById(productCategoryId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/productCategory/" + productCategoryId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    sortCategories(indexList): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/productCategory/sort-categories", indexList, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }



    //Products

    createProduct(product: Product) {
        product.isActive = true;
        return this.http.post(this.commonService.baseUrl + "api/product/", product, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    getProductsByCategoryId(productCategoryId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/product/" + productCategoryId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                var result = response.json()
                _.each(result, i => {
                    if (i.image && i.image.indexOf('mybakerystorage') > -1) {
                        i.image = i.image.replace('https://mybakerystorage.blob.core.windows.net/', 'https://mybakeryadmin.azurewebsites.net/') + '?w=255&h=255&autorotate=true';
                    }
                })
                return result;
            })
            .catch(this.commonService.handleError);
    }

    createProductSample(productSample: ProductSample): Observable<ProductSample> {

        return this.http.post(this.commonService.baseUrl + "api/productSample/", productSample, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    updateProductSample(productSample: ProductSample) {
        return this.http.put(this.commonService.baseUrl + "api/productSample/", productSample, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    updateProduct(product: Product) {
        return this.http.put(this.commonService.baseUrl + "api/product/" + product.id, product, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    toggleActiveProduct(productId: number) {
        return this.http.put(this.commonService.baseUrl + "api/product/toggle-active/" + productId, null, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }



    deleteProduct(productId: number) {
        return this.http.delete(this.commonService.baseUrl + "api/product/" + productId, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    deleteProductSample(productSampleId: number) {
        return this.http.delete(this.commonService.baseUrl + "api/productSample/" + productSampleId, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    uploadProductImage(dataURL: any, shopCode: string, productId): Observable<any> {

        var options = this.commonService.getAuthHeader(false);
        //options.headers.append('Content-Type', "multipart/form-data");

        var blob = this.dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("canvasImage.jpg", blob, "canvasImage.jpg");
        return this
            .http
            .post(this.commonService.baseUrl + "api/product/image/" + shopCode + "/" + productId, fd, options)
            .map((response: Response) => {
                return response;
            })
            .catch(this.commonService.handleError);
    }

    //ProductLabels

    getProductLabels(): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/productLabel/", this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //OpenCloseTime

    saveOpenCloseTime(shop: Shop): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/shopSetting/open-close-time/" + shop.id, [shop.openTime, shop.closeTime], this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    // CakeSizeType

    getCakeSizeTypes(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/cakeSizeType/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    saveCakeSizeTypes(cakeSizeTypes: CakeSizeType[]): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/cakeSizeType/", cakeSizeTypes, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    // DeliveryOptions

    getDeliveryOptions(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shopSetting/delivery-options/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    saveDeliveryOptions(deliveryOptions: DeliveryOption[]): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/shopSetting/delivery-options/", deliveryOptions, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Shop configs

    getShopConfigs(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shopConfig/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //website configs

    getWebsiteConfigs(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/websiteConfig/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createWebsiteConfig(colorConfig: WebsiteConfig): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/websiteConfig/", colorConfig, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    saveWebsiteConfig(colorConfig: WebsiteConfig): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/websiteConfig/", colorConfig, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deleteWebsiteConfig(websiteConfigId: number) {
        return this.http.delete(this.commonService.baseUrl + "api/websiteConfig/" + websiteConfigId, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    //Customer
    getCustomersByShop(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getCustomerByCustomerId(customerId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/" + customerId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateCustomer(customer: Customer) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/customer/", customer, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createCustomer(customer: Customer) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/customer/", customer, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    searchCustomer(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    searchCustomerByPhone(shopId: number, limit = 10, query): Observable<CustomerSearchResult[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/search-limit-by-phone-new/" + shopId + "/" + limit + "?q=" + query, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrderCount(customerId: number, shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/order-count/" + customerId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getCustomerShop(customerId: number, shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/customer-shop/" + customerId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    linkCustomerShop(customerTypeId, customerId: number, shopId: number, externalId: string) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/customer/link-customer-shop/", { 'customerTypeId': customerTypeId, 'customerId': customerId, 'shopId': shopId, 'externalId': externalId }, this.commonService.getAuthHeader(true))
            // .put(this.commonService.baseUrl + "api/customer/link-customer-shop/" + '/' + customerId + '/' + shopId + '/' +  externalId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createAndLinkCustomerShop(customer: Customer) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/customer/create-and-link-customer-shop/", { 'customer': customer }, this.commonService.getAuthHeader(true))
            // .put(this.commonService.baseUrl + "api/customer/link-customer-shop/" + '/' + customerId + '/' + shopId + '/' +  externalId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getCustomerShopByExternalId(externalId: string, shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/customer-shop-by-externalId/" + externalId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getCustomerTypes(shopId) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/customer-type/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getCustomerStats(shopId) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customer/stats/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    filterCustomerShops(shopId, filter): Observable<CustomerShop[]> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/customer/customer-shops-by-shop/" + shopId, filter, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    ///
    // Customer Campaigns
    ///

    getCustomerCampaign(nameId: string, shopId: number): Observable<CustomerCampaign> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/customerCampaign/" + nameId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateCustomerCampaign(customerCampaign: CustomerCampaign): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/customerCampaign/", customerCampaign, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Income Transactions

    getIncomeHeader(headerId){
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/by-id/"+ headerId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getIncomeHeaderFirst100(shopId, date) {
        var idNumber = "Sell" + date.getDate() + (parseInt(date.getMonth().toString()) + 1) + date.getFullYear();
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/get-first-100/" + shopId + "/" + idNumber, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getIncomeHeadersByShop(shopId: number, start: Date, end: Date, startWith = ''): Observable<IncomeHeader[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()) + "&startWith=" + startWith, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getIncomeHeadersLiteByShop(shopId: number, start: Date, end: Date): Observable<IncomeHeader[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/lite/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getIncomeHeadersLiteDaysByShop(shopId: number, start: Date, end: Date): Observable<IncomeTotalDate[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/lite/days/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getIncomeHeadersByCustomerId(customerId: string, start: Date, end: Date) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/customer/" + customerId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getIncomeHeadersByShopCustomer(shopId: number, customerId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeHeader/shop-customer/" + shopId + "/" + customerId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getIncomeTransactionsByShop(shopId: number, start: Date, end: Date): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeTransaction/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deactiveTransactions(ids: Array<number>, destroyedReason, shopId) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/incomeTransaction/deactive-transactions", { 'ids': ids, 'destroyedReason': destroyedReason, 'shopId': shopId }, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDescriptionsOfIncomeTransactionsByShop(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/incomeTransaction/descriptions/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createIncomeTransaction(incomeTransaction: any): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/incomeTransaction/", incomeTransaction, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createIncomeHeader(incomeHeader: IncomeHeader): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/incomeHeader/", incomeHeader, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createIncomeCustomer(incomeCustomer: any): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/incomeHeader/create-income-customer", incomeCustomer, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateIncomeHeader(incomeHeader: IncomeHeader): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/incomeHeader/", incomeHeader, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Shift

    getListShift(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/list/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getShiftsByShopId(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }
    getShiftsByShopId4Small(shopId: number, date): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/small/" + shopId + "/" + date, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getNextShift(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/next/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getShiftsByShopId4Big(shopId: number, date): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/big/" + shopId + "/" + date, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getActiveShift(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/active/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    setActiveShift(shopId: number, orderIndex) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shift/set-active/" + shopId + "/" + orderIndex, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //memberShift

    createMemberShift(memberShift: MemberShift): Observable<number> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/memberShift/", memberShift, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deleteMemberShift(memberId: number, shiftId: number): Observable<number> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/memberShift/" + memberId + "/" + shiftId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Expense Transactions

    getExpenseHeaderById(id: number): Observable<ExpenseHeader> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/expenseHeader/detail/" + id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getExpenseHeadersByShop(shopId: number, start: Date, end: Date): Observable<ExpenseHeader[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/expenseHeader/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getExpenseTransactionsByShop(shopId: number, start: Date, end: Date): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/expenseTransaction/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    createExpenseHeader(expenseHeader: ExpenseHeader): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/expenseHeader/", expenseHeader, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateExpenseHeader(expenseHeader: ExpenseHeader): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/expenseHeader/", expenseHeader, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeExpenseHeader(expenseHeaderId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/expenseHeader/" + expenseHeaderId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeExpenseTransaction(expenseTransactionId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/expenseTransaction/" + expenseTransactionId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeIncomeHeader(incomeHeaderId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/incomeHeader/" + incomeHeaderId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeIncomeTransaction(incomeTransactionId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/incomeTransaction/" + incomeTransactionId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    createExpenseTransaction(expenseTransaction: any): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/expenseTransaction/", expenseTransaction, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //Orders

    getOrder(id: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/by-id/" + id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrderByIdNumber(idNumber: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/by-id-number/" + idNumber, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrdersByCustomerId(id: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/customer/" + id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrdersHistoryByCustomerId(id: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/customer-history/" + id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrdersHistoryByShopIdustomerId(shopId: number, customerId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/customer-history/" + shopId + "/" + customerId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getActiveOrders(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/by-id/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getNotDoneOrdersInShift(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/get-not-done-in-shift/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getOrdersByWeek(shopId: number, start: Date, end: Date): Observable<any> {


        start =  Utilities.toLocaleDate(start)
        end = Utilities.toLocaleDate(end)
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/by-week/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getActiveOrdersToday(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/today/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDoneOrders(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/done/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getSkipOrders(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/skip/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    makeOrder(order: Order): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/order", order, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateOrder(order: Order): Observable<any> {
        var updatingOrder = _.cloneDeep(order);
        delete updatingOrder.orderCakeStatus;
        delete updatingOrder.address;
        delete updatingOrder.customer;
        return this
            .http
            .put(this.commonService.baseUrl + "api/order", updatingOrder, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    putOrder(order: Order): Observable<any> {
        var updatingOrder = _.cloneDeep(order);
        delete updatingOrder.orderCakeStatus;
        //delete updatingOrder.address;
        //delete updatingOrder.customer;
        return this
            .http
            .put(this.commonService.baseUrl + "api/order/put-order", updatingOrder, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateOrderAddress(orderId: number): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/order/update-address/" + orderId, {}, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrdersStatusNew(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/order/all-new/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //OrderCakeStatus

    //Reviews

    createReview(review: Review): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/review", review, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }
    //OrderDetails

    getOrderDetailsByDate4Small(shopId: number, date: string): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/orderDetail/small/" + shopId + "/" + date, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getOrderDetailsByDate4Big(shopId: number, date: string): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/orderDetail/big/" + shopId + "/" + date, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createOrderDetail(orderDetail: OrderDetail): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/order/add-order-detail", orderDetail, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeOrderDetail(orderDetailId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/order/delete-order-detail/" + orderDetailId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //MaterialProviders

    getMaterialProviders(shopId: number): Observable<MaterialProvider[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/materialProvider/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateMaterialProvider(materialProvider: MaterialProvider): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/materialProvider/", materialProvider, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createMaterialProvider(materialProvider: MaterialProvider): Observable<any> {

        return this
            .http
            .post(this.commonService.baseUrl + "api/materialProvider/", materialProvider, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);

    }

    //Materials


    getMaterials(shopId: number): Observable<Material[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/material/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateMaterial(material: Material): Observable<any> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/material/", material, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeMaterial(materialId: number): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/material/" + materialId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //search

    shopSearch(shopId: number, query: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shop/shop-search/" + shopId + "?q=" + query, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //stats

    getMembersSales(shopId: number, start: Date, end: Date): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/stats/members-sales/" + shopId + "?start=" + Date.parse(start.toString()) + "&end=" + Date.parse(end.toString()), this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDashboardProduct(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/stats/dashboard-product/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDashboardHardProduct(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/stats/dashboard-hard-product/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getDashboardOrder(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/stats/dashboard-order/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getFinancialMonthsStats(shopId: number, monthsParamsArray: any) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/stats/financial-months/" + shopId, monthsParamsArray, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getCustomerMonthsStats(shopId: number, monthsParamsArray: any) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/stats/customer-months/" + shopId, monthsParamsArray, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    getOrderWeeksStats(shopId: number, weeksParamsArray: any) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/stats/order-weeks/" + shopId, weeksParamsArray, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //chat

    loadMessages(roomName: string): Observable<ChatMessage[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/chatMessage/" + roomName, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getChatPreOdersRooms(shopId: number): Observable<ChatMessage[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/chatroom/pre-orders/" + shopId)
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getAllActiveOrderRooms(shopId: number): Observable<ChatMessage[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/chatroom/all-active-orders/" + shopId)
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    // members

    changePassword(memberId, vm): Observable<MemberShop> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/member/change-password/" + memberId, vm, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            });
    }


    changePasswordByMemberId(memberId: number, newPassword: string, confirmPassword: string): Observable<MemberShop[]> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/member/admin-change-password/" + memberId, { 'newPassword': newPassword, 'confirmPassword': confirmPassword }, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    updateAvatar(memberId: number, image): Observable<MemberShop> {
        return this
            .http
            .put(this.commonService.baseUrl + "api/member/update-avatar/" + memberId, { image: image }, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            });
    }


    getCurrentMember(): Observable<Member> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/member/me", this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getMembersByShop(shopId: number): Observable<Member[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/member/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getSellMembersByShop(shopId: number): Observable<Member[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/member/sell-members-by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getMemberShopsByShop(shopId: number): Observable<MemberShop[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/memberShop/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    deleteMemberByMemberId(memberId: number, shopId: number): Observable<MemberShop[]> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/member/" + memberId + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //memberClaim
    createMemberClaim(memberClaim: MemberClaim): Observable<number> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/memberClaim/", memberClaim, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deleteMemberClaim(memberId: number, claimValue: string, shopId): Observable<number> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/memberClaim/" + memberId + "/" + claimValue + "/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //img
    public uploadImageImg(dataURL: any): Observable<any> {
        let headers = new Headers({ 'Authorization': "Client-ID 30dbd870b94407a" });

        var blob = this.dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append("image", blob);


        //headers.append('Content-Type', 'multipart/form-data');
        var requestOptions = new RequestOptions({ headers: headers });

        return this
            .http
            .post("https://api.imgur.com/3/image", fd, requestOptions)
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    uploadImageAzure(currentFile: any, dataURL: any, shopCode: string): Observable<any> {

        var options = this.commonService.getAuthHeader(false);
        var blob = this.dataURItoBlob(dataURL);
        var fd = new FormData(document.forms[0]);
        fd.append(currentFile.name, blob, currentFile.name);
        return this
            .http
            .post(this.commonService.baseUrl + "api/image/" + shopCode, fd, options)
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    deleteImageAzure(imageLink: string): Observable<any> {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/image/?link=" + encodeURI(imageLink), this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    //video
    uploadVideo(currentFile: any, dataURL: any, shopCode: string): Observable<any> {

        var blob = this.dataURItoBlob(dataURL);
        var options = this.commonService.getAuthHeader(false);

        var fd = new FormData(document.forms[0]);
        fd.append(currentFile.name, blob, currentFile.name);
        return this
            .http
            .post(this.commonService.baseUrl + "api/video/" + shopCode, fd, options)
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    //shopRoles

    getRole(shopId, memberId): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shopRole/" + shopId + "/" + memberId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getShopRoles(): Observable<ShopRole[]> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/shopRole/admin/", this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //camera
    getCameras(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/camera/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //vouchers

    getVouchers(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/voucher/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createVouchers(voucherRequests) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/voucher/", voucherRequests, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    deleteVoucher(shopId: number, voucherGroup: string) {
        return this.http.delete(this.commonService.baseUrl + "api/voucher/" + shopId + "/" + voucherGroup, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    //facebook

    createFacebookPageShop(facebookPageShop) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/facebook/", facebookPageShop, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    updateFacebookPageShop(facebookPageShop) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/facebook/", facebookPageShop, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    removeFacebookPageShop(facebookPageShop) {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/facebook/" + facebookPageShop.id, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    testPostFacebook(pageToken) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/facebook/", { accessToken: pageToken }, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    getFacebookPageShops(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/facebook/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getFacebookPageShopsByUniqueId(uniqueId: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/facebook/by-uniqueId/" + uniqueId)
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    creatFacebookPost(fbPost: FacebookPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/facebookPost/", fbPost, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }
    editFacebookPost(fbPost: FacebookPost) {
        if (!fbPost.id) {
            return;
        }
        return this
            .http
            .put(this.commonService.baseUrl + "api/facebookPost/", fbPost, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    deleteFacebookPost(fbPost: FacebookPost) {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/facebookPost/" + fbPost.id, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    postFacebookNow(post: FacebookPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/facebookPost/post", post, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    //zalos
    getZaloPageShops(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/zalo/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getZaloOAPagesIncludePosts(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/zaloOA/include-posts/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getZaloOAPages(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/zaloOA/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


    createZaloPageShop(zaloPageShop) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zalo/", zaloPageShop, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }
    updateZaloPageShop(zaloPageShop) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/zalo/", zaloPageShop, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }
    removeZaloPageShop(zaloPageShop) {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/zalo/" + zaloPageShop.id, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    getZaloAccessToken(code: string) {
        return this
            .http
            .post("https://oauth.zaloapp.com/v3/access_token?app_id=43860413461215279&app_secret=IvCLmGMOKX2R5JPw47cV" + "&code=" + code, {}, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    creatZaloPost(zlPost: ZaloPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zaloPost/", zlPost, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }
    editZaloPost(zlPost: ZaloPost) {
        return this
            .http
            .put(this.commonService.baseUrl + "api/zaloPost/", zlPost, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    deleteZaloPost(zlPost: ZaloPost) {
        return this
            .http
            .delete(this.commonService.baseUrl + "api/zaloPost/" + zlPost.id, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    postZaloNow(post: ZaloPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zaloPost/post", post, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }


    //Zalo OA api endpoints
    getZaloOA(access_token) {
        return this
            .http
            .get("https://openapi.zalo.me/v2.0/oa/getoa?access_token=" + access_token)
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createZaloOAPage(zaloOAPage) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zaloOA/", zaloOAPage, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    creatZaloOAPost(zlPost: ZaloOAPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zaloOAPost/", zlPost, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    postZaloOANow(post: ZaloOAPost) {
        return this
            .http
            .post(this.commonService.baseUrl + "api/zaloOAPost/post", post, this.commonService.getAuthHeader(true))
            .map((response: any) => {
                return response._body;
            })
            .catch(this.commonService.handleError);
    }

    //hard produc barcode

    getHardProductByShop(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/hardProductBarcode/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    getHardProductByShopNotBlocks(shopId: number) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/hardProductBarcode/by-shop-not-blocks/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createHardProduct(hardProduct: HardProductBarcode) {
        return this.http.post(this.commonService.baseUrl + "api/hardProductBarcode", hardProduct, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }
    updateHardProduct(hardProduct: HardProductBarcode) {
        return this.http.put(this.commonService.baseUrl + "api/hardProductBarcode", hardProduct, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    resetHardProductBarcode(id) {
        return this.http.put(this.commonService.baseUrl + "api/hardProductBarcode/reset", id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    removeHardProductBarcode(id) {
        return this.http.delete(this.commonService.baseUrl + "api/hardProductBarcode/" + id, this.commonService.getAuthHeader(true)).map((response: Response) => {
            return response.json();
        })
            .catch(this.commonService.handleError);
    }

    resetAllStuffs(shopId) {
        return this.http.put(this.commonService.baseUrl + "api/hardProductBarcode/reset-all/" + shopId, {}, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createHardBlockProduct(hardBlockProduct: HardBlockProductBarcode) {
        return this.http.post(this.commonService.baseUrl + "api/hardBlockProductBarcode", hardBlockProduct, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createHardSetProduct(hardSetProduct: HardSetProductBarcode) {
        return this.http.post(this.commonService.baseUrl + "api/hardSetProductBarcode", hardSetProduct, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    updateHardSetProduct( hardSetProduct: HardSetProductBarcode) {
        return this.http.put(this.commonService.baseUrl + "api/hardSetProductBarcode/" , hardSetProduct, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    deleteHardSetProduct(hardSetProduct: HardSetProductBarcode) {
        return this.http.delete(this.commonService.baseUrl + "api/hardSetProductBarcode/" + hardSetProduct.id, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //reports

    reportShift(link): Observable<any> {

        var option = this.commonService.getAuthHeader(false);
        option.responseType = ResponseContentType.ArrayBuffer;

        return this
            .http
            .get(this.commonService.baseUrl + link, option)
            //     {
            //     let b:any = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
            //     var url= window.URL.createObjectURL(b);
            //       window.open(url);
            //     }
            //   );
            .map((response: Response) => response);
    }

    sendEmail(email) {
        return this.http.post(this.commonService.baseUrl + "api/email", email, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //barcode

    getBarcodeTypeByBarcode(shopId: number, barcode: string) {
        return this
            .http
            .get(this.commonService.baseUrl + "api/barcode/" + shopId + "/" + barcode, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    // diver

    getDriversByShop(shopId: number): Observable<any> {
        return this
            .http
            .get(this.commonService.baseUrl + "api/driver/by-shop/" + shopId, this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createDriver(shopId, driver): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/driver/" + shopId, driver , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    createDriverRun(driverRun: DriverRun): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/driverRun" , driverRun , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }

    //NganLuong

    createNganLuongTransaction(nganLuongTransaction: NganLuongTransaction): Observable<any> {
        return this
            .http
            .post(this.commonService.baseUrl + "api/nganLuong/createTransaction" , nganLuongTransaction , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json();
            })
            .catch(this.commonService.handleError);
    }


}

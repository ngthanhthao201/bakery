import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { CommonService } from "../../../shared/services/common.service";
import { ProductBarcode } from "../../../shared/models/product-barcode.model";


@Injectable({
    providedIn: 'root'
})
export class ProductBarcodeService {
    constructor(private http: Http, private commonService: CommonService) {

    }

        //Product Barcode

        createProductBarcode(productBarcode: ProductBarcode) {
            return this.http.post(this.commonService.baseUrl + "api/productBarcode/", productBarcode, this.commonService.getAuthHeader(true)).map((response: Response) => {
                return response.json();
            })
                .catch(this.commonService.handleError);
        }
    
        updateProductBarcode(productBarcode){
            return this.http.put(this.commonService.baseUrl + "api/productBarcode/", productBarcode, this.commonService.getAuthHeader(true)).map((response: Response) => {
                return response.json();
            })
                .catch(this.commonService.handleError);
        }
    
        removeProductBarcode(id) {
            return this.http.delete(this.commonService.baseUrl + "api/productBarcode/" + id, this.commonService.getAuthHeader(true)).map((response: Response) => {
                return response.json();
            })
                .catch(this.commonService.handleError);
        }
    
        removeProductBarcodeByBarcode(barcode, shopid) {
            return this.http.delete(this.commonService.baseUrl + "api/productBarcode/" + barcode + "/" + shopid, this.commonService.getAuthHeader(true)).map((response: Response) => {
                return response.json();
            })
                .catch(this.commonService.handleError);
        }
    
        getProductBarcodes(shopId: number) {
            return this
                .http
                .get(this.commonService.baseUrl + "api/productBarcode/by-shop/" + shopId, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.commonService.handleError);
        }

        getProductBarcodeByBarcode(shopId: number, barcode) {
            return this
                .http
                .get(this.commonService.baseUrl + "api/productBarcode/by-barcode/" + shopId + "/" + barcode, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.commonService.handleError);
        }
    
        getProductBarcodesByDate(shopId: number, date: Date) {
            return this
                .http
                .get(this.commonService.baseUrl + "api/productBarcode/by-shop-by-date/" + shopId + "?date=" + Date.parse(date.toString()), this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.commonService.handleError);
        }
    
        getProductBarcodesForSale(shopId: number) {
            return this
            .http
            .get(this.commonService.baseUrl + "api/productBarcode/by-shop-for-sale/" + shopId , this.commonService.getAuthHeader(true))
            .map((response: Response) => {
                return response.json()
            })
            .catch(this.commonService.handleError);
        }

        getPriceCategories(shopId: number){
            return this
                .http
                .get(this.commonService.baseUrl + "api/productBarcode/price-categories/" + shopId, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.commonService.handleError);
        }

        getProductBarcodesNotSold(shopId: number) {
            return this
                .http
                .get(this.commonService.baseUrl + "api/productBarcode/by-shop-not-sold/" + shopId, this.commonService.getAuthHeader(true))
                .map((response: Response) => {
                    return response.json()
                })
                .catch(this.commonService.handleError);
        }
}
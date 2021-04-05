import { EventEmitter, Injectable } from "@angular/core";
import { Shop } from "../models/shop.model";
import { ApiService } from "./api.service";
import { ProductBarcode } from "../models/product-barcode.model";
import { ProductCategory } from "../models/product-category.model";
import * as _ from "lodash";
import { MbSignalRService } from "./mbSignalR.service";
import { HardProductBarcode } from "../models/hard-product-barcode.model";
import { ShopService } from "./shop.service";
import { SnotifyService } from 'ng-snotify';
import { ProductBarcodeService } from "../../layout/product-barcode/services/product-barcode.service";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class BarcodeService {
    currentShop: Shop;
    _productBarcodes: ProductBarcode[];
    _productBarcodesNotSold : ProductBarcode[];
    _productBarcodesIsSold : ProductBarcode[];
    categories: ProductCategory[];
    _hardProductBarcodes: HardProductBarcode[] =[];
    listChanged: EventEmitter<any>= new EventEmitter();
    hbcListChanged: EventEmitter<any>= new EventEmitter();
    private _labelsShowHideSettings = {};
    _productBarcodeRemove : ProductBarcode[];

    constructor(private shopService: ShopService, private apiService: ApiService, private productBarcodeService: ProductBarcodeService,
        private snotifyService: SnotifyService, private mbSignalRService: MbSignalRService) {
        this.currentShop =  shopService.currentShop;
        if(!this.currentShop) return;
        this.getCategories();
    }

    public get productBarcodes(){
        return this._productBarcodes;
    }



    public get productBarcodesNotSold(){
      this._productBarcodesNotSold = _.filter(this._productBarcodes,{'isSold': false,  'isActive': true}) || [];
       return  _.sortBy(this._productBarcodesNotSold, ['checkinDate']).reverse() ;
    }

    public set productBarcodesNotSold(value){
        this._productBarcodesNotSold = value;
    }


    public get productBarcodesIsSold(){
        if(!this._productBarcodes) return [];
        this._productBarcodesIsSold = _.filter(this._productBarcodes,{'isSold': true,  'isActive': true}) || [];
       return  _.sortBy(this._productBarcodesIsSold, ['checkinDate']).reverse() ;
    }

    public set productBarcodesIsSold(value){
        this._productBarcodesIsSold = value;
    }


    removeProductBarcode(productBarcode: ProductBarcode){

        if(productBarcode.id){
            this.productBarcodeService.removeProductBarcode(productBarcode.id).subscribe(() => {
                var index = this._productBarcodes.indexOf(productBarcode);
                this._productBarcodes.splice(index, 1);
                this.snotifyService.info("Xóa bánh mã vạch thành công!", "");
                this.listChanged.emit();
            })
        }else{
            this.productBarcodeService.removeProductBarcodeByBarcode(productBarcode.barcode, productBarcode.shopId).subscribe(() => {
                var index = this._productBarcodes.indexOf(productBarcode);
                this._productBarcodes.splice(index, 1);
                this.snotifyService.info("Xóa bánh mã vạch thành công!", "");
                this.listChanged.emit();
            })
        }
    }


    removeHardProductBarcode(hardProductBarcode: HardProductBarcode){

        this.apiService.removeHardProductBarcode(hardProductBarcode.id).subscribe(() => {
            var index = this._hardProductBarcodes.indexOf(hardProductBarcode);
            this._hardProductBarcodes.splice(index, 1);
            this.snotifyService.info("Xóa bánh mã vạch thành công!", "");
            this.hbcListChanged.emit();
        })
    }

    public  addProductBarcode(productBarcode: ProductBarcode){

        var category = _.find(this.categories, {idBarcode: productBarcode.productCategoryBarcodeId});
        if(!category){
            this.snotifyService.error("Không thể nhập mã, không tìm thấy album này","");
        }

       return   this.productBarcodeService.createProductBarcode(productBarcode).subscribe((id) => {
            productBarcode.id = id;
            this.snotifyService.success("Quét nhập bánh thành công: " + productBarcode.barcode, "");
            this.playAudio('success');
            productBarcode.productCategoryName = this.getCategoryName(productBarcode.productCategoryBarcodeId);
            return true;
        }, err=>{
            this.snotifyService.error(err._body);
            return false
        })
      }

     public playAudio(type){
        let audio = new Audio();
          if(type == 'success'){
            audio.src = "../../assets/sounds/scan_success.wav";
            audio.load();
            audio.play();
          }else{
            audio.src = "../../assets/sounds/scan_failed.wav";
            audio.load();
            audio.play();
          }


    }

      getCategories(){
        this.apiService.getProductCategoriesByShop(this.shopService.currentShop.id).subscribe(r=>{
          this.categories = r;
        });
        this.apiService.getHardProductByShopNotBlocks(this.shopService.currentShop.id).subscribe(r=>{
            this._hardProductBarcodes = r;
            this.hbcListChanged.emit();
        })
      }

      getCategoryName(productCategoryBarcodeId){
        if(!this.categories) return "";
        var result = _.find(this.categories, {idBarcode: productCategoryBarcodeId}) as any;
        if(!result) return '';
        return result.name;
      }

      getCategoryImage(productCategoryBarcodeId){
        if(!this.categories) return "";
        return (_.find(this.categories, {idBarcode: productCategoryBarcodeId}) as any) .image;
      }

      setIsSold(barcode){
        var findResult =  _.find(this._productBarcodes, {'barcode':barcode})  as any;
        if(findResult){
            findResult.isSold = true;
        }
      }

      //Hard Product Barcodes
      public get hardProductBarcodes(){

          return this._hardProductBarcodes;
      }

      public get hardProductBarcodeLabels(){
        for (let index = 0; index < this._hardProductBarcodes.length; index++) {
            const element = this._hardProductBarcodes[index];
            if(!element.label){
                this._hardProductBarcodes[index].label = 'Không group'
            }
        }
        var labels = _.uniq(_.map(this._hardProductBarcodes, 'label'));

        console.log(labels)
        // labels = _.filter(labels, i=>{
        //     return i != null;
        // });
        labels = _.sortBy(labels);
        return labels;
    }

    public get labelsShowHideSettings(){

            if(!this._labelsShowHideSettings) this._labelsShowHideSettings = {};
            _.each(this.hardProductBarcodeLabels, l=>{
                this._labelsShowHideSettings[l] = true;
            })

        return this._labelsShowHideSettings;
    }



    public getCountByProductBarcodeId(id){
        var result = _.filter(this.productBarcodesNotSold, {productCategoryBarcodeId: id});
        return result.length;
    }
    public getCountByProductBarcodeIsSoldId(id){
        var result = _.filter(this.productBarcodesIsSold, {productCategoryBarcodeId: id});
        return result.length;
    }

    public getProductBarcodeNotSoldByName(name: string){
        var category = _.find(this.categories,{name:name});
        if(category){
            var result = _.filter(this.productBarcodesNotSold, {productCategoryBarcodeId: category.idBarcode});
            var result = _.orderBy(result, ['checkinDate']);
            return _.take(result, 15);
        }
    }

    public getProductBarcodeIsSoldByName(name: string){
        var category = _.find(this.categories,{name:name});
        if(category){
            var result = _.filter(this.productBarcodesIsSold, {productCategoryBarcodeId:category.idBarcode});
            var result = _.orderBy(result, ['checkinDate']);
            return _.take(result, 15);
        }
    }

    public getHardProductBarcodesByLabel(label){
        var result = _.filter(this._hardProductBarcodes, {label: label});
        return _.sortBy(result, ['price','name']);
    }

    public getHardProductBarcodeByBarcode(barcode){
       return  _.find(this._hardProductBarcodes,{barcode:barcode});
    }

    public get productBarcodesRemove(){
        this._productBarcodeRemove = _.filter(this._productBarcodes,{'isSold': false,  'isActive': false}) || [];
       return  _.sortBy(this._productBarcodeRemove, ['destroyedTime']).reverse() ;
    }

    public set productBarcodesRemove(value){
        this._productBarcodeRemove = value;
    }

}

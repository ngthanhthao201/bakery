import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ProductBarcode } from '../../../../shared/models/product-barcode.model';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { SnotifyService } from 'ng-snotify';
import { MemberService } from '../../../../shared/services/member.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../../shared/models/product.model';
import { Router } from '@angular/router';
import { ProductBarcodeService } from '../../services/product-barcode.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;


@Component({
  selector: 'dialog-input-product',
  templateUrl: './input-product-dialog.component.html',
  styleUrls: ['./input-product-dialog.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(1000)),
    ]),
  ]
})
export class InputProductDialogComponent implements OnInit {

  currentMemberId = 0;
  productCategory: ProductCategory;
  products: any[] = [];
  currentPage: any;
  objectKeys = Object.keys;
  productsGrByNameId = [];
  nameIds = [];
  isNewPd: boolean = true;
  constructor(public barcodeService: BarcodeService, private memberService: MemberService, private productBarcodeService: ProductBarcodeService,
    private snotifyService: SnotifyService, private shopService: ShopService, private router: Router,
    private spinner: NgxSpinnerService
    ) {
  }

  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  ngOnInit() {


    var currentPage = this;
    $('body').scannerDetection({

      //https://github.com/kabachello/jQuery-Scanner-Detection

      timeBeforeScanTest: 200, // wait for the next character for upto 200ms
      avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
      preventDefault: true,
      endChar: [13],
      minLength: 5,
      onComplete: (barcode: string) => {
        currentPage.processBarcode(barcode, currentPage)
      } // main callback function
      ,
      onError: string => {

        var last8Char = string.substr(string.length - 8);
        if (isNaN(last8Char)) {
          return;
        }
        if (currentPage) {
          currentPage.processBarcode(string, currentPage)
        }
      }
    });


    //  setTimeout(()=>{
    //    this.processBarcode('$120521910001', this);
    //  },2000)
    //  setTimeout(()=>{
    //      this.processBarcode('$120521910002', this);
    //    },5000)

  }

 async  processBarcode(barcode, currentPage) {
    if (barcode.length < 5) return;
    if (barcode.includes('-')) {

    }
    else if (barcode.startsWith("$") || barcode.startsWith("0") ) {

        var newProductBarcode = new ProductBarcode;
        var getIndex = barcode.slice(-3);
        var getDate = barcode.slice(-7, -3);
        var getCategoryBarcodeId = barcode.slice(-9, -7);
        var getPrice = barcode.slice(- (barcode.length - 1), - 9)
        newProductBarcode.shopId = this.shopService.currentShop.id;
        newProductBarcode.productCategoryBarcodeId = getCategoryBarcodeId;
        newProductBarcode.checkinDate = new Date();
        newProductBarcode.checkinBy = this.memberService.currentMember.id;
        newProductBarcode.price = parseInt(getPrice) * 1000;
        newProductBarcode.barcode = barcode;
      this.spinner.show();
         this.productBarcodeService.createProductBarcode(newProductBarcode).subscribe((id) => {
          newProductBarcode.id = id;
            this.snotifyService.success("Quét nhập bánh thành công: " + newProductBarcode.barcode, "");
            newProductBarcode.productCategoryName = this.barcodeService.getCategoryName(newProductBarcode.productCategoryBarcodeId);
            this.products.push(newProductBarcode);
            var _this = this;
            var productsGrByNameId = _.groupBy(this.products, "productCategoryBarcodeId")
            _.forOwn(productsGrByNameId, (value, key) => {
              _this.nameIds = key as any;
              _this.productsGrByNameId[key] = _.groupBy(value, "price");
    
            });
            this.spinner.hide();
        }, err=>{
            this.snotifyService.error(err._body);
            this.spinner.hide();
        })


      }
  }

  processBarcodeWithoutScanned(barcode) {

    var newProductBarcode = new ProductBarcode;
    var getIndex = barcode.slice(-3);
    var getDate = barcode.slice(-7, -3);
    var getCategoryBarcodeId = barcode.slice(-9, -7);
    var getPrice = barcode.slice(- (barcode.length - 1), - 9)
    newProductBarcode.shopId = this.shopService.currentShop.id;
    newProductBarcode.productCategoryBarcodeId = getCategoryBarcodeId;
    newProductBarcode.checkinDate = new Date();
    newProductBarcode.checkinBy = this.memberService.currentMember.id;
    newProductBarcode.price = parseInt(getPrice) * 1000;
    newProductBarcode.barcode = barcode;
    this.currentPage.barcodeService.addProductBarcode(newProductBarcode);
  }


  linkToProductBarcode() {
    this.router.navigateByUrl("/product-barcode");
  }

  ok(){
    window.location.reload();
  }

}
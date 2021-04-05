import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductBarcode } from '../../../../shared/models/product-barcode.model';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { ProductBarcodeService } from '../../services/product-barcode.service';
import { SnotifyService } from 'ng-snotify';
import { MemberService } from '../../../../shared/services/member.service';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import * as _ from "lodash";
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { MbSignalRService } from '../../../../shared/services/mbSignalR.service'
import { DashboardComponent } from '../../../dashboard/dashboard.component';
@Component({
  selector: 'app-input-product-handmade',
  templateUrl: './input-product-handmade.component.html',
  styleUrls: ['./input-product-handmade.component.scss']
})
export class InputProductHandmadeComponent implements OnInit {
  price = new FormControl();
  cakeGroup = new FormControl();
  public category: any;
  a = 'k';
  public newProductBarcodes = new ProductBarcode;
  categories: ProductCategory[];
  public priceNumber = true;
  image: any;
  currentFile: any;
  barcode : any;
  constructor(
    private apiService : ApiService, private shopService: ShopService,
    private productBarcodeService: ProductBarcodeService,  private snotifyService: SnotifyService,
    private memberService: MemberService, public barcodeService: BarcodeService, private mbSignalRService: MbSignalRService

  ) { }
  getProductCategoriesByShop(){
    this.apiService.getProductCategoriesByShop(this.shopService.currentShop.id).subscribe(r=>{
     this.category = r;
     this.barcode = Math.random().toString(36).toUpperCase().substr(2, 10);
     this.a = this.category.find(i => i.idBarcode == this.newProductBarcodes.productCategoryBarcodeId).name;
    //  console.log('this.category',this.category)

  })
  }
  onChangeCategory(event) {
    console.log(event.value);
    this.a = event.value;
}

  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);

  }

  readThis(file: any): void {
    this.currentFile = file;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      console.log(" this.image", this.image)
    }
    myReader.readAsDataURL(file);
  }

  ngOnInit() {
    this.getProductCategoriesByShop()
  }
  loading(){
      var addLoading = $('#loading');
      addLoading.removeClass('spinnerHidden');
      addLoading.addClass('spinner');
      setTimeout(function(){
        addLoading.removeClass('spinner');
        addLoading.addClass('spinnerHidden');
      },2000)
  }

  public addCategory() {
    if(this.image){
      this.apiService.uploadImageAzure(this.currentFile, this.image,  "-Category").subscribe(r => {
          this.abc(r)
          console.log("r",r)
      })
    }else{
      this.abc()
    }
  }

  abc(image = ''){
    this.newProductBarcodes.image = image
    console.log("image",image)
    this.newProductBarcodes.checkinDate = new Date();
    this.newProductBarcodes.checkinBy = this.memberService.currentMember.id;
    this.newProductBarcodes.barcode = this.barcode;
    this.newProductBarcodes.shopId = this.shopService.currentShop.id;
    this.newProductBarcodes.note = null;
    this.newProductBarcodes.productCategoryName = this.category.find(i => i.idBarcode == this.newProductBarcodes.productCategoryBarcodeId).name;
    this.productBarcodeService.createProductBarcode(this.newProductBarcodes).subscribe((id) => {
        this.addListenProductBarcodeSetShift();
      this.snotifyService.success("Thêm bánh thành công");
      this.loading();
    })
  }
  onChangeEvent(e){
    this.priceNumber = true
    this.a = this.category.find(i => i.idBarcode == this.newProductBarcodes.productCategoryBarcodeId).name;
    if( e > 1000){
      this.priceNumber = false
    }
    console.log(this.barcode);
    
  }
  addListenProductBarcodeSetShift(){
      this.mbSignalRService.joinRoom(`productBarcode/${this.shopService.currentShop.id}`).then(r =>{
          this.mbSignalRService.listenEvent('productBarcodeComing',(shift:any) => {
            DashboardComponent.watchProductShift.emit()
          })
      })
  }
}

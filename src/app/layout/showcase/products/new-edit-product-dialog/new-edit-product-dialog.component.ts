import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../../../shared/models/product.model';
import { ApiService } from '../../../../shared/services/api.service';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { CakeSizeType } from '../../../../shared/models/cake-size-type.model';
import { CakeSizePrice } from '../../../../shared/models/cake-size-price.model';

@Component({
  selector: 'app-new-edit-product-dialog',
  templateUrl: './new-edit-product-dialog.component.html',
  styleUrls: ['./new-edit-product-dialog.component.scss']
})
export class NewEditProductDialogComponent implements OnInit {
  currentProduct: Product;
  currentShop: Shop;
  image: any;
  currentFile: any;
  cakeSizeTypes :CakeSizeType[] =[];
  loadingMessage = '';
  currencyMaskOptions ={prefix: '' , suffix: 'đ ', thousands: '.', precision:0 };


  isLoading= false;

  constructor(private snotifyService: SnotifyService, private apiService: ApiService, public dialogRef: MatDialogRef<NewEditProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentProduct = data.currentProduct;
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    this.cakeSizeTypes = data.cakeSizeTypes;
  }

  ngOnInit() {
 
  }

  isCreatingNew() {
    return !this.currentProduct.id;
  }

  hasPhoto() {
    return this.currentProduct.image || this.image;
  }

  createOrUpdateProduct() {
    this.isLoading = true;
    if(this.image){
      this.loadingMessage = 'Đang tải ảnh lên ...'
      this.apiService.uploadImageAzure(this.currentFile ,this.image, this.currentShop.shopCode + "-Product").subscribe(r => {
        if (r) {
          this.currentProduct.image = r;
          this.saveProduct();
        }
      })
    }else{
      this.saveProduct();
    }
    
  }

  saveProduct(){
    this.loadingMessage = 'Đang lưu bánh ...'
    if(this.isCreatingNew()){
      this.currentProduct.isActive = true;
      this.apiService.createProduct(this.currentProduct).subscribe(r=>{
        this.snotifyService.success("Tạo mới thành công","");

        this.dialogRef.close();
        this.isLoading = false;
      });
    }else{
      this.apiService.updateProduct(this.currentProduct).subscribe(r=>{
        this.snotifyService.success("Cập nhật thành công","");
        this.dialogRef.close();
        this.isLoading = false;
      });
    }
  }

  deleteProduct(productId: number){
    this.apiService.deleteProduct(productId).subscribe(r=>{
      this.snotifyService.success("Xóa thành công","");
        this.dialogRef.close();
    })
  }

  croppedImageDone(result){
    this.currentFile = result.file;
    this.image = result.dataUrl;
  }


  addNewCakeSizePrice(p: Product){
    var cakeSizePrice = new CakeSizePrice(p.id);
    if(!p.cakeSizePrices) p.cakeSizePrices = [];
    p.cakeSizePrices.push(cakeSizePrice);
  }



}

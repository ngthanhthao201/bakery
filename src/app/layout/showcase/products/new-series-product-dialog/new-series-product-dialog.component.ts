import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import { Product } from '../../../../shared/models/product.model';
import { Shop } from '../../../../shared/models/shop.model';
import { ApiService } from '../../../../shared/services/api.service';
@Component({
  selector: 'app-new-series-product-dialog',
  templateUrl: './new-series-product-dialog.component.html',
  styleUrls: ['./new-series-product-dialog.component.scss']
})

export class NewSeriesProductDialogComponent {
  public files: [];
  url : any;
  imageurl = [];
  currentProduct: Product;
  currentShop: Shop;
  productCategory: ProductCategory;
  isLoading = false;
  loadingMessage = '';
  loadingImages = '';
  constructor(private snotifyService: SnotifyService, private apiService: ApiService, public dialogRef: MatDialogRef<NewSeriesProductDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentProduct = data.currentProduct;
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    this.productCategory = data.productCategory;
    
  }
  selectedFile : File = null;
    onFileChanged(event: any) {
    this.files = event.target.files;
    if(this.files.length > 0){
      for (const file of this.files) {
        this.loadingImages = './assets/icons/icon_loading.jpg';
        let reader = new FileReader();
        reader.onload = () => {
          $('.image-upload-wrap').hide();
          $('.file-upload-image').attr('src', file);
          $('.file-upload-content').show();
          var newLength = this.imageurl.push(reader.result);  
        };
        reader.readAsDataURL(file);
        this.loadingImages = './assets/icons/icon_sucess.png';
      }
    } 
  }

  closeDialog(){
    this.dialogRef.close(this.files);
  }
  upLoad(){
    this.isLoading = true;
    this.loadingMessage = 'Đang lưu bánh ...'
    for( let urls of this.imageurl){
      this.currentProduct.image || urls;
      if(urls){
        this.apiService.uploadImageAzure(this.files ,urls, this.currentShop.shopCode + "-Product").subscribe(r => {
          if (r) {
            this.currentProduct.image = r;
            this.saveProduct();
          }
        })
      }else{
        this.saveProduct();
      }
    }    
  }
  isCreatingNew() {
    return !this.currentProduct.id;
  }
  saveProduct(){
    this.loadingMessage = 'Thêm bánh mới thành công'
    if(this.isCreatingNew()){
      this.currentProduct.name = this.productCategory.name;
      this.currentProduct.isActive = true;
      this.apiService.createProduct(this.currentProduct).subscribe(r=>{
        this.dialogRef.close();
        this.isLoading = false;
      });
    }
  }
}
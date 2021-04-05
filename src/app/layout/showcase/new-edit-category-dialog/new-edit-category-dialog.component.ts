import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategory } from '../../../shared/models/product-category.model';
import { ApiService } from '../../../shared/services/api.service';
import { Shop } from '../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { ProductLabel } from '../../../shared/models/product-label.model';

@Component({
  selector: 'app-new-edit-category-dialog',
  templateUrl: './new-edit-category-dialog.component.html',
  styleUrls: ['./new-edit-category-dialog.component.scss']
})
export class NewEditCategoryDialogComponent implements OnInit {
  currentCategory: ProductCategory;
  currentShop: Shop;
  image: any;
  currentFile: any;
  productLabels: ProductLabel[];
  constructor(private snotifyService: SnotifyService, private apiService: ApiService, public dialogRef: MatDialogRef<NewEditCategoryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.currentCategory = data.currentCategory;
    this.productLabels = data.productLabels;
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));

  }

  ngOnInit() {

  }

  isCreatingNew() {
    return !this.currentCategory.id;
  }

  hasPhoto() {
    return this.currentCategory.image || this.image;
  }

  createOrUpdateCategory() {
      if(this.image){
        
      this.apiService.uploadImageAzure(this.currentFile, this.image, this.currentShop.shopCode + "-Category").subscribe(r => {
        if (r) {
          this.currentCategory.image = r;
          this.saveCategory();
        }
      })
    }else{
      this.saveCategory();
    }
  }

  saveCategory(){
    if(this.isCreatingNew()){
      this.apiService.createProductCategory(this.currentCategory).subscribe(r=>{
        this.snotifyService.success("Tạo mới thành công","");
        this.dialogRef.close();
      });
    }else{
      this.apiService.updateProductCategory(this.currentCategory).subscribe(r=>{
        this.snotifyService.success("Cập nhật thành công","");
        this.dialogRef.close();
      });
    }
  }

  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);

  }

  readThis(file: any): void {
    this.currentFile = file;
    console.log(file);
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
    }
    myReader.readAsDataURL(file);
  }

}

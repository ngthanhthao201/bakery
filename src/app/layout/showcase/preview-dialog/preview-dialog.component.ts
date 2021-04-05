import { Component, OnInit, Inject } from '@angular/core';
import { Shop } from '../../../shared/models/shop.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductCategory } from '../../../shared/models/product-category.model';
import { Product } from '../../../shared/models/product.model';
import { ProductSample } from '../../../shared/models/product-sample.model';

@Component({
  selector: 'app-preview-dialog',
  templateUrl: './preview-dialog.component.html',
  styleUrls: ['./preview-dialog.component.scss']
})
export class PreviewDialogComponent implements OnInit {
  currentShop: Shop;
  productCategories: ProductCategory[];
  products: Product[];
  productSamples1: ProductSample[];
  productSamples2: ProductSample[]
  constructor(public dialogRef: MatDialogRef<PreviewDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.productCategories = data.productCategories;
    this.products = data.products;

    // if(this.products && this.products.length > 0){
    //   for(var i = 0; i< this.products.length; i ++){
    //     if(i % 2 == 0){
    //       this.productSamples1.push(this.products[i]);
    //     }else{
    //       this.productSamples2.push(this.products[i])
    //     }
    //   }
    // }
   }

  ngOnInit() {
    this.currentShop =  JSON.parse(localStorage.getItem('currentShop'));
  }

}

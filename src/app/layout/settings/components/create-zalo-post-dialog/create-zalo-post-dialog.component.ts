import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { DeliveryOption } from '../../../../shared/models/delivery-option.model';
import { WebsiteConfig } from '../../../../shared/models/website-config.model';
import { ZaloPost } from '../../../../shared/models/zalo-post.model';
import { ShopService } from '../../../../shared/services/shop.service';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import * as _ from 'lodash';


@Component({
  selector: 'create-zalo-post-dialog',
  templateUrl: './create-zalo-post-dialog.component.html',
  styleUrls: ['./create-zalo-post-dialog.component.scss'],
})

export class CreateZaloDialogDialogComponent implements OnInit {

  categories: ProductCategory[];
  zaloPost: ZaloPost = new ZaloPost();
  currentShop: Shop;
  currencyMaskOptions = { prefix: '', suffix: 'đ ', thousands: '.', precision: 0 };
  image: any;
  currentFile: any;
  selectedCategory :ProductCategory = new ProductCategory();

  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<CreateZaloDialogDialogComponent>, private snotifyService: SnotifyService, 
    @Inject(MAT_DIALOG_DATA) public data: any, private shopService: ShopService) {
    this.zaloPost.zaloPageShopId = data.zaloPageShopId;
    if (data.zaloPost) {
      this.zaloPost = data.zaloPost;
    }
  }

  ngOnInit() {
    this.getCategories();
  }

  ngAfterViewInit() {
    this.textarea();
  }


  private textarea() {
    var textarea = $('textarea').on('keydown focus', (e) => {
      var el = e.target;
      el.style.cssText = 'height:auto; padding:5px';
      el.style.cssText = 'height:' + el.scrollHeight + 'px';

      var cloneTextArea = $('#clone-textarea')[0];
      cloneTextArea.style.cssText = 'height:auto; padding:5px';
      cloneTextArea.style.cssText = 'height:' + el.scrollHeight + 'px';
    }

    );
  }

  getCategories() {
    this.apiService.getProductCategoriesByShop(this.shopService.currentShop.id).subscribe(r => {
      this.categories = r;
    })
  }

  categoryChanged(){
    this.zaloPost.link = 'https://tiembanhngon.com/' + this.shopService.currentShop.name + "/" + this.selectedCategory.id;
  }

  goToProducts(link) {
    window.open(link,"_blank");
    
  }
  onActivate(event) {
    if (event.type === 'click') {
      this.goToProducts(event.row.id);
    }
  }


  CreatingNew() {
    return !this.zaloPost;
  }

  ok() {
    if (this.CreatingNew()) {
      this.apiService.creatZaloPost(this.zaloPost).subscribe(r => {
        console.log(r);
        this.dialogRef.close(true);
      });
    } else {
      this.apiService.editZaloPost(this.zaloPost).subscribe(r => {
        console.log(r);
        this.dialogRef.close(true);
      });
    }
  }


}


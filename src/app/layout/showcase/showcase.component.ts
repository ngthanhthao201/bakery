import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../shared/services/api.service';
import { ProductCategory } from '../../shared/models/product-category.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PreviewDialogComponent } from './preview-dialog/preview-dialog.component';
import { SnotifyService } from 'ng-snotify';

import { NewEditCategoryDialogComponent } from './new-edit-category-dialog/new-edit-category-dialog.component';
import { Product } from '../../shared/models/product.model';
import { ClipboardService } from 'ngx-clipboard';
import * as _ from 'lodash';
import { Utilities } from '../../shared/services/utilities';
import { ProductLabel } from '../../shared/models/product-label.model';
import { ShopService } from '../../shared/services/shop.service';
import * as hopscotch from 'hopscotch'
import { TourService } from '../../shared/services/tour.service';


@Component({
    selector: 'app-showcase',
    templateUrl: './showcase.component.html',
    styleUrls: ['./showcase.component.scss'],
    animations: [routerTransition()],
})
export class ShowcaseComponent implements OnInit {

    productCategories: any = [];
    accessoriesCategory: ProductCategory;
    productLabels: ProductLabel[];
    result : '';
    constructor(private apiService: ApiService, private router: Router, public dialog: MatDialog,
        private snotifyService: SnotifyService, private clipboardService: ClipboardService, public shopService: ShopService, private tourService: TourService,
    ) { }

    ngOnInit() {

        if (this.shopService.currentShop.id) {
            this.getProductCategoriesByShop();
        }
        this.apiService.getProductLabels().subscribe(r => {
            this.productLabels = r;
        });
    }

    ngAfterViewInit() {
        this.tourService.startTour("showcaseComponent");
    }

    startTourAgain() {
        this.tourService.startTourAgain("showcaseComponent");
    }
    getProductCategoriesByShop(): void {
        this.apiService.getProductCategoriesByShop(this.shopService.currentShop.id).subscribe(res => {

            this.productCategories = _.filter(res, { 'isAccessories': false });
            this.productCategories = _.sortBy(this.productCategories, 'index')
            _.each(this.productCategories, pc => {
                pc.products = _.filter(pc.products, { 'isActive': true });
            })


        }
        );
    }

    createNew(): void {
        if (this.productCategories.length > 59) {
            this.snotifyService.confirm("Bạn đang thêm quá nhiều. Hãy liên hệ chúng tôi để được trợ giúp", "", {
                buttons: [
                    {
                        text: "Ok",
                        action: () => {
                            return;
                            //this.snotifyService.clear();
                        }
                    }, {
                        text: "Cancel",
                        action: () => {
                            this.snotifyService.clear();;
                        }
                    }
                ]
            });
        } else {

            var newCategory = new ProductCategory();
            newCategory.shopId = this.shopService.currentShop.id;
            // this.apiService.createProductCategory(newcategory).subscribe(r=>{
            //     this.getProductCategoriesByShop();
            // });
            let dialogRef = this.dialog.open(NewEditCategoryDialogComponent, {
                width: '600px',
                data: {
                    currentCategory: newCategory
                }
            });

            dialogRef.afterClosed().subscribe(r => {
                this.getProductCategoriesByShop();
            })
        }
    }


    editProductCategory(pc) {

        let dialogRef = this.dialog.open(NewEditCategoryDialogComponent, {
            width: '600px',
            data: {
                currentCategory: pc,
                productLabels: this.productLabels
            }
        });

        dialogRef.afterClosed().subscribe(r => {
            this.getProductCategoriesByShop();
        })
    }

    goToProducts(productCategoryId: number) {
        this.router.navigate(['/showcase/' + productCategoryId]);
    }

    previewOnPhone() {
        let dialogRef = this.dialog.open(PreviewDialogComponent, {
            data: {
                productCategories: this.productCategories
            },
            panelClass: "hidden-container"
        });
    }

    deleteProductCategory(productCategoryId: number) {

        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa mục này?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {

                        this.apiService.deleteProductCategory(productCategoryId).subscribe(r => {
                            this.getProductCategoriesByShop();
                        }, err => {
                            console.log(err);
                            this.snotifyService.error(err._body, "")
                        })

                        this.snotifyService.clear();
                    }
                }, {
                    text: "Cancel",
                    action: () => {
                        this.snotifyService.clear();
                    }
                }
            ]
        });

    }

    // deleteAccesssory(productId: number){

    //     this.alertService.showDialog("Bạn có chắc chắn muốn xóa mục này?",DialogType.confirm , val=>{    
    //         this.apiService.deleteProduct(productId).subscribe(r=>{
    //             this.getProductCategoriesByShop();
    //         })
    //       });

    // }

    onActivate(event) {
        if (event.type === 'click') {
            this.goToProducts(event.row.id);
        }
    }

    copyLink(category) {
        var link = Utilities.getCategoryUrlWebsite(this.shopService.currentShop, category);
        this.clipboardService.copyFromContent(link);
        this.snotifyService.success("Đã Copy Link Website", "");
    }

    // draggableOptions: SortablejsOptions = {
    //     draggable: '.draggable'
    //   };

    // scrollableOptions: SortablejsOptions = {
    //     scroll: true,
    //     scrollSensitivity: 100,
    //   };



}


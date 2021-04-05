import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ProductBarcode } from '../../shared/models/product-barcode.model';
import { Shop } from '../../shared/models/shop.model';
import * as _ from 'lodash';
import { ProductCategory } from '../../shared/models/product-category.model';
import { BarcodeService } from '../../shared/services/barcode.service';

import { SnotifyService } from 'ng-snotify';

import { Utilities } from '../../shared/services/utilities';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { HardProductBarcode } from '../../shared/models/hard-product-barcode.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { NewStuffBarcodeDialogComponent } from './new-stuff-barcode-dialog/new-stuff-barcode-dialog.component';
import { ShopService } from '../../shared/services/shop.service';
import { AddStuffDialogComponent } from './add-stuff-dialog/add-stuff-dialog.component';
import { MemberService } from '../../shared/services/member.service';
import { routerTransition } from '../../router.animations';
import { DownloadBarcodeSheetComponent } from './download-barcode-sheet/download-barcode-sheet';
import { DestroyStuffDialogComponent } from './destroy-stuff-dialog/destroy-stuff-dialog.component';
import { HardBlockProductBarcode } from '../../shared/models/hard-block-product-barcode.model';
import { ConfirmResetStuffsComponent } from './confirm-reset-stuffs/confirm-reset-stuffs.component';
import { DialogAddImage } from './dialog-add-image/dialog-add-image.component';
import { ActivatedRoute } from '@angular/router';
import { MatTabGroup } from '@angular/material/tabs';

declare var jquery: any;
declare var $: any;


@Component({
    selector: 'app-stuff-barcode',
    templateUrl: './stuff-barcode.component.html',
    styleUrls: ['./stuff-barcode.component.scss'],
    animations: [routerTransition()]
})
export class StuffBarcodeComponent implements OnInit {

    //new
    hardProducts: Array<HardProductBarcode> = [];
    hardProductsRows = [];
    hardProductsSettingRows = [];
    //old
    currentShop: Shop;
    currentFile: any;
    currentProduct: HardProductBarcode;



    @ViewChild("stuffTabs", { static: false }) stuffTabs: MatTabGroup;
    @ViewChild(DatatableComponent,{static: true}) table: DatatableComponent;

    constructor(private bottomSheet: MatBottomSheet,
        private activatedRoute: ActivatedRoute,
         public memberService: MemberService,
         public shopService: ShopService, private apiService: ApiService, public barcodeService: BarcodeService,
         private detectorRef: ChangeDetectorRef,
         private snotifyService: SnotifyService, public dialog: MatDialog) {
        shopService.shopChanged.subscribe(r => {
            this.currentShop = shopService.currentShop;
        })
    }


    ngOnInit() {
        this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
        var memberId = parseInt(localStorage.getItem('memberId'));
        var currentPage = this;

        $('body').scannerDetection({

            //https://github.com/kabachello/jQuery-Scanner-Detection

            timeBeforeScanTest: 200, // wait for the next character for upto 200ms
            startChar: [120],
            avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
            endChar: [13],
            onComplete: function (barcode: string, qty) {
                currentPage.processBarcode(barcode, currentPage);
            } // main callback function	,
            ,
            onError: function (string, qty) {
                currentPage.processBarcode(string, currentPage);
            }
        });

        //new
        this.getHardProduct();

        // this.barcodeService.hbcListChanged.subscribe(r => {
        //     this.hardProducts = this.barcodeService.hardProductBarcodes;
        //     this.hardProductsRows = this.hardProducts;
        // })



    }

    ngOnDestroy() {
        $('body').scannerDetection(false);
    }

    processBarcode(barcode, currentPage) {
        var selectedHardProduct = this.hardProducts.find(x => x.barcode == barcode);
        if (selectedHardProduct) {
            this.openSelectCountStuff(selectedHardProduct);
        }
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

        const temp = this.hardProducts.filter(function (hbc) {
            return Utilities.searchOnItem(hbc, filterValue, [], ['name']);
        });

        // update the rows
        this.hardProductsRows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }

    applyFilterSetting(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

        const temp = this.hardProducts.filter(function (hbc) {
            return Utilities.searchOnItem(hbc, filterValue, [], ['name']);
        });

        // update the rows
        this.hardProductsSettingRows = temp;
        // Whenever the filter changes, always go back to the first page
        this.table.offset = 0;
    }


    getHardProduct() {
        this.apiService.getHardProductByShop(this.currentShop.id).subscribe(result => {
            if (result == []) {
                this.hardProducts.push(new HardProductBarcode());
                this.hardProducts[0].shopId = this.shopService.currentShop.id;
            } else {
                this.hardProducts = result;
            }
            this.hardProducts.forEach(hardProduct => {
                hardProduct.total = 0;
                if (hardProduct.hardBlockProductBarcodes) {
                    hardProduct.hardBlockProductBarcodes.forEach(item => {
                        hardProduct.total += item.count;
                        if (item.destroyedCount) {
                            hardProduct.total -= item.destroyedCount;
                        }
                    });
                }
            });

            this.hardProductsRows = this.hardProducts;
            this.hardProductsSettingRows = this.hardProducts;
        })
    }

    toggleExpandRow(row) {
        console.log('Toggled Expand Row!', row);
        this.table.rowDetail.toggleExpandRow(row);
    }

    onDetailToggle(event) {
        console.log('Detail Toggled', event);
    }

    addNewStuff(hardProduct = null) {
        var labels = _.uniq(_.map(this.hardProducts, 'label'));
        labels = _.filter(labels, i => {
            return i != null;
        })

        let dialogRef = this.dialog.open(NewStuffBarcodeDialogComponent, {
            data: {
                hardProduct: hardProduct,
                labels: labels
            }
        });

        dialogRef.afterClosed().subscribe(r => {
            this.getHardProduct();
        })
    }
    


    croppedImageDone(result, hpc){
        //this.currentFile = result.file;
        //this.image = result.dataUrl;
        this.apiService.uploadImageAzure({name: hpc.name + ".png"}, result.dataUrl,  this.currentShop.shopCode+ "-Category").subscribe(r => {
            hpc.image = r;
                this.apiService.updateHardProduct(hpc).subscribe(result => {
                    this.snotifyService.success("Upload ảnh thành công", "");
                })
        })
      }


    resetHardProduct(hardProductBarcode: HardProductBarcode) {
        if (!this.memberService.hasPermission('shop.setting')) {
            this.snotifyService.error('Bạn không có quyền xóa!', '');
            return;
        }
        this.snotifyService.confirm("Bạn có chắc chắn muốn reset ?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {
                        this.apiService.resetHardProductBarcode(hardProductBarcode.id).subscribe(r => {
                            this.snotifyService.success("Reset thành công", "");
                            hardProductBarcode.hardBlockProductBarcodes = [];
                            hardProductBarcode.total = 0;
                        });
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

    destroyHardProduct(hardProductBarcode) {
        let dialogRef = this.dialog.open(DestroyStuffDialogComponent, {
            data: {
                hardProductBarcode: hardProductBarcode
            }
        });

        dialogRef.afterClosed().subscribe(r => {
            this.getHardProduct();
        })
    }

    deleteStuff(hbc) {
        if (!this.memberService.hasPermission('shop.setting')) {
            this.snotifyService.error('Bạn không có quyền xóa!', '');
            return;
        }
        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa ?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {
                        this.barcodeService.removeHardProductBarcode(hbc);
                        this.snotifyService.clear();
                        this.getHardProduct();
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

    openSelectCountStuff(selectedStuff) {
        let dialogRef = this.dialog.open(AddStuffDialogComponent, {
            width: '300px',
            data: {
                hardProduct: selectedStuff
            }
        });

        dialogRef.afterClosed().subscribe(r => {
            this.getHardProduct();
        })
    }


    downloadStuffBarCode(hardProduct: HardProductBarcode) {
        this.bottomSheet.open(DownloadBarcodeSheetComponent, {
            data: {
                hardProduct: hardProduct
            },
        });
    }

    resetStuffs(){
        var ref= this.dialog.open(ConfirmResetStuffsComponent, {
            data:{

            }
        })

        ref.afterClosed().subscribe(r=>{
            if(r){
            this.apiService.resetAllStuffs(this.shopService.currentShop.id).subscribe(r=>{
                this.snotifyService.success("Reset thành công!")
            })
            }
        })
    }

    ngAfterViewInit(){
        var selectedTab = this.activatedRoute.snapshot.queryParams["tab"];
        console.log(selectedTab);
        if(selectedTab){
            this.stuffTabs.selectedIndex = 2;
        }
        this.detectorRef.detectChanges();
    }

}

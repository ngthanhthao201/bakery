import { Component, OnInit, Inject } from "@angular/core";
import { Product } from "../../../shared/models/product.model";
import { Shop } from "../../../shared/models/shop.model";
import { SnotifyService } from "ng-snotify";

import { ApiService } from "../../../shared/services/api.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HardProductBarcode } from "../../../shared/models/hard-product-barcode.model";
import { ShopService } from "../../../shared/services/shop.service";
import { FormControl } from "@angular/forms";
import { HardSetProductBarcode } from "../../../shared/models/hard-set-product-barcode.model";
import { Utilities } from "../../../shared/services/utilities";

@Component({
    selector: "app-new-stuff-barcode-dialog",
    templateUrl: "./new-stuff-barcode-dialog.component.html",
    styleUrls: ["./new-stuff-barcode-dialog.component.scss"],
})
export class NewStuffBarcodeDialogComponent implements OnInit {
    currentProduct: HardProductBarcode;
    currentShop: Shop;
    memberId: number;
    labels: string[];
    labelCtrl: FormControl = new FormControl();
    isLoading = false;
    loadingMessage = "Đang cập nhật bánh";
    newHardSet: HardSetProductBarcode;
    currentFile: any;
    image: any;

    currentFileForSet: any;
    imageForSet: any;

    currencyMaskOptions = {
        prefix: "",
        suffix: "đ ",
        thousands: ".",
        precision: 0,
    };
    constructor(
        public shopService: ShopService,
        private apiService: ApiService,
        public dialogRef: MatDialogRef<NewStuffBarcodeDialogComponent>,
        private snotifyService: SnotifyService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.currentProduct = data.hardProduct;
        this.labels = data.labels;

        if (this.currentProduct) {
            this.newHardSet = new HardSetProductBarcode();
            this.newHardSet.hardProductBarcodeId = this.currentProduct.id;
        }

        this.memberId = parseInt(localStorage.getItem("memberId"));
        shopService.shopChanged.subscribe((r) => {
            this.currentShop = shopService.currentShop;
        });
        if (!this.currentProduct) {
            this.currentProduct = new HardProductBarcode();
            this.currentProduct.shopId = this.shopService.currentShop.id;
        }
    }

    ngOnInit() {}

    createOrUpdateProduct() {
        if (this.currentProduct.id) {
            if (this.image) {
                this.apiService
                    .uploadImageAzure(this.currentFile, this.image, "-Category")
                    .subscribe((r) => {
                        this.currentProduct.image = r;
                        this.apiService
                            .updateHardProduct(this.currentProduct)
                            .subscribe((result) => {
                                this.dialogRef.close();
                            });
                    });
            }
            this.apiService
                .updateHardProduct(this.currentProduct)
                .subscribe((result) => {
                    this.dialogRef.close();
                });
        } else {
            if (this.image) {
                this.apiService
                    .uploadImageAzure(this.currentFile, this.image, "-Category")
                    .subscribe((r) => {
                        this.currentProduct.image = r;
                        this.apiService
                            .createHardProduct(this.currentProduct)
                            .subscribe((result) => {
                                this.dialogRef.close();
                            });
                    });
            } else {
                this.apiService
                    .createHardProduct(this.currentProduct)
                    .subscribe((result) => {
                        this.dialogRef.close();
                    });
            }
        }
    }

    async saveNewHardSet(hs: HardSetProductBarcode) {
        hs.barcode =
            this.currentProduct.barcode + "-" + Utilities.uniqueIdNumber(4);

            if (this.imageForSet){
                hs.image =  await this.apiService.uploadImageAzure(this.currentFileForSet, this.imageForSet, "-Category").toPromise()
            }

        this.apiService.createHardSetProduct(hs).subscribe((r) => {
            this.snotifyService.success("Tạo thành công!", "");
            this.dialogRef.close();
        });
    }

    deleteHardSet(hs: HardSetProductBarcode) {
        this.snotifyService.confirm(
            "Bạn có chắc chắn muốn xóa set/hộp này?",
            "",
            {
                buttons: [
                    {
                        text: "Ok",
                        action: () => {
                            this.apiService
                                .deleteHardSetProduct(hs)
                                .subscribe((r) => {
                                    this.snotifyService.success(
                                        "Xóa thành công!",
                                        ""
                                    );
                                    this.dialogRef.close();
                                });
                            this.snotifyService.clear();
                        },
                    },
                    {
                        text: "Cancel",
                        action: () => {
                            this.snotifyService.clear();
                        },
                    },
                ],
            }
        );
    }

    onFileSelect(event) {
        var file = event.target.files[0];
        this.readThis(file);
    }
    readThis(file: any) {
        this.currentFile = file;
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.image = myReader.result;
        };
        myReader.readAsDataURL(file);
    }

    croppedImageDone(result){
        this.currentFile = {name: this.currentProduct.name + ".png"};
        this.image = result.dataUrl;
       
      }


    async croppedImageDoneForSet(result, hs){
        this.currentFileForSet = {name: hs.name + ".png"};
        this.imageForSet = result.dataUrl;

        hs.image =  await this.apiService.uploadImageAzure(this.currentFileForSet, this.imageForSet, "-Category").toPromise()
        this.apiService.updateHardSetProduct(hs).subscribe(r=>{

        })
      }
}

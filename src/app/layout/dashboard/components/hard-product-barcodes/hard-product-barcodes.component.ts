import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    EventEmitter,
    HostListener,
} from "@angular/core";
import { routerTransition } from "../../../../router.animations";
import { OrderService } from "../../../orders/services/order.service";
import {
    SnotifyService,
    SnotifyPosition,
    SnotifyToastConfig,
} from "ng-snotify";
import * as _ from "lodash";
import { QuickOrderService } from "../../../../shared/services/quick-order.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { BarcodeService } from "../../../../shared/services/barcode.service";
import { ShopService } from "../../../../shared/services/shop.service";
import { DateTimeService } from "../../../../shared/services/date-time.service";
import { AddStuffDialogComponent } from "../../../stuff-barcode/add-stuff-dialog/add-stuff-dialog.component";
import { ShowHideLabelSheet } from "../show-hide-label/show-hide-label-sheet.component";
import { ProductCategory } from "../../../../shared/models/product-category.model";

declare var $: any;
import { SettingsService } from "../../../../shared/services/settings.service";
import { CustomerShop } from "../../../../shared/models/customer-shop.model";
import { ModelHelper } from "../../../../shared/services/model-helper";
import { SaleType } from "../../../../shared/models/sale-type.enum";
import { Router } from "@angular/router";

@Component({
    selector: "app-hard-product-barcodes",
    templateUrl: "./hard-product-barcodes.component.html",
    styleUrls: ["./hard-product-barcodes.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routerTransition()],
})
export class HardProductBarcodesComponent implements OnInit {


    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {


      if (event.ctrlKey && event.altKey && event.shiftKey) {

        this.isInputCake = !this.isInputCake;
        if (this.isInputCake) {
          $('html, body').animate({
            scrollTop: $("#hard-product-barcode-filter").offset().top - 40
          }, 1000);
        }
      }

     
    }

    public static customerScanned: EventEmitter<any> = new EventEmitter<any>();
    public static isTouch: EventEmitter<any> = new EventEmitter<any>();
    categories: ProductCategory[];
    isInputCake = false;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    filterHardProductBarcode = "label";
    public SaleType = SaleType;

    barcodeType: any;
    customerShop: CustomerShop;

    public radioCheck2: boolean = false;

    constructor(
        public dateTimeService: DateTimeService,
        public orderService: OrderService,
        public barcodeService: BarcodeService,
        private snotifyService: SnotifyService,
        public shopService: ShopService,
        public settingsService: SettingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private bottomSheet: MatBottomSheet,
        public quickOrderService: QuickOrderService,
        public dialog: MatDialog,
        private router: Router

    ) {
        this.shopService.currentShop = JSON.parse(
            localStorage.getItem("currentShop")
        );


    }

    isLastPriceElement(pc, pcs) {
        var prices = _.filter(pcs, { price: pc.price });
        return prices.indexOf(pc) == prices.length - 1;
    }

    ngOnInit() {
        this.barcodeService.hbcListChanged.subscribe((r) => {
            this.changeDetectorRef.detectChanges();
        });

        this.quickOrderService.incomeTransactionChanged$.subscribe((r) => {
            this.changeDetectorRef.detectChanges();
        });

       
    }
    ngAfterViewInit(){
        $('#myTab').tabCollapse();
    }
    ngOnDestroy() {
        try{
            $("body").scannerDetection(false);
        }catch(err){}
    }

    addQuickPrice(description, type, price, barcode = null, quantity = 1) {
        if (this.isInputCake && barcode.startsWith("C")) {
            var selectedStuff = this.barcodeService.getHardProductBarcodeByBarcode(
                barcode
            );
            let dialogRef = this.dialog.open(AddStuffDialogComponent, {
                width: "300px",
                data: {
                    hardProduct: selectedStuff,
                },
            });

            dialogRef.afterClosed().subscribe((r) => {
                //this.getHardProduct();
            });
            return;
        }
        if (barcode && this.quickOrderService.checkBarcodeExisted(barcode)) {
            if (barcode.startsWith("C")) {
                this.quickOrderService.increaseQuantityBarcodeExisted(
                    barcode,
                    quantity
                );
                return;
            } else {
                this.snotifyService.warning("Không nhập được 2 lần!", "");
                return;
            }
        }

        ModelHelper.addQuickPrice(
            this.quickOrderService,
            this.snotifyService,
            description,
            type,
            price,
            barcode,
            quantity
        );
    }

    openBottomSheet() {
       this.router.navigateByUrl("/stuff-barcode?tab=2")
    }

    radioChange2(e) {

    }
}

import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
    Component,
    OnInit,
    HostListener,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    NgZone,
    EventEmitter,
    Output,
    ViewChild,
} from "@angular/core";
import { routerTransition } from "../../router.animations";
import { OrderService } from "../orders/services/order.service";
import { ApiService } from "../../shared/services/api.service";
import { Shop } from "../../shared/models/shop.model";
import { Utilities } from "../../shared/services/utilities";
import {
    SnotifyService,
    SnotifyPosition,
    SnotifyToastConfig,
} from "ng-snotify";
import * as _ from "lodash";
import { QuickOrderService } from "../../shared/services/quick-order.service";
import { IncomeTransaction } from "../../shared/models/IncomeTransaction";
import { PriceChip } from "../../shared/models/price-chip.model";
import { NewEditPriceDialog } from "../../shared/dialogs/new-edit-price-dialog.component";
import { MbSignalRService } from "../../shared/services/mbSignalR.service";
import { BarcodeService } from "../../shared/services/barcode.service";
import { ShopService } from "../../shared/services/shop.service";
import { QzTrayService } from "../../shared/services/qz-tray.service";
import { ExpenseHeader } from "../../shared/models/expense-header.model";
import { ExpenseTransaction } from "../../shared/models/expense-transaction.model";
import { ExpenseDialog } from "../../shared/dialogs/expense-dialog.component";
import { MaterialService } from "../../shared/services/material.service";
import { OtherExpenseDialog } from "../../shared/dialogs/other-expense-dialog.component";
import { PrintService } from "../../shared/services/print.service";
import { SellMode } from "../../shared/models/sell-mode.enum";
import { Order } from "../../shared/models/order.model";
import { ActivatedRoute, Router } from "@angular/router";
import { DateTimeService } from "../../shared/services/date-time.service";
import { ProductBarcode } from "../../shared/models/product-barcode.model";
import { HardProductBarcode } from "../../shared/models/hard-product-barcode.model";
import { AddStuffDialogComponent } from "../stuff-barcode/add-stuff-dialog/add-stuff-dialog.component";
import { ShowHideLabelSheet } from "./components/show-hide-label/show-hide-label-sheet.component";
import { NavItem } from "../../shared/menu-item/nav-item";
import { ProductCategory } from "../../shared/models/product-category.model";
import { MemberService } from "../../shared/services/member.service";
import { SellCakeSettingsComponent } from "./components/sell-cake-settings/sell-cake-settings.component";
declare var $: any;
declare var classie: any;
import * as screenfull from "screenfull";
import { OrderDetailComponent } from "../../shared/modules/order-detail/components/order-detail/order-detail.component";
import { SettingsService } from "../../shared/services/settings.service";
import { ProductBarcodeService } from "../product-barcode/services/product-barcode.service";
import { LinkCustomerComponent } from "../orders-timeline/link-customer/link-customer.component";
import { CustomerShop } from "../../shared/models/customer-shop.model";
import { BarcodeType } from "../../shared/models/barcode-type.enum";
import { ModelHelper } from "../../shared/services/model-helper";
import { SaleType } from "../../shared/models/sale-type.enum";
import { NgxSpinnerService } from "ngx-spinner";
import { BlockAndWarningComponent } from "./components/block-and-warning/block-and-warning.component";
import { MatDialog } from "@angular/material/dialog";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [routerTransition()],
})
export class DashboardComponent implements OnInit {

    //ngx-pagination tabForSaleName and tabForSalePrice
    p: number[] = [];
    q: number[] = [];
    curentTab = localStorage.getItem('curentTab') || 'ProductBarcode';
    searchsCtrl : FormControl;
    isFirst: boolean;
    @HostListener("document:keydown", ["$event"])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key == "F7") {
            if (this.quickOrderService.sellMode == SellMode.Normal) {
                this.snotifyService.info("Vào chế độ bán bánh cảm ứng", "");
                DashboardComponent.isTouch.emit(true);
                if (screenfull.isEnabled) {
                    screenfull.toggle();
                }
                $(".app-sidebar").hide();
                $(".main-content").css("padding-left", "0px");
                $(".main-content .content-wrapper").css("padding", "0px");
                $("body").removeClass("push-right");
                $("#products-dashboard-container").removeClass("col-md-9");
                $("#products-dashboard-container").addClass("col-md-12");
                this.quickOrderService.sellMode = SellMode.TouchScreen;
                this.filterHardProductBarcode = "label";
                $("html, body").animate(
                    {
                        scrollTop:
                            $("#hard-product-barcode-filter").offset().top - 40,
                    },
                    1000
                );
            } else if (
                this.quickOrderService.sellMode == SellMode.TouchScreen
            ) {
                this.snotifyService.info("Thoát chế độ bán bánh cảm ứng", "");
                DashboardComponent.isTouch.emit(false);

                if (screenfull.isEnabled) {
                    screenfull.toggle();
                }
                $(".app-sidebar").show();
                $(".main-content").css("padding-left", "");
                $(".main-content .content-wrapper").css("padding", "");
                $("body").addClass("push-right");
                $("#products-dashboard-container").addClass("col-md-9");
                $("#products-dashboard-container").removeClass("col-md-12");
                this.quickOrderService.sellMode = SellMode.Normal;
            }
        }

        
    }
    public static customerScanned: EventEmitter<any> = new EventEmitter<any>();
    public static isTouch: EventEmitter<any> = new EventEmitter<any>();
    public static watchProductShift: EventEmitter<any> = new EventEmitter<any>();

    public static productSoldEvent: EventEmitter<any> = new EventEmitter<any>();

    categories: ProductCategory[];
    isInputCake = false;
    public alerts: Array<any> = [];
    public sliders: Array<any> = [];
    filterHardProductBarcode = "label";
    public SaleType = SaleType;
    public filteredProducts: [];
    public selectedProduct = "";
    productBarcodes = [];
    @ViewChild("tabGroup") tabGroup;

    priceChips4Accessory: PriceChip[] = [];
    priceChips4Cake: PriceChip[] = [];
    priceChips4Discount: PriceChip[] = [
        new PriceChip(-5000),
        new PriceChip(-10000),
    ];
    priceChips4PercentDiscount: PriceChip[] = [new PriceChip(-5)];
    navItem: NavItem = {
        displayName: "",
        iconName: "",
        children: [],
    };

    barcodeType: any;
    customerShop: CustomerShop;
    //order chart
    public orderChartData: Array<any> = [{ data: [], label: "order" }];

    public orderChartLabels: Array<any> = [];

    public tabForSalePrice: any;
    public tabForSaleName: any;
    public searchForSaleName: any;
    public searchForSalePrice: any;
    public radioCheck: boolean = false;
    // public priceBakery:boolean = false;

    @ViewChild('autoCompleteSearchInput', { read: MatAutocompleteTrigger, static: false }) autoComplete: MatAutocompleteTrigger;


    constructor(
        public dateTimeService: DateTimeService,
        public orderService: OrderService,
        private apiService: ApiService,
        public barcodeService: BarcodeService,
        private productBarcodeService: ProductBarcodeService,
        private snotifyService: SnotifyService,
        private mbSignalRService: MbSignalRService,
        public shopService: ShopService,
        private memberService: MemberService,
        public settingsService: SettingsService,
        private changeDetectorRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private ngZone: NgZone,
        private router: Router,
        private materialService: MaterialService,
        private printService: PrintService,
        private route: ActivatedRoute,
        private bottomSheet: MatBottomSheet,
        public quickOrderService: QuickOrderService,
        public dialog: MatDialog,
        private qzTrayService: QzTrayService


    )

    {
        this.searchsCtrl = new FormControl;

        this.shopService.currentShop = JSON.parse(
            localStorage.getItem("currentShop")
        );

        if (localStorage.getItem("priceChips4Cake")) {
            this.priceChips4Cake = JSON.parse(
                localStorage.getItem("priceChips4Cake")
            );
            this.priceChips4Cake = _.sortBy(this.priceChips4Cake, "value");
        }

        if (localStorage.getItem("priceChips4Accessory")) {
            this.priceChips4Accessory = JSON.parse(
                localStorage.getItem("priceChips4Accessory")
            );
            this.priceChips4Accessory = _.sortBy(
                this.priceChips4Accessory,
                "value"
            );
        }

        if (localStorage.getItem("priceChips4Discount")) {
            this.priceChips4Discount = JSON.parse(
                localStorage.getItem("priceChips4Discount")
            );
            this.priceChips4Discount = _.sortBy(
                this.priceChips4Discount,
                "value"
            ).reverse();
        }

        if (localStorage.getItem("priceChips4PercentDiscount")) {
            this.priceChips4PercentDiscount = JSON.parse(
                localStorage.getItem("priceChips4PercentDiscount")
            );
            this.priceChips4PercentDiscount = _.sortBy(
                this.priceChips4PercentDiscount,
                "value"
            ).reverse();
        }

    }

    ngOnInit() {
        localStorage.removeItem("isExistedCustomer");
        this.initPriceChips();

        DashboardComponent.productSoldEvent.subscribe((e) => {
            this.getProductBarcodesForSale();
        });

        var currentPage = this;

        
        $("body").scannerDetection({
            //https://github.com/kabachello/jQuery-Scanner-Detection

            timeBeforeScanTest: 200, // wait for the next character for upto 200ms
            avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
            preventDefault: false,
            startChar: [120],
            endChar: [13],
            minLength: 5,
            onComplete: function (barcode: String, qty) {
                if (currentPage.dialog.openDialogs.length > 0) {
                    return false;
                }
                currentPage.processBarcode(barcode, currentPage);
            }, // main callback function ,
            onError: function (string, qty) {

            },
        });

        var filter = localStorage.getItem("filterHardProductBarcode");
        if (filter) {
            this.filterHardProductBarcode = filter;
        }

        this.barcodeService.hbcListChanged.subscribe((r) => {
            this.changeDetectorRef.detectChanges();
        });

        this.quickOrderService.incomeTransactionChanged$.subscribe((r) => {
            this.changeDetectorRef.detectChanges();
        });

        this.getProductBarcodesForSale();

        if(localStorage.getItem("isFrist")){
            this.isFirst = JSON.parse(localStorage.getItem("isFrist"))
        }else{
            this.isFirst = false;
        }
        if(localStorage.getItem("radioCheck")){
            this.radioCheck = JSON.parse(localStorage.getItem("radioCheck"))
        }else{
            this.radioCheck = true
        }

        if(this.mbSignalRService.isConnected){
            this.addListenProductBarcodeSetShift()
        }else{
            this.mbSignalRService.connectedEvent.subscribe( r => {
                this.addListenProductBarcodeSetShift()
            })
        }

    }

    ngAfterViewInit() {
        // document.getElementsByClassName('mat-tab-header-pagination-before')[0].remove();
        // document.getElementsByClassName('mat-tab-header-pagination-after')[0].remove();
        this.getCategories();
        //  setTimeout(()=>{
        //    this.processBarcode('19132', this);
        //  },2000)
        DashboardComponent.watchProductShift.subscribe((r) => {
            // console.log("For ProductBarcodesForSale: ", r);
            this.getProductBarcodesForSale();
           var animationProduct = $('.productCard');
           animationProduct.addClass('load-8');
           setTimeout(function(){
            animationProduct.removeClass('load-8');
          },30000)
        })
    }

    ngOnDestroy() {
       try{ $("body").scannerDetection(false);}catch{}
    }

    isLastPriceElement(pc, pcs) {
        var prices = _.filter(pcs, { price: pc.price });
        return prices.indexOf(pc) == prices.length - 1;
    }

    // remain(price){
    //   return this.cardForSale.filter(i => i.price.toString() == price).length
    // }

    filterBy(nameFilter: string, r) {
        var teamForSaleName = [];
        for (let i = 0; i < r.length; i++) {
            const element = r[i];

            var categoryForSaleName = teamForSaleName.find(
                (item) => item[nameFilter] == element[nameFilter]
            );
            if (categoryForSaleName && categoryForSaleName.price) {
                categoryForSaleName.categoryName.push(element);
            } else {
                teamForSaleName.push({
                    productCategoryName: element.productCategoryName,
                    price: element.price,
                    categoryName: [element],
                });
            }
        }
        //  r.forEach(i =>{
        //   var categoryForSaleName = teamForSaleName.find(item => item[nameFilter] == i[nameFilter]);
        //   if(categoryForSaleName) {
        //     categoryForSaleName.categoryName.push(i)
        //   } else {
        //     teamForSaleName.push({
        //       productCategoryName : i.productCategoryName,
        //       price: i.price,
        //       categoryName: [i]
        //     })
        //   }
        // })
        return _.sortBy(teamForSaleName, nameFilter);
    }

    getProductBarcodesForSale() {
        this.productBarcodeService
            .getProductBarcodesForSale(this.shopService.currentShop.id)
            .subscribe((r) => {
                this.productBarcodes = r;
                delete this.tabForSaleName;
                delete this.tabForSalePrice;
                this.tabForSaleName = this.filterBy("productCategoryName", r);
                this.tabForSalePrice = this.filterBy("price", r);
                this.changeDetectorRef.detectChanges();
            });
    }
    //catch event click togglePanel
    togglePanel(){
        this.isFirst = !this.isFirst
        localStorage.setItem("isFrist",JSON.stringify(this.isFirst))
    }
    radioChange(e) {
        this.radioCheck = !this.radioCheck;
        localStorage.setItem("radioCheck",JSON.stringify(this.radioCheck))
    }

    applySearchFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    }

    searchProducts(value) {
        value = value.trim(); // Remove whitespace
        value = value.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        if (value) {
            // this.productBarcodeService
            //     .getProductBarcodesForSale(this.shopService.currentShop.id)
            //     .subscribe((result) => {
            //         this.filteredProducts = result.filter(function (hbc) {
            //             return Utilities.searchOnItem(hbc, value);
            //         });
            //         this.changeDetectorRef.detectChanges();
            //     });
            // this.apiService
            //     .getHardProductByShopNotBlocks(this.shopService.currentShop.id)
            //     .subscribe((r) => {
            //         this.filteredProducts = r.filter(function (abc) {
            //             return Utilities.searchOnItem(abc, value);
            //         });
            //         this.changeDetectorRef.detectChanges();
            //     });

            // search local first

            //console.log(this.barcodeService.hardProductBarcodes)
                    let filteredProductsHPB = this.barcodeService.hardProductBarcodes.filter(function (hbc) {
                        return Utilities.searchOnItem(hbc, value, [],['name','productCategoryName']);
                    }) as any;

            // search online

            //console.log(this.barcodeService.hardProductBarcodes)
            let filteredProductsPB = [];
            console.log(value)
            if(this.productBarcodes){

                 filteredProductsPB = this.productBarcodes.filter(function (hbc) {
                    return Utilities.searchOnItem(hbc, value, [],['productCategoryName','barcode']);
                }) as any;
            }
           
            this.filteredProducts = filteredProductsHPB.concat(filteredProductsPB);
            this.changeDetectorRef.detectChanges();
                // search online
            

        } else {
            this.filteredProducts = [];
        }
        this.filteredProducts  = _.sortBy( this.filteredProducts, 'price') as any;
        this.changeDetectorRef.detectChanges();
    }

    onSelectProduct({ option: { value } }) {
        // this.selectedProduct =
        //     value.productCategoryName == undefined
        //         ? value.name + "," + value.price + "đ"
        //         : value.productCategoryName + "," + value.price + "đ";

        // console.log('this.selectedPat',this.selectedProduct);
        delete this.selectedProduct ;
    }

    openInputProduct() {
        this.router.navigateByUrl("/input-product-barcode");
    }

    openInputProductHandmade() {
        this.router.navigateByUrl("/input-product-barcode-handmade");
    }

    // change(){
    //     this.priceBakery = !this.priceBakery
    // }
    scrollTabs(event) {
        const children = this.tabGroup._tabHeader._elementRef.nativeElement
            .children;
        const back = children[0];
        const forward = children[2];
        if (event.deltaY < 0) {
            forward.click();
        } else {
            back.click();
        }
    }

    reverse() {
        this.tabForSalePrice.forEach((e) => {
            e.categoryName.reverse();
        });

        this.tabForSaleName.forEach((item) => {
            item.categoryName.reverse();
        });
    }


    getCategories() {
        this.apiService
            .getProductCategoriesByShop(this.shopService.currentShop.id)
            .subscribe((r) => {
                this.categories = r;
                _.each(this.categories, (c) => {
                    this.apiService
                        .getProductCategoryById(c.id)
                        .subscribe((category) => {
                            c.products = category.products;

                            this.navItem.children.push({
                                displayName: category.name,
                                iconName: "",
                                children: _.sortBy(
                                    category.products.map((p) => {
                                        return {
                                            image: Utilities.replaceImageLink(
                                                p.image,
                                                250,
                                                250
                                            ),
                                            displayName: p.name,
                                            price: p.sellingPrice,
                                            data: p,
                                            clickEvent: (err, res) => {
                                                this.addQuickPrice(
                                                    p.name,
                                                    p.sellingPrice,
                                                    "$"
                                                );
                                                this.quickOrderService.requestIsOrder(
                                                    true
                                                );
                                            },
                                            hoverEvent: (err, res) => {
                                                console.log(res);
                                            },
                                        };
                                    }),
                                    ["price"]
                                ),
                            });
                        });
                });
            });
    }

    filterHardProductBarcodeChanged() {
        localStorage.setItem(
            "filterHardProductBarcode",
            this.filterHardProductBarcode
        );
    }

    processBarcode(barcode, currentPage) {
        this.spinner.show();
        this.apiService
            .getBarcodeTypeByBarcode(
                this.shopService.currentShop.id,
                encodeURIComponent(barcode)
            )
            .subscribe((r) => {
                this.spinner.hide();
                try {
                    switch (r.barcodeType) {
                        //Order
                        case BarcodeType.Order:
                            this.apiService
                                .getOrder(r.data.id)
                                .subscribe((o) => {
                                    console.log(o);
                                    let dialogRef = this.dialog.open(
                                        OrderDetailComponent,
                                        {
                                            panelClass: "col-md-9",
                                            data: {
                                                order: o,
                                            },
                                        }
                                    );
                                });

                            break;

                        //Product
                        case BarcodeType.Product:
                            if (r.data) {
                                if (r.data.isSold) {
                                    currentPage.snotifyService.error(
                                        "Bánh đã được bán!",
                                        ""
                                    );
                                    return;
                                }
                                if (r.data.destroyedBy) {
                                    currentPage.snotifyService.error(
                                        "Bánh đã hủy!",
                                        ""
                                    );
                                    return;
                                }
                                r.data.productCategoryName = this.barcodeService.getCategoryName(
                                    r.data.productCategoryBarcodeId
                                );
                                currentPage.addQuickPrice(
                                    r.data.productCategoryName,
                                    SaleType.Product,
                                    r.data.price,
                                    barcode
                                );
                                currentPage.barcodeService.playAudio("success");
                            } else {
                                //currentPage.processBarcodeWithoutScanned(barcode);
                                currentPage.snotifyService.warning(
                                    "Mã này chưa có trong hệ thống! Vui lòng quét nhập tại phòng bánh.",
                                    ""
                                );
                            }
                            break;

                        //HardProduct
                        case BarcodeType.HardProduct:
                            if (r.data) {
                                currentPage.addQuickPrice(
                                    r.data.name,
                                    SaleType.HardProduct,
                                    r.data.price,
                                    barcode
                                );
                            } else {
                                currentPage.snotifyService.error(
                                    "Mã này không có trong hệ thống!",
                                    ""
                                );
                            }
                            break;

                        //Customer
                        case BarcodeType.Customer:
                            if (!r.data) {
                                this.snotifyService.warning(
                                    "Mã khách hàng chưa được liên kết!",
                                    {
                                        timeout: 10000,
                                        buttons: [
                                            { text: "Đóng" },
                                            {
                                                text: "Liên Kết Nhanh",
                                                action: () => {
                                                    this.dialog.open(
                                                        LinkCustomerComponent,
                                                        {
                                                            data: {
                                                                externalId: barcode,
                                                            },
                                                            panelClass:
                                                                "col-md-9",
                                                        }
                                                    );
                                                },
                                            },
                                        ],
                                    }
                                );
                                return;
                            }
                            this.customerShop = r.data;
                            if (
                                r.data &&
                                r.data.externalId &&
                                !r.data.customer
                            ) {
                                let dialogRefCustomer = this.dialog.open(
                                    LinkCustomerComponent,
                                    {
                                        panelClass: ["col-md-6"],
                                        data: {
                                            externalId: barcode,
                                            customerShop: this.customerShop,
                                        },
                                    }
                                );
                                dialogRefCustomer
                                    .afterClosed()
                                    .subscribe((result) => {
                                        if (result) {
                                            DashboardComponent.customerScanned.emit(
                                                this.customerShop
                                            );
                                        }
                                    });
                            } else if (
                                r.data &&
                                r.data.externalId &&
                                r.data.customer
                            ) {
                                this.snotifyService.success(
                                    `Chào mừng ${this.customerShop.customer.name} quay trở lại`,
                                    {
                                        position: SnotifyPosition.leftBottom,
                                        icon: this.customerShop.customerType
                                            .icon,
                                        timeout: 5000,
                                    }
                                );
                                this.addQuickPrice(
                                    `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`,
                                    SaleType.DiscountPercent,
                                    -this.customerShop.customerType
                                        .discountPercent
                                );
                                DashboardComponent.customerScanned.emit(
                                    this.customerShop
                                );
                            }
                            break;
                    }
                } catch (err) {}
            });
    }

    initPriceChips() {}



    public closeAlert(alert: any) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
    }

    toBytes(text) {
        var arr = [];
        for (var i = 0; i < text.length; i++) {
            arr.push(text[i].charCodeAt(0));
        }
        return arr;
    }

    addQuickPrice(description, type, price, barcode = null, quantity = 1) {
        if (this.isInputCake && barcode.startsWith("C")) {
            var selectedStuff = this.barcodeService.getHardProductBarcodeByBarcode(
                barcode
            );
            console.log("selectedStuff", selectedStuff);
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

    processBarcodeWithoutScanned(barcode) {}

    divMouseDown;

    mousedown(type, pc) {
        var currentPage = this;
        this.divMouseDown = setTimeout(function () {
            var ref = currentPage.snotifyService.confirm(
                "Bạn có chắc chắn muốn xóa giá này?",
                "",
                {
                    buttons: [
                        {
                            text: "Ok",
                            action: () => {
                                if (type == 1) {
                                    currentPage.priceChips4Cake.splice(
                                        currentPage.priceChips4Cake.indexOf(pc),
                                        1
                                    );
                                    localStorage.setItem(
                                        "priceChips4Cake",
                                        JSON.stringify(
                                            currentPage.priceChips4Cake
                                        )
                                    );
                                }
                                if (type == 2) {
                                    currentPage.priceChips4Accessory.splice(
                                        currentPage.priceChips4Accessory.indexOf(
                                            pc
                                        ),
                                        1
                                    );
                                    localStorage.setItem(
                                        "priceChips4Accessory",
                                        JSON.stringify(
                                            currentPage.priceChips4Accessory
                                        )
                                    );
                                }
                                if (type == 3) {
                                    currentPage.priceChips4Discount.splice(
                                        currentPage.priceChips4Discount.indexOf(
                                            pc
                                        ),
                                        1
                                    );
                                    localStorage.setItem(
                                        "priceChips4Discount",
                                        JSON.stringify(
                                            currentPage.priceChips4Discount
                                        )
                                    );
                                }
                                if (type == 4) {
                                    currentPage.priceChips4PercentDiscount.splice(
                                        currentPage.priceChips4PercentDiscount.indexOf(
                                            pc
                                        ),
                                        1
                                    );
                                    localStorage.setItem(
                                        "priceChips4PercentDiscount",
                                        JSON.stringify(
                                            currentPage.priceChips4PercentDiscount
                                        )
                                    );
                                }
                                currentPage.snotifyService.remove(ref.id, true);
                            },
                        },
                        {
                            text: "Cancel",
                            action: () => {
                                currentPage.snotifyService.remove(ref.id, true);
                            },
                        },
                    ],
                }
            );
        }, 3000);
    }

    mouseup() {
        if (this.divMouseDown) {
            clearTimeout(this.divMouseDown);
        }
    }

    addPrice(type) {
        let dialogRef = this.dialog.open(NewEditPriceDialog, {
            width: "600px",
            data: {
                type: type,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result && result.value) {
                this.ngZone.run(() => {
                    if (type == SaleType.Product) {
                        this.priceChips4Cake.push(result);
                        localStorage.setItem(
                            "priceChips4Cake",
                            JSON.stringify(this.priceChips4Cake)
                        );
                    }
                    if (type == SaleType.HardProduct) {
                        this.priceChips4Accessory.push(result);
                        localStorage.setItem(
                            "priceChips4Accessory",
                            JSON.stringify(this.priceChips4Accessory)
                        );
                    }
                    if (type == SaleType.DiscountMoney) {
                        if (result.value >= 0) {
                            result.value = result.value * -1;
                            // alert("Khuyến mãi cần là số âm !")
                            // return;
                        }
                        this.priceChips4Discount.push(result);
                        localStorage.setItem(
                            "priceChips4Discount",
                            JSON.stringify(this.priceChips4Discount)
                        );
                    }
                    if (type == SaleType.DiscountPercent) {
                        if (result.value >= 0) {
                            result.value = result.value * -1;
                            // alert("Khuyến mãi cần là số âm !")
                            // return;
                        }
                        this.priceChips4PercentDiscount.push(result);
                        localStorage.setItem(
                            "priceChips4PercentDiscount",
                            JSON.stringify(this.priceChips4PercentDiscount)
                        );
                    }
                    this.changeDetectorRef.detectChanges();
                });
            }
        });
    }

    openSellCakeSettings(): void {
        this.bottomSheet.open(SellCakeSettingsComponent, {
            data: {},
        });
    }

    openBottomSheet(): void {
        this.bottomSheet.open(ShowHideLabelSheet, {
            data: {},
        });
    }

    addListenProductBarcodeSetShift(){
        this.mbSignalRService.joinRoom(`productBarcode/${this.shopService.currentShop.id}`).then(r =>{
            this.mbSignalRService.listenEvent('productBarcodeComing',(shift:any) => {
              DashboardComponent.watchProductShift.emit()
            })
        })
    }


    showTab(tab){
        this.curentTab = tab.tabCode;
        localStorage.setItem("curentTab", tab.tabCode)
    }

    keyWordPressedChanged(w){

        setTimeout(() => {
            this.searchProducts(this.searchsCtrl.value);
            this.autoComplete.openPanel();
            this.autoComplete.position = "below"
            this.autoComplete.updatePosition();
    }, 201)
    }
}

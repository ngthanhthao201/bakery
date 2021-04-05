import { ExpenseDialog } from './../../../shared/dialogs/expense-dialog.component';
import { OtherExpenseDialog } from "../../../shared/dialogs/other-expense-dialog.component";
import { PrintService } from './../../../shared/services/print.service';
import { MaterialService } from './../../../shared/services/material.service';
import { ExpenseTransaction } from './../../../shared/models/expense-transaction.model';
import { ExpenseHeader } from './../../../shared/models/expense-header.model';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { OrderService } from '../../orders/services/order.service';
import { ApiService } from '../../../shared/services/api.service';
import { ShopService } from '../../../shared/services/shop.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { RemoteSupportComponent } from '../remote-support/remote-support.component';
import { MemberService } from '../../../shared/services/member.service';
import { OrderDetailComponent } from '../../../shared/modules/order-detail/components/order-detail/order-detail.component';
import * as _ from 'lodash';
import { NoticeDialog } from '../../../shared/dialogs/notice-dialog.component'
import { OnlineOfflineService } from '../../../shared/services/offline.service';
import { InputProductDialogComponent } from '../../product-barcode/components/input-product-dialog/input-product-dialog.component';
import * as moment from 'moment';
import { filter } from 'rxjs/operators';
import { BarcodeService } from '../../../shared/services/barcode.service';
import { RemoveProductBarcodeDialog } from '../../product-barcode/components/remove-product-barcode/remove-product-barcode.component';
import { SnotifyService, SnotifyPosition } from 'ng-snotify';
import { AddStuffDialogComponent } from '../../stuff-barcode/add-stuff-dialog/add-stuff-dialog.component';
import { Shift } from '../../../shared/models/shift.model';
import { MbSignalRService } from '../../../shared/services/mbSignalR.service';
import { LayoutComponent } from '../../layout.component';
import { QzTrayService } from '../../../shared/services/qz-tray.service';
import { ConnectPrintersComponent } from '../../../shared/dialogs/connect-printers/connect-printers.component';
import { AuthService } from '../../../shared/services/auth.service';
import { AutoFindConnectPrinter } from '../../../shared/dialogs/auto-find-connect-printer/auto-find-connect-printer.component';
import { LinkCustomerComponent } from '../../orders-timeline/link-customer/link-customer.component';
import { CustomerSearchResult } from '../../../shared/models/customer-search-result.model';
import { CustomerShop } from '../../../shared/models/customer-shop.model';
import { Customer } from '../../../shared/models/customer.model';
import { NotificationsService } from '../../../shared/services/notifications.service';
import { NotificationDialogComponent } from './notification-dialog/notification-dialog.component';
import { OrderStatus } from '../../../shared/models/order-status.enum';
import { Order } from '../../../shared/models/order.model';
import { debounceTime, startWith , distinctUntilChanged, switchMap} from 'rxjs/operators';
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent {
  toggleClass = "ft-maximize";
  public isCollapsed = true;
  searchOrderCtrl: FormControl;
  filteredOrders: Observable<any[]>;
  ordersToday = [];
  shops = [];
  today = moment(new Date());
  trialDays = 0;
  currentShop: any;
  now = new Date();


  dashboardOrder: any = {};
  dashboardOrderIsLoading: boolean;
   dashboardProd: any = {};
   dashboardProdIsLoading: boolean;
  dashboardHardProd: any = {};
  dashboardHardProdIsLoading: boolean;

  activeShift: Shift;
  connectedPrinter: string = "";
  printers = [];

  public extendCollapsed = true;

  isTurnOn: boolean;
  // public static isTurn: EventEmitter<any> = new EventEmitter<any>();
  @Output() isTurnChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('ordersAutoCompleteInput', { read: MatAutocompleteTrigger, static: false }) autoComplete: MatAutocompleteTrigger;

  constructor(private orderService: OrderService, private translate: TranslateService,
    public onlineOfflineService: OnlineOfflineService, private snotifyService: SnotifyService,
    private router: Router, private dialog: MatDialog, private apiService: ApiService,
    public barcodeService: BarcodeService, private mbSignalRService: MbSignalRService,
    private qzService: QzTrayService, private notificationsService: NotificationsService,
    public shopService: ShopService, public memberService: MemberService, private service: AuthService,
    public printService: PrintService, private materialService: MaterialService ) {
    //this.getActiveOrdersToday();
    this.translate.addLangs(['en', 'vi','tbn','fashion']);
    this.translate.setDefaultLang('tbn');
    this.orderService.ordersChanged.subscribe(r => {
      //this.getActiveOrdersToday();

    })

    this.getShops();
    this.connectedPrinter = localStorage.getItem("connectedPrinter");
    this.qzService.getPrinters().subscribe(r => {
      this.printers = r;

      //case 2 check here Case: Does not select properly printer
      // if(connectedPrinter){
      //   //case 3
      // }



    }, err => {

      this.dialog.open(AutoFindConnectPrinter, {
        data: {
          errorCode: 1
        }
      })

      console.log(err)
    })
    

    this.searchOrderCtrl = new FormControl();

    try{
    this.filteredOrders = this.searchOrderCtrl.valueChanges.pipe(
      startWith(),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterOrder(val || '')
      })
    );
    }catch{}

    this.currentShop = this.shopService.currentShop;
    var trialDate = moment(this.currentShop.trialDate)
    this.trialDays = trialDate.diff(this.today, 'days')

    this.getNotiCategories();
    this.getNotiArticles();

  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!this.extendCollapsed) {
        this.toggleExtend()
      }
    });
    LayoutComponent.setShiftEvent.subscribe(r => {
      if (!this.extendCollapsed) {
        this.toggleExtend()
      }
      this.getActiveShift();
    })
    this.getActiveShift();

    if (localStorage.getItem('isTurnOnQR'))
      this.isTurnOn = true;
  }


  getActiveShift() {
    this.apiService.getActiveShift(this.shopService.currentShop.id).subscribe(r => {
      this.activeShift = r;
    })
  }

  getShops() {
    this.apiService.getShopsByMemberId(this.memberService.currentMember.id).subscribe(r => {
      this.shops = r;
      //console.log(' this.shops', this.shops)
      if(this.shopService.currentShop.id){
        this.shopService.currentShop = _.find(this.shops, {id: this.shopService.currentShop.id});
      }
      

    });

  }

  filterOrder(val: string) {
    if (!val) return Observable.of([]);
    try {
      val = val.toLowerCase();
    }
    catch (ex) {
      return Observable.empty();
    }

    return this.apiService.shopSearch(this.shopService.currentShop.id, val).map(response => response.filter(option => {

      // return (option.idNumber && option.idNumber.toLowerCase().indexOf(val) >= 0)
      //   || (option.comments && option.comments.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val) >= 0)
      //   || (option.customer && option.customer.phoneNumber.indexOf(val) >= 0)
      //   || (option.order && option.order.idNumber.toLowerCase().indexOf(val) >= 0)
      //   ;
      if (option.order) {
        this.apiService.getOrder(option.order.id).subscribe(r => {
          option.order = r;
          if (option.order.comments && option.order.comments != '{}') {
            var obj = JSON.parse(option.order.comments);
            option.order.comments = obj.note;
          }
          option.order.deliveryPickupTime = moment(option.order.deliveryPickupTime).toDate();
        })

        return (option.order && option.order.idNumber.toLowerCase().indexOf(val) >= 0)
          || (option.order.comments && option.order.comments.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").indexOf(val) >= 0)
          ;
      }
      return (option.customer)
        || (option.materialProvider)
        || (option.voucher)
        || (option.product)

    }));

  }


  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    //this.getOrderCount(event.option.value.id);
    if (event.option.value.order) {
      console.log(event.option.value.order);
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: event.option.value.order
        }
      });

      this.searchOrderCtrl.reset();

      dialogRef.afterClosed().subscribe(result => {
        if (result) {

        }
        this.searchOrderCtrl.markAsDirty();
      });
    }

  }

  getActiveOrdersToday() {
    // if (!this.shopService.currentShop) return;
    // this.apiService.getActiveOrdersToday(this.shopService.currentShop.id).subscribe(r => {
    //   this.ordersToday = _.sortBy(r, ['status', 'deliveryPickupTime']);
    // })
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else this.toggleClass = "ft-maximize";
  }

  selectShop(s) {
    this.shopService.currentShop = s;
    window.location.reload();
  }

  logout() {
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('currentMember');
    localStorage.removeItem('currentShop');
    localStorage.removeItem('accessToken');
    this.openLoginDialog();
  }


  openSupportDialog() {
    this.dialog.open(RemoteSupportComponent, {
      panelClass: 'col-md-7'
    })
  }

  openLoginDialog() {
    this.router.navigateByUrl("/login");
  }

  openNoticeDialog() {
    let dialogRef = this.dialog.open(NoticeDialog, {
      panelClass: 'col-md-6',
      data: {
        htmlString: `<div  class="row">
              <img class="col-md-4" src="https://www.upsieutoc.com/images/2019/01/03/unnamed.png">

              <div class="col-md-8 badge-info">

              Dữ liệu phần mềm quản lý tiệm bánh ngon sẽ tự động cập nhật số điện thoại của thành viên và khách hàng từ 11 số qua 10 số mới vào lúc 23h ngày 4/1
              <br>
              <br>
              Cụ thể, với nhà mạng Viettel: Các đầu số 0162, 0163, 0164,0165, 0166, 0167, 0168, 0169 sẽ chuyển thành 032, 033, 034, 035, 036, 037, 038, 039.

              Với nhà mạng Vinaphone: Các đầu số 0123, 0124, 0125, 0127, 0129 sẽ chuyển thành 083, 084, 085, 081, 082.

              Với nhà mạng MobiFone: Các đầu số 0120, 0121, 0122, 0126, 0128 sẽ chuyển thành 070, 079, 077, 076, 078.

              Với nhà mạng Vietnamobile: Các đầu số số 0188, 0186 sẽ chuyển thành 056, 058.

              Với nhà mạng Gtel: Đầu số 0199 sẽ chuyển thành 059.
              </div>

                </div>`
      }
    })


  }

  openOfflineDialog() {
    let dialogRef = this.dialog.open(NoticeDialog, {
      panelClass: 'col-md-6',
      data: {
        htmlString: `
        <div  class="row">
              <div class="col-md-12">

                Bạn đang trong chế độ ngoại tuyến, vui lòng kiểm tra kết nối mạng.
                <br>
                Đừng lo, bạn vẫn có thể tạo giao dịch và sẽ được đồng bộ ngay khi có mạng trở lại.
              </div>

        </div>`
      }
    })


  }

  openInputProduct() {
    this.router.navigateByUrl("/input-product-barcode");
  }

  inputProductHandmade(){
      this.router.navigateByUrl("/input-product-barcode-handmade");
  }

  getStatsProd() {
    // this.dashboardProdIsLoading = true;
    // this.apiService.getDashboardProduct(this.shopService.currentShop.id).subscribe(r => {
    //   this.dashboardProd = r;
    //   this.dashboardProdIsLoading = false;
    // })
  }

  getStatsHardProd() {
    this.dashboardHardProdIsLoading = true;
    this.apiService.getDashboardHardProduct(this.shopService.currentShop.id).subscribe(r => {
      this.dashboardHardProd = r;
      this.dashboardHardProdIsLoading = false;
    })
  }

  getStatsOrder() {
    this.dashboardOrderIsLoading = true;
    this.apiService.getDashboardOrder(this.shopService.currentShop.id).subscribe(r => {
      this.dashboardOrder = r;
      this.dashboardOrderIsLoading = false;
    })
  }

  toggleExtend() {
    var _this = this;

    if (_this.extendCollapsed) {
      this.getStatsProd();
      this.getStatsOrder();
      this.getStatsHardProd();
    }

    $('#extend-content').slideToggle(500, function () {
      _this.extendCollapsed = !($('#extend-content').is(':visible') as boolean)
    });
  }

  //remove product
  removeBC(bc) {
    if (!this.memberService.hasPermission("shop.setting")) {
      this.snotifyService.error('Bạn không có quyền xóa!', '');
      return;
    }

    let dialogRef = this.dialog.open(RemoveProductBarcodeDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        productBarcode: bc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getStatsProd();
      }

    });
  }

  openOrderDetail(orderId) {
    this.apiService.getOrder(orderId).subscribe(r => {
      console.log(r)
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: r,
        }
      });
    })
  }

  refresh(){
    this.getStatsOrder();
    this.getStatsHardProd();
  }

  changeToNextShift() {
    var negativeCount = _.find(this.dashboardHardProd.emptingHardProducts, stuff => {
      return stuff.count < 0;
    });
    if (negativeCount) {
      this.snotifyService.error("Có sản phẩm với số lượng âm", "");
      return false;
    }

    var ordersNotDoneInShift = _.filter(this.dashboardOrder.deliveringOrders,(o: Order) => {
      return o.status != OrderStatus.Done && moment(o.deliveryPickupTime ).isBefore(moment())
    });

    if (ordersNotDoneInShift.length > 0) {
      this.snotifyService.error("Có đơn trong ca cần xử lý", "");

      _.each(ordersNotDoneInShift, o=>{

        ($("#"+ o.idNumber) as any).effect("highlight", {}, 3000);

      })




     //

      return false;
    }

    // this.dialog.open(NextShiftConfirmComponent, {
    //   panelClass: 'col-md-12',
    //   data:{

    //   }
    // })

    this.snotifyService.confirm(
      "Bạn có chắc chắn muốn chuyển ca tiếp theo?",
      "",
      {
        position: SnotifyPosition.leftBottom,
        buttons: [
          {
            text: "Chuyển",
            action: () => {
              this.apiService
                .setActiveShift(
                  this.shopService.currentShop.id,
                  this.activeShift.orderIndex + 1
                )
                .subscribe(() => {
                  this.dialog.closeAll();
                  this.snotifyService.success(
                    "Đổi ca thành công",
                    ""
                  );
                }, err => {
                  console.log(err);
                  this.snotifyService.error(
                    err._body,
                    ""
                  );
                });
              this.snotifyService.clear();
            }
          },
          {
            text: "Hủy",
            action: () => {
              this.snotifyService.clear();
            }
          }
        ]
      }
    );
  }

  openAddHardBlock(hardProductBarcode) {
    hardProductBarcode.total = hardProductBarcode.count;
    let dialogRef = this.dialog.open(AddStuffDialogComponent, {
      width: "300px",
      data: {
        hardProduct: hardProductBarcode
      }
    });
    dialogRef.afterClosed().subscribe(result => {

      this.getStatsHardProd();


    });
  }

  openPrinterSelection() {
    let dialogRef = this.dialog.open(ConnectPrintersComponent, {
      panelClass: "col-md-9",
      data: {
        printers: this.printers
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.connectedPrinter = result;
        localStorage.setItem('qz-tray', 'true')
        localStorage.setItem('connectedPrinter', result);
      }

    });
  }

  isChanged() {
    if (this.isTurnOn) {
      localStorage.setItem('isTurnOnQR', this.isTurnOn.toString());
      this.isTurnChanged.emit(true);
    } else {
      localStorage.removeItem('isTurnOnQR');
      this.isTurnChanged.emit(false);
    }
    window.location.reload();
  }

  numberPressedChanged() {
    setTimeout(() => {
      this.autoComplete.openPanel();
      this.autoComplete.position = "below"
      this.autoComplete.updatePosition();
    }, 201)

  }

  openLinkCustomer() {
    let dialogRef = this.dialog.open(LinkCustomerComponent, {
      panelClass: ["col-md-7"],
      data: {
        customerShop: new CustomerShop(),
        customer: null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getCustomerShop(result.customerId);
      }
    });
  }

  getCustomerShop(customerId = null, customerSearchResult: CustomerSearchResult = null) {
    // if (customerId) {
    //   this.apiService.getCustomerShop(customerId, this.shopService.currentShop.id).subscribe(r => {
    //     this.customerShop = r;
    //     if (this.customerShop.externalId) {
    //       ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`, SaleType.DiscountPercent, -this.customerShop.customerType.discountPercent);
    //     }
    //   });
    // }
    // if (customerSearchResult) {
    //   this.customerShop = ModelHelper.toCustomerShop(customerSearchResult);
    //   if (this.newOrder && this.newOrder.id && this.isHaveDiscount) {
    //     return;
    //   }
    //   if (this.customerShop.externalId) {
    //     ModelHelper.addQuickPrice(this.quickOrderService, this.snotifyService, `Khuyến mãi VIP (${this.customerShop.customerType.discountPercent}%)`, SaleType.DiscountPercent, -this.customerShop.customerType.discountPercent);
    //   }
    // }
    // $('.numpad-container').hide();
  }

  articles: any;
  categories: any;
  notifications: any;

  getNotiCategories() {
    this.notificationsService.getNotificationCategories().subscribe(r => {
      this.categories = _.sortBy(r, 'title');
      console.log(this.categories);
    })
  }

  getNotiArticles() {
    this.notificationsService.getNotificationArticles().subscribe(r => {
      this.articles = _.groupBy(r, 'category.title');
      if (this.articles["Chức Năng Mới"]) {
        this.notifications = this.articles["Chức Năng Mới"];
        console.log(this.notifications);
      }
    });
  }

  openNotiDialog(notification) {
    let dialogRef = this.dialog.open(NotificationDialogComponent, {
      panelClass: 'col-md-8',
      data: {
        notification: notification,
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openNewExpense() {
    var newExpenseHeader = new ExpenseHeader(
        this.shopService.currentShop.id
    );
    newExpenseHeader.expenseTransactions = [
        new ExpenseTransaction(newExpenseHeader.shopId),
    ];
    let dialogRef = this.dialog.open(ExpenseDialog, {
        panelClass: ["col-md-8", "col-sx-12"],
        data: {
            expenseHeader: newExpenseHeader,
            materialProviders: this.materialService.materialProviders,
        },
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
           
        }
    });
}

openNewOtherExpense() {
    var newExpenseHeader = new ExpenseHeader(
        this.shopService.currentShop.id
    );
    newExpenseHeader.expenseTransactions = [
        new ExpenseTransaction(newExpenseHeader.shopId),
    ];
    let dialogRef = this.dialog.open(OtherExpenseDialog, {
        panelClass: ["col-md-8", "col-sx-12"],
        data: {
            expenseHeader: newExpenseHeader,
            materialProviders: this.materialService.materialProviders,
        },
    });

}

}

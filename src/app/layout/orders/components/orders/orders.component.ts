import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Order } from '../../../../shared/models/order.model';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Review } from '../../../../shared/models/review.model';
import { ClipboardService } from 'ngx-clipboard';
import { Utilities } from '../../../../shared/services/utilities';
import { SnotifyService } from 'ng-snotify';
import { ShopService } from '../../../../shared/services/shop.service';
import * as _ from 'lodash';
import * as moment from "moment";
import { Subject } from 'rxjs';
import { OrderDetailComponent } from '../../../../shared/modules/order-detail/components/order-detail/order-detail.component';
import { NgxDatatableResizer } from '../../../../shared/models/Ngx-datatable-resizer';
import { TableResize2 } from '../../../../shared/models/table-resize2';


@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [routerTransition()]
})
export class OrdersComponent implements OnInit {
  loadingIndicator: boolean;
  columns = [
    { prop: 'id' },
    { name: 'image' },
    { name: 'name' }
  ];

  public tableIdNameResizer: TableResize2 = new TableResize2('orders-table-id',
    [
      new NgxDatatableResizer('member', 0.15),
      new NgxDatatableResizer('customer', 0.15),

      new NgxDatatableResizer('delivery', 0.2),
      new NgxDatatableResizer('info', 0.45),
      new NgxDatatableResizer('money', 0.15),
      new NgxDatatableResizer('action', 0.05),
    ]);

  currentShop: any = {};

  waitingOrders: Order[];
  searchOrderText: string;
  now = new Date();
  nowName = moment(this.now).format('dddd')
  dayNames = [];
  dayNamesVN = { "Monday": "Thứ Hai", "Tuesday": "Thứ Ba", "Wednesday": "Thứ Tư", "Thursday": "Thứ Năm", "Friday": "Thứ Sáu", "Saturday": "Thứ Bảy", "Sunday": "Chủ Nhật" }
  groupedByDay = {};
  week: any = {
    startWeek: new Date(),
    endWeek: new Date()
  };

  // dataSource = new MatTableDataSource<Order>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private subject: Subject<string> = new Subject();

  constructor(private shopService: ShopService, private apiService: ApiService, private dialog: MatDialog,
    public orderService: OrderService, private router: Router, private snotifyService: SnotifyService) {

  }

  ngOnInit() {

    // this.subject.debounceTime(500).subscribe(searchTextValue => {
    //   this.applyFilter(searchTextValue);
    // });

    this.changeWeek(0);

    this.orderService.ordersChanged.subscribe(r => {
      this.getOrdersByWeek();
    })

    this.setDayCollapsed();

  }

  // applyFilter(filterValue: string) {
  //   if(!filterValue){
  //       this.waitingOrders = _.orderBy( this.orderService.waitingOrders, ['deliveryPickupTime']);
  //       return;
  //   }
  //   filterValue = filterValue.trim(); // Remove whitespace
  //   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

  //   const temp = this.orderService.waitingOrders.filter(function(hbc) {
  //     return Utilities.searchOnItem(hbc, filterValue);
  //   });

  //   this.waitingOrders = temp;
  // }

  onKeyUp(searchTextValue: string) {
    this.subject.next(searchTextValue);
  }

  getOrdersByWeek() {
    this.apiService.getOrdersByWeek(this.shopService.currentShop.id, this.week.startWeek, this.week.endWeek).subscribe(r => {
      // r = _.sortBy(r, ['status', 'deliveryPickupTime']);
     
      let orderStatus = r.filter(i => i.status == 2);
      r = _.sortBy(r.filter(e => e.status !== 2),
        [function(o) { return !o.isUrgent; }]
      ).concat(orderStatus)
      this.groupedByDay = {};
      _.each(r, o => {
        if (!this.groupedByDay[moment(o.deliveryPickupTime).format('dddd')]) {
          this.groupedByDay[moment(o.deliveryPickupTime).format('dddd')] = [o];
        } else {
          this.groupedByDay[moment(o.deliveryPickupTime).format('dddd')].push(o);
        }
      })
    });

  }

  // updateCakeStatus(orderCakeStatus) {
  //   this.orderService.updateCakeStatus(orderCakeStatus).subscribe(r => {
  //     this.snotifyService.success("Cập nhật thành công", "");
  //     console.log(orderCakeStatus);
  //   });
  // }

  async onActivate(event) {
    if (event.type === 'click') {
       var order = await this.apiService.getOrder(event.row.id).toPromise()
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-9',
        data: {
          order: order
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) { }
      });
      console.log(event);
    }
  }

  // copyLinkReview(order) {

  //   if (!order.review) {
  //     //create review first
  //     var newReview = new Review();
  //     newReview.shopId = this.currentShop.id;
  //     newReview.orderId = order.id;

  //     this.apiService.createReview(newReview).subscribe(r => {
  //       order.review = r;
  //       var link = Utilities.getReviewUrl(order.review);
  //       this.clipboardService.copyFromContent(link);
  //       this.snotifyService.success("Đã Copy Link Review", "");
  //     })
  //   } else {
  //     var link = Utilities.getReviewUrl(order.review);
  //     this.clipboardService.copyFromContent(link);
  //     this.snotifyService.success("Đã Copy Link Review", "");
  //   }
  // }

  changeWeek(nextOrPrevious) {
    var temp = parseInt(nextOrPrevious);
    if (temp == 0) //current-week
    {
      this.week.startWeek = moment(this.now).startOf("isoWeek").toDate();
      this.week.endWeek = moment(this.now).endOf("isoWeek").toDate();
    }
    else // nextOrPrevious-weekt
    {
      this.week.startWeek = moment(this.week.startWeek).startOf("isoWeek").add(7 * temp, 'days').toDate();
      this.week.endWeek = moment(this.week.startWeek).endOf("isoWeek").add(7, "hours").toDate();
    }

    this.dayNames = [
      { name: 'Monday', nameVN: 'T2', isCollapsed: false, date: moment(this.week.startWeek).toDate() },
      { name: 'Tuesday', nameVN: 'T3', isCollapsed: false, date: moment(this.week.startWeek).add(1, 'day').toDate() },
      { name: 'Wednesday', nameVN: 'T4', isCollapsed: false, date: moment(this.week.startWeek).add(2, 'days').toDate() },
      { name: 'Thursday', nameVN: 'T5', isCollapsed: false, date: moment(this.week.startWeek).add(3, 'days').toDate() },
      { name: 'Friday', nameVN: 'T6', isCollapsed: false, date: moment(this.week.startWeek).add(4, 'days').toDate() },
      { name: 'Saturday', nameVN: 'T7', isCollapsed: false, date: moment(this.week.startWeek).add(5, 'days').toDate() },
      { name: 'Sunday', nameVN: 'CN', isCollapsed: false, date: moment(this.week.startWeek).add(6, 'days').toDate() }
    ];

    this.getOrdersByWeek();
  }

  private setDayCollapsed() {
    const now = moment();
    const nowDayName = moment(now).format('dddd');
    const nowDayNameIndex = _.findIndex(this.dayNames, { name: nowDayName });
    this.dayNames.forEach((element, index) => {
      if (index < nowDayNameIndex) {
        element.isCollapsed = true;
      }
    });
  }

  openOrderDetail(order) {
    this.apiService.getOrder(order.id).subscribe(r => {
      console.log('rorder',r)
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: r
        }
      });
    });
  }


}

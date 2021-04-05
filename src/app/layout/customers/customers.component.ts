import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from '../../shared/models/customer.model';
import { NewEditCustomerDialog } from '../../shared/dialogs/new-edit-customer.component';
import { ShopService } from '../../shared/services/shop.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Utilities } from '../../shared/services/utilities';
import { Router } from '@angular/router';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

import { FormControl } from '../../../../node_modules/@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { from } from 'rxjs';
import { CustomerShop } from '../../shared/models/customer-shop.model';
import { CustomerService } from '../../shared/services/customer.service';
import { CandidateCustomer } from '../../shared/models/candidate-customer.model';
import { OrderDetailComponent } from '../../shared/modules/order-detail/components/order-detail/order-detail.component';
import { MemberService } from '../../shared/services/member.service';
import { debounceTime, startWith , distinctUntilChanged, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  animations: [routerTransition()]
})
export class CustomersComponent implements OnInit {

  statistics: any = {};
  //customer chart
  public lineChartData: Array<any> = [
    { data: [], label: 'Khách hàng mới' },
    { data: [], label: 'Khách hàng cũ quay lại' }
  ];

  candidateOrders: CandidateCustomer[] = [];
  candidateIncomeHeaders: CandidateCustomer[] = [];

  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: false,
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItem, data) {

          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return datasetLabel + ': ' + value;
        }
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function (label, index, labels) {
              return label;
            }
          },
        }
      ]
    }

  };
  public lineChartColors: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(57,178,238,0.2)',
      borderColor: 'rgba(57,178,238,1)',
      pointBackgroundColor: 'rgba(57,178,238,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(57,178,238,0.8)'
    },
    {
    lineTension: 0,
    fill: false,
    borderColor: "#5ADF0E",
    pointBorderColor: "#5ADF0E",
    pointBackgroundColor: "#FFF",
    pointBorderWidth: 2,
    pointHoverBorderWidth: 2,
    pointRadius: 4,
    }
  ];

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public monthsObject: any;
  public weeksObject: any;

  columns = [
    { prop: 'id' },
    { name: 'image' },
    { name: 'name' }
  ];
  // displayedColumns = [ 'id','image', 'name'];
  customerShops: CustomerShop[] =[];
  // dataSource = new MatTableDataSource<Customer>();

   filteredCustomers: Observable<any[]> = from([]);
   filteredCustomersRows: CustomerShop[] =[];
  searchCtrl: FormControl;

  @ViewChild(MatPaginator,{static: true}) paginator: MatPaginator;
  @ViewChild(MatSort,{static: true}) sort: MatSort;

  constructor(public shopService: ShopService, private apiService: ApiService, public dialog: MatDialog,
    private customerService: CustomerService, private memberService: MemberService
    ) {
    this.searchCtrl = new FormControl();
    try{
  this.filteredCustomers =  this.searchCtrl.valueChanges.pipe(
      startWith(),
      debounceTime(200),
      distinctUntilChanged(),

      switchMap(val => {
        return this.filterCustomer(val || '')
      })
      )
      
      ;

      this.filteredCustomers.subscribe(r=>{
        this.filteredCustomersRows = r;
      })
    }catch{}
  }

  ngOnInit() {
    this.shopService.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    if (this.shopService.currentShop.id) {
      this.getCustomersByShop();
      this.getStatistics();

      this.monthsObject = Utilities.getPreviousMonths(14);
      this.lineChartLabels = this.monthsObject.monthsAsString;
      console.log('this.lineChartLabels',this.lineChartLabels)
      console.log('this.monthsObject',this.monthsObject)
      this.initChart();
      this.searchCandidateOrders();
      this.searchCandidateIncomes();
    }
    //this.paginator.pageSize = 20;

    this.searchCtrl.get('searchCustomers').valueChanges.subscribe(r=>console.log(r))
  }

  searchCandidateOrders():void{
    this.customerService.searchCandidateOrders(this.shopService.currentShop.id).subscribe(r => {
      r=  _.filter(r,c=>{
        return c.phoneNumber.length >1
      })
      this.candidateOrders = r;
    });
  }

  searchCandidateIncomes():void{
    this.customerService.searchCandidateIncomes(this.shopService.currentShop.id).subscribe(r => {
      console.log(r)
      this.candidateIncomeHeaders = r;
    });
  }

  getCustomersByShop(): void {
    this.apiService.filterCustomerShops(this.shopService.currentShop.id, {}).subscribe(r => {
      this.customerShops = r;
      this.filteredCustomersRows = r;
    });
  }

  initChart() {
    var monthsParamsArray = _.map(this.monthsObject.months, function (o: moment.Moment) {
      // console.log('this.monthObject.months', this.monthsObject.months)
      console.log('monthsParamsArray',monthsParamsArray)
      return {
        start: Date.parse(o.startOf('month').toDate().toString()),
        end: Date.parse(o.endOf('month').toDate().toString()),
      }
     
    });

    this.apiService.getCustomerMonthsStats(this.shopService.currentShop.id, monthsParamsArray).subscribe(r => {
      console.log('rsd',r)
      console.log('this.shopService.currentShop.id',this.shopService.currentShop.id);
      console.log('monthsParamsArray',monthsParamsArray    )
      this.lineChartData = [
        { data: _.map(r, 'count'), label: 'Khách hàng mới' },
        { data: _.map(r, 'cameBack'), label: 'Khách hàng cũ quay lại' },
      ];

    });

  }

  getStatistics() {
    this.apiService.getCustomerStats(this.shopService.currentShop.id).subscribe(r => {
      this.statistics = r;
    })
  }

  openDialog4Update(currentCustomer) {
    if(!currentCustomer.customerShops){
      currentCustomer.customerShops = [{shopId: this.shopService.currentShop.id, externalId: currentCustomer.externalId}]
    }
    let dialogRef = this.dialog.open(NewEditCustomerDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        currentCustomer: currentCustomer,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateCustomer(result).subscribe(r => {

        })
      }
    });
  }

  openCustomerDetailDialog(currentCustomer) {
    let dialogRef = this.dialog.open(CustomerDetailComponent, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        currentCustomer: currentCustomer,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  createNewCustomer(){
    let dialogRef = this.dialog.open(NewEditCustomerDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        currentCustomer: {
          customerShops: [{shopId: this.shopService.currentShop.id}]
        },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.createCustomer(result).subscribe(r=>{

        })
      }
    });
  }

  filterCustomer(val: string) {
    if (!val || val.length < 1) {
      //return from<Customer>(this.customers);
      this.filteredCustomersRows = _.cloneDeep(this.customerShops);
      return;
    }
    return this.apiService.filterCustomerShops(this.shopService.currentShop.id, {query: val.toLowerCase()}).map(response => response.filter(r => {
        return r
    }));
    
  }

  filterCustomersByType($event){
    console.log($event)
    var type = parseInt($event.value)
    switch(type){
      case 0 :
          this.apiService.filterCustomerShops(this.shopService.currentShop.id, {}).subscribe(r=>{
            this.filteredCustomersRows = r;
          })
          break;
        case 1 :
            this.apiService.filterCustomerShops(this.shopService.currentShop.id, {isVip: true}).subscribe(r=>{
              this.filteredCustomersRows = r;
            })
            break;
        case 2 :
            this.apiService.filterCustomerShops(this.shopService.currentShop.id, {isNormal: true}).subscribe(r=>{
              this.filteredCustomersRows = r;
            })
            break;
        case 3 :
              this.apiService.filterCustomerShops(this.shopService.currentShop.id, {isCheckin: true}).subscribe(r=>{
                this.filteredCustomersRows = r;
              })
              break;
    }

  }


  viewOrder(orderId){
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

  viewIncome(incomeHeaderId){
    
  }

  callToggled(e, co){

    if(e.target.checked){
      if(!co.customerCandidateAudit){
        co.customerCandidateAudit = {
        customerId: co.id,
        isPhoneCalled: true,
        phoneCalledTime: new Date(),
        phoneCalledMemberId: this.memberService.currentMember.id,
        orderId: co.candidateOrder.id
      }
    }else{
        co.customerCandidateAudit.isPhoneCalled = true;
        co.customerCandidateAudit.phoneCalledTime = new Date();
        co.customerCandidateAudit.phoneCalledMemberId = this.memberService.currentMember.id;
      }

      
    }

    this.customerService.saveCustomerCandidateAudit(co.customerCandidateAudit).subscribe(r=>{
      co.customerCandidateAudit.id = r;
    })
  }

  smsToggled(e, co){

    if(e.target.checked){
      if(!co.customerCandidateAudit){
        co.customerCandidateAudit = {
        customerId: co.id,
        isMessageSent: true,
        messageSentTime: new Date(),
        messageSentMemberId: this.memberService.currentMember.id,
        orderId: co.candidateOrder.id
      }
    }else{
        co.customerCandidateAudit.isMessageSent = true;
        co.customerCandidateAudit.messageSentTime = new Date();
        co.customerCandidateAudit.messageSentMemberId = this.memberService.currentMember.id;
      }
    }

    this.customerService.saveCustomerCandidateAudit(co.customerCandidateAudit).subscribe(r=>{
      co.customerCandidateAudit.id = r;
    })
  }

}

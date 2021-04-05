import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../shared/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDialog } from '../../shared/dialogs/order-dialog.component';
import { IncomeDialog } from '../../shared/dialogs/income-dialog.component';
import localeVI from '@angular/common/locales/vi'
import { IncomeTransaction } from '../../shared/models/IncomeTransaction';
import { IDropdownItem } from '../../shared/models/DropdownItem';
import * as moment from 'moment';

import { ExpenseTransaction } from '../../shared/models/expense-transaction.model';
import { ExpenseDialog } from '../../shared/dialogs/expense-dialog.component';
import { ExpenseHeader } from '../../shared/models/expense-header.model';
import { IncomeHeader } from '../../shared/models/income-header.model';
import { MaterialProvider } from '../../shared/models/material-provider.model';
import * as _ from 'lodash';
import { SnotifyService } from 'ng-snotify'; 
import { TranslateService } from '@ngx-translate/core';
import { CurrencyFormatPipe } from '../../shared/pipes/currencyformat.pipe';
import { Utilities } from '../../shared/services/utilities';
import { Shop } from '../../shared/models/shop.model';
import { TransactionsDetailDialog } from './dialogs/transactions-detail.component';
import { ExpenseTransactionsDetailDialog } from './dialogs/expense-transactions-detail.component';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { JwtHelper } from '../../shared/services/jwt-helper';
import { Router } from '@angular/router';
import { IncomeDayDetailDialog } from './dialogs/income-day-detail.component';
import { MaterialService } from '../../shared/services/material.service';
import { MemberService } from '../../shared/services/member.service';
import { HeadersDetailDialog } from './dialogs/headers-detail.component';
import { IncomeTotalDate } from '../../shared/models/income-total-date.model';
import { NgxSpinnerService } from 'ngx-spinner';

const SelectDates = [{ display: "Ngày", value: 1 }, { display: "Tháng", value: 2 }, { display: "Tùy chọn", value: 3 }];




@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.scss'],
  animations: [routerTransition()],
})
export class FinancialComponent implements OnInit {


  selectDates: IDropdownItem[] = SelectDates;
  selectedDate = 2;

  currentShop: Shop;
  financial: any = {
    startDate: new Date(),
    endDate: new Date()
  }

  incomeHeadersRows: IncomeTotalDate[] =[];
  incomeHeadersCache : IncomeTotalDate[]=[];
  loadingIndicator :boolean;


  expenseHeadersRows: ExpenseHeader[]=[];
  expenseHeadersCache : ExpenseHeader[]=[];
  loadingIndicatorExpense = true;
  reorderable: boolean ;

  myDatepicker: any = {};
  productCategories: any = [];
  totalIncome: number;
  totalIncomeString: string = "";
  totalExpense: number;
  totalExpenseString: string = "";
  totalBalanceString: string = "";
  incomeGroupByDay: any;

  //materials

  descriptionsOfIncomeTransactions: string[];

  filterExpenseRadio: number =1;

  stats: any = {};

  //line charts
  public lineChartData: Array<any> = [
    {  data: [], label: 'THU' }, // hidden: false,
    { data: [], label: 'CHI' },
    { data: [], label: 'Lợi Nhuận' }
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true,
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: function (tooltipItem, data) {

          var label = data.labels[tooltipItem.index];
          var datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
          var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
          return datasetLabel + ': ' + new CurrencyFormatPipe().transform(value);
        }
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            callback: function (label, index, labels) {
              return new CurrencyFormatPipe().transform(label);;
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
      // dark grey
      backgroundColor: 'rgba(255,87,34,0.2)',
      borderColor: 'rgba(255,87,34,1)',
      pointBackgroundColor: 'rgba(255,87,34,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,87,34,1)'
    },
    {
      // grey
      backgroundColor: 'rgba(139,195,74,0.2)',
      borderColor: 'rgba(139,195,74,1)',
      pointBackgroundColor: 'rgba(139,195,74,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(139,195,74,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  public monthsObject: any;
  public hideFinancical = true;

  constructor(private router: Router, private translate: TranslateService,
     private apiService: ApiService, private spinner: NgxSpinnerService,
     public memberService: MemberService,
    public materialService: MaterialService, private snotifyService: SnotifyService, 
    iconRegistry: MatIconRegistry, public dialog: MatDialog) {

    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
   }

  @ViewChild(DatatableComponent,{static: true}) table: DatatableComponent;


  ngOnInit() {

    var now = new Date();
    this.financial = {
      startDate: moment(now).startOf('month').toDate(),
      endDate: moment(now).endOf('month').toDate()
    }
    
    this.initFinancial();
  }

  initFinancial(){
    if (this.currentShop.id) {

      this.getIncomeHeadersByShop();
      this.getExpenseHeadersByShop();
      //this.getMaterialProvidersByShop();
      this.getDescriptionsOfIncomeTransactions();
    }

        this.monthsObject = Utilities.getPreviousMonths(12);
        this.lineChartLabels = this.monthsObject.monthsAsString;
        this.initChart();
  }

  async onActivate(event) {
    if(event.stopPropagation){
      event.stopPropagation();
    }
    if (event.type === 'click') {
      this.spinner.show();
     var headers = await  this.apiService.getIncomeHeadersByShop(this.currentShop.id, event.row.incomeDate, moment(event.row.incomeDate).endOf('day').toDate() ).toPromise();
     this.spinner.hide();
     let dialogRef = this.dialog.open(HeadersDetailDialog, {
        panelClass: 'col-md-9',
        data: {
          headers:headers
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {

        }
      });
      //console.log(event);
    }
  }

  ngAfterViewInit() {
    
    

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.incomeHeadersCache.filter(function(incomeHeader) {
      return Utilities.searchOnItem(incomeHeader, filterValue);
    });

    // update the rows
    this.incomeHeadersRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  applyFilterExpense(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.expenseHeadersCache.filter(function(incomeHeader) {
      return Utilities.searchOnItem(incomeHeader, filterValue);
    });

    // update the rows
    this.expenseHeadersRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterExpenseRadioChanged(v){
    if(v === '1'){
      this.expenseHeadersRows = this.expenseHeadersCache;
      return;
    }
    if(v === '2'){
      this.expenseHeadersRows = this.expenseHeadersCache.filter(function(expenseHeader) {
        return expenseHeader.materialProvider !=null;
      });
    }
      if(v === '3'){
        this.expenseHeadersRows = this.expenseHeadersCache.filter(function(expenseHeader) {
          return expenseHeader.materialProvider == null;
        });

      return;
    }
  
}

  displayPassword(){
  }

  getIncomeHeadersByShop(): void {
    this.loadingIndicator = true;
    this.apiService.getIncomeHeadersLiteDaysByShop(this.currentShop.id, this.financial.startDate, this.financial.endDate).subscribe(r => {
      this.totalIncome = 0;
      for (var i = 0; i < r.length; i++) {
        this.totalIncome += r[i].amount;
        r[i].incomeDate = moment(r[i].incomeDate).subtract(14, 'hours').toDate();
      }
      
      // this.incomeGroupByDay= _.groupBy(r, function (i) {
      //   return moment(i.dateCreated).startOf('day').format();
      // });
      this.totalIncomeString = new Intl.NumberFormat('vi-VN').format(this.totalIncome) + " đ";

      // var rows = Object.keys(this.incomeGroupByDay).map((dayString)=>{
      //   return {
      //     dateCreated: dayString,
      //     amount: _.sumBy(this.incomeGroupByDay[dayString],'amount'),
      //     description: ` ${this.incomeGroupByDay[dayString].length} giao dịch`
      //   } as any;
      // })
      var rows = _.orderBy(r,'incomeDate','desc')

      this.incomeHeadersCache = [...rows];
      this.incomeHeadersRows = rows;
      //this.dataSource.data = r;
      this.loadingIndicator = false;
    }, error => {
      console.log(error)
    })
  }

  viewIncomeDetail(){
    let dialogRef = this.dialog.open(IncomeDayDetailDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        incomeGroupByDay: this.incomeGroupByDay
      }
    });
  }

  getExpenseHeadersByShop(): void {
    this.loadingIndicatorExpense = true;
    this.apiService.getExpenseHeadersByShop(this.currentShop.id, this.financial.startDate, this.financial.endDate).subscribe(r => {

      this.expenseHeadersCache = [...r];
      this.expenseHeadersRows = r;
      this.totalExpense = 0;
      for (var i = 0; i < this.expenseHeadersCache.length; i++) {
        this.totalExpense += this.expenseHeadersCache[i].amount;
      }
      this.totalExpenseString = new Intl.NumberFormat('vi-VN').format(this.totalExpense) + " đ";

      this.loadingIndicatorExpense = false;
    }, error => {

    })
  }

  // getMaterialProvidersByShop(): void {
  //   this.apiService.getMaterialProviders(this.currentShop.id).subscribe(r => {
  //     this.materialProviders = r;
  //     this.materialProviders = _.orderBy(this.materialProviders, 'name');
  //   }, error => {
  //     console.log(error)
  //   })
  // }

  getDescriptionsOfIncomeTransactions(): void {
    this.apiService.getDescriptionsOfIncomeTransactionsByShop(this.currentShop.id).subscribe(r => {
      this.descriptionsOfIncomeTransactions = r;
    }, error => {
      console.log(error)
    })
  }

  getTotalBalance(): string {
    return new Intl.NumberFormat('vi-VN').format(this.totalIncome - this.totalExpense) + " đ";

  }

  selectedDateChanged($event): void {

  }

  openDialog(): void {
    var incomeHeader = new IncomeHeader();
    incomeHeader.dateCreated = new Date();
    incomeHeader.shopId = this.currentShop.id;
    incomeHeader.incomeTransactions = [new IncomeTransaction()];
    incomeHeader.idNumber = this.currentShop.shopCode + "-" + Utilities.uniqueIdNumber(4);
    
    let dialogRef = this.dialog.open(IncomeDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        incomeHeader: incomeHeader,
        descriptions:this.descriptionsOfIncomeTransactions
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        var newIncome = result;
        newIncome.shopId = this.currentShop.id;
        this.apiService.createIncomeHeader(newIncome).subscribe(r => {

          this.getIncomeHeadersByShop();
          this.initChart();
        })
      }
    });
  }

  openDialog4Update(incomeHeader): void {

    let dialogRef = this.dialog.open(IncomeDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        incomeHeader: incomeHeader,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.apiService.updateIncomeHeader(result).subscribe(r => {
          console.log('update Income');
          this.getIncomeHeadersByShop();
          this.initChart();
        })
      }
    });
  }

  openExpenseDialog(): void {
    var newExpenseHeader = new ExpenseHeader(this.currentShop.id);
    newExpenseHeader.expenseTransactions = [new ExpenseTransaction(newExpenseHeader.shopId)];
    let dialogRef = this.dialog.open(ExpenseDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        expenseHeader: newExpenseHeader,
        materialProviders: this.materialService.materialProviders
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        _.each(result.expenseTransactions, t => {
          if (t.materialBuyingHistory && t.materialBuyingHistory.material && t.materialBuyingHistory.material.id) {
            t.materialBuyingHistory.materialId = t.materialBuyingHistory.material.id;
            t.materialBuyingHistory.material = undefined;
          }
        })
        var newExpense = result;

        this.apiService.createExpenseHeader(newExpense).subscribe(r => {
          //this.getMaterialProvidersByShop();
          
          this.getExpenseHeadersByShop();
          this.initChart();
          this.translate.get('AddSuccess').subscribe(translation => {
            this.snotifyService.success(translation, '')
          })
        })
      }
    });
  }

  openExpenseDialog4Update(expenseHeader: ExpenseHeader): void {

    let dialogRef = this.dialog.open(ExpenseDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        expenseHeader: undefined,
        expenseHeaderId: expenseHeader.id,
        materialProviders: this.materialService.materialProviders,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        _.each(result.expenseTransactions, t => {
          if (t.materialBuyingHistory && t.materialBuyingHistory.material && t.materialBuyingHistory.material.id) {
            t.materialBuyingHistory.materialId = t.materialBuyingHistory.material.id;
            t.materialBuyingHistory.material = undefined;
          }
        })
        this.apiService.updateExpenseHeader(result).subscribe(r => {
          console.log('update Expense');
          this.getExpenseHeadersByShop();
          this.initChart();
        })
        console.log(result);

      }
    });
  }

  showDetails(transactions){
    let dialogRef = this.dialog.open(TransactionsDetailDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        transactions: transactions
      }
    });
  }

  showDetailsOfExpense(expenseHeaderId){
    let dialogRef = this.dialog.open(ExpenseTransactionsDetailDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        expenseHeaderId: expenseHeaderId
      }
    });
  }

  removeExpense(expenseHeaderId): void {
    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?","" ,{
      buttons:[
        {
          text:"Ok",
          action: ()=>{
            this.apiService.removeExpenseHeader(expenseHeaderId).subscribe(r=>{
              this.getExpenseHeadersByShop();
            });
              this.snotifyService.clear();
          }
        },{
          text:"Cancel",
          action: ()=>{
            this.snotifyService.clear();
          }
        }
      ]
    });
    
  }

  removeIncome(incomeHeaderId): void {
    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?","" ,{
      buttons:[
        {
          text:"Ok",
          action: ()=>{
            this.apiService.removeIncomeHeader(incomeHeaderId).subscribe(r=>{
              this.getIncomeHeadersByShop();
            });
              this.snotifyService.clear();
          }
        },{
          text:"Cancel",
          action: ()=>{
            this.snotifyService.clear();
          }
        }
      ]
      
    });
    
  }

  //line charts



  initChart() {
    var monthsParamsArray = _.map(this.monthsObject.months, function (o: moment.Moment) {
      return {
        start: Date.parse(o.startOf('month').toDate().toString()),
        end: Date.parse(o.endOf('month').toDate().toString()),
      }
    });

    this.apiService.getFinancialMonthsStats(this.currentShop.id, monthsParamsArray).subscribe(r => {




      this.lineChartData = [
        { data: _.map(r, 'incomeAmount'), label: 'THU' },
        { data: _.map(r, 'expenseAmount'), label: 'CHI' },
        { data: _.map(r, 'balanceAmount'), label: 'Lợi Nhuận' }
      ];

    });
  }

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

}

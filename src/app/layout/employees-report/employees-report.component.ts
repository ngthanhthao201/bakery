import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';
import { ShopService } from '../../shared/services/shop.service';
import { Shop } from '../../shared/models/shop.model';
import { IncomeContainer } from '../../shared/models/income-container.model';
import { ApiService } from '../../shared/services/api.service';
import { MemberService } from '../../shared/services/member.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currencyformat.pipe';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Utilities } from '../../shared/services/utilities';

@Component({
  selector: 'app-employees-report',
  templateUrl: './employees-report.component.html',
  styleUrls: ['./employees-report.component.scss']
})
export class EmployeesReportComponent implements OnInit {
  kindOfReport: number = 2;
  employeeReportDay: any = {
    startDate: new Date(),
    endDate: new Date()
  };
  employeeReportMonth: any = {
    startDate: new Date(),
    endDate: new Date()
  };
  employeeReportWeek: any = {
    startDate: new Date(),
    endDate: new Date()
  };
  now = new Date();

  incomeContainer: IncomeContainer;
  _currentShop: Shop;

  lineChartOptions: any;
  public lineChartType: string = 'line';
  public lineChartLegend: boolean = true;
  lineChartData: Array<any>;
  lineChartDataOrder:Array<any> = [
    { data: [], label: 'Tổng đơn hàng' },
  ];
  public lineChartLabels: Array<any> = [];
  public lineChartLabelsOrder: Array<any> = [];

  lineChartColors: any;
  employeeSaleInfo = [];
  public monthsObject: any;
  public lineChartOptionsOrder: any = {
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

  public lineChartColorsOrder: Array<any> = [
    {
      // grey
      backgroundColor: 'rgba(57,178,238,0.2)',
      borderColor: 'rgba(57,178,238,1)',
      pointBackgroundColor: 'rgba(57,178,238,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(57,178,238,0.8)'
    }
  ];
  constructor(public shopService: ShopService, public apiService: ApiService, public memberService: MemberService) {
    this.lineChartOptions = {
      animation: {
        duration: 1000, // general animation time
        easing: 'easeOutBack'
      },
      hover: {
        animationDuration: 1000, // duration of animations when hovering an item
        mode: 'label'
      },
      responsiveAnimationDuration: 1000, // animation duration after a resize
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'bottom',
      },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            return (data.datasets[tooltipItem.datasetIndex].label + " : " + new CurrencyFormatPipe().transform(tooltipItem.yLabel));
          },
        }
      },

      scales: {
        xAxes: [{
          display: true,
          gridLines: {
            color: "#f3f3f3",
            drawTicks: false,
          },
          ticks: {
            beginAtZero: false,
            padding: 20,
            callback: function (dayName) {
              return moment(dayName).format('D/M/YYYY');
            },
          },
          scaleLabel: {
            display: true,
            // labelString: 'Ngày'
          },

        }],
        yAxes: [{
          display: true,
          gridLines: {
            color: "#f3f3f3",
            drawTicks: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Tiền Bán',
          },
          ticks: {
            callback: function (item) {
              return new CurrencyFormatPipe().transform(item);
            }
          }
        }]
      },

    };
    this.lineChartColors = [];
    this.lineChartData = [];

  }

  ngOnInit() {
    this.currentMonth();
    this.currentWeek();
    this.currentDay();

    this.loadChartLabel();
    setTimeout(() => {
      this.loadChartColor();
    }, 0)
    this.monthsObject = Utilities.getPreviousMonths(14);
    this.lineChartLabelsOrder = this.monthsObject.monthsAsString;
    this.initChartOrder()
  }

  public initChartOrder(){
    var weeksParamsArray = _.map(this.monthsObject.months, function (o: moment.Moment) {
      return {
        start: Date.parse(o.startOf('month').toDate().toString()),
        end: Date.parse(o.endOf('month').toDate().toString()),
      }
     
    });
    this.apiService.getOrderWeeksStats(this.shopService.currentShop.id,weeksParamsArray).subscribe(r =>{
      this.lineChartDataOrder = [
        { data: _.map(r, 'count'), label: 'Tổng đơn hàng' },
      ];
    })
  }

  private loadChartColor() {
    this.shopService.members.forEach(() => {
      this.lineChartColors.push({
        lineTension: 0,
        fill: false,
        borderColor: "#d50000",
        pointBorderColor: "#d50000",
        pointBackgroundColor: "#FFF",
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointRadius: 4,
      },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#d500f9",
          pointBorderColor: "#d500f9",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#304ffe",
          pointBorderColor: "#304ffe",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#004d40",
          pointBorderColor: "#004d40",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#ffab00",
          pointBorderColor: "#ffab00",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#5d4037",
          pointBorderColor: "#5d4037",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#263238",
          pointBorderColor: "#263238",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "black",
          pointBorderColor: "black",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#d5f8ae",
          pointBorderColor: "#d5f8ae",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#a4f7e3",
          pointBorderColor: "#a4f7e3",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#008080",
          pointBorderColor: "#008080",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#ecddcd",
          pointBorderColor: "#ecddcd",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#e5cdae",
          pointBorderColor: "#e5cdae",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#ffdb00",
          pointBorderColor: "#ffdb00",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#58914d",
          pointBorderColor: "#58914d",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#f27f71",
          pointBorderColor: "#f27f71",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#8B0000",
          pointBorderColor: "#8B0000",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#ff906b",
          pointBorderColor: "#ff906b",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#9ea2a9",
          pointBorderColor: "#9ea2a9",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#000b06",
          pointBorderColor: "#000b06",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#BDB76B",
          pointBorderColor: "#BDB76B",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "blue",
          pointBorderColor: "blue",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#FFFF00",
          pointBorderColor: "#FFFF00",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#6B8E23",
          pointBorderColor: "#6B8E23",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#7FFFD4",
          pointBorderColor: "#7FFFD4",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
        {
          lineTension: 0,
          fill: false,
          borderColor: "#483D8B",
          pointBorderColor: "#483D8B",
          pointBackgroundColor: "#FFF",
          pointBorderWidth: 2,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
        },
      );
    });
  }

  private loadChartLabel() {
    this.lineChartLabels = [];
    this.lineChartData = [];
    this.employeeSaleInfo = [];

    if (this.kindOfReport == 1) {
      this.apiService.getMembersSales(this.shopService.currentShop.id, moment(this.employeeReportDay.startDate).startOf('day').toDate(), moment(this.employeeReportDay.endDate).endOf('day').toDate()).subscribe(r => {
        this.lineChartLabels.push(moment(this.employeeReportDay.startDate).format('M/D/YYYY') + "*")
        this.lineChartLabels.push(moment(this.employeeReportDay.startDate).format('M/D/YYYY'));

        r.forEach(m => {
          if (m.memberId && m.saleDays) {
            var data = [] as any;
            var totalData = 0;
            for (var i = 0; i <= 1; i++) {
              var saleDay = _.find(m.saleDays, { dayName: this.lineChartLabels[i] }) as any;
              if (saleDay) {
                data.push(saleDay.total);
                totalData += saleDay.total;
              } else {
                data.push(0)
              }
            };
            this.lineChartData.push({
              data: data,
              label: this.shopService.getMemberNameById(m.memberId),
            });
            this.employeeSaleInfo.push({
              memberName: this.shopService.getMemberNameById(m.memberId),
              totalSale: totalData,
              memberImage: this.shopService.getMemberImageById(m.memberId)
            });
          }
        });
        this.employeeSaleInfo = _.orderBy(this.employeeSaleInfo, 'totalSale').reverse();
      })
    }

    if (this.kindOfReport == 2) {
      this.apiService.getMembersSales(this.shopService.currentShop.id, moment(this.employeeReportWeek.startDate).startOf('week').toDate(), moment(this.employeeReportWeek.endDate).endOf('week').toDate()).subscribe(r => {
        for (var i = 0; i <= 6; i++) {
          var labelDate = moment(this.employeeReportWeek.startDate).add(i, 'days').format('M/D/YYYY');
          this.lineChartLabels.push(labelDate);
        };
        r.forEach(m => {
          if (m.memberId && m.saleDays) {
            var data = [] as any;
            var totalData = 0;
            for (var i = 0; i <= 6; i++) {
              var saleDay = _.find(m.saleDays, { dayName: this.lineChartLabels[i] }) as any;
              if (saleDay) {
                data.push(saleDay.total);
                totalData += saleDay.total;
              } else {
                data.push(0)
              }
            };

            this.lineChartData.push({
              data: data,
              label: this.shopService.getMemberNameById(m.memberId),
            });
            this.employeeSaleInfo.push({
              memberName: this.shopService.getMemberNameById(m.memberId),
              totalSale: totalData,
              memberImage: this.shopService.getMemberImageById(m.memberId)
            });
          }
        });
        this.employeeSaleInfo = _.orderBy(this.employeeSaleInfo, 'totalSale').reverse();
      })
    }
    if (this.kindOfReport == 3) {
      this.apiService.getMembersSales(this.shopService.currentShop.id, moment(this.employeeReportMonth.startDate).startOf('month').toDate(), moment(this.employeeReportMonth.endDate).endOf('month').toDate()).subscribe(r => {
        for (var i = 0; i <= 30; i++) {
          var labelDate = moment(this.employeeReportMonth.startDate).add(i, 'days').format('M/D/YYYY');
          this.lineChartLabels.push(labelDate);
        };
        r.forEach(m => {
          if (m.memberId && m.saleDays) {
            var data = [];
            var totalData = 0;
            for (var i = 0; i <= 30; i++) {
              var saleDay = _.find(m.saleDays, { dayName: this.lineChartLabels[i] }) as any;
              if (saleDay) {
                data.push(saleDay.total);
                totalData += saleDay.total;
              } else {
                data.push(0);
              }
            };
            this.lineChartData.push({
              data: data,
              label: this.shopService.getMemberNameById(m.memberId),
            });
            this.employeeSaleInfo.push({
              memberName: this.shopService.getMemberNameById(m.memberId),
              totalSale: totalData,
              memberImage: this.shopService.getMemberImageById(m.memberId)
            });

          }
        });
        this.employeeSaleInfo = _.orderBy(this.employeeSaleInfo, 'totalSale').reverse();
      })
    }




  }

  kindOfReportChange() {
    this.loadChartLabel();
    this.loadChartColor();
  }
  private currentDay() {
    this.employeeReportDay = {
      startDate: moment(this.now).startOf('day').toDate(),
      endDate: moment(this.now).endOf('day').toDate()
    };
  }
  private currentMonth() {
    this.employeeReportMonth = {
      startDate: moment(this.now).startOf('month').toDate(),
      endDate: moment(this.now).endOf('month').toDate()
    };
  }

  private currentWeek() {
    this.employeeReportWeek = {
      startDate: moment(this.now).startOf("week").day(1).toDate(),
      endDate: moment(this.now).endOf("week").day(7).toDate()
    };
  }

  nextDay() {
    var futureDay = moment(this.employeeReportDay.startDate).add(1, 'day');
    var futureDayEnd = moment(this.employeeReportDay.endDate).add(7, 'days');
    this.employeeReportDay.startDate = futureDay;
    this.employeeReportDay.startDate = futureDayEnd;
    this.loadChartLabel();
  }
  previousDay() {
    var previousDay = moment(this.employeeReportDay.startDate).add(-1, 'day');
    var previousDayEnd = moment(this.employeeReportDay.endDate).add(-1, 'day');
    this.employeeReportDay.startDate = previousDay;
    this.employeeReportDay.endDate = previousDayEnd;
    this.loadChartLabel();
  }
  nextWeek() {
    var futureWeek = moment(this.employeeReportWeek.startDate).add(7, 'days');
    var futureWeekEnd = moment(this.employeeReportWeek.endDate).add(7, 'days');
    this.employeeReportWeek.startDate = futureWeek;
    this.employeeReportWeek.endDate = futureWeekEnd;
    this.loadChartLabel();
  }
  previousWeek() {
    var previousWeek = moment(this.employeeReportWeek.startDate).add(-7, 'days');
    var previousWeekEnd = moment(this.employeeReportWeek.endDate).add(-7, 'days');
    this.employeeReportWeek.startDate = previousWeek;
    this.employeeReportWeek.endDate = previousWeekEnd;
    this.loadChartLabel();
  }
  nextMonth() {
    var futureMonth = moment(this.employeeReportMonth.startDate).add(1, 'month');
    var futureMonthEnd = moment(this.employeeReportMonth.endDate).add(1, 'month');
    this.employeeReportMonth.startDate = futureMonth;
    this.employeeReportMonth.endDate = futureMonthEnd;
    this.loadChartLabel();
  }
  previousMonth() {
    var previousMonth = moment(this.employeeReportMonth.startDate).add(-1, 'month');
    var previousMonthEnd = moment(this.employeeReportMonth.endDate).add(-1, 'month');
    this.employeeReportMonth.startDate = previousMonth;
    this.employeeReportMonth.endDate = previousMonthEnd;
    this.loadChartLabel();
  }

  // events
  public chartClicked(): void {
    //your code here
  }

  public chartHovered(): void {
    //your code here
  }

  getRandomColor() {
    var color = Math.floor(0x1000000 * Math.random()).toString(16);
    return '#' + ('000000' + color).slice(-6);
  }

  // myFilter = (d: Date): boolean => {
  //   return moment(d).isBefore(new Date());
  // }

  myFilter = (d: Date): boolean => {
    return Utilities.withInMonthFilter(d);
  }

  dateChange(event: MatDatepickerInputEvent<Date>): any {
    this.loadChartLabel();
  }


}
import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { SnotifyService } from 'ng-snotify';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Document, Packer, Paragraph, WidthType, Media, VerticalAlign, Table, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { Base64 } from 'js-base64';
import * as JsBarcode from 'jsbarcode';
import { DatePipe } from '@angular/common';
import { Http } from '@angular/http';
import * as _moment from 'moment';
import { ReportProductBarcodeDetail } from '../report-product-barcode-detail/report-product-barcode-detail';
import { ReportTransactionDetail } from '../report-transaction-detail/report-transaction-detail';
import { Shift } from '../../../../shared/models/shift.model';
import { DateTimeService } from '../../../../shared/services/date-time.service';
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { ApiService } from '../../../../shared/services/api.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currencyformat.pipe';
import { DownloadReportComponent } from '../download-report-bottom-sheet/download-report-bottom-sheet';
import { Observable } from 'rxjs';
import { ShiftSnapShot } from '../../../../shared/models/shift-snap-shot.model';
import { DailyReportService } from '../../services/daily-report.service';
import { ProductBarcodeService } from '../../../product-barcode/services/product-barcode.service';
import { Utilities } from '../../../../shared/services/utilities';
import { EmployeesReportComponent } from '../../../employees-report/employees-report.component';
import { MemberService } from '../../../../shared/services/member.service';
import { ActivatedRoute } from '@angular/router';
import { OrderDetailComponent } from '../../../../shared/modules/order-detail/components/order-detail/order-detail.component';

import { forkJoin} from'rxjs'

@Component({
  selector: 'product-barcode-report',
  templateUrl: './product-barcode-report.component.html',
  styleUrls: ['./product-barcode-report.component.scss']
})
export class ProductBarcodeReportComponent implements OnInit {

  priceCategories: Array<any> = [];
  totalAmountBigCake = 0;
  loadingIndicator: boolean;
  shifts: Array<Shift> = [];
  activeShift: Shift;
  nextShift: Shift;
  selectedIndexTab: number;
  selectedDate: Date = _moment().toDate();;
  isInPast: boolean = false;
  shiftSnapShotsFromPreviousDate: Array<ShiftSnapShot>;
  total = 0;
  destroyedCakes = [];
  objectKeys = Object.keys;
  ods = [];
  productBarcodesCount= 0;
  productBarcodesSaleCount =0;

  constructor(private changeDetectorRef: ChangeDetectorRef, private http: Http, private dateTimeService: DateTimeService,
    private barcodeService: BarcodeService, public shopService: ShopService,
    private snotifyService: SnotifyService, private apiService: ApiService,
    private bottomSheet: MatBottomSheet, private dialog: MatDialog,
    private dailyReportService: DailyReportService,
    public memberService: MemberService,
    private productBarcodeService: ProductBarcodeService,
    private route: ActivatedRoute, ) {

  }

  ngOnInit() {
    this.loadingIndicator = true;
    this.totalAmountBigCake = 0;
    this.priceCategories = [];
    this.shifts = [];
    this.destroyedCakes = [];


    this.dailyReportService
      .getPreviousSnapShotByShiftAndDate4BigCake(
        this.shopService.currentShop.id,
        _moment(this.selectedDate)
          .subtract(0, "days")
          .format("YYYY-MM-DD")
      )
      .subscribe(
        r => {
          this.shiftSnapShotsFromPreviousDate = r;
          this.initData();
          this.getShiftsByShop();
        },
        () => {
          this.loadingIndicator = false;
        }
      );

  }

  // myFilter = (d: Date): boolean => {
  //   return _moment(d).isBefore(new Date());
  // }

  myFilter = (d: Date): boolean => {
    return Utilities.withInMonthFilter(d);
  }

  dateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.isInPast = _moment(this.selectedDate).isBefore(new Date());
    this.ngOnInit();
  }



  getShiftsByShop() {
    forkJoin(
      this.productBarcodeService.getPriceCategories(this.shopService.currentShop.id),
      this.apiService.getShiftsByShopId4Big(this.shopService.currentShop.id, _moment(this.selectedDate).format("YYYY-MM-DD")),
      this.apiService.getOrderDetailsByDate4Big(this.shopService.currentShop.id, _moment(this.selectedDate).format("YYYY-MM-DD"))
    ).subscribe(res => {

      var previousShift: Shift;
      this.loadingIndicator = false;
      this.shifts = res[1];

      this.activeShift = _.find(this.shifts, { isActive: true }) as any;
      if (this.activeShift) {
        this.nextShift = _.find(this.shifts, { orderIndex: this.activeShift.orderIndex + 1 }) as any;
      }

      _.each(this.shifts, (shift, index: any) => {
        shift.totalAmount = 0;
        shift.totalAmountBigCake = 0;
        if (shift.incomeTransactions.length > 0) {
          shift.firstTransactionTime = shift.incomeTransactions[0].createdDate;
          shift.lastTransactionTime = _.last(shift.incomeTransactions).createdDate;

          shift.totalAmountBigCake = _.sumBy(shift.incomeTransactions, 'amount');
        }

        //cakeCategories soft barcodes Bánh lớn - bánh kem

        var destroyCakes = _.filter(shift.productBarcodes, 'destroyedReason');
        if (destroyCakes.length > 0) {
          this.destroyedCakes = destroyCakes;
        }

        shift.priceCategories = _.cloneDeep(res[0]);

        this.ods = res[2];
   
        _.each(shift.priceCategories, pc => {
            pc.transactions = _.filter(shift.incomeTransactions, t => {
            return t.barcode.slice(-9, -7) == pc.idBarcode && t.unitPrice == pc.price
          });

          pc.productBarcodes = _.filter(shift.productBarcodes, productB => {
            return productB.barcode.slice(-9, -7) == pc.idBarcode && productB.isActive && pc.price == productB.price;
          });

          // var ods =  _.filter(this.ods, o => {
          //   if (o.barcode.slice(-9, -7) == pc.idBarcode && o.unitPrice == pc.price) {
          //     return o;
          //   }
          // });
          // pc.orderDetailsGrp = _.groupBy(ods, "orderId");

          var temp = (_.find(shift.shiftSnapShots, {
            productCategoryBarcodeId: pc.idBarcode, price: pc.price
          }) as any)
          pc.end = temp ? temp.end : '';

          if (index == 0) {
            var endTemp = _.find(this.shiftSnapShotsFromPreviousDate, { productCategoryBarcodeId: pc.idBarcode, price: pc.price }) as any;
            pc.start = endTemp ? endTemp.end : undefined;
          } else {
            var endTemp = _.find(this.shifts[index - 1].shiftSnapShots, { productCategoryBarcodeId: pc.idBarcode, price: pc.price }) as any;
            pc.start = endTemp ? endTemp.end : undefined;
          }

        });

      });
      console.log("shifts: ", this.shifts)

    });
  }

  showTotalTab = false;
  initData() {

    forkJoin(
      this.productBarcodeService.getPriceCategories(this.shopService.currentShop.id),
      this.apiService.getIncomeHeadersByShop(
        this.shopService.currentShop.id,
        _moment(this.selectedDate).startOf('day').toDate(), _moment(this.selectedDate).endOf('day').toDate(), '$'
      ),
      this.productBarcodeService.getProductBarcodesByDate(this.shopService.currentShop.id, _moment(this.selectedDate).endOf('day').toDate()),
      this.dailyReportService.getPreviousSnapShotByShiftAndDate4BigCake(this.shopService.currentShop.id, _moment(this.selectedDate).subtract(0, 'days').format("YYYY-MM-DD")),
      this.productBarcodeService.getProductBarcodesNotSold(this.shopService.currentShop.id)
    ).subscribe(res => {
      this.priceCategories = res[0];

      const pbs = res[2] as any;
      this.productBarcodesCount = pbs.length;

      var incomeTransactions = _.flatten(_.map(res[1], 'incomeTransactions'));
      incomeTransactions = _.filter(incomeTransactions,{isActive: true})
        this.productBarcodesSaleCount = incomeTransactions.length;
      _.each(this.priceCategories, pc => {

        pc.transactions = _.filter(incomeTransactions, t => {
          if (t && t.barcode.slice(-9, -7) == pc.idBarcode && t.unitPrice == pc.price) {
            return true;
          }
        });

        pc.productBarcodes = _.filter(pbs, pb => {
          return pb.productCategoryBarcodeId == pc.idBarcode && pb.price == pc.price;
        })

        var ods =  _.filter(this.ods, o => {
          if (o.barcode.slice(-9, -7) == pc.idBarcode && o.unitPrice == pc.price) {
            return o;
          }
        });
        pc.orderDetailsGrp = _.groupBy(ods, "orderId");

        pc.start = ((_.find(res[3], { productCategoryBarcodeId: pc.idBarcode, price: pc.price })) != null ? (_.find(res[3], { productCategoryBarcodeId: pc.idBarcode, price: pc.price }) as any).end : undefined)
        pc.total = _.filter(res[4], pb => {
          return pb.productCategoryBarcodeId == pc.idBarcode && pb.price == pc.price;
        }).length

      })

      if (res[1]) {
        //ProductBarcodes Bánh lớn
        this.showTotalTab = true;
        this.totalAmountBigCake = _.sumBy(incomeTransactions, 'amount');
      }

    });



  }

  viewDetail(productBarcodes) {
    this.bottomSheet.open(ReportProductBarcodeDetail, {
      data: {
        productBarcodes: productBarcodes
      },
    });
  }


  viewDetailTransaction(incomeTransactions) {
    this.bottomSheet.open(ReportTransactionDetail, {
      data: {
        incomeTransactions: incomeTransactions
      },
    });
  }

  openOrderDetail(orderId) {
    this.apiService.getOrder(orderId).subscribe(r => {
        let dialogRef = this.dialog.open(OrderDetailComponent, {
            panelClass: 'col-md-8',
            data: {
                order: r,
            }
        });
    })
}

  selectedIndexChanged() {
    setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 250)
  }

  countArray(hardBlockProductBarcodes) {
    return _.sumBy(hardBlockProductBarcodes, 'originalCount');
  }

  showReportButtonsByShift(shift: Shift) {
    var priceCategoriesGrouped = _.groupBy(_.cloneDeep(shift.priceCategories), 'price');
    var buttons = [
      {
        name: "Báo cáo bánh kem theo ca",
        action: () => {
          var columnCount = 7;
          const doc = new Document(undefined, {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
          });
          doc.Header.createParagraph(this.shopService.currentShop.name);
          doc.Footer.createParagraph(this.shopService.currentShop.name);
          var reportName = "Báo cáo bánh kem " + shift.name +
            " (" +
            new DatePipe('vi-VN').transform(shift.firstTransactionTime, 'short') + " - " + new DatePipe('vi-VN').transform(shift.lastTransactionTime, 'short')
          ")";

          doc.addParagraph(new Paragraph(reportName).heading1().center())

          Object.keys(priceCategoriesGrouped).reverse().forEach((price, index) => {
            this.createTableByShift(doc, new CurrencyFormatPipe().transform(parseFloat(price)), priceCategoriesGrouped[price], index == 0, shift)
          });

          const packer = new Packer();

          packer.toBlob(doc).then(blob => {
            saveAs(blob, reportName + ".docx");
            console.log("Document created successfully");
          });
        }
      },

    ];
    this.bottomSheet.open(DownloadReportComponent, {
      data: {
        buttons: buttons
      },
    });
  }

  createTableByShift(doc, tableName, rows, needHeader = false, shift: Shift) {
    doc.addParagraph(new Paragraph());
    doc.addParagraph(new Paragraph(tableName).heading1().left());
    var table = new Table(needHeader ? (rows.length + 1) : rows.length, 7);
    table.setWidth(WidthType.PERCENTAGE, '100%');
    doc.addTable(table);
    if (needHeader) {
      table.getCell(0, 0).addContent(new Paragraph("Tên bánh").heading3().center()).CellProperties.setWidth('24%', WidthType.PERCENTAGE);
      table.getCell(0, 1).addContent(new Paragraph("Tồn đầu").heading3().center()).CellProperties.setWidth('10%', WidthType.PERCENTAGE);
      table.getCell(0, 2).addContent(new Paragraph("Nhập").heading3().center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      table.getCell(0, 3).addContent(new Paragraph("Hủy").heading3().center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
      table.getCell(0, 3).addContent(new Paragraph("Lý do").heading3().center());
      table.getCell(0, 4).addContent(new Paragraph("Bán").heading3().center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      table.getCell(0, 5).addContent(new Paragraph("Thành tiền").heading3().center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      table.getCell(0, 5).addContent(new Paragraph(new CurrencyFormatPipe().transform(shift.totalAmountBigCake)).heading3().center());
      table.getCell(0, 6).addContent(new Paragraph("Tồn cuối").heading3().center()).CellProperties.setWidth('10%', WidthType.PERCENTAGE);
    }

    rows.forEach((element, index) => {


      table.getCell(needHeader ? index + 1 : index, 0).addContent(new Paragraph(element.name)).CellProperties.setWidth('24%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 1).addContent(new Paragraph(element.start).center()).CellProperties.setWidth('10%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 2).addContent(new Paragraph(element.productBarcodes.length > 0 ? element.productBarcodes.length : '').center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);

      if (_.filter(shift.productBarcodes, 'destroyedReason')) {
        var destroyCakes = _.filter(shift.productBarcodes, 'destroyedReason');

        if (destroyCakes.length < 1) {
          table.getCell(needHeader ? index + 1 : index, 3).addContent(new Paragraph(destroyCakes.length < 0 ? '' : '').center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
        } else {
          var destroyCakesGrById = _.groupBy(destroyCakes, 'productCategoryBarcodeId')
          var destroycakesGrByPrice = [];
          _.forOwn(destroyCakesGrById, (value, key) => {
            destroycakesGrByPrice[key] = _.groupBy(value, "price");
            var prices = Object.keys(destroycakesGrByPrice[key])
            _.forEach(prices, p => {
              var cakes = destroycakesGrByPrice[key][p];
              if (cakes["0"].productCategoryBarcodeId == element.idBarcode && cakes[0].price == element.price) {
                table.getCell(needHeader ? index + 1 : index, 3).addContent(new Paragraph(cakes.length > 0 ? cakes.length.toString() : '').center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
                _.forEach(destroycakesGrByPrice[key][p], dc => {
                  table.getCell(needHeader ? index + 1 : index, 3).addContent(new Paragraph(cakes.length > 0 ? dc.destroyedReason : '').center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);

                })
              }
            })
          });

        }

      }

      table.getCell(needHeader ? index + 1 : index, 4).addContent(new Paragraph(element.transactions.length > 0 ? element.transactions.length : '').center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      if (element.transactions.length > 0) {
        table.getCell(needHeader ? index + 1 : index, 5).addContent(new Paragraph(new CurrencyFormatPipe().transform(element.transactions.length > 0 ? element.transactions.length * element.transactions[0].amount : 0)).center()).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      } else {
        table.getCell(needHeader ? index + 1 : index, 5).addContent(new Paragraph('')).CellProperties.setWidth('13%', WidthType.PERCENTAGE);
      }
      table.getCell(needHeader ? index + 1 : index, 6).addContent(new Paragraph(element.end).center()).CellProperties.setWidth('10%', WidthType.PERCENTAGE);
    });
  }

  showReportButton() {

    var priceCategoriesGrouped = _.groupBy(_.cloneDeep(this.priceCategories), 'price');

    var buttons = [
      {
        name: "Báo cáo theo ngày",
        action: () => {
          var columnCount = 6;
          const doc = new Document(undefined, {
            top: 5,
            right: 5,
            bottom: 5,
            left: 5
          });
          doc.Header.createParagraph(this.shopService.currentShop.name);
          doc.Footer.createParagraph(this.shopService.currentShop.name);
          var reportName = "Báo cáo tổng kết ngày" + " (" + new DatePipe('vi-VN').transform(this.selectedDate, 'short') + ")";
          doc.addParagraph(new Paragraph(reportName).heading1().center())
          doc.addParagraph(new Paragraph("Tổng cộng: " + new CurrencyFormatPipe().transform(this.totalAmountBigCake)).heading3().center())

          Object.keys(priceCategoriesGrouped).reverse().forEach((price, index) => {
            this.createTable(doc, new CurrencyFormatPipe().transform(parseFloat(price)), priceCategoriesGrouped[price], index == 0)
          });

          const packer = new Packer();

          packer.toBlob(doc).then(blob => {
            saveAs(blob, reportName + ".docx");
            console.log("Document created successfully");
          });
        }
      },
      //   {
      //   name: "Tải báo cáo theo ca (docx)",
      //   link: environment.baseURl + "api/report/shift/" + this.shopService.currentShop.id + "/" + shift.id + "/" +_moment(new Date()).format("YYYY-MM-DD")
      // }
    ];
    this.bottomSheet.open(DownloadReportComponent, {
      data: {
        buttons: buttons
      },
    });
  }

  createTable(doc, tableName, rows, needHeader = false) {

    doc.addParagraph(new Paragraph());
    doc.addParagraph(new Paragraph(tableName).heading1().left());

    var table = new Table(needHeader ? (rows.length + 1) : rows.length, 5);
    table.setWidth(WidthType.PERCENTAGE, '100%');
    doc.addTable(table);
    if (needHeader) {
      table.getCell(0, 0).addContent(new Paragraph("Tên bánh").heading3().center()).CellProperties.setWidth('30%', WidthType.PERCENTAGE);
      table.getCell(0, 1).addContent(new Paragraph("Đầu ngày").heading3().center()).CellProperties.setWidth('18%', WidthType.PERCENTAGE);
      table.getCell(0, 2).addContent(new Paragraph("Nhập").heading3().center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
      table.getCell(0, 3).addContent(new Paragraph("Bán").heading3().center()).CellProperties.setWidth('18%', WidthType.PERCENTAGE);
      table.getCell(0, 4).addContent(new Paragraph("Hiện tại").heading3().center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
    }

    rows.forEach((element, index) => {
      table.getCell(needHeader ? index + 1 : index, 0).addContent(new Paragraph(element.name)).CellProperties.setWidth('30%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 1).addContent(new Paragraph(element.start).center()).CellProperties.setWidth('18%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 2).addContent(new Paragraph(element.productBarcodes.length > 0 ? element.productBarcodes.length.toString() : "").center()).CellProperties.setWidth('17%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 3).addContent(new Paragraph(element.transactions.length > 0 ? element.transactions.length.toString() : "").center()).CellProperties.setWidth('18%', WidthType.PERCENTAGE);
      table.getCell(needHeader ? index + 1 : index, 4).addContent(new Paragraph(element.total > 0 ? element.total.toString() : "").center());
    });

  }

}

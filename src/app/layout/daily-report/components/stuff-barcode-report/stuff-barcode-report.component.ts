import { Component, OnInit, Input } from "@angular/core";

import { SnotifyService } from "ng-snotify";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { MatDialog } from "@angular/material/dialog";
import * as _ from "lodash";
import { Document, Packer, Paragraph, WidthType, Table, BorderStyle, TextRun, } from "docx";
import { saveAs } from "file-saver";
import { DatePipe } from "@angular/common";
import { Http } from "@angular/http";
import * as _moment from "moment";
import { Shift } from "../../../../shared/models/shift.model";
import { ShiftSnapShot } from "../../../../shared/models/shift-snap-shot.model";
import { DateTimeService } from "../../../../shared/services/date-time.service";
import { BarcodeService } from "../../../../shared/services/barcode.service";
import { ShopService } from "../../../../shared/services/shop.service";
import { ApiService } from "../../../../shared/services/api.service";
import { CurrencyFormatPipe } from "../../../../shared/pipes/currencyformat.pipe";
import { DownloadReportComponent } from "../download-report-bottom-sheet/download-report-bottom-sheet";
import { AddStuffDialogComponent } from "../../../stuff-barcode/add-stuff-dialog/add-stuff-dialog.component";
import { DailyReportService } from "../../services/daily-report.service";
import { HardSetProductBarcode } from "../../../../shared/models/hard-set-product-barcode.model";
import { Utilities } from "../../../../shared/services/utilities";
import { OrderDetailComponent } from "../../../../shared/modules/order-detail/components/order-detail/order-detail.component";
import { HardBlockProductBarcode } from "../../../../shared/models/hard-block-product-barcode.model";
import { start } from "repl";
import { MemberService } from "../../../../shared/services/member.service";


@Component({
    selector: "stuff-barcode-report",
    templateUrl: "./stuff-barcode-report.component.html",
    styleUrls: ["./stuff-barcode-report.component.scss"]
})

export class StuffBarcodeReportComponent implements OnInit {
    stuffs: Array<any> = [];
    cakeCategories: Array<any> = [];
    totalAmount = 0;
    loadingIndicator: boolean;
    shifts: Array<Shift> = [];
    activeShift: Shift;
    nextShift: Shift;
    isInPast = false;
    selectedIndexTab: number;
    showBigCake = true;
    showSmallCake = true;
    selectedDate: Date = new Date();
    shiftSnapShotsFromPreviousDate: Array<ShiftSnapShot>;
    hardBlockProductBarcodes: HardBlockProductBarcode;
    public _ = _;
    constructor(
        private dialog: MatDialog,
        private dateTimeService: DateTimeService,
        private barcodeService: BarcodeService,
        public shopService: ShopService,
        private apiService: ApiService,
        private snotifyService: SnotifyService,
        private bottomSheet: MatBottomSheet,
        private dailyReportService: DailyReportService,
        public memberService: MemberService,
    ) { }

    ngOnInit() {
        this.loadingIndicator = true;
        this.totalAmount = 0;

        this.shifts = [];
        this.stuffs = undefined;
        this.nextShift = undefined;
        this.dailyReportService
            .getPreviousSnapShotByShiftAndDate(
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
    //     //const day = d.getDate();
    //     // Prevent Saturday and Sunday from being selected.
    //     //return day <= new Date().getDate();

    //     return _moment(d).isBefore(new Date());
    // };


    myFilter = (d: Date): boolean => {
        return Utilities.withInMonthFilter(d);
    }

    dateChange(event: MatDatepickerInputEvent<Date>) {
        this.selectedDate = event.value;
        this.isInPast = _moment(this.selectedDate).isBefore(new Date());
        this.ngOnInit();
    }

    getShiftsByShop() {
        this.apiService
            .getShiftsByShopId4Small(
                this.shopService.currentShop.id,
                _moment(this.selectedDate).format("YYYY-MM-DD")
            )
            .subscribe(
                async r => {
                    this.nextShift = await this.apiService
                        .getNextShift(this.shopService.currentShop.id)
                        .toPromise();

                    this.shifts = r;
                    console.log('shifts-stuff', this.shifts)
                    this.activeShift = _.find(this.shifts, {
                        isActive: true
                    }) as any;

                    var previousShift: Shift;
                    _.each(this.shifts, shift => {
                        shift.totalAmount = 0;
                        shift.totalAmountBigCake = 0;
                        //shift.incomeTransactions = _.filter(incomeTransactionsTotal, { shiftId: shift.id }) as any;
                        if (shift.incomeTransactions.length > 0) {
                            shift.firstTransactionTime =
                                shift.incomeTransactions[0].createdDate;
                            shift.lastTransactionTime = _.last(
                                shift.incomeTransactions
                            ).createdDate;
                        }

                        //Stuffs hard barcodes Bánh nhỏ - bánh món

                        var hardpbcs = _.cloneDeep(
                            this.barcodeService.hardProductBarcodes
                        );

                        shift.stuffs = this.convertHPBSToStuffs(shift, previousShift, hardpbcs);

                        if (!previousShift) {
                            previousShift = new Shift();
                        }
                        Object.assign(previousShift, shift);

                        shift.stuffs = _.sortBy(shift.stuffs, [
                            "label",
                            "name"
                        ]);
                        var groupsByBarcode = _.groupBy(
                            shift.incomeTransactions,
                            "barcode"
                        );

                        _.each(shift.stuffs, stuff => {
                            var amount = _.sumBy(
                                groupsByBarcode[stuff.barcode],
                                "amount"
                            );
                            if(stuff.barcode == 'C-GPJ3'){
                                console.log(groupsByBarcode[stuff.barcode]);
                            }
                            stuff.saleCount = _.sumBy(
                                groupsByBarcode[stuff.barcode],
                                "quantity"
                            );
                            stuff.money = amount;
                            shift.totalAmount += amount;

                            if (stuff.hardSetProductBarcodes.length > 0) {
                                _.each(stuff.hardSetProductBarcodes, hs => {
                                    var amount = _.sumBy(
                                        groupsByBarcode[hs.barcode],
                                        "amount"
                                    );
                                    hs.saleCount = _.sumBy(
                                        groupsByBarcode[hs.barcode],
                                        "quantity"
                                    );
                                    shift.totalAmount += amount;
                                    stuff.money += amount;
                                    stuff.saleCount +=
                                        hs.saleCount * hs.customerCount;
                                });
                            }
                        });
                    });
                },
                
                () => {
                    this.loadingIndicator = false;
                }
                
            ); //end getShiftsByShopId
        // endgetHardProductByShop
    }

    showTotalTab = false;
    initData() {
        this.apiService
            .getHardProductByShop(this.shopService.currentShop.id)
            .subscribe(r => {
                var hardProductBarcodes = r;

                this.stuffs = hardProductBarcodes.map(i => {
                    return {
                        id: i.id,
                        name: i.name,
                        label: i.label,
                        orderDetails: [],
                        total:
                            _.sumBy(i.hardBlockProductBarcodes, "count") -
                            _.sumBy(
                                i.hardBlockProductBarcodes,
                                "destroyedCount"
                            ),
                        barcode: i.barcode,
                        price: i.price,
                        hardBlockProductBarcodes: _.filter(
                            i.hardBlockProductBarcodes,
                            hb => {
                                return (
                                    hb.originalCount > 0 &&
                                    this.dateTimeService.isSameDate(
                                        new Date(hb.checkinDate),
                                        new Date()
                                    )
                                );
                            }
                        ),
                        destroyedHardBlockProductBarcodes: _.filter(
                            i.hardBlockProductBarcodes,
                            hb => {
                                return (
                                    hb.originalCount == 0 &&
                                    hb.destroyedCount > 0 &&
                                    this.dateTimeService.isSameDate(
                                        new Date(hb.destroyedTime),
                                        this.selectedDate
                                    )
                                );
                            }
                        ),
                        hardSetProductBarcodes: i.hardSetProductBarcodes,
                        start:
                            _.find(this.shiftSnapShotsFromPreviousDate, {
                                hardProductBarcodeId: i.id
                            }) != null
                                ? (_.find(this.shiftSnapShotsFromPreviousDate, {
                                    hardProductBarcodeId: i.id
                                }) as any).end
                                : undefined
                    };
                });
                this.apiService
                    .getIncomeHeadersByShop(
                        this.shopService.currentShop.id,
                        _moment(this.selectedDate).startOf('day').toDate(), _moment(this.selectedDate).endOf('day').toDate(), 'C'
                    )
                    .subscribe(r => {
                        this.loadingIndicator = false;

                            this.showTotalTab = true;

                            var allIts = _.flatten(_.map(r, 'incomeTransactions'));

                            //stuffs Bánh nhỏ
                            var groupsByBarcode = _.groupBy(
                                allIts,
                                "barcode"
                            );
                            _.each(this.stuffs, s => {
                                var amount = _.sumBy(
                                    groupsByBarcode[s.barcode],
                                    "amount"
                                );
                                s.saleCount = _.sumBy(
                                    groupsByBarcode[s.barcode],
                                    "quantity"
                                );
                                s.money = amount;
                                this.totalAmount += amount;

                                if (s.hardSetProductBarcodes) {
                                    _.each(s.hardSetProductBarcodes, hs => {
                                        var amount = _.sumBy(
                                            groupsByBarcode[hs.barcode],
                                            "amount"
                                        );
                                        hs.saleCount = amount / hs.price;
                                        this.totalAmount += amount;
                                        s.money += amount;
                                        s.saleCount +=
                                            hs.saleCount * hs.customerCount;
                                    });
                                }
                            });
                            this.stuffs = _.sortBy(this.stuffs, [
                                "label",
                                "name"
                            ]);
                        
                    });

                this.apiService.getOrderDetailsByDate4Small(this.shopService.currentShop.id, _moment(this.selectedDate).format("YYYY-MM-DD")).subscribe(r => {

                    _.each(r, i => {
                        var stuff = _.find(this.stuffs, { barcode: i.barcode });
                        if (stuff) {
                            stuff.orderDetails.push(i);

                        }
                    })

                })

            });


    }

    findOrderDetails(row){
        if(row.orderDetails){
            return row.orderDetails;
        }
        if(!this.stuffs) return [];
        var s= _.find(this.stuffs,{barcode: row.barcode});
        row.orderDetails = _.filter(s.orderDetails,{barcode: row.barcode});
        //row.saleCount  += _.sumBy(row.orderDetails,'quantity')
        return s.orderDetails;

    }

    openAddHardBlock(hardProductBarcode) {
        let dialogRef = this.dialog.open(AddStuffDialogComponent, {
            width: "300px",
            data: {
                hardProduct: hardProductBarcode
            }
        });
    }

    getRowClass(row) {
        return {
            "negative-count": row.total < 0
        };
    }

    changeToNextShift() {


            this.snotifyService.info("Vui lòng bấm nút Chuyển Ca ở vị trí chính giữa, bên trên");
            return false;
        

     
    }

    selectedIndexChanged() {
        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 250);
    }

    countArray(hardBlockProductBarcodes) {
        return _.sumBy(hardBlockProductBarcodes, "originalCount");
    }

    getTotalOfGroupLabel(items) {
        return _.sumBy(items, "money");
    }

    getSaleCountOfArray(array) {
        return _.sumBy(array, (i: any) => {
            return i.saleCount * i.customerCount;
        });
    }

    convertHPBSToStuffs(shift: Shift, previousShift: Shift, hardpbcs) {
        return hardpbcs.map(i => {
            return {
                name: i.name,
                id: i.id,
                label: i.label,
                barcode: i.barcode,
                price: i.price,
                hardBlockProductBarcodes: _.filter(
                    shift.hardBlockProductBarcodes,
                    hbpc => {
                        return (
                            hbpc.hardProductBarcodeId ===
                            i.id && hbpc.originalCount > 0
                        );
                    }
                ),
                destroyedHardBlockProductBarcodes: _.filter(
                    shift.hardBlockProductBarcodes,
                    hbpc => {
                        return (
                            hbpc.hardProductBarcodeId === i.id &&
                            hbpc.originalCount == 0 &&
                            hbpc.destroyedCount > 0
                        );
                    }
                ),
                hardSetProductBarcodes: _.cloneDeep(
                    i.hardSetProductBarcodes
                ),
                end:
                    _.find(shift.shiftSnapShots, {
                        hardProductBarcodeId: i.id
                    }) != null
                        ? (_.find(shift.shiftSnapShots, {
                            hardProductBarcodeId: i.id
                        }) as any).end
                        : undefined,
                start: previousShift
                    ? _.find(previousShift.shiftSnapShots, {
                        hardProductBarcodeId: i.id
                    }) != null
                        ? (_.find(previousShift.shiftSnapShots, {
                            hardProductBarcodeId: i.id
                        }) as any).end
                        : undefined
                    : _.find(
                        this.shiftSnapShotsFromPreviousDate,
                        { hardProductBarcodeId: i.id }
                    ) != null
                        ? (_.find(
                            this.shiftSnapShotsFromPreviousDate,
                            { hardProductBarcodeId: i.id }
                        ) as any).end
                        : undefined
            } as any;
        })
    }

    showReportButtonsByShift(shift: Shift) {
        var stuffs = _.sortBy(shift.stuffs, ["name"]);

        var buttons = [
            {
                name: "Báo cáo bánh nhỏ theo ca",
                action: () => {
                    if (this.memberService.hasFinancial) {
                        var columnCount = 7;
                    }
                    if (!this.memberService.hasFinancial) {
                        var columnCount = 6;
                    }
                    const doc = new Document(undefined, {
                        top: 5,
                        right: 5,
                        bottom: 5,
                        left: 5
                    });
                    doc.Header.createParagraph("    " + this.shopService.currentShop.name);
                    doc.Footer.createParagraph("    " + this.shopService.currentShop.name);

                    var reportName =
                        "Báo cáo " + shift.name +
                        " (" + new DatePipe("vi-VN").transform(shift.firstTransactionTime, "short") + " - " +
                        new DatePipe("vi-VN").transform(shift.lastTransactionTime, "short") + ")";
                    doc.addParagraph(new Paragraph(reportName).heading1().center());

                    //foreach tables
                    var isFirstTable = true;
                    _.each(
                        this.barcodeService.hardProductBarcodeLabels,
                        label => {
                            var labelStuffs = _.filter(stuffs as any, {
                                label: label
                            }) as Array<any>;

                            doc.addParagraph(new Paragraph());
                            doc.addParagraph(new Paragraph());
                            doc.addParagraph(new Paragraph("    " + label).heading1());
                            if (this.memberService.hasFinancial) {
                                doc.addParagraph(new Paragraph("      " + new CurrencyFormatPipe().transform(_.sumBy(labelStuffs, "money"))).spacing({ before: 50 }));
                            }
                            doc.addParagraph(new Paragraph());

                            var index = 0;
                            var rowCount = labelStuffs.length + 1;

                            if (isFirstTable) {
                                index++;
                                rowCount++;
                            }

                            var table = new Table(rowCount, columnCount);
                            table.setWidth(WidthType.PERCENTAGE, "100%");
                            doc.addTable(table);

                            table.getCell(0, 0).CellProperties.setWidth("30%", WidthType.PERCENTAGE);
                            table.getCell(0, 1).CellProperties.setWidth("10%", WidthType.PERCENTAGE);
                            table.getCell(0, 2).CellProperties.setWidth("15%", WidthType.PERCENTAGE);
                            table.getCell(0, 3).CellProperties.setWidth("10%", WidthType.PERCENTAGE);
                            table.getCell(0, 4).CellProperties.setWidth("15%", WidthType.PERCENTAGE);
                            table.getCell(0, 5).CellProperties.setWidth("10%", WidthType.PERCENTAGE);
                            if (this.memberService.hasFinancial) {
                                table.getCell(0, 6).CellProperties.setWidth("10%", WidthType.PERCENTAGE);
                            }

                            if (isFirstTable) {
                                table.getCell(0, 0).addContent(new Paragraph("Tên bánh").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 1).addContent(new Paragraph("Tồn đầu").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 2).addContent(new Paragraph("Nhập bởi").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 3).addContent(new Paragraph("Hủy").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 3).addContent(new Paragraph("Lý Do").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 4).addContent(new Paragraph("Bán").heading3().center().spacing({ before: 100 }));
                                if (this.memberService.hasFinancial) {
                                    table.getCell(0, 5).addContent(new Paragraph("Thành tiền").heading3().center().spacing({ before: 100 }));
                                    table.getCell(0, 5).addContent(new Paragraph(new CurrencyFormatPipe().transform(shift.totalAmount)).heading3().center().spacing({ before: 100 }));
                                    table.getCell(0, 6).addContent(new Paragraph("Tồn cuối").heading3().center().spacing({ before: 100 }));
                                }
                                if (!this.memberService.hasFinancial) {
                                    table.getCell(0, 5).addContent(new Paragraph("Tồn cuối").heading3().center().spacing({ before: 100 }));
                                }
                            }
                            isFirstTable = false;

                            var index = 1;
                            _.each(labelStuffs, stuff => {
                                table
                                    .getCell(index, 0)
                                    .addContent(new Paragraph().addRun(new TextRun((stuff.name)).size(24)).spacing({ before: 100, after: 100 }));
                                
                                var startStocks = stuff.start || stuff.end + stuff.saleCount + _.sumBy(stuff.destroyedHardBlockProductBarcodes,'destroyedCount') - _.sumBy(stuff.hardBlockProductBarcodes,'originalCount');
                                if(!startStocks){
                                    startStocks = 0;
                                }
                                table
                                    .getCell(index, 1)
                                    .addContent(new Paragraph(startStocks.toString()).center().spacing({ before: 100, after: 100 }));
                                // table.getCell(index, 2).addContent(new Paragraph( inputTotall> 0? inputTotall.toString() :"" ));

                                var groupedByMemberId = _.groupBy(
                                    stuff.hardBlockProductBarcodes,
                                    "checkinBy"
                                );
                                _.each(
                                    Object.keys(groupedByMemberId),
                                    memberId => {
                                        var memberName = this.shopService.getMemberNameById(parseInt(memberId));
                                        table
                                            .getCell(index, 2)
                                            .addContent(
                                                new Paragraph(_.sumBy(groupedByMemberId[memberId], "originalCount").toString() + " - " + memberName).spacing({ before: 100, after: 100 })
                                            );
                                    }
                                );

                                _.each(stuff.destroyedHardBlockProductBarcodes, d => {
                                    table
                                        .getCell(index, 3)
                                        .addContent(new Paragraph(d.destroyedCount).center().spacing({ before: 100, after: 100 }))
                                        .addContent(new Paragraph(d.destroyedReason).center().spacing({ before: 100, after: 100 }))
                                })


                                table
                                    .getCell(index, 4)
                                    .addContent(new Paragraph(stuff.saleCount + _.sumBy(stuff.orderDetails,'quantity')).center().spacing({ before: 100, after: 100 }));
                                if (stuff.hardSetProductBarcodes.length > 0) {
                                    let par = new Paragraph().addRun(new TextRun(stuff.saleCount - this.getSaleCountOfArray(stuff.hardSetProductBarcodes) + " " + (stuff.name)).break());
                                    _.each(stuff.hardSetProductBarcodes, set => {
                                        par.addRun(new TextRun(set.saleCount * set.customerCount + `( ${set.name} x ${set.saleCount})`).break());
                                    })
                                    par.Borders.addTopBorder("red", BorderStyle.DASH_DOT_STROKED, '', '3');
                                    table
                                        .getCell(index, 4)
                                        .addContent(par.center());
                                }
                                if (this.memberService.hasFinancial) {
                                    if (stuff.money > 0) {
                                        table
                                            .getCell(index, 5)
                                            .addContent(new Paragraph(new CurrencyFormatPipe().transform(stuff.money)).center().spacing({ before: 100, after: 100 }));
                                    }

                                    if(stuff.end){
                                        table
                                        .getCell(index, 6)
                                        .addContent(new Paragraph(stuff.end).center().spacing({ before: 100, after: 100 }));
                                    }else{
                                        var endStocks = stuff.start + _.sumBy(stuff.hardBlockProductBarcodes,'originalCount') - stuff.saleCount - _.sumBy(stuff.destroyedHardBlockProductBarcodes,'destroyedCount');
                                        table
                                        .getCell(index, 6)
                                        .addContent(new Paragraph(endStocks.toString()).center().spacing({ before: 100, after: 100 }));
                                    }
                                    
                                }
                                if (!this.memberService.hasFinancial) {
                                    if(stuff.end){
                                        table
                                        .getCell(index, 5)
                                        .addContent(new Paragraph(stuff.end).center().spacing({ before: 100, after: 100 }));
                                    }else{
                                        var endStocks = stuff.start + _.sumBy(stuff.hardBlockProductBarcodes,'originalCount') - stuff.saleCount - _.sumBy(stuff.destroyedHardBlockProductBarcodes,'destroyedCount');
                                        table
                                        .getCell(index, 5)
                                        .addContent(new Paragraph(endStocks.toString()).center().spacing({ before: 100, after: 100 }));
                                    }
                                }

                                index++;
                            });
                        }
                    );


                    const packer = new Packer();

                    packer.toBlob(doc).then(blob => {
                        saveAs(blob, reportName + ".docx");
                        console.log("Document created successfully");
                    });
                }
            }
        ];
        this.bottomSheet.open(DownloadReportComponent, {
            data: {
                buttons: buttons
            }
        });
    }

    showReportButton() {
        var stuffs = _.sortBy(this.stuffs, ["name"]);

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

                    var reportName =
                        "Báo cáo tổng kết ngày" +
                        " (" + new DatePipe("vi-VN").transform(this.selectedDate, "short") + ")";
                    doc.addParagraph(new Paragraph(reportName).heading1().center());

                    var isFirstTable = true;
                    _.each(
                        this.barcodeService.hardProductBarcodeLabels,
                        label => {
                            var labelStuffs = _.filter(stuffs as any, {
                                label: label
                            }) as Array<any>;

                            var index = 0;
                            var rowCount = labelStuffs.length + 1;
                            if (isFirstTable) {
                                index++;
                                rowCount++;
                            }

                            doc.addParagraph(new Paragraph());
                            doc.addParagraph(new Paragraph());
                            doc.addParagraph(new Paragraph(label).heading1().left());
                            doc.addParagraph(new Paragraph(new CurrencyFormatPipe().transform(_.sumBy(labelStuffs, "money"))).left());
                            doc.addParagraph(new Paragraph());

                            var table = new Table(rowCount, columnCount);
                            table.setWidth(WidthType.PERCENTAGE, "100%");
                            doc.addTable(table);

                            table.getCell(0, 0).CellProperties.setWidth("25%", WidthType.PERCENTAGE);
                            table.getCell(0, 1).CellProperties.setWidth("10%", WidthType.PERCENTAGE);
                            table.getCell(0, 2).CellProperties.setWidth("15%", WidthType.PERCENTAGE);
                            table.getCell(0, 3).CellProperties.setWidth("20%", WidthType.PERCENTAGE);
                            table.getCell(0, 4).CellProperties.setWidth("15%", WidthType.PERCENTAGE);
                            table.getCell(0, 5).CellProperties.setWidth("10%", WidthType.PERCENTAGE);

                            if (isFirstTable) {
                                table.getCell(0, 0).addContent(new Paragraph("Tên bánh").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 1).addContent(new Paragraph("Đầu ngày").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 2).addContent(new Paragraph("Nhập bởi").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 3).addContent(new Paragraph("Bán").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 4).addContent(new Paragraph("Thành tiền").heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 4).addContent(new Paragraph(new CurrencyFormatPipe().transform(this.totalAmount)).heading3().center().spacing({ before: 100 }));
                                table.getCell(0, 5).addContent(new Paragraph("Hiện tại").heading3().center().spacing({ before: 100 }));
                            }

                            isFirstTable = false;

                            _.each(labelStuffs, stuff => {
                                table
                                    .getCell(index, 0)
                                    .addContent(new Paragraph(stuff.name).spacing({ before: 100, after: 100 }));

                                var startStocks = stuff.start || stuff.end + stuff.saleCount + _.sumBy(stuff.destroyedHardBlockProductBarcodes,'destroyedCount') - _.sumBy(stuff.hardBlockProductBarcodes,'originalCount');
                                if(!startStocks){
                                    startStocks = 0;
                                }
                                table
                                    .getCell(index, 1)
                                    .addContent(new Paragraph(startStocks.toString()).center().spacing({ before: 100, after: 100 }));
                                var groupedByMemberId = _.groupBy(stuff.hardBlockProductBarcodes, "checkinBy");

                                _.each(
                                    Object.keys(groupedByMemberId),
                                    memberId => {
                                        var memberName = this.shopService.getMemberNameById(parseInt(memberId));
                                        table
                                            .getCell(index, 2)
                                            .addContent(
                                                new Paragraph(_.sumBy(groupedByMemberId[memberId], "originalCount").toString() + " - " + memberName).spacing({ before: 100, after: 100 })
                                            );
                                    }
                                );

                                if ((stuff.saleCount + _.sumBy(stuff.orderDetails, 'quantity') + _.sumBy(stuff.destroyedHardBlockProductBarcodes, 'destroyedCount')) > 0) {
                                    table
                                        .getCell(index, 3)
                                        .addContent(new Paragraph(`Tổng: ` + `-` + `${stuff.saleCount + _.sumBy(stuff.orderDetails, 'quantity') + _.sumBy(stuff.destroyedHardBlockProductBarcodes, 'destroyedCount')}`).center().heading5().spacing({ before: 100, after: 100 }));
                                    table
                                        .getCell(index, 3)
                                        .addContent(new Paragraph(stuff.saleCount + `(bán)`).center());
                                    if (stuff.hardSetProductBarcodes.length > 0) {
                                        let par = new Paragraph().addRun(new TextRun(stuff.saleCount - this.getSaleCountOfArray(stuff.hardSetProductBarcodes) + " " + (stuff.name)).break())
                                        _.each(stuff.hardSetProductBarcodes, set => {
                                            par.addRun(new TextRun(set.saleCount * set.customerCount + `( ${set.name} x ${set.saleCount})`).break());
                                        })
                                        par.Borders.addTopBorder("red", BorderStyle.DASH_DOT_STROKED, '', '3');
                                        table
                                            .getCell(index, 3)
                                            .addContent(par.center());
                                    }
                                    if (stuff.orderDetails.length > 0) {
                                        _.each(stuff.orderDetails, od => {
                                            table
                                                .getCell(index, 3)
                                                .addContent(new Paragraph(od.quantity + `(đặt)`).center())
                                        })
                                    }
                                    if (stuff.destroyedHardBlockProductBarcodes.length > 0) {
                                        _.each(stuff.destroyedHardBlockProductBarcodes, d => {
                                            table
                                                .getCell(index, 3)
                                                .addContent(new Paragraph(d.destroyedCount + `(hủy)`).center())
                                        })
                                    }
                                }

                                if (stuff.money > 0) {
                                    table
                                        .getCell(index, 4)
                                        .addContent(new Paragraph(new CurrencyFormatPipe().transform(stuff.money)).center().spacing({ before: 100, after: 100 }));
                                }

                                table
                                    .getCell(index, 5)
                                    .addContent(new Paragraph(stuff.total).center().spacing({ before: 100, after: 100 }));
                                index++;
                            });
                        }
                    );

                    const packer = new Packer();

                    packer.toBlob(doc).then(blob => {
                        saveAs(blob, reportName + ".docx");
                        console.log("Document created successfully");
                    });
                }
            }
            //   {
            //   name: "Tải báo cáo theo ca (docx)",
            //   link: environment.baseURl + "api/report/shift/" + this.shopService.currentShop.id + "/" + shift.id + "/" +_moment(new Date()).format("YYYY-MM-DD")
            // }
        ];
        this.bottomSheet.open(DownloadReportComponent, {
            data: {
                buttons: buttons
            }
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
}

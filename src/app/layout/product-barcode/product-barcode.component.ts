import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { ProductBarcode } from '../../shared/models/product-barcode.model';
import * as _ from 'lodash';
import { ProductCategory } from '../../shared/models/product-category.model';
import { BarcodeService } from '../../shared/services/barcode.service';
import { saveAs } from 'file-saver';
import { Base64 } from 'js-base64';
import { SnotifyService } from 'ng-snotify';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ShopService } from '../../shared/services/shop.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';
import { routerTransition } from '../../router.animations';
import { Document, Packer, Paragraph, WidthType, Media, VerticalAlign, TextRun, Run, HorizontalPositionAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, VerticalPositionAlign, Spacing } from 'docx';
import * as JsBarcode from 'jsbarcode';
import { MatDialog } from '@angular/material/dialog';
import { ActiveProductBarcodeComponent } from './components/active-product-barcode/active-product-barcode.component';
import { SoldProductBarcodeComponent } from './components/sold-product-barcode/sold-product-barcode.component';
import { InactiveProductBarcodeComponent } from './components/inactive-product-barcode/inactive-product-barcode.component';
import * as QRCode from 'qrcodejs2';
import { InputProductDialogComponent } from './components/input-product-dialog/input-product-dialog.component';
import { MemberService } from '../../shared/services/member.service';
import { Router } from '@angular/router';
import { format } from 'url';

declare var jquery: any;
declare var $: any;

@Component({
    selector: 'app-product-barcode',
    templateUrl: './product-barcode.component.html',
    styleUrls: ['./product-barcode.component.scss'],
    animations: [routerTransition()]
})
export class ProductBarcodeComponent implements OnInit {
    selectedBarcodeSize: number;

    barcode = {
        type: 1,
        price: 1,
        number: 0,
        date: new Date()
    };


    productBarcodePrintingQuantity: number;
    selectedIndexTab: number;
    categories: ProductCategory[];

    currentMemberId = 0;

    addQrCode = false;
    qrCodeValue = "";

    @ViewChild(DatatableComponent,{static: true}) table: DatatableComponent;
    @ViewChild(ActiveProductBarcodeComponent,{static: true}) activePBC: ActiveProductBarcodeComponent;
    @ViewChild(SoldProductBarcodeComponent,{static: true}) soldPBC: SoldProductBarcodeComponent;
    @ViewChild(InactiveProductBarcodeComponent,{static: true}) inactivePBC: InactiveProductBarcodeComponent;

    //bar chart
    barChartOptions: any;
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;
    public barChartData: any[];
    public barChartLabels: string[] = [];

    constructor(public dialog: MatDialog, private apiService: ApiService, public barcodeService: BarcodeService,
        private snotifyService: SnotifyService, public shopService: ShopService, private memberService: MemberService, private router: Router, ) {
        this.barChartOptions = {
            scaleShowVerticalLines: true,
            responsive: true,
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false,
                        maxRotation: 60,
                        minRotation: 60
                    }
                }]
            },
            tooltips: {
                // Disable the on-canvas tooltip
                enabled: false,

                custom: function (tooltipModel) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip') as any;

                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = "<table></table>";
                        document.body.appendChild(tooltipEl);
                    }
                    tooltipEl.style.zIndex = "2";
                    tooltipEl.style.background = "#000000c4";
                    tooltipEl.style.color = "white";
                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        $('#chartjs-tooltip').remove();
                        return;
                    }

                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }

                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }

                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);

                        var innerHtml = '<thead>';

                        titleLines.forEach(function (title) {
                            innerHtml += '<tr><th>' + title + '</th><th></th></tr>';
                        });
                        innerHtml += '</thead><tbody>';

                        bodyLines.forEach(function (body, i) {
                            var colors = tooltipModel.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td>' + span + body + '</td></tr>';
                        });


                        var productBarcodes = barcodeService.getProductBarcodeNotSoldByName(titleLines[0]) as Array<ProductBarcode>;
                        productBarcodes.forEach(i => {

                            innerHtml += '<tr><td>' + i.barcode + '</td>'

                                + '<td>' + new TimeAgoPipe().transform(i.checkinDate) + '</td></tr>';
                        });
                        if (productBarcodes.length >= 15) innerHtml += "<tr><td>...</td></tr>"
                        innerHtml += '</tbody>';

                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }

                    // `this` will be the overall tooltip
                    var position = this._chart.canvas.getBoundingClientRect();

                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.marginLeft = "20px";
                }
            }
        };
    }

    ngOnInit() {
        this.currentMemberId = parseInt(localStorage.getItem('memberId'));

        this.selectedBarcodeSize = parseInt(JSON.parse(localStorage.getItem('selectedBarcodeSize') || "33522"));

        this.getCategoriesWithBarcode();

        if (this.barcodeService.productBarcodes) {
            this.initChartData();
        }
        else {
            this.barcodeService.listChanged.subscribe(r => {
                this.initChartData();
            })
        }

    }

    // ngOnDestroy() {
    //     $('body').scannerDetection(false);
    // }

    selectedIndexChanged() {
        if (this.selectedIndexTab == 0) {
            setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 250)
        }
    }



    get bcValue(): string {
        var today = new Date().getDate();
        var today2Digits = ("0" + today).slice(-2);
        var month2Digits = ("0" + (new Date().getMonth() + 1)).slice(-2);
        var barcodeData = `0${this.barcode.price.toString()}${this.barcode.type.toString()}${today2Digits}${month2Digits}001`;
        return barcodeData;
    }

    readFileXml() {
        if (this.selectedBarcodeSize == 4) {
            this.generateDocxBarcodes();
            return true;
        }

        var categoryName = `${this.barcodeService.getCategoryName(this.barcode.type)}`;
        var priceData = `${this.barcode.price.toString()}.000 đ`;
        var barcodeData = this.bcValue;
        var printer = this.shopService.getShopConfigByName("printer-label-config");

        //build file string

        let str: string = `<?xml version="1.0" encoding="utf-8"?>
        <labelshopdocument version="1.2" tag="for Zenpart" date="2018-09-09 16:14:42" sign="5f66f8923a3ffc9a0f321cdd462f67f9" docid="d31ec930-11bb-4e9d-ba0f-537b53cb1741">
            <labelform version="1.1">
                <paper name="Untitled" code="0" brand="0" cate="0" syslabel="0" otype="0" type="0" maxid="13">
                    <paper size="256" atuoset="0" width="10500" height="2200" orientation="1" color="255,255,255" leftoffect="0" topoffect="0"/>
                    ${printer}
                </paper>
                <labellayer>
                    <labelformat name="Untitled" uint="0">
                        <page left="0" top="0" right="100" bottom="0" viewrotate="0"/>
                        <label width="3500" height="2200" rows="1" cols="3" rowgap="100" colgap="0" rotation="0"/>
                        <form corner="0" hole="0" holesize="0" order="LTH"/>
                    </labelformat>
                    <labelobjects>
                        <drawobj type="drawbarcode" id="2" name="" left="211" top="894" right="3289" bottom="1905" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <barcode btype="2" barwidth="985" charextra="0" gapwidth="0" radio="300" wide="300" reduction="0" high="698" readable="0" ralign="2" rcolgap="0" readx="0" ready="0" templet="0" templtestr=""/>
                            <font facename="Arial" style="0" charset="0" height="788" width="0" italic="0" steikeout="0" underline="0" family="0" color="0,0,0" bkcolor="255,255,255"/>
                            <baroption check="0" stchar="1" fullascii="0" c128codeset="0" c128ean="0" codabarschar="0" codabarechar="0" c25schar="0" c25echar="0" eanaddon="0" itf14bar="1" itf14barwidth="5" itf14barspace="10" itf14check="1" rsstype="0" rssseph="1" rsssegr="11" rsshold="0"/>
                            <baroption2 p417cols="0" p4172rows="0" p417ecc="0" p417t="0" qrecc="0" dmbw="0" mxsize="0" mxmode="0" hsecc="0" hsencrypt="0" hskey="" hsver="0" codepage="0" stdisx="4" stdisy="4" stdot="1" width2d="2000" height2d="2000"/>
                        </drawobj>
                        <drawobj type="drawtext" id="10" name="" left="350" top="80" right="3150" bottom="318" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <text type="0" width="0" align="2" cut="0" spactype="0" spacing="0" charextra="0" template="0" templtestr="" circr="0" circradian="0" circstart="0" circtw="0" circway="0"/>
                            <font facename="Arial" style="1" charset="1" height="600" width="12000" italic="0" steikeout="0" underline="0" family="34" color="0,0,0" bkcolor="255,255,255"/>
                        </drawobj>
                        <drawobj type="drawtext" id="12" name="" left="493" top="393" right="3008" bottom="793" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <text type="1" width="0" align="2" cut="0" spactype="0" spacing="0" charextra="0" template="0" templtestr="" circr="0" circradian="0" circstart="0" circtw="0" circway="0"/>
                            <font facename="Arial" style="0" charset="1" height="1000" width="16555" italic="0" steikeout="0" underline="0" family="0" color="0,0,0" bkcolor="255,255,255"/>
                        </drawobj>
                    </labelobjects>
                    <objvarlink link=":2,1:10,9:12,11"/>
                </labellayer>
                <variables>
                        <variable type="serial" id="1" name="" shareid="barcode" data="${Base64.encode(barcodeData)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="9" name="" shareid="shopname" data="${Base64.encode(categoryName)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="11" name="" shareid="price" data="${Base64.encode(priceData)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                    </variables>
            </labelform>
            <database version="1.0">
                <Connection type="2" table="" colout="" group="1" config="" file="" parameter="">
                    <fields/>
                </Connection>
            </database>
            <pictures/>
        </labelshopdocument>        
    `;

        if (this.selectedBarcodeSize == 24025) {
            str = `<?xml version="1.0" encoding="utf-8"?>
        <labelshopdocument version="1.2" tag="for Zenpart" date="2018-09-09 16:14:42" sign="5f66f8923a3ffc9a0f321cdd462f67f9" docid="d31ec930-11bb-4e9d-ba0f-537b53cb1741">
            <labelform version="1.1">
                <paper name="Untitled" code="0" brand="0" cate="0" syslabel="0" otype="0" type="0" maxid="13">
                    <paper size="256" atuoset="0" width="8500" height="2500" orientation="1" color="255,255,255" leftoffect="0" topoffect="0"/>
                    ${printer}
                </paper>
                <labellayer>
                    <labelformat name="Untitled" uint="0">
                        <page left="0" top="0" right="100" bottom="0" viewrotate="0"/>
                        <label width="4000" height="2500" rows="1" cols="2" rowgap="100" colgap="0" rotation="0"/>
                        <form corner="0" hole="0" holesize="0" order="LTH"/>
                    </labelformat>
                    <labelobjects>
                        <drawobj type="drawbarcode" id="2" name="" left="461" top="1285" right="3539" bottom="2296" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <barcode btype="2" barwidth="985" charextra="0" gapwidth="0" radio="300" wide="300" reduction="0" high="698" readable="0" ralign="2" rcolgap="0" readx="0" ready="0" templet="0" templtestr=""/>
                            <font facename="Arial" style="0" charset="0" height="788" width="0" italic="0" steikeout="0" underline="0" family="0" color="0,0,0" bkcolor="255,255,255"/>
                            <baroption check="0" stchar="1" fullascii="0" c128codeset="0" c128ean="0" codabarschar="0" codabarechar="0" c25schar="0" c25echar="0" eanaddon="0" itf14bar="1" itf14barwidth="5" itf14barspace="10" itf14check="1" rsstype="0" rssseph="1" rsssegr="11" rsshold="0"/>
                            <baroption2 p417cols="0" p4172rows="0" p417ecc="0" p417t="0" qrecc="0" dmbw="0" mxsize="0" mxmode="0" hsecc="0" hsencrypt="0" hskey="" hsver="0" codepage="0" hollow="0" stdisx="4" stdisy="4" stdot="1" width2d="2000" height2d="2000"/>
                        </drawobj>
                        <drawobj type="drawtext" id="10" name="" left="242" top="251" right="3759" bottom="526" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <text type="0" width="0" align="2" cut="0" spactype="0" spacing="0" charextra="0" template="0" templtestr="" circr="0" circradian="0" circstart="0" circtw="0" circway="0"/>
                            <font facename="Arial" style="1" charset="1" height="700" width="12000" italic="0" steikeout="0" underline="0" family="34" color="0,0,0" bkcolor="255,255,255"/>
                        </drawobj>
                        <drawobj type="drawtext" id="12" name="" left="743" top="672" right="3258" bottom="1072" rotation="none" style="0" halign="2" valign="0" tpalign="0" tvalign="0">
                            <color type="0" mode="1" table="0" change="0" varname="" index="123" colors="#FF0000,#00FF00,#0000FF" col="2" row="2"/>
                            <text type="1" width="0" align="2" cut="0" spactype="0" spacing="0" charextra="0" template="0" templtestr="" circr="0" circradian="0" circstart="0" circtw="0" circway="0"/>
                            <font facename="Arial" style="0" charset="1" height="1000" width="16555" italic="0" steikeout="0" underline="0" family="0" color="0,0,0" bkcolor="255,255,255"/>
                        </drawobj>
                    </labelobjects>
                    <objvarlink link=":2,1:10,9:12,11"/>
                </labellayer>
                <variables>
                        <variable type="serial" id="1" name="" shareid="barcode" data="${Base64.encode(barcodeData)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="9" name="" shareid="shopname" data="${Base64.encode(categoryName)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="11" name="" shareid="price" data="${Base64.encode(priceData)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                    </variables>
            </labelform>
            <database version="1.0">
                <Connection type="2" table="" colout="" group="1" config="" file="" parameter="">
                    <fields/>
                </Connection>
            </database>
            <pictures/>
        </labelshopdocument>        
    `;
        }

        var myblob = new Blob([str], {
            type: 'text/plain'
        });
        saveAs(myblob, `${categoryName} - ${this.barcode.price.toString()}.lsdx`);
    }

    selectedBarcodeSizeChanged() {
        console.log(this.selectedBarcodeSize);
        localStorage.setItem("selectedBarcodeSize", this.selectedBarcodeSize.toString());
    }

    addQrCodeChanged() {
        this.qrCodeValue = this.bcValue;
    }

    //generateDocx
    generateDocxBarcodes() {
        var columnCount = 4;
        var rowCount = this.productBarcodePrintingQuantity / columnCount;
        const doc = new Document(undefined, {
            top: 5,
            right: 5,
            bottom: 5,
            left: 100
        });

        const table = doc.createTable(rowCount, columnCount);
        // doc.Header.createParagraph(this.shopService.currentShop.name);
        // doc.Footer.createParagraph(this.shopService.currentShop.name);
        table.setWidth(WidthType.PERCENTAGE, '98%');
        var name = this.barcodeService.getCategoryName(this.barcode.type);
        var today = new Date().getDate();
        var today2Digits = ("0" + today).slice(-2);
        var month2Digits = ("0" + (new Date().getMonth() + 1)).slice(-2);
        var index = 0;

        for (var i = 0; i < rowCount; i++) {
            for (var j = 0; j < columnCount; j++) {
                index++;
                var canvas = document.createElement("canvas");
                canvas.style.display = "none";

                var barcodeData = `0${this.barcode.price.toString()}${this.barcode.type.toString()}${today2Digits}${month2Digits}` + ('000' + index).substr(-3);
                const paragraph = new Paragraph().center();
                // if (this.addQrCode) {

                //     var qrcode = new QRCode(document.getElementById('testQr'), {
                //         text: barcodeData,
                //     });
                //     qrcode.clear();
                //     qrcode.makeCode(barcodeData);

                //     var canvasQr = document.querySelector("#testQr canvas") as any;
                //     const qrimage = Media.addImage(doc, canvasQr.toDataURL("image/png"), 40, 40, {
                        
                //         floating: {
                //             horizontalPosition: {
                //                 offset: 30000, // relative: HorizontalPositionRelativeFrom.PAGE by default
                //             },
                //             verticalPosition: {
                //                 offset: 50000, // relative: VerticalPositionRelativeFrom.PAGE by default
                //             },
                        
                //         }
                       
                //     });

                //     paragraph.addRun(qrimage.Run);
                // }

                paragraph.addRun(new TextRun(name).bold().tab()).spacing({before:50});
                paragraph.addRun(new TextRun(`${this.barcode.price.toString()}.000 đ`).size(26).bold().tab().break());
                
                table.getCell(i, j).addContent(paragraph);
                JsBarcode(canvas, barcodeData, { format: "CODE128", height: 30, textMargin: 0, fontSize: 18, });
                const image = Media.addImage(doc, canvas.toDataURL("image/png"), 160, 50);
                table.getCell(i, j).addContent(image.Paragraph.center());
                table.getCell(i, j).CellProperties.setVerticalAlign(VerticalAlign.BOTTOM);
            }
        }

        const packer = new Packer();

        packer.toBlob(doc).then(blob => {
            console.log(blob);
            saveAs(blob, name + this.barcode.price.toString() + ".docx");
            console.log("Document created successfully");
        });
    }

    getCategoriesWithBarcode() {
        this.apiService.getProductCategoriesByShopWithBarcode(this.shopService.currentShop.id).subscribe(r => {
            this.categories = r;
        })
    }

    initChartData() {
        this.barChartData = [
            { data: [], label: 'Còn trong tủ' },
        ];
        this.barChartLabels = [];
        this.barcodeService.categories.forEach(i => {
            this.barChartLabels.push(i.name);
            this.barChartData[0].data.push(this.barcodeService.getCountByProductBarcodeId(i.idBarcode));
        });
    }

    openInputProduct() {
        this.router.navigateByUrl("/input-product-barcode");
    }

}


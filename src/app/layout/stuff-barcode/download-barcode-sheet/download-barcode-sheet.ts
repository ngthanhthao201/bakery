import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Inject } from "@angular/core";
import { ShopService } from "../../../shared/services/shop.service";
import { saveAs } from 'file-saver';
import { Base64 } from 'js-base64';
import {Document, Packer, Paragraph, WidthType, Media, VerticalAlign, TextRun, IFloating, HorizontalPositionAlign, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom, VerticalPositionAlign} from 'docx';
import * as JsBarcode from 'jsbarcode';
import { HardProductBarcode } from "../../../shared/models/hard-product-barcode.model";
import { CurrencyFormatPipe } from "../../../shared/pipes/currencyformat.pipe";
import { all } from "q";

@Component({
    selector: 'download-barcode-sheet',
    templateUrl: 'download-barcode-sheet.html',
    styleUrls: ['download-barcode-sheet.scss'],
  })
  export class DownloadBarcodeSheetComponent {
    buttons:Array<any>=[];
    hardProduct: HardProductBarcode;
    quantity: number;
    addQrCode = false;
    constructor(private shopService: ShopService, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<DownloadBarcodeSheetComponent>) {

        this.hardProduct = data.hardProduct;


    }
    downloadAsItem(){
      var printer = this.shopService.getShopConfigByName("printer-label-config");

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
                          <variable type="constant" id="1" name="" shareid="barcode" data="${Base64.encode(this.hardProduct.barcode)}" serialtype="0" serialstep="0" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                              <limit filled="left" fillchar="0" cutout="right"/>
                              <cut/>
                          </variable>
                          <variable type="constant" id="9" name="" shareid="shopname" data="${Base64.encode(this.hardProduct.name)}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                              <limit filled="left" fillchar="0" cutout="right"/>
                              <cut/>
                          </variable>
                          <variable type="constant" id="11" name="" shareid="price" data="${Base64.encode(this.hardProduct.price + 'đ')}" serialtype="0" serialstep="1" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
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

      var myblob = new Blob([str], {
          type: 'text/plain'
      });
      saveAs(myblob, `${this.hardProduct.name}-${this.hardProduct.price.toString()}.lsdx`);
    }

    downloadAsA4(){
      var columnCount =7;
      var rowCount = this.quantity / columnCount;
      const doc = new Document(undefined,{top: 5,
          right: 5,
          bottom: 5,
          left: 5});
      const table = doc.createTable(rowCount, columnCount);
    //   doc.Header.createParagraph(this.shopService.currentShop.name);
    //   doc.Footer.createParagraph(this.shopService.currentShop.name);
      table.setWidth(WidthType.PERCENTAGE, '100%');
     var name =  this.hardProduct.name;

     var index = 0;

      for(var i =0 ;i < rowCount; i++){
          for(var j =0 ;j < columnCount; j++){
             
              index ++;
              var canvas = document.createElement("canvas");
              canvas.style.display = "none";


               const paragraph = new Paragraph().center();
                if(this.addQrCode){
                    var canvasQr = document.querySelector("canvas") as any;
                    const qrimage = Media.addImage(doc, canvasQr.toDataURL("image/png"),40, 40,{
                        floating: {
                            horizontalPosition: {
                              relative: HorizontalPositionRelativeFrom.PAGE,
                              align: HorizontalPositionAlign.LEFT,
                            },
                            verticalPosition: {
                              relative: VerticalPositionRelativeFrom.PAGE,
                              align: VerticalPositionAlign.TOP,
                            },
                          }
                    } );
                
                paragraph.addRun(qrimage.Run);
                }

               paragraph.addRun(new TextRun(name).bold().tab().break());
               paragraph.addRun(new TextRun(`${ new CurrencyFormatPipe().transform(this.hardProduct.price)}`).bold().tab());

               table.getCell(i, j).addContent(paragraph);

               JsBarcode(canvas, this.hardProduct.barcode, {format: "CODE128",   height: 22, textMargin:0, fontSize:18});
               const image = Media.addImage(doc, canvas.toDataURL("image/png"),80, 52);
              table.getCell(i, j).addContent(image.Paragraph.center());
              table.getCell(i,j).CellProperties.setVerticalAlign(VerticalAlign.CENTER);
          }
      }


      

      const packer = new Packer();

          packer.toBlob(doc).then(blob => {
              console.log(blob);
              saveAs(blob, name+ ".docx");
              console.log("Document created successfully");
          });
    }

    downloadAsItem2(){
        var printer = this.shopService.getShopConfigByName("printer-label-config");
  
        let str: string = `<?xml version="1.0" encoding="utf-8"?>
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
                        <variable type="serial" id="1" name="" shareid="barcode" data="${Base64.encode(this.hardProduct.barcode)}" serialtype="0" serialstep="0" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="9" name="" shareid="shopname" data="${Base64.encode(this.hardProduct.name)}" serialtype="0" serialstep="0" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
                            <limit filled="left" fillchar="0" cutout="right"/>
                            <cut/>
                        </variable>
                        <variable type="constant" id="11" name="" shareid="price" data="${Base64.encode(this.hardProduct.price + 'đ')}" serialtype="0" serialstep="0" serialrepeat="1" serealreptype="0" serealreset="0" serealchars="" serealupper="" sereallower="" serealfield="" serealforder="0" serealsrc="0" databasefield="" databasegrindex="0" keyboardprompt="" datatimetype="0" datatimeoffect="0" datatimeformat="" usertc="0" rtctype="0" scripttext="" scriptpriv="RnVuY3Rpb24gT25HZXREYXRhKCkNCiAgICBPbkdldERhdGEgPSAiMTIzNDU2NzgiDQpFbmQgRnVuY3Rpb24=">
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
  
        var myblob = new Blob([str], {
            type: 'text/plain'
        });
        saveAs(myblob, `${this.hardProduct.name}-${this.hardProduct.price.toString()}.lsdx`);
      }

  }
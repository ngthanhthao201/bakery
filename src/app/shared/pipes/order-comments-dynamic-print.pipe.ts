import {Pipe, PipeTransform,ChangeDetectorRef} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser";
import { Order } from "../models/order.model";
import { VnPhonePipe } from "./vnphone.pipe";
import { DatePipe } from "@angular/common";

@Pipe({
    name: 'orderCommentsDynamicPrint',
    pure: true
})
export class OrderCommentsDynamicPrintPipe implements  PipeTransform
{

    constructor( private sanitized: DomSanitizer)
    {
       
    }


    transform(obj:Order, parameter: string)
    {
        try {

           var advanceComments =  obj.advanceComments || JSON.parse(obj.comments)  ;
           var currentCustomer = obj.customer ;
            // return this.sanitized.bypassSecurityTrustHtml(`
            //         <table style="width: 100%">
            //             <tbody>
            //                 ${(obj.attachments && obj.attachments.length > 0) ?
            //                     `
            //                     <tr>
            //                         <td>
            //                         <span> Có <span style="font-size:14pt; font-weight: bold"> ${obj.attachments.length} mẫu</span>(quét mã bên trên)</span>
            //                         </td>
            //                     </tr>
            //                     `
            //                     :''}
 
            //                 <tr>
            //                     <td>
            //                        L.Bánh:  <span style="white-space: pre-line; font-size:14pt; font-weight: bold">`+ (advanceComments.size || '--') +`</span>
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>
            //                     Nhân:  <span style="white-space: pre-line; font-size:14pt; font-weight: bold">`+ (advanceComments.filling || '--') +`</span>
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>
            //                         N.Dung:  <span  style="white-space: pre-line;font-size:14pt; font-weight: bold">`+ (advanceComments.note || '--') +`</span>
            //                     </td>
            //                 </tr>
            //                 <tr>
            //                     <td>
            //                         Đ/C Giao: <span *ngIf="advanceComments.address != null" style="white-space: pre-line; font-size:14pt; font-weight: bold">` + (advanceComments.address || '--') +`</span>
            //                     </td>
                                
            //                 </tr>
            //             </tbody>
            //         </table>
            //    `);


            //new design receipt
            return this.sanitized.bypassSecurityTrustHtml(`
            <div style="width:98%; border: dotted 1px; padding:5px" >
            ${(obj.attachments && obj.attachments.length > 0) 
                ?
                ` <span> Có <span style="font-size:14pt; font-weight: bold"> ${obj.attachments.length} mẫu</span>(quét mã bên trên)</span><br>`
                :``}
            <small>Loại bánh - kích thước</small>
            <strong style="white-space: pre-line;font-size:14pt;">
            ${advanceComments.size}
            </strong> 
         
            <div style="display:inline-flex; width:100%">
                ${ (advanceComments.filling && advanceComments.filling != 'null') ?`
                <div style="width: 50%">
                    <small>Nhân</small> <br>
                    <strong style="font-size:16pt;">
                    ${advanceComments.filling}
                    </strong>
                </div>
                ` :`` }
                ${ (advanceComments.numberCandle && advanceComments.numberCandle != 'Không lấy') ?`
                    <div style="width: 50%">
                        <small>Nến số</small> <br>
                        <strong style="font-size:16pt;">
                        ${advanceComments.numberCandle}
                        </strong>
                    </div>
                `:``}
            </div>
            <br>
      

              <small>Nội dung</small> <br><strong style="white-space: pre-line;font-size:14pt;">${advanceComments.note}
                </strong> 
          </div>
          
          
          <div style="width:98%; border: dotted 1px; padding:5px" >
            <small>SDT Khách</small> 
            <strong style="float:right">
             ${ currentCustomer.phoneNumber ? new VnPhonePipe().transform(currentCustomer.phoneNumber) : ''}
            </strong> 
            <br>
            <small>Ngày giao</small> 
            <strong style="float:right">${new DatePipe('vi-VN').transform( obj.deliveryPickupTime, 'HH:mm EEEE, d/MM')}</strong> 
            <br>
            ${advanceComments.address ? `
                <small>Địa chỉ giao</small>
                <strong style="white-space: pre-line;font-size:14pt;">
                ${advanceComments.address}
                </strong>
            `:``}
            ${advanceComments.deliveryInstruction ? `
                <small>Chỉ đường</small>
                <strong style="white-space: pre-line;font-size:14pt;">
                    ${(advanceComments.deliveryInstruction)}
                </strong> 
            `:``}

          </div>`);

        } catch (e) {
          return this.sanitized.bypassSecurityTrustHtml(`
            <table style="width: 100%">
                <tbody>
            
                    <tr>
                        <td>
                           L.Bánh:  <span style="white-space: pre-line; font-size:14pt; font-weight: bold">`+ (advanceComments.size || '--') +`</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            N.Dung:  <span  style="white-space: pre-line;font-size:14pt; font-weight: bold">`+ (advanceComments.note || '--') +`</span>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Đ/C Giao: <span *ngIf="advanceComments.address != null" style="white-space: pre-line; font-size:14pt; font-weight: bold">` + (advanceComments.address || '--') +`</span>
                        </td>
                        
                    </tr>
                </tbody>
            </table>
       `);;
        }

        
    };
}
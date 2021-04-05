import {Pipe, PipeTransform,ChangeDetectorRef} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
    name: 'orderCommentsPrint',
    pure: true
})
export class OrderCommentsPrintPipe implements  PipeTransform
{

    constructor( private sanitized: DomSanitizer)
    {
       
    }


    transform(obj:any, parameter: string)
    {
        try {
           var advanceComments = JSON.parse(obj);


           if(parameter == 'header'){
            return this.sanitized.bypassSecurityTrustHtml(
                `
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    L.Bánh:
                                </span>
                                <p style="white-space: pre-line;margin-left: 25px;">`+ (advanceComments.size || '--') +`</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    Nhân:
                                </span>
                                <p style="white-space: pre-line;margin-left: 25px;">`+ (advanceComments.filling || '--') +`</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    N.Dung: 
                                </span>
                                <p style="white-space: pre-line;margin-left: 25px;">`+ (advanceComments.note  || '--')+ `</p>
                            </div>
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    Đ/C Giao:
                                </span>
                                <a  target="_blank" href="https://www.google.com/maps/search/` + advanceComments.address +'" ' +`style="color: #007bff !important;white-space: pre-line;margin-left: 10px;">` + (advanceComments.address || '--') +`</a>
                            </div>
               `);

           }
           if(parameter == 'describe'){
            return this.sanitized.bypassSecurityTrustHtml(
                `
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    L.Bánh: <span style="white-space: pre-line;font-weight: normal; margin-left: 5px">`+ (advanceComments.size || '--') +`</span>
                                </span>
                            </div>
                            <div>
                            <span style="font-size: 12px; font-weight:bold">
                                Nhân: <span style="white-space: pre-line;font-weight: normal; margin-left: 5px">`+ (advanceComments.filling || '--') +`</span>
                            </span>
                        </div>
                            <div>
                                <span style="font-size: 12px; font-weight:bold">
                                    N.Dung: <span style="white-space: pre-line;font-weight: normal; margin-left: 5px">`+ (advanceComments.note || '--') +`</span>
                                </span>
                            </div>
                            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;width: 78%;">
                                <span style="font-size: 12px; font-weight:bold">
                                    Đ/C Giao: <span style="font-weight: normal; margin-left: -18px">
                                    <a  target="_blank" href="https://www.google.com/maps/search/` + advanceComments.address +'" ' +`style="color: #007bff !important;margin-left: 25px;">` + (advanceComments.address || '--') +`</a></span>
                                </span>
                            </div>
               `);

           }else{
            return this.sanitized.bypassSecurityTrustHtml(`
                    <table style="width: 100%">
                        <tbody>
                            <tr>
                                <td>
                                   L.Bánh:  <span style="white-space: pre-line; font-size:16pt; font-weight: bold">`+ (advanceComments.size || '--') +`</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                Nhân:  <span style="white-space: pre-line; font-size:16pt; font-weight: bold">`+ (advanceComments.filling || '--') +`</span>
                                </td>
                             </tr>
                            <tr>
                                <td>
                                    N.Dung:  <span  style="white-space: pre-line;font-size:16pt; font-weight: bold">`+ (advanceComments.note || '--') +`</span>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    Đ/C Giao: <span *ngIf="advanceComments.address != null" style="white-space: pre-line; font-size:16pt; font-weight: bold">` + (advanceComments.address || '--') +`</span>
                                </td>
                                
                            </tr>
                        </tbody>
                    </table>
               `);

            
           }

        } catch (e) {
            return  obj;
        }

        
    };
}
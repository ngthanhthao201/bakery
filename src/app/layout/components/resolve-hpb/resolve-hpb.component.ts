import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HardBlockProductBarcode } from '../../../shared/models/hard-block-product-barcode.model';
import { ApiService } from '../../../shared/services/api.service';
import { SnotifyService } from 'ng-snotify';
import { NgxSpinnerService } from 'ngx-spinner';
import { MemberService } from '../../../shared/services/member.service';
import { ShopService } from '../../../shared/services/shop.service';
import { IncomeHeader } from '../../../shared/models/income-header.model';
import { IncomeContainer } from '../../../shared/models/income-container.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-resolve-hpb',
  templateUrl: './resolve-hpb.component.html',
  styleUrls: ['./resolve-hpb.component.scss']
})
export class ResolveHpbComponent implements OnInit {
  hpbWarning: any;
  incomeHeader: IncomeHeader;
  incomeContainers= [];
  newHardBlockProductBarcode: HardBlockProductBarcode ;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any, private apiService: ApiService,
  private spinner: NgxSpinnerService, private memberService: MemberService, public shopService: ShopService,
  private snotifyService: SnotifyService, public dialogRef: MatDialogRef<ResolveHpbComponent>) {
    this.hpbWarning = data.hpbWarning;
    this.newHardBlockProductBarcode = new HardBlockProductBarcode();
    this.newHardBlockProductBarcode.checkinBy = this.memberService.currentMember.id;
    this.newHardBlockProductBarcode.checkinDate = new Date();
    this.newHardBlockProductBarcode.hardProductBarcodeId = this.hpbWarning.hardProductBarcode.id;
   }

  ngOnInit() {
    this.apiService.getIncomeHeaderFirst100(this.shopService.currentShop.id, new Date()).subscribe(r=>{
      this.incomeHeader = r;  
      var groups = _.groupBy(this.incomeHeader.incomeTransactions, 'incomeContainerIdNumber');
      var _this = this;
      Object.keys(groups) // get the keys as array
      .forEach(function(lengthKey) { // iterate the sorted keys' array
          var incomecontainer = new IncomeContainer();
          incomecontainer.incomeTransactions = groups[lengthKey];
          incomecontainer.date = incomecontainer.incomeTransactions[0].createdDate;
          incomecontainer.memberId =  incomecontainer.incomeTransactions[0].memberId;

          //if(_.some(incomecontainer.incomeTransactions, {description: _this.hpbWarning.hardProductBarcode.name})){
            _this.incomeContainers.push(incomecontainer);
          //}

          
      });
    })
  }

  createHBPB(){
    this.spinner.show();
    this.apiService.createHardBlockProduct(this.newHardBlockProductBarcode).subscribe(result => {
      this.snotifyService.success('Thêm ' + this.newHardBlockProductBarcode.count + ' ' + this.hpbWarning.hardProductBarcode.name +' thành công', '');
      // 
      this.spinner.hide();
      this.dialogRef.close();
    })
  }

  removeIncomeTransactions(incomeContainer){
    var ids = _.map(incomeContainer.incomeTransactions,i=> {
      return i.id;
    });


    this.snotifyService.confirm("Bạn có chắc chắn muốn xóa hóa đơn này?","",{
      buttons: [
        {
            text: "Ok",
            action: () => {
              this.spinner.show();
              this.apiService.deactiveTransactions(ids, incomeContainer.destroyedReason, this.shopService.currentShop.id).subscribe(r=>{
                this.snotifyService.success("Xóa giao dịch thành công! 1 tin nhắn đã gửi tới quản trị viên.","");
                this.spinner.hide();
                this.dialogRef.close();
              });
                this.snotifyService.clear();
            }
        }, {
            text: "Cancel",
            action: () => {
                this.snotifyService.clear();
            }
        }
    ]
    });

  }

}

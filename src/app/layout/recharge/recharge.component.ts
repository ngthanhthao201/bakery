import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { NganLuongService } from '../../shared/services/ngan-luong.service';
import * as _ from 'lodash'
import { MemberService } from '../../shared/services/member.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class RechargeComponent implements OnInit {

  setExpressCheckoutParams :any ={
    bank_code:'',
    total_amount: 0,
    buyer_fullname: this.memberService.currentMember.name,
    buyer_mobile: this.shopService.currentShop.phoneNumber,
    buyer_email: this.memberService.currentMember.email || "hotro@tiembanhngon.com",
    card_number:"",
    card_fullname:"",
    payment_method:""
  }

  banks =[];

  requiredFields = [];
  requiredFieldsMap ={

  }

  activeTab: string = "ngb-tab-0";

  bankIcons= ['VISA', 'MASTE', 'AMREX', 'JCB', 'VCB', 'TCB', 'MB', 'VIB', 'ICB', 'EXB', 'ACB', 'HDB', 'MSB', 'NVB', 'DAB', 'SHB', 'OJB', 'SEA', 'TPB', 'PGB', 'BIDV', 'AGB', 'SCB', 'VPB', 'VAB', 'GPB', 'SGB','NAB','BAB']

  tabMap = {

    "ngb-tab-0": {
      title:"ATM Online",
      payment_method: "ATM_ONLINE",
      bank_account_field: "Số Thẻ ATM (in trên thẻ) *",
      bank_account_placeholder: "Số Thẻ ATM"
    },
    "ngb-tab-1": {
      title:"Internet Banking",
      payment_method: "IB_ONLINE",
      bank_account_field: "Số tài khoản ngân hàng *",
      bank_account_placeholder: "Số tài khoản"
    },
  }

  errorMessage ="";

  constructor(public shopService: ShopService, private nganLuongService: NganLuongService, 
    private memberService: MemberService, private spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute
    ) {

      console.log(this.activatedRoute.snapshot.queryParams)

     }

  ngOnInit() {
    this.shopService.refreshShop();
  }

  ngAfterViewInit(){
    this.getBanks();
  }

  tabChanged(){
    this.getBanks();
  }

  bankChanged(){
    var b = _.find(this.banks,{bank_code: this.setExpressCheckoutParams.bank_code})
    var payment_method = this.tabMap[this.activeTab].payment_method;
    this.setExpressCheckoutParams.payment_method = payment_method;
    this.requiredFields = b.payment_method[payment_method].field
  }

  getBanks(){
   this.spinner.show();
    this.nganLuongService.getRequestField(this.tabMap[this.activeTab].payment_method).subscribe(r=>{
      this.banks = r;
      this.spinner.hide();
    })
  }

  ok(){
    if(!this.setExpressCheckoutParams.total_amount){
      alert('Vui lòng nhập số tiền.');
      return;
    }
    if(!this.setExpressCheckoutParams.buyer_fullname){
      alert('Vui lòng nhập tên.')
      return;
    }
    if(!this.setExpressCheckoutParams.bank_code){
      alert('Vui lòng chọn ngân hàng.')
      return;
    }

    if (this.requiredFields){
      if(this.requiredFields.indexOf('BANK_ACCOUNT') > -1 && !this.setExpressCheckoutParams.card_number){
        alert('Vui lòng nhập tài khoản ngân hàng hoặc số thẻ atm.')
        return;
      }

      if(this.requiredFields.indexOf('BANK_NAME') > -1 && !this.setExpressCheckoutParams.card_fullname){
        alert('Vui lòng nhập tên chủ thẻ.')
        return;
      }
    }
    this.spinner.show();
    this.nganLuongService.setExpressCheckoutShop(this.shopService.currentShop.id, this.setExpressCheckoutParams).subscribe(r=>{
      if(r){
        window.location.href = r.auth_url;
      }
    }, err=>{
      this.errorMessage = err._body;
      this.spinner.hide();
    })
  }

}

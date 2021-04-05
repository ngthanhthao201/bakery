import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {FormControl, Validators, FormGroup} from '@angular/forms';

import * as _moment from 'moment';
import * as _ from 'lodash';
import { Observable } from "rxjs/Observable";
import { Product } from "../../../../shared/models/product.model";
import { ShopRole } from "../../../../shared/models/shop-role.model";
import { MemberShop } from "../../../../shared/models/member-shop.model";
import { ApiService } from "../../../../shared/services/api.service";
import { Member } from "../../../../shared/models/member.model";
import { MemberService } from "../../../../shared/services/member.service";
import { SnotifyService } from "ng-snotify";



@Component({
  selector: 'new-edit-member-dialog',
  templateUrl: 'new-edit-member-dialog.component.html',
  styleUrls: ['./new-edit-member-dialog.component.scss'],

})
export class NewEditMemberDialog {
  currentShop: any = {};
  productCategories: any = [];

  productCtrl: FormControl;
  filteredProducts: Observable<any[]>;

  products: Product[] = [];
  confirmPassword: string;
  canLogIn= false;

  form: FormGroup;

  member: Member;

  mapRoles ={
    Admin: "Quản trị viên",
    Baker: "Thợ làm bánh",
    Seller: "Bán Bánh",
    BarcodeTracker: "Nhập Bánh"
  }

  roles =[{id: 1, name: "Quản trị viên"},{id: 2, name: "Thợ làm bánh"},{id: 3, name: "Bán Bánh"},{id: 4, name: "Nhập Bánh"}];

  constructor(private apiService: ApiService, private memberService: MemberService,
    private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<NewEditMemberDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.productCtrl = new FormControl();
      

      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        role: new FormControl('', Validators.required),
        username: new FormControl('', Validators.required),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
        gender: new FormControl(''),
        canLogIn: new FormControl(''),
     });
     
     this.member = data.member;
     console.log(this.member)
     if(!this.member){
      this.member = new Member();
     }else{
      this.canLogIn = !!this.member.username
     }

     
  }


  public ngAfterViewInit(): void {

  }

  ngOnInit() {
    
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));


  }

  displayFn(value: any): string {  
    return value && typeof value === 'object' ? value.name : value;
  }

  updateMember(){
    this.memberService.updateMember(this.currentShop.id ,this.member).subscribe(r => {
      this.dialogRef.close(null);
    },err=>{
      this.snotifyService.error(err);
    })
  }

  createMember(){
    this.memberService.createMember(this.currentShop.id ,this.member).subscribe(r => {
      this.dialogRef.close(null);
    },err=>{
      this.snotifyService.error(err);
    })
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

}
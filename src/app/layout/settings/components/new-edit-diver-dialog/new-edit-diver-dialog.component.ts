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
import { Driver } from "../../../../shared/models/driver.model";



@Component({
  selector: 'new-edit-diver-dialog',
  templateUrl: 'new-edit-diver-dialog.component.html',
  styleUrls: ['./new-edit-diver-dialog.component.scss'],

})
export class NewEditDriverDialog {
  currentShop: any = {};
  confirmPassword: string;
  form: FormGroup;
  driver: Driver;

  constructor(private apiService: ApiService, private memberService: MemberService,
    private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<NewEditDriverDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.form = new FormGroup({
        name: new FormControl('', Validators.required),
        phoneNumber: new FormControl('', Validators.required),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
     });
     
     this.driver = data.driver;
     console.log(this.driver)
     if(!this.driver){
      this.driver = new Driver();
     }else{
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

  // updateMember(){
  //   this.memberService.updateMember(this.currentShop.id ,this.member).subscribe(r => {
  //     this.dialogRef.close(null);
  //   },err=>{
  //     this.snotifyService.error(err);
  //   })
  // }

  createDriver(){
    this.apiService.createDriver(this.currentShop.id ,this.driver).subscribe(r => {
      this.dialogRef.close(r);
    },err=>{
      this.snotifyService.error(err);
    })
  }

  onNoClick(): void {
    this.dialogRef.close(null);
  }

}
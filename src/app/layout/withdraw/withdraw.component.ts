import { Component, OnInit } from '@angular/core';
import { ShopService } from '../../shared/services/shop.service';
import { NganLuongService } from '../../shared/services/ngan-luong.service';
import * as _ from 'lodash'
import { MemberService } from '../../shared/services/member.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

  

  constructor(public shopService: ShopService, private nganLuongService: NganLuongService, 
    private memberService: MemberService, private spinner: NgxSpinnerService, private activatedRoute: ActivatedRoute
    ) {

      console.log(this.activatedRoute.snapshot.queryParams)

     }

  ngOnInit() {
    
  }

  ngAfterViewInit(){
    
  }

  
}

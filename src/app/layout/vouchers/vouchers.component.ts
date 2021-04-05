import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { MatDialog } from '@angular/material/dialog';
import { NewVouchersDialogComponent } from './new-vouchers-dialog/new-vouchers-dialog.component';
import { Shop } from '../../shared/models/shop.model';
import { ApiService } from '../../shared/services/api.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss'],
  animations: [routerTransition()],
})
export class VouchersComponent implements OnInit {
  currentShop: Shop;
  voucherGroups: any = [];
  constructor(public dialog: MatDialog, private apiService: ApiService) { 
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    this.getVouchers();
  }

  ngOnInit() {

  }

  getVouchers(){
    this.apiService.getVouchers(this.currentShop.id).subscribe(r=>{
      _.each(r, g=>{
        g.usedGroup = _.filter(g, {isUsed: true});
        g.activeGroup = _.filter(g, {isUsed: false});
        this.voucherGroups.push(g);
      })
      
    });
  }

  deleteVoucher(name){
    this.apiService.deleteVoucher(this.currentShop.id, name).subscribe(r=>{
      this.getVouchers();
    });
    
  }

  openDialog(): void {

    
    let dialogRef = this.dialog.open(NewVouchersDialogComponent, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        shopId: this.currentShop.id
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.apiService.createVouchers(result).subscribe(r=>{
          this.getVouchers();
        });
      }
    });
  }

}

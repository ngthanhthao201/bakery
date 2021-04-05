import { Component, Inject, OnInit } from '@angular/core';
import { ShopService } from '../../../../shared/services/shop.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SidebarComponent } from '../../../components/sidebar-v2/sidebar.component';

@Component({
  selector: 'app-block-and-warning',
  templateUrl: './block-and-warning.component.html',
  styleUrls: ['./block-and-warning.component.scss']
})
export class BlockAndWarningComponent implements OnInit {
  public expirationDate  = false;
  public dueDate = false;
  public promotionDate : any
  constructor(public shopService: ShopService,
    public dialogRef: MatDialogRef<SidebarComponent>, @Inject(MAT_DIALOG_DATA) public data: any
    ) {
    this.promotionDate = data.promotionDate,
    this.expirationDate = data.expirationDate,
    this.dueDate = data.dueDate
    
  }

  ngOnInit() {

  }

}

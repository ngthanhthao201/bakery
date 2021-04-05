import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-link-confirm',
  templateUrl: './order-link-confirm.component.html',
  styleUrls: ['./order-link-confirm.component.css']
})
export class OrderLinkConfirmComponent implements OnInit {
  textConfirm = ''
  constructor(private dialogRef: MatDialogRef<OrderLinkConfirmComponent>) { }

  ngOnInit(): void {
  }


   ok(){
    this.dialogRef.close(true);
   }
}

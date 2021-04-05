import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'orders-timeline-confirm-dialog',
    templateUrl: './orders-timeline-confirm-dialog.component.html',
})
export class OrdersTimelineConfirmDialogComponent {
    newOrder = [];
    isContinue = false;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<OrdersTimelineConfirmDialogComponent>,) {
        this.newOrder = data.newOrder;
    }

    ngOnInit(){

    }
    
    continue(){
        this.isContinue = true;
        this.dialogRef.close(this.isContinue);
    }

}
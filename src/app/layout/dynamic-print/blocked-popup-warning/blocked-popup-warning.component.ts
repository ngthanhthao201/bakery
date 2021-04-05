import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-blocked-popup-warning',
  templateUrl: './blocked-popup-warning.component.html',
  styleUrls: ['./blocked-popup-warning.component.scss']
})
export class BlockedPopupWarningComponent implements OnInit {

  constructor( public dialogRef: MatDialogRef<BlockedPopupWarningComponent>) { }

  ngOnInit() {
  }

  ok(){
    this.dialogRef.close(true);
  }

}

import { Component } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { Inject } from "@angular/core";

@Component({
    selector: 'download-report-bottom-sheet',
    templateUrl: 'download-report-bottom-sheet.html',
    styleUrls: ['download-report-bottom-sheet.scss'],
  })
  export class DownloadReportComponent {
    buttons:Array<any>=[];
    constructor( @Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<DownloadReportComponent>) {

        this.buttons = data.buttons;


    }


  }
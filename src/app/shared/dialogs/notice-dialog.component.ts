import { Component, Input, Inject } from "@angular/core";
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'notice-dialog',
    templateUrl: 'notice-dialog.component.html',

})
export class NoticeDialog {

   message: any;

    constructor(private sanitized: DomSanitizer, public dialogRef: MatDialogRef<NoticeDialog>, @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = this.sanitized.bypassSecurityTrustHtml(data.htmlString);
       
    }

    ngOnInit() {



    }

}
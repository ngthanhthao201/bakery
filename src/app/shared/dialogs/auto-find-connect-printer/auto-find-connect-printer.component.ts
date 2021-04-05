import { Component, OnInit, Inject } from '@angular/core';
import { QzTrayService } from '../../services/qz-tray.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClipboardService } from 'ngx-clipboard';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-auto-find-connect-printer',
  templateUrl: './auto-find-connect-printer.component.html',
  styleUrls: ['./auto-find-connect-printer.component.scss']
})
export class AutoFindConnectPrinter implements OnInit {

  errorCode: number;
  qzTrayFolder = `C:\Program Files\QZ Tray\qz-tray.exe`;
  constructor(private qzService: QzTrayService,
    private clipboardService: ClipboardService,
    private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<AutoFindConnectPrinter>, @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
      this.errorCode = data.errorCode;
    }

  ngOnInit() {
    
  }
  
  copyQzTrayFolder(){
    this.clipboardService.copyFromContent(this.qzTrayFolder);
    this.snotifyService.success("Đã copy, vui lòng paste vào ô thư mục")
  }

}

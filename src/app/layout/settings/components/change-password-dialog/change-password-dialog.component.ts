
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnotifyService } from 'ng-snotify';
import { Component, Inject } from '@angular/core';
import { Member } from '../../../../shared/models/member.model';

@Component({
  selector: 'change-password-dialog.component',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  password: any = {};
  member: Member;
  constructor(private apiService: ApiService, private snotifyService: SnotifyService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.member = data.member;
  }

  ngOnInit() {

  }


  changePassword() {
    this.apiService.changePasswordByMemberId(this.member.id, this.password.newPassword, this.password.confirmPassword).subscribe(r => {
      if (r) {
        this.snotifyService.success("Cập nhật mật khẩu thành công!", "");
      }
      this.dialogRef.close();
    })
  }


}

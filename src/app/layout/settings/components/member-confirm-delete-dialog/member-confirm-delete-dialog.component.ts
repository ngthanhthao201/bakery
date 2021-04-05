import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { SnotifyService } from 'ng-snotify';
import { Member } from '../../../../shared/models/member.model';
import { ShopService } from '../../../../shared/services/shop.service';

@Component({
  selector: 'member-confirm-delete-dialog',
  templateUrl: './member-confirm-delete-dialog.component.html',
  styleUrls: ['./member-confirm-delete-dialog.component.scss']
})
export class MemberConfirmDeleteDialogComponent {

  currentShop: Shop;
  member: Member;
  isDisabled: boolean = false;

  constructor(private apiService: ApiService, private snotifyService: SnotifyService, private shopService: ShopService,
    public dialogRef: MatDialogRef<MemberConfirmDeleteDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    this.member = data.member;

  }

  ngOnInit() {
  }

  delete() {
    // this.snotifyService.info('Đang xoá', '');
    this.isDisabled = true;
    this.apiService.deleteMemberByMemberId(this.member.id, this.currentShop.id).subscribe(r => {
      this.shopService.refreshMembers();
      this.dialogRef.close();
      this.snotifyService.success('Xoá thành công', '');
    }, error => {
      this.dialogRef.close();
      this.snotifyService.error(error._body, '');   
      this.isDisabled = true 
    });
  }


}

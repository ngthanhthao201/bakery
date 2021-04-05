import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { SnotifyService } from 'ng-snotify';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  changePasswordVM : any = {};
  memberId: number;
  constructor(private apiService: ApiService, private snotifyService: SnotifyService) { }

  ngOnInit() {
    this.memberId = parseInt(localStorage.getItem('memberId'));
  }


  changePassword(){
    delete this.changePasswordVM.confirmPassword;
    console.log(this.changePasswordVM);
    this.apiService.changePassword( this.memberId , this.changePasswordVM).subscribe(r=>{
      if(r){
        this.snotifyService.success("Cập nhật mật khẩu thành công!","");
      }
    }, err =>{
      console.log(err);
      this.snotifyService.error(err._body,"");
    })
  }
}

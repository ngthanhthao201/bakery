import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from '../../../../shared/services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shop } from '../../../../shared/models/shop.model';
import { DeliveryOption } from '../../../../shared/models/delivery-option.model';
import { WebsiteConfig } from '../../../../shared/models/website-config.model';

@Component({
  selector: 'advslide-config-dialog-dialog',
  templateUrl: './advslide-config-dialog.component.html',
  styleUrls: ['./advslide-config-dialog.component.scss']
})
export class AdvSlideDialogComponent implements OnInit {
  advSlide :WebsiteConfig;
  currentShop: Shop;
  image: any;
  currentFile: any;
  currentAdvSlide: WebsiteConfig;
  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<AdvSlideDialogComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));
    this.currentAdvSlide =  data.adv;
   }

  ngOnInit() {

  }

  createOrUpdateAdv() {
    if(this.image){
      
    this.apiService.uploadImageAzure(this.currentFile, this.image, this.currentShop.shopCode + "-AdvSlide").subscribe(r => {
      if (r) {
        this.currentAdvSlide.value.image = r;
        this.saveAdvSlide();
      }
    })
  }else{
    this.saveAdvSlide();
  }
}

  saveAdvSlide(){
    this.currentAdvSlide.shopId = this.currentShop.id;
    if(this.currentAdvSlide.value.constructor == Object){
      this.currentAdvSlide.value = JSON.stringify(this.currentAdvSlide.value);
    }
    this.apiService.saveWebsiteConfig(this.currentAdvSlide).subscribe(r=>{
      this.dialogRef.close();
    });
  }

  
  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);

  }

  readThis(file: any): void {
    this.currentFile = file;
    console.log(file);
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
    }
    myReader.readAsDataURL(file);
  }


}

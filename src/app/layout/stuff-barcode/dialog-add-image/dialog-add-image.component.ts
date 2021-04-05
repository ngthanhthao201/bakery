import { Component, OnInit,Inject,ElementRef } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { result } from 'lodash';
import { HardProductBarcode } from '../../../shared/models/hard-product-barcode.model';
import { ApiService } from "../../../shared/services/api.service";


@Component({
    selector: 'dialog-add-image',
    templateUrl: './dialog-add-image.component.html',
    styleUrls: ['./dialog-add-image.component.scss']
  })
  export class DialogAddImage implements OnInit {
    currentFile: any;
    currentProduct: HardProductBarcode;
    newCurrentProduct: any;
    image: any;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private apiService: ApiService
    ){
        this.currentProduct = data.hardProduct;
    }
    ngOnInit() {
        console.log("currentProduct",this.currentProduct)
    }

    getFiles(event){
        var file = event.target.files[0];
        this.readThis(file)
    }
    readThis(file : any): void {
        this.currentFile = file;
        var myReader: FileReader = new FileReader();
        myReader.onloadend = (e) => {
            this.image = myReader.result;
        }
        myReader.readAsDataURL(file);
    }
    loading(){
        var addLoading = $('#loading');
        addLoading.removeClass('spinnerHidden');
        addLoading.addClass('spinner');
        setTimeout(function(){
          addLoading.removeClass('spinner');
          addLoading.addClass('spinnerHidden');
        },2000)
    }

    loadImageProduct(){
        if(this.image){
            this.apiService.uploadImageAzure(this.currentFile, this.image,  "-Category").subscribe(r => {
                this.currentProduct.image = r;
                    this.apiService.updateHardProduct(this.currentProduct).subscribe(result => {
                        this.loading();
                    })
            })
        }
    }
  }

import { Component, Inject, ViewChild, ElementRef } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { ApiService} from "../../../shared/services/api.service";
import * as _moment from 'moment';
import * as _ from 'lodash';
import { Material } from "../../../shared/models/material.model";
import { MaterialProvider } from "../../../shared/models/material-provider.model";
import { from } from "rxjs";
import { SnotifyService } from 'ng-snotify';
@Component({
  selector: 'edit-provider-dialog',
  templateUrl: 'edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss'],
})
export class EditProviderDialog {
  rows = [];
  materialProvider: MaterialProvider;
  currentFile: any;
  image: string;




  constructor(private apiService: ApiService, public dialogRef: MatDialogRef<EditProviderDialog>,private snotifyService : SnotifyService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.materialProvider = data.materialProvider;

  }

  
  getFiles(event) {
    var file = event.target.files[0];
    this.readThis(file);
  }
  readThis(file: any): void {
    var myReader: FileReader = new FileReader();
    this.currentFile = file;
    myReader.onloadend = (e) => {
      this.apiService.uploadImageImg(myReader.result).subscribe(r => {
        this.snotifyService.success("Cập nhật ảnh thành công","");
        // this.setImage(r.data.link);
        this.materialProvider["image"] = r.data.link;     
       })
    }
    myReader.readAsDataURL(file);
  }
  // setImage(imagepath) {
  //   this.materialProvider["image"] = imagepath;
  // }


  public ngAfterViewInit(): void {

  }

  ngOnInit() {
  }



  ok() {

    this.dialogRef.close(this.materialProvider);
  



  }




}
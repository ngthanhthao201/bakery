import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FacebookRoutingModule } from './facebook-routing.module';
import { SharedModule } from '../../shared/modules/shared.module';
import { FacebookComponent } from './facebook.component';
import { ImageUploadModule } from 'angular2-image-upload';
import { AngularMaterialModule } from '../../shared/modules/angular-material.module';
import { FacebookPostComponent } from './components/facebook-post/facebook-post.component';
import { ZaloOAPageSelectSheet } from './components/facebook-post/zalo-oa-page-select/zalo-oa-page-select';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FacebookRoutingModule,
    ImageUploadModule,
    AngularMaterialModule,
    ChartsModule,
    FileUploadModule 
  ],
  declarations: [FacebookComponent, FacebookPostComponent, ZaloOAPageSelectSheet ],

})
export class FacebookModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { SettingsRoutingModule } from './settings-routing.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CakeSizeTypeDialogComponent } from './components/cake-size-type-dialog/cake-size-type-dialog.component';
import { DeliveryOptionsSettingDialogComponent } from './components/delivery-options-setting-dialog/delivery-options-setting-dialog.component';
import { AdvSlideDialogComponent } from './components/advslide-config-dialog/advslide-config-dialog.component';
import { OpenCloseTimeDialogComponent } from './components/open-close-time-dialog/open-close-time-dialog.component';
import { CreateZaloDialogDialogComponent } from './components/create-zalo-post-dialog/create-zalo-post-dialog.component';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { ImageUploadModule } from 'angular2-image-upload';
import { NewEditMemberDialog } from './components/new-edit-member-dialog/new-edit-member-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MemberConfirmDeleteDialogComponent } from './components/member-confirm-delete-dialog/member-confirm-delete-dialog.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { CheckinSettingComponent } from './components/checkin-setting/checkin-setting.component';
import { NewEditDriverDialog } from './components/new-edit-diver-dialog/new-edit-diver-dialog.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    SettingsRoutingModule,
    CurrencyMaskModule,
    MatTabsModule,
  ],
  declarations: [SettingsComponent, NewEditMemberDialog, CakeSizeTypeDialogComponent,
     DeliveryOptionsSettingDialogComponent, AdvSlideDialogComponent, OpenCloseTimeDialogComponent,
      CreateZaloDialogDialogComponent, MemberConfirmDeleteDialogComponent, ChangePasswordDialogComponent, 
      CheckinSettingComponent, NewEditDriverDialog],
  entryComponents:[NewEditMemberDialog, CakeSizeTypeDialogComponent,
     DeliveryOptionsSettingDialogComponent, AdvSlideDialogComponent, OpenCloseTimeDialogComponent,
      CreateZaloDialogDialogComponent, MemberConfirmDeleteDialogComponent, ChangePasswordDialogComponent,
    CheckinSettingComponent, NewEditDriverDialog]
})
export class SettingsModule { }

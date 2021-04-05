import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ApiService } from '../../shared/services/api.service';
import { Shop } from '../../shared/models/shop.model';
import { Member } from '../../shared/models/member.model';
import { MemberShop } from '../../shared/models/member-shop.model';
import { MemberClaim } from '../../shared/models/member-claim.model';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { ShopRole } from '../../shared/models/shop-role.model';
import { CakeSizeTypeDialogComponent } from './components/cake-size-type-dialog/cake-size-type-dialog.component';
import { DeliveryOptionsSettingDialogComponent } from './components/delivery-options-setting-dialog/delivery-options-setting-dialog.component';
import { WebsiteConfig } from '../../shared/models/website-config.model';
import { SnotifyService } from 'ng-snotify';
import { AdvSlideDialogComponent } from './components/advslide-config-dialog/advslide-config-dialog.component';
import { OpenCloseTimeDialogComponent } from './components/open-close-time-dialog/open-close-time-dialog.component';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { FacebookPageShop } from '../../shared/models/facebook-page-shop.model';
import { ZaloPageShop } from '../../shared/models/zalo-page-shop.model';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';

import { OrderService } from '../orders/services/order.service';
import { ProductCategory } from '../../shared/models/product-category.model';
import { CreateZaloDialogDialogComponent } from './components/create-zalo-post-dialog/create-zalo-post-dialog.component';

import { FacebookPost } from '../../shared/models/facebook-post.model';
import { ZaloPost } from '../../shared/models/zalo-post.model';

import { registerLocaleData } from '@angular/common';
import { TimeSpan } from '../../shared/models/timespan';
import { MemberService } from '../../shared/services/member.service';
import { Shift } from '../../shared/models/shift.model';
import { MemberShift } from '../../shared/models/member-shift.model';
import { NewEditMemberDialog } from './components/new-edit-member-dialog/new-edit-member-dialog.component';
import { ShopService } from '../../shared/services/shop.service';
import { Observable } from 'rxjs';
import { MemberConfirmDeleteDialogComponent } from './components/member-confirm-delete-dialog/member-confirm-delete-dialog.component';
import { ChangePasswordDialogComponent } from './components/change-password-dialog/change-password-dialog.component';
import { CheckinSettingComponent } from './components/checkin-setting/checkin-setting.component';
import { NewEditDriverDialog } from './components/new-edit-diver-dialog/new-edit-diver-dialog.component';
// import {XML, XMLList} from 'sxml';

declare var Zalo: any;

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    animations: [routerTransition()]
})



export class SettingsComponent implements OnInit {

    definedMemberClaims = [];
    definedMemberNotificationClaims = [];
    currentShop: Shop;
    shopNameUrl: string;
    shopRoles: ShopRole[];
    websiteConfigs: WebsiteConfig[];
    colorConfig: WebsiteConfig;
    advSlidesConfigs: WebsiteConfig[];
    color: string;
    editMode = false;

    idleTime: number;
    zaloPages = [];

    zaloPageShops: ZaloPageShop[];
    _orderService: OrderService;
    selectedMember4ChangeImage: Member;
    hours: number;
    shifts: Shift[];
    mapRoleIds = {
        1: "Quản Trị Viên",
        2: "Thợ Làm Bánh",
        3: "Bán Bánh",
        4: "Nhập Bánh"
    }
    selectedIndex: any;
    isAdmin : boolean = false;

    constructor(private apiService: ApiService,
        public memberService: MemberService,
        private orderService: OrderService,
        private fb: FacebookService,
        public shopService: ShopService,
        public dialog: MatDialog, private snotifyService: SnotifyService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
     ) {

        this._orderService = orderService;
        this.currentShop = JSON.parse(localStorage.getItem('currentShop'));

        this.definedMemberClaims = [

            new MemberClaim("Tài Chính", "permission", "shop.financial", this.currentShop.id),
            new MemberClaim("Kho", "permission", "shop.warehouse", this.currentShop.id),
            new MemberClaim("Khách Hàng", "permission", "shop.customer", this.currentShop.id),
            new MemberClaim("Tủ Bánh", "permission", "shop.showcase", this.currentShop.id),
            new MemberClaim("Cài Đặt", "permission", "shop.setting", this.currentShop.id),
            new MemberClaim("Nhập Bánh", "permission", "shop.barcodeinput", this.currentShop.id),
            new MemberClaim("Bán Bánh", "permission", "shop.sellcake", this.currentShop.id),
            new MemberClaim("Hiện tên bán bánh", "permission", "shop.appear4sellcake", this.currentShop.id),
        ];

        this.definedMemberNotificationClaims = [
            new MemberClaim("Chat Với Khách", "permission", "shop.chatcustomer", this.currentShop.id),
            // new MemberClaim("Đơn", "permission", "noti.orders", this.currentShop.id),
            // new MemberClaim("Chat", "permission", "noti.chats", this.currentShop.id),
            // new MemberClaim("Từng Giao Dịch", "permission", "noti.transactions", this.currentShop.id),
            // new MemberClaim("Chuyển Ca", "permission", "noti.shifts", this.currentShop.id),
            // new MemberClaim("Nhập / Hủy Bánh ", "permission", "noti.cakes", this.currentShop.id)
        ];

        this.shopNameUrl = this.currentShop.name.replace(' ', '-');

        var memberId = parseInt(localStorage.getItem('memberId'));
        // this.apiService.getMemberById(memberId).subscribe(r => {
        //     if (!r.memberClaims || !_.find(r.memberClaims, { claimValue: 'shop.setting' })) {
        //         this.route.navigateByUrl('/');
        //     } else {
        //     }
        // });
        this.activatedRoute.queryParams.subscribe(r => {
            if (r.tab == null) {
                return;
            } else {
                this.selectedIndex = r.tab;
            }
        })
    }

    ngOnInit() {
        this.getMembers();
        this.getShopRoles();
        this.getWebsiteConfigs();
        this.getZaloPageShops();
        this.getListShift();
        this.getDriver();

        if (localStorage.getItem("idleTime")) {
            this.idleTime = parseInt(JSON.parse(localStorage.getItem("idleTime")));
        }

        console.log(this.shopService.members)

        _.forEach(this.memberService.currentMember.roleIds, role => {
            if (role == 1) {
              this.isAdmin = true;
            }
          });

    }

    getListShift() {
        this.apiService.getListShift(this.currentShop.id).subscribe(r => {
            this.shifts = r;
        });
    }



    //zalo

    openCreateZaloPost(zlPage) {
        let dialogRef = this.dialog.open(CreateZaloDialogDialogComponent, {
            width: '800px',
            data: {
                zaloPageShopId: zlPage.id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getZaloPageShops();
                this.snotifyService.success('Tạo post Zalo thành công!', '');
            }
        });
    }

    editZaloPost(zlPost, zlPage) {
        let dialogRef = this.dialog.open(CreateZaloDialogDialogComponent, {
            width: '800px',
            data: {
                zaloPost: zlPost,
                zaloPageShopId: zlPage.id
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.getZaloPageShops();
                this.snotifyService.success('Sửa post Zalo thành công!', '');
            }
        });
    }

    deleteZaloPost(zlPage) {
        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa post này?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {
                        this.apiService.deleteZaloPost(zlPage).subscribe(r => {
                            this.getZaloPageShops();
                            this.snotifyService.success('Xóa post thành công!', '');
                        })
                        this.snotifyService.clear();
                    }
                },
                {
                    text: "Cancel",
                    action: () => {
                        this.snotifyService.clear();
                    }
                }
            ]
        });
    }

    postZaloNow(post: ZaloPost) {
        this.apiService.postZaloNow(post).subscribe(r => {
            this.snotifyService.success('post thành công', '');
        })
    }

    getShopRoles() {
        this.apiService.getShopRoles().subscribe(r => {
            this.shopRoles = r;
            console.log(' this.shopRoles', this.shopRoles)
        });
    }

    getMembers() {
        this.shopService.refreshMembers();
    }

    getDriver(){
        this.shopService.refreshDrivers();
    }

    getWebsiteConfigs() {
        this.apiService.getWebsiteConfigs(this.currentShop.id).subscribe(r => {
            this.websiteConfigs = r;
            this.colorConfig = _.find(this.websiteConfigs, { name: 'AccentColor' });
            if (this.colorConfig) {
                this.color = JSON.parse(this.colorConfig.value).color;
            }
            this.advSlidesConfigs = _.filter(this.websiteConfigs, { name: "AdvSlide" })
            _.each(this.advSlidesConfigs, a => {
                a.value = JSON.parse(a.value);
            })
        });
    }


    getZaloPageShops() {
        this.apiService.getZaloPageShops(this.currentShop.id).subscribe(r => {
            this.zaloPageShops = r;
            console.log(r);
        });
    }

    hasPermission(member: Member, claim: MemberClaim): boolean {
        return _.some(member.memberClaims, { claimValue: claim.claimValue });
    }

    hasMemberShift(member: Member, shiftId: number): boolean {
        return _.some(member.memberShifts, { shiftId: shiftId });
    }

    assignMemberClaim(checked: boolean, claim: MemberClaim, memberId: number) {
        if (checked) {
            var newClaim = Object.assign({}, claim);
            newClaim.name = undefined;
            newClaim.memberId = memberId;
            newClaim.shopId = this.currentShop.id;
            this.apiService.createMemberClaim(newClaim).subscribe(r => {
                this.getMembers();
                this.snotifyService.success("Cập nhật thành công");
            });
        }
        else {
            //delete claim
            this.apiService.deleteMemberClaim(memberId, claim.claimValue, this.currentShop.id).subscribe(r => {
                this.getMembers();
                this.snotifyService.success("Cập nhật thành công");
            });
        }

    }

    assignMemberShift(checked: boolean, shiftId: number, memberId: number) {
        if (checked) {
            var newMemberShift = new MemberShift();
            newMemberShift.shiftId = shiftId;
            newMemberShift.memberId = memberId;
            newMemberShift.shopId = this.currentShop.id;
            this.apiService.createMemberShift(newMemberShift).subscribe(r => {
                this.getMembers();
                this.snotifyService.success("Cập nhật thành công");
            });
        }
        else {
            //delete claim
            this.apiService.deleteMemberShift(memberId, shiftId).subscribe(r => {
                this.getMembers();
                this.snotifyService.success("Cập nhật thành công");
            });
        }

    }

    newMember() {
        let dialogRef = this.dialog.open(NewEditMemberDialog, {
            width: '600px',
            data: {
                shopId: this.currentShop.id,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            var newMemberShop: MemberShop = new MemberShop();
            newMemberShop.shopId = this.currentShop.id;
            newMemberShop.roleId = 2;
            newMemberShop.member = result;
            if (result) {
                this.memberService.createMemberShop(newMemberShop).subscribe(r => {
                    this.getMembers();
                })
            }

        });
    }

    editMember(member) {
        let dialogRef = this.dialog.open(NewEditMemberDialog, {
            width: '600px',
            data: {
                shopId: this.currentShop.id,
                member: member
            }
        });
    }

    deleteMember(memberShop) {
        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa thành viên này?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {
                        this.memberService.deleteMemberShop(memberShop.memberId, memberShop.shopId).subscribe(r => {
                            this.getMembers();
                        })
                        this.snotifyService.clear();
                    }
                }, {
                    text: "Cancel",
                    action: () => {
                        this.snotifyService.clear();
                    }
                }
            ]
        });
   

    }

    deleteMemberByMemberId(row){
        let dialogRef = this.dialog.open(MemberConfirmDeleteDialogComponent,{
            panelClass: 'col-md-4',
            data: {
                member: row,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    changePassword(row){
        let dialogRef = this.dialog.open(ChangePasswordDialogComponent,{
            panelClass: 'col-md-4',
            data: {
                member: row,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    settingOpenCloseTime() {
        let dialogRef = this.dialog.open(OpenCloseTimeDialogComponent, {
            width: '600px',
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    settingCakeSizeType() {
        let dialogRef = this.dialog.open(CakeSizeTypeDialogComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    settingDeliveryOptions() {
        let dialogRef = this.dialog.open(DeliveryOptionsSettingDialogComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {

        });
    }

    setTimeForidle() {
        if (this.idleTime == 0) {
            localStorage.removeItem('idleTime');
            return;
        }
        localStorage.setItem('idleTime', this.idleTime.toString());
        window.location.reload();
    }

    getFiles(event) {
        var file = event.target.files[0];
        this.readThis(file);

    }

    getFilesForMember(event) {
        var member = this.selectedMember4ChangeImage;
        var file = event.target.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            var image = myReader.result;
            this.apiService.uploadImageAzure(file, image, member.name + "-Avatar").subscribe(r => {
                if (r) {
                    member.image = r;
                    console.log(member);
                    this.apiService.updateAvatar(member.id, member.image).subscribe(res => {
                        this.snotifyService.success("Cập nhật ảnh thành công!", "");
                    })

                }
            })
        }
        myReader.readAsDataURL(file);

    }

    readThis(file: any): void {

        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            var image = myReader.result;
            this.apiService.uploadImageAzure(file, image, this.currentShop.shopCode + "-Icon").subscribe(r => {

                if (r) {
                    this.currentShop.icon = r;
                    this.apiService.updateShopImage(this.currentShop).subscribe(r2 => {


                    })

                }
            })
        }
        myReader.readAsDataURL(file);
    }

    //driver
    newDriver() {
        let dialogRef = this.dialog.open(NewEditDriverDialog, {
            width: '600px',
            data: {
                shopId: this.currentShop.id,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
             this.snotifyService.success("Tạo thành công","")
             this.getDriver();
            }

        });
    }

    //website

    colorChanged(e) {
        if (!this.colorConfig || !this.colorConfig.id) {
            this.colorConfig = new WebsiteConfig();
            this.colorConfig.shopId = this.currentShop.id;
            this.colorConfig.name = "AccentColor";
            this.colorConfig.value = JSON.stringify({ "color": e });
            this.apiService.createWebsiteConfig(this.colorConfig).subscribe(r => {
                this.snotifyService.success("Saved Color Sucessfully", "");
            });
        } else {
            this.colorConfig.value = JSON.stringify({ "color": e });
            this.apiService.saveWebsiteConfig(this.colorConfig).subscribe(r => {
                this.snotifyService.success("Saved Color Sucessfully", "");
            });
        }

    }

    newOrEditAdvSlide(advSlide) {
        if (advSlide) {

        }
        else {
            advSlide = new WebsiteConfig();
            advSlide.name = "AdvSlide";
            advSlide.value = {
                image: ''
            }
        }

        let dialogRef = this.dialog.open(AdvSlideDialogComponent, {
            width: '800px',
            data: { adv: advSlide }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.getWebsiteConfigs();
        });
    }

    deleteAdvSlide(websiteConfigId) {
        this.snotifyService.confirm("Bạn có chắc chắn muốn xóa mục này?", "", {
            buttons: [
                {
                    text: "Ok",
                    action: () => {
                        this.apiService.deleteWebsiteConfig(websiteConfigId).subscribe(r => {
                            this.getWebsiteConfigs();
                        })
                        this.snotifyService.clear();
                    }
                }, {
                    text: "Cancel",
                    action: () => {
                        this.snotifyService.clear();
                    }
                }
            ]
        });
    }

    enterEditMode() {
        this.editMode = true;
    }

    saveGeneralSettings() {

        this.apiService.saveShop(this.currentShop).subscribe(r => {

            this.editMode = false;
        });
    }

    loginZl() {
        localStorage.setItem('zaloTokenType', 'zalo');
        Zalo.login();
    }

    removeZaloPage(zlPageShop: ZaloPageShop) {
        this.apiService.removeZaloPageShop(zlPageShop).subscribe(r => {
            if (r) {
                this.getZaloPageShops();
            }
        });
    }

    //print bảcode
    printBarcode() {
        var bc = document.getElementById("barcode-content").getElementsByTagName("img")[0];
        console.log(bc);
        var mywindow = window.open('', 'PRINT', 'height=400,width=600');

        mywindow.document.write('<html><body>');

        mywindow.document.write(`<img src="${bc.src}" style="display:block; width:100%; height:auto;margin: 0 auto;"/>`)

        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10*/

        mywindow.print();
        mywindow.close();
        return true;
    }

    zaloPostTimeChange(zlPageShop: ZaloPageShop) {
        this.apiService.updateZaloPageShop(zlPageShop).subscribe(r => {
            this.snotifyService.success("Cài đặt thời gian thành công", "");
        });
    }

    tabChanged(event) {
        this.router.navigate(['settings'], { queryParams: { tab: event.index  } })
    }

    openCheckInSetting() {
        let dialogRef = this.dialog.open(CheckinSettingComponent, {
            width: '600px',
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}

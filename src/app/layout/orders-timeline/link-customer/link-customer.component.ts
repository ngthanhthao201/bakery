import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { ApiService } from '../../../shared/services/api.service';
import { ShopService } from '../../../shared/services/shop.service';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Customer } from '../../../shared/models/customer.model';
import { CustomerShop } from '../../../shared/models/customer-shop.model';
import { SnotifyService } from 'ng-snotify';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { ModelHelper } from '../../../shared/services/model-helper';
import { from } from 'rxjs';
import { CustomerSearchResult } from '../../../shared/models/customer-search-result.model';
import { AlertService } from '../../../shared/services/alert.service';
import { debounceTime, startWith , distinctUntilChanged, switchMap} from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'link-customer',
    templateUrl: './link-customer.component.html',
    styleUrls: ['./link-customer.component.scss'],
})
export class LinkCustomerComponent implements OnInit {

    selectedCustomer: Customer;
    customerShop: CustomerShop;
    externalId: string;
    message: string;
    isDisabled: boolean = true;
    barcode: string;
    externalIdByText: string;
    searchCtrl: FormControl;
    nameCtrl: FormControl;
    vipCtrl: FormControl;
    filteredCustomers: Observable<any[]>;
    newCustomerName = "";
    customerTypes = [];


    @ViewChild('autoComplete_linkCustomerDialog', { read: MatAutocompleteTrigger ,static: false}) autoComplete: MatAutocompleteTrigger;

    constructor(private apiService: ApiService, private shopService: ShopService, private snotifyService: SnotifyService,
        public dialogRef: MatDialogRef<LinkCustomerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, ) {
        this.customerShop = data.customerShop || {};
        this.externalId = data.externalId;
        this.externalIdByText = data.externalId;
        this.selectedCustomer = data.customer || "";
        this.searchCtrl = new FormControl();
        this.nameCtrl = new FormControl();
        this.vipCtrl = new FormControl();

        this.apiService.getCustomerTypes(shopService.currentShop.id).subscribe(r => {
            this.customerTypes = r;
            this.customerShop.customerTypeId = this.customerTypes[0].id
        })


        this.filteredCustomers = this.searchCtrl.valueChanges.pipe(
            startWith(),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap(val => {
                return this.filterCustomer(val || '')
            })
        );
    }

    ngOnInit() {
        if (this.customerShop) {
            // this.apiService.getCustomerByCustomerId(this.customerShop.customerId).subscribe(r => {
            //     this.customer = r;
            // })
        }

        var _this = this;
        (<any>$(document)).scannerDetection({

            timeBeforeScanTest: 200, // wait for the next character for upto 200ms
            avgTimeByChar: 40, // it's not a barcode if a character takes longer than 100ms
            preventDefault: false,
            startChar: [120],
            endChar: [13],
            minLength: 5,
            onComplete: function (barcode) {
                _this.processBarcode(barcode, _this);

            } // main callback function
            ,
            onError: function (string) {
                //_this.processBarcode(string, _this);
            }
        });
        this.message = "Vui lòng quét mã";


    }

    displayFn(user?: any): string | undefined {
        return user && user.phoneNumber ? user.phoneNumber : user;
    }

    onSelectionChanged(event: MatAutocompleteSelectedEvent) {
        var searchResult = event.option.value as CustomerSearchResult;
        if (searchResult.externalId && searchResult.externalId != "") {
            this.snotifyService.warning("Khách hàng này đã có thẻ. Vui lòng chọn khách hàng khác!")
            this.deleteSelectedCustomer();
            return;
        }
        this.getCustomerShop(null, searchResult)
    }

    filterCustomer(val: string) {
        console.log(this.searchCtrl.value)

        if (!val || val.length < 1) {
            this.message = null;
            return from([]);
        }
        if (val && val.length != 10) {
            this.message = "Số điện thoại chưa đúng! (10 số)";
        }
        if ((val && val.length == 10) || (this.selectedCustomer && this.selectedCustomer.id)) {
            localStorage.setItem('isExistedCustomer', 'true');
            this.message = null;
        }
        else {
            localStorage.removeItem('isExistedCustomer');
        }

        return this.apiService.searchCustomerByPhone(this.shopService.currentShop.id, 10, val).map(response => response.filter(customerSearchResult => {
            if (val == customerSearchResult.phoneNumber) {
                this.selectedCustomer = ModelHelper.toCustomer(customerSearchResult);
                this.getCustomerShop(null, customerSearchResult);
            }
            return (customerSearchResult.phoneNumber && customerSearchResult.phoneNumber.indexOf(val) >= 0);
        }));

    }

    async getCustomerShop(customerId = null, customerSearchResult: CustomerSearchResult = null) {
        if (customerId) {
            this.customerShop = await this.apiService.getCustomerShop(customerId, this.shopService.currentShop.id).toPromise();
        }
        if (customerSearchResult) {
            this.customerShop = ModelHelper.toCustomerShop(customerSearchResult);

        }
        if (!this.customerShop.customerTypeId) {
            this.customerShop.customerTypeId = this.customerTypes[0].id
        }

    }

    ngAfterViewInit() {
        // this.processBarcode("19132", this)
    }

    ngOnDestroy() {
        $(document).scannerDetection(false);

    }

    processBarcode(barcode, _this) {
        if (this.externalIdByText && this.externalIdByText.length > 0) {
            return;
        }
        this.message = barcode;
        _this.apiService.getBarcodeTypeByBarcode(_this.shopService.currentShop.id, barcode).subscribe(r => {
            if (r.barcodeType == 3) {
                _this.isDisabled = false;
                _this.externalId = barcode;
            } else {
                _this.isDisabled = true;
                _this.snotifyService.error('Mã không hợp lệ', '');
            }
        })
    }

    linkCustomerShop() {
        if (this.externalIdByText && this.externalIdByText.length > 0) {
            this.externalId = this.externalIdByText;
        }
        this.apiService.linkCustomerShop(this.customerShop.customerTypeId, this.customerShop.customerId, this.shopService.currentShop.id, this.externalId).subscribe(r => {
            this.snotifyService.success('Liên kết thành công', '');
            this.dialogRef.close(this.customerShop);
        }, err => {
            this.snotifyService.error(err._body, '');
        });
    }

    createAndLinkCustomerShop() {
        var newCustomer = {
            phoneNumber: this.searchCtrl.value,
            name: this.newCustomerName,
            customerShops: [
                {
                    shopId: this.shopService.currentShop.id,
                    customerTypeId: this.customerShop.customerTypeId,
                    externalId: this.externalId
                }
            ]
        };
        this.apiService.createAndLinkCustomerShop(newCustomer as Customer).subscribe(r => {
            this.snotifyService.success('Liên kết thành công', '');
            this.customerShop.customerId = r.id;
            this.dialogRef.close(this.customerShop);
        }, err => {
            this.snotifyService.error(err._body, '');
        });
    }



    textChange() {
        if (this.externalIdByText.length < 1) {
            return this.isDisabled = true;
        }
        return this.isDisabled = false;
    }

    deleteExternalId() {
        this.externalId = '';
    }

    deleteSelectedCustomer() {
        this.selectedCustomer = "" as any;
        this.customerShop = {} as any;
        this.newCustomerName = "";

    }

    numberPressedChanged() {
        setTimeout(() => {
            this.autoComplete.openPanel();
            this.autoComplete.position = "below"
            this.autoComplete.updatePosition();
        }, 201)
    }

}


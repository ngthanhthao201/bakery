import { Component, OnInit, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { ProductBarcode } from '../../../../shared/models/product-barcode.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { MemberService } from '../../../../shared/services/member.service';
import { SnotifyService } from 'ng-snotify';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Utilities } from '../../../../shared/services/utilities';
import { Subject } from 'rxjs';
import { RemoveProductBarcodeDialog } from '../remove-product-barcode/remove-product-barcode.component';
import { ProductBarcodeComponent } from '../../product-barcode.component';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import * as _ from "lodash";
import { ProductBarcodeService } from '../../services/product-barcode.service';
import { OrderDetailComponent } from '../../../../shared/modules/order-detail/components/order-detail/order-detail.component';
import { debounceTime } from 'rxjs/operators';
import { MbSignalRService } from '../../../../shared/services/mbSignalR.service'
import { DashboardComponent } from '../../../dashboard/dashboard.component';
@Component({
  selector: 'app-active-product-barcode',
  templateUrl: './active-product-barcode.component.html',
  styleUrls: ['./active-product-barcode.component.scss']
})
export class ActiveProductBarcodeComponent implements OnInit {

  productBarcodes = [];
  productBarcodesOriginal = [];
  private subject: Subject<string> = new Subject();
  image: any;
  row: any;
  currentFile: any;
  public category: any;
  searchProductText: any;
  isShowCakeLifeTime: boolean;
  productBarcode: ProductBarcode;
  public newProductBarcodes = new ProductBarcode;
  filterProductRadio: string = 'all';

  @ViewChild(DatatableComponent, { static: true }) table: DatatableComponent;

  constructor(public dialog: MatDialog, public barcodeService: BarcodeService, 
    private productBarcodeService: ProductBarcodeService, private mbSignalRService: MbSignalRService,
    private memberService: MemberService, private snotifyService: SnotifyService, public apiService: ApiService, 
    public shopService: ShopService, public cdr: ChangeDetectorRef) {
  }

  ngOnInit() {

    this.subject.pipe(debounceTime(500)).subscribe(searchTextValue => {
      console.log('ss')
      this.applyFilter(searchTextValue);
    });

    this.productBarcodeService.getProductBarcodes(this.shopService.currentShop.id).subscribe(allpds => {
      var allpdsSort = _.sortBy(allpds, ['price', 'productCategoryBarcodeId']).reverse();
      this.productBarcodesOriginal = Object.assign(allpdsSort);
      this.productBarcodes = allpdsSort;
      console.log(this.productBarcodes)
    });

  }

  onKeyUp(searchTextValue: string) {
    this.subject.next(searchTextValue);
  }

  applyFilter(filterValue: string) {
    if (!filterValue) {
      this.productBarcodes = _.sortBy(this.productBarcodesOriginal, 'price').reverse();
      return;
    }
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.productBarcodesOriginal.filter(function (pc) {
      return pc.barcode.indexOf(filterValue) > -1;
    });

    // update the rows
    this.productBarcodes = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;

  }

  //remove product
  removeBC(bc) {
    if (!this.memberService.hasPermission("shop.setting")) {
      this.snotifyService.error('Bạn không có quyền xóa!', '');
      return;
    }

    let dialogRef = this.dialog.open(RemoveProductBarcodeDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        productBarcode: bc
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.barcodeService.listChanged.emit();
        this.barcodeService.productBarcodesRemove = result;
      }
      // console.log(this.barcodeService.productBarcodesRemove);
    });
  }

  toggleExpandRow(row) {
    console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event) {
    console.log('Detail Toggled', event);
  }

  filterProductRadioChanged(value) {
    if (value === 'all') {
      this.productBarcodes = Object.assign(this.productBarcodesOriginal);
    }
    if (value === 'notSold') {
      this.productBarcodes = _.filter(this.productBarcodesOriginal, { isSold: false, isActive: true } as any);
    }
    if (value === 'isSold') {
      this.productBarcodes = _.filter(this.productBarcodesOriginal, { isSold: true } as any);
    }
    if (value === 'delete') {
      this.productBarcodes = _.filter(this.productBarcodesOriginal, { isActive: false } as any);
    }

  }

  toggleExpandGroup(group) {
    console.log('Toggled Expand Group!', group);
    this.table.groupHeader.toggleExpandGroup(group);
  }

  viewOrder(orderId) {
    this.apiService.getOrder(orderId).subscribe(r => {
      console.log(r)
      let dialogRef = this.dialog.open(OrderDetailComponent, {
        panelClass: 'col-md-8',
        data: {
          order: r,
        }
      });
    })
  }

  prevent(event, row) {
    // event.stopPropagation();
    // event.preventDefault()
    console.log(event.target.files[0])
    console.log(row.barcode)
  }

  getFiles(event, row) {
    var file = event.target.files[0];
    this.productBarcode = row;
    this.readThis(file, row);
  }

  readThis(file: any, row): void {
    this.currentFile = file;
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.image = myReader.result;
      this.productBarcode.image = this.image;
      row.image = this.image
      this.updateProductBarcode()
    }
    myReader.readAsDataURL(file);
  }
  public updateProductBarcode() {
    this.apiService.uploadImageAzure(this.currentFile, this.image,  "-Category").subscribe(r => {
      this.abc(r)
      console.log("r",r)
  })
  }
  abc(image = ''){
    this.productBarcode.image = image;
    console.log("van Linh")
    console.log(this.productBarcode);
    this.productBarcodeService.updateProductBarcode(this.productBarcode).subscribe((id) => {
        this.addListenProductBarcodeSetShift();
      this.snotifyService.success("Cập nhật thành công");
      this.loading();
    })
  }
  addListenProductBarcodeSetShift(){
    this.mbSignalRService.joinRoom(`productBarcode/${this.shopService.currentShop.id}`).then(r =>{
        this.mbSignalRService.listenEvent('productBarcodeComing',(shift:any) => {
          DashboardComponent.watchProductShift.emit()
        })
    })
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
}



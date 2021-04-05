import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Shop } from '../../shared/models/shop.model';
import { Material } from '../../shared/models/material.model';
import { SnotifyService } from 'ng-snotify';

import { MaterialProvider } from '../../shared/models/material-provider.model';
import { MatDialog } from '@angular/material/dialog';
import { ProviderHistoryDialog } from './dialogs/provider-history.component';
import { ExpenseHeader } from '../../shared/models/expense-header.model';
import { ExpenseTransaction } from '../../shared/models/expense-transaction.model';
import { ExpenseDialog } from '../../shared/dialogs/expense-dialog.component';

import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { MaterialHistoryDialog } from './dialogs/material-history.component';
import { Utilities } from '../../shared/services/utilities';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { EditProviderDialog } from './dialogs/edit-provider.component';

@Component({
  selector: 'app-providers-warehouse',
  templateUrl: './providers-warehouse.component.html',
  styleUrls: ['./providers-warehouse.component.scss']
})
export class ProvidersWarehouseComponent implements OnInit {

  @ViewChild(DatatableComponent,{static: true}) tableMaterial: DatatableComponent;
  @ViewChild(DatatableComponent,{static: true}) tableProvider: DatatableComponent;

  currentShop: Shop;
  materials: Material[];
  materialRows: Material[];
  materialProviders: MaterialProvider[];
  materialProviderRows: MaterialProvider[];
  loadingIndicator: boolean;
  image: string;
  constructor(private apiService: ApiService,
    private snotifyService: SnotifyService,
    public dialog: MatDialog) {
    this.currentShop = JSON.parse(localStorage.getItem('currentShop'));

  }

  ngOnInit() {
    this.loadingIndicator = true;
    Observable.forkJoin(
      this.getMaterials(),
      this.getMaterialProviders()
    ).subscribe(res => {
      this.materials = this.materialRows = res[0];
      this.materialProviders = this.materialProviderRows = res[1];

      _.each(this.materials, m => {
        if (m.materialBuyingHistories) {
          var firstHistory = m.materialBuyingHistories[0];
          if (firstHistory && firstHistory.materialProviderId) {
            m.materialProvider = _.find(this.materialProviders, { 'id': firstHistory.materialProviderId });
          }

        }
      })
      this.loadingIndicator = false;
    });

  }

  getMaterials() {
    return this.apiService.getMaterials(this.currentShop.id);
  }

  getMaterialProviders() {
    return this.apiService.getMaterialProviders(this.currentShop.id);
  }

  removeMaterial(mId) {
    // this.alertService.showDialog("Bạn có chắc chắn muốn xóa nguyên liệu này?", DialogType.confirm, val => {

    //   this.apiService.removeMaterial(mId).subscribe(r => {
    //     this.getMaterials();
    //   })
    // });

    var ref = this.snotifyService.confirm("", "", {
      buttons: [
        {
          text: "Ok",
          action: () => {
            this.apiService.removeMaterial(mId).subscribe(r => {
              this.getMaterials();
            })
          }
        }, {

          text: "Cancel",
          action: () => {

          }
        }
      ]
    }
    );

  }

  onActivateProvider(event) {
    if (event.type === 'click') {
      let dialogRef = this.dialog.open(ProviderHistoryDialog, {
        panelClass: ["col-md-8", "col-sx-12"],
        data: {
          materialBuyingHistories: event.row.materialBuyingHistories
        }
      });
    }
  }

  onActivateMaterial(material) {

    let dialogRef = this.dialog.open(MaterialHistoryDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        material: material
      }
    });

  }

  editInStock(material: Material) {
    this.snotifyService.prompt("Nhập số lượng trong kho", "", {
      buttons: [
        {
          text: "Ok",
          action: () => {

            this.apiService.updateMaterial(material).subscribe(res => {
              this.ngOnInit();
              this.snotifyService.success("Cập nhật thành công!");
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

  createExpenses(m) {
    var newExpenseHeader = new ExpenseHeader(this.currentShop.id);
    if (m.materialProvider) {
      newExpenseHeader.materialProvider = m.materialProvider;
    }

    newExpenseHeader.expenseTransactions = [new ExpenseTransaction(newExpenseHeader.shopId)];
    let dialogRef = this.dialog.open(ExpenseDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        expenseHeader: newExpenseHeader,
        materialProviders: this.materialProviders
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        _.each(result.expenseTransactions, t => {
          if (t.materialBuyingHistory && t.materialBuyingHistory.material && t.materialBuyingHistory.material.id) {
            t.materialBuyingHistory.materialId = t.materialBuyingHistory.material.id;
            t.materialBuyingHistory.material = undefined;
          }
        })
        var newExpense = result;

        this.apiService.createExpenseHeader(newExpense).subscribe(r => {
          this.ngOnInit();
        })
      }
    });
  }

  editProviderInfo(materialProvider: MaterialProvider) {
    let dialogRef = this.dialog.open(EditProviderDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        materialProvider: materialProvider,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      result.materialBuyingHistories = null;

      this.apiService.updateMaterialProvider(result).subscribe(r => {
      })

    });
  }

  applyFilterMaterial(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.materials.filter(function (m) {
      return Utilities.searchOnItem(m, filterValue, ['materialProvider']);
    });

    // update the rows
    this.materialRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableMaterial.offset = 0;
  }

  applyFilterProvider(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.materialProviders.filter(function (m) {
      return Utilities.searchOnItem(m, filterValue);
    });

    // update the rows
    this.materialProviderRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.tableProvider.offset = 0;
  }

  createNewProvider() {
    let dialogRef = this.dialog.open(EditProviderDialog, {
      panelClass: ["col-md-8", "col-sx-12"],
      data: {
        materialProvider: { shopId: this.currentShop.id },
      }
    });
    dialogRef.afterClosed().subscribe(r => {
      if (r) {
        var newProvider = r;
        this.apiService.createMaterialProvider(newProvider).subscribe(result => {
          console.log("Id:" + result);
          this.ngOnInit();
        })
      }
    });
  }
}

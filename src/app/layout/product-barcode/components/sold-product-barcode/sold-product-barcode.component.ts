import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ProductBarcode } from '../../../../shared/models/product-barcode.model';
import { Subject } from 'rxjs';
import { BarcodeService } from '../../../../shared/services/barcode.service';
import { Utilities } from '../../../../shared/services/utilities';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from '../../../../shared/services/api.service';
import { ShopService } from '../../../../shared/services/shop.service';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';
import { ProductCategory } from '../../../../shared/models/product-category.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-sold-product-barcode',
  templateUrl: './sold-product-barcode.component.html',
  styleUrls: ['./sold-product-barcode.component.scss']
})
export class SoldProductBarcodeComponent implements OnInit {

  productBarcodesIsSold: ProductBarcode[] = [];
  productBarcodesIsSoldRows: ProductBarcode[] = [];
  private subjectSoldCakes: Subject<string> = new Subject();

  searchProductText: any;
  searchProductTextIsSold: any;

  //bar chart
  barChartOptions: any;
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartDataIsSold: any[];
  public barChartLabelsIsSold: string[] = [];
  categories: ProductCategory[];

  @ViewChild(DatatableComponent,{static: true}) table: DatatableComponent;

  constructor(public barcodeService: BarcodeService, public apiService: ApiService, public shopService: ShopService, ) {
    this.barChartOptions = {
      scaleShowVerticalLines: true,
      responsive: true,
      scales: {
        xAxes: [{
          ticks: {
            autoSkip: false,
            maxRotation: 60,
            minRotation: 60
          }
        }]
      },
      tooltips: {
        // Disable the on-canvas tooltip
        enabled: false,

        custom: function (tooltipModel) {
          // Tooltip Element
          var tooltipEl = document.getElementById('chartjs-tooltip') as any;

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.id = 'chartjs-tooltip';
            tooltipEl.innerHTML = "<table></table>";
            document.body.appendChild(tooltipEl);
          }
          tooltipEl.style.zIndex = "2";
          tooltipEl.style.background = "#000000c4";
          tooltipEl.style.color = "white";
          // Hide if no tooltip
          if (tooltipModel.opacity === 0) {
            $('#chartjs-tooltip').remove();
            return;
          }

          // Set caret Position
          tooltipEl.classList.remove('above', 'below', 'no-transform');
          if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
          } else {
            tooltipEl.classList.add('no-transform');
          }

          function getBody(bodyItem) {
            return bodyItem.lines;
          }

          // Set Text
          if (tooltipModel.body) {
            var titleLines = tooltipModel.title || [];
            var bodyLines = tooltipModel.body.map(getBody);

            var innerHtml = '<thead>';

            titleLines.forEach(function (title) {
              innerHtml += '<tr><th>' + title + '</th><th></th></tr>';
            });
            innerHtml += '</thead><tbody>';

            bodyLines.forEach(function (body, i) {
              var colors = tooltipModel.labelColors[i];
              var style = 'background:' + colors.backgroundColor;
              style += '; border-color:' + colors.borderColor;
              style += '; border-width: 2px';
              var span = '<span style="' + style + '"></span>';
              innerHtml += '<tr><td>' + span + body + '</td></tr>';
            });

            var productBarcodes = barcodeService.getProductBarcodeNotSoldByName(titleLines[0]) as Array<ProductBarcode>;
            productBarcodes.forEach(i => {

              innerHtml += '<tr><td>' + i.barcode + '</td>'

                + '<td>' + new TimeAgoPipe().transform(i.checkinDate) + '</td></tr>';
            });
            if (productBarcodes.length >= 15) innerHtml += "<tr><td>...</td></tr>"
            innerHtml += '</tbody>';

            var tableRoot = tooltipEl.querySelector('table');
            tableRoot.innerHTML = innerHtml;
          }

          // `this` will be the overall tooltip
          var position = this._chart.canvas.getBoundingClientRect();

          // Display, position, and set styles for font
          tooltipEl.style.opacity = 1;
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.left = position.left + tooltipModel.caretX + 'px';
          tooltipEl.style.top = position.top + tooltipModel.caretY + 'px';
          tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
          tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
          tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
          tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
          tooltipEl.style.marginLeft = "20px";
        }
      }
    };
  }

  ngOnInit() {
    this.subjectSoldCakes.pipe(debounceTime(500)).subscribe(searchProductTextIsSold => {
      this.applyFilterSoldCakes(searchProductTextIsSold);
    });

    this.barcodeService.listChanged.subscribe(r => {
      this.productBarcodesIsSold = this.barcodeService.productBarcodesIsSold;
      this.productBarcodesIsSoldRows = this.barcodeService.productBarcodesIsSold;
      this.applyFilterSoldCakes(this.searchProductTextIsSold);
    });

    this.getCategoriesWithBarcode();
    if (this.barcodeService.productBarcodes) {
      this.initChartDataIsSold();
    }
    else {
      this.barcodeService.listChanged.subscribe(r => {
        this.initChartDataIsSold();
      })
    }
  }

  onKeyUpSoldCakes(searchTextValue: string) {
    this.subjectSoldCakes.next(searchTextValue);
  }

  applyFilterSoldCakes(filterValue: string) {
    if (!filterValue) {
      this.productBarcodesIsSoldRows = this.barcodeService.productBarcodesIsSold;
      return;
    }
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

    const temp = this.barcodeService.productBarcodesIsSold.filter(function (hbc) {
      return Utilities.searchOnItem(hbc, filterValue);
    });

    // update the rows
    this.productBarcodesIsSoldRows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;

  }

  //event
  public chartClickedIsSold(e: any): void {
    if (e.active && e.active[0]) {
      this.searchProductText = e.active[0]._model.label;
      this.applyFilterSoldCakes(this.searchProductTextIsSold);

      $('html, body').animate({
        scrollTop: $("#product-barcode-table").offset().top - 40
      }, 1000);
    }
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  initChartDataIsSold() {
    this.barChartDataIsSold = [
      { data: [], label: 'Đã bán' },
    ];
    this.barChartLabelsIsSold = [];
    this.barcodeService.categories.forEach(i => {
      this.barChartLabelsIsSold.push(i.name);
      this.barChartDataIsSold[0].data.push(this.barcodeService.getCountByProductBarcodeIsSoldId(i.idBarcode));
    });
  }

  getCategoriesWithBarcode() {
    this.apiService.getProductCategoriesByShopWithBarcode(this.shopService.currentShop.id).subscribe(r => {
      this.categories = r;
    })
  }

}

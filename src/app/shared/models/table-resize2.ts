import {NgxDatatableResizer} from "./Ngx-datatable-resizer";

/**
 * @author: Mateusz Zastawny
 */

export class TableResize2 {

  private tableId: string;
  private columns: Array<NgxDatatableResizer>;
  private columnsMap = {};

  private sum: number = 0;

  constructor(tableId: string, columns: Array<NgxDatatableResizer>) {
    this.tableId = tableId;
    this.columns = columns;

    this.setMap();
  }

  private setMap(): void {
    this.columns.forEach(column => {
      this.columnsMap[column.name] = column.grow;
      this.sum = Math.round((this.sum += column.grow) * 100) / 100;
    });
  }

  public width(name: string): number {
    const maxWidth = Number(window.getComputedStyle(document.getElementById(this.tableId)).width.slice(0, -2));
    var result  = (Math.round((((this.columnsMap[name] * 100) / this.sum) / 100) * 100) / 100) * maxWidth;;
    return result ;
  }
}
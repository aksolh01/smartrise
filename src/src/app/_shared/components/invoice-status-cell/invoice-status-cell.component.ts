import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-invoice-status-cell',
  templateUrl: './invoice-status-cell.component.html',
  styleUrls: ['./invoice-status-cell.component.scss']
})
export class InvoiceStatusCellComponent  {
  rowData: any;
  val: any;
  @Input() set value(val: any) {
    this.val = val;
  }

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

}

import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-invoice-due-amount',
  templateUrl: './invoice-due-amount.component.html',
  styleUrls: ['./invoice-due-amount.component.scss']
})
export class InvoiceDueAmountComponent implements ViewCell {
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

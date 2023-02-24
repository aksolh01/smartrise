import { Component, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-ng2-table-html-cell',
  templateUrl: './ng2-table-html-cell.component.html',
  styleUrls: ['./ng2-table-html-cell.component.scss']
})
export class Ng2TableHtmlCellComponent implements ViewCell {

  constructor() { }
  value: string | number;
  rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-account-name-cell',
  templateUrl: './account-name-cell.component.html',
  styleUrls: ['./account-name-cell.component.scss']
})
export class AccountNameCellComponent implements OnInit, ViewCell {

  clicked = new EventEmitter<number>();

  private headerText: string;
  get header() {
    return this.headerText;
  }
  set header(v: string) {
    this.headerText = v;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onClick() {
    this.clicked.emit(this.rowData?.account?.id);
  }
}

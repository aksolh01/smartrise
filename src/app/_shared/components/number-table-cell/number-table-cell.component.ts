import { Component, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-number-table-cell',
  templateUrl: './number-table-cell.component.html',
  styleUrls: ['./number-table-cell.component.scss']
})
export class NumberTableCellComponent implements OnInit, ViewCell {

  constructor() { }

  value: string | number;
  rowData: any;
  suffix: string;
  prefix: string;
  parameter: string;

  ngOnInit(): void {
    const o = this.value;
  }

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  public setSuffix(suffix: string) {
    this.suffix = suffix;
  }

  public setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  public setParameter(parameter: string) {
    this.parameter = parameter;
  }
}

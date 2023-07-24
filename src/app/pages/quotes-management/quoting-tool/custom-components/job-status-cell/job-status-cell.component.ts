import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-job-status-cell',
  templateUrl: './job-status-cell.component.html',
  styleUrls: ['./job-status-cell.component.scss']
})
export class JobStatusCellComponent implements OnInit, ViewCell {

  @Input() value: any;
  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  constructor() { }

  ngOnInit(): void {
  }

}

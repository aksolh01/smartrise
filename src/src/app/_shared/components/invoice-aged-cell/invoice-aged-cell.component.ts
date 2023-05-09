import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-invoice-aged-cell',
  templateUrl: './invoice-aged-cell.component.html',
  styleUrls: ['./invoice-aged-cell.component.scss']
})
export class InvoiceAgedCellComponent implements OnInit {

  constructor() { }

  @Input() set value(val: any) {
  }

  @Input() rowData: any;
  @Input() isPillStyle = false;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  ngOnInit(): void {
  }
}

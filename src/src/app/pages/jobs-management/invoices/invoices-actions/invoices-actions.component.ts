import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-invoices-actions',
  templateUrl: './invoices-actions.component.html',
  styleUrls: ['./invoices-actions.component.scss']
})
export class InvoicesActionsComponent implements OnInit, ViewCell {

  canViewInvoiceDetails = true;
  showDetails = new EventEmitter<any>();

  constructor() { }
  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onShowDetails() {
    this.showDetails.next(this.rowData);
  }
}

import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-invoices-actions',
  templateUrl: './invoices-actions.component.html',
  styleUrls: ['./invoices-actions.component.scss']
})
export class InvoicesActionsComponent implements OnInit {
  value: string | number;
  rowData: any;

  canPay = true;
  payEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onPay() {
    this.payEvent.emit(this.rowData);
  }
}

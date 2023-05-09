import { Component, OnInit, EventEmitter  } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-statement-of-account-actions',
  templateUrl: './statement-of-account-actions.component.html',
  styleUrls: ['./statement-of-account-actions.component.scss']
})
export class AgedRecievablesActionsComponent implements OnInit, ViewCell {

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

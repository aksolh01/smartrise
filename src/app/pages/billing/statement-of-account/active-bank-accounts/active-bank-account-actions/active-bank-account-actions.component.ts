import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { IActiveBankAccount } from '../../../../../_shared/models/bank-account.model';

@Component({
  selector: 'ngx-active-bank-account-actions',
  templateUrl: './active-bank-account-actions.component.html',
  styleUrls: ['./active-bank-account-actions.component.scss']
})
export class ActiveBankAccountActionsComponent implements OnInit, ViewCell {
  select = new EventEmitter<IActiveBankAccount>();
  id: any;

  constructor() { }
  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onSelect(id) {
    this.rowData.selected = true;
    this.select.next(this.rowData);
  }
}

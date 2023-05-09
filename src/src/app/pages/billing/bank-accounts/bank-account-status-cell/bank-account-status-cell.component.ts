import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { BankAccountStatusConstants } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-bank-account-status-cell',
  templateUrl: './bank-account-status-cell.component.html',
  styleUrls: ['./bank-account-status-cell.component.scss']
})
export class BankAccountStatusCellComponent implements OnInit, ViewCell {

  active = BankAccountStatusConstants.Active;
  awaitingVerification = BankAccountStatusConstants.AwaitingVerification;
  toBeDeleted = BankAccountStatusConstants.ToBeDeleted;
  transferFailed = BankAccountStatusConstants.TransferFailed;

  constructor() { }

  bankStatus: string | number;
  @Input() set value(val: string | number) {
    this.bankStatus = val;
  }

  rowData: any;

  ngOnInit(): void {
  }

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

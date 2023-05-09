import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-accounts-list-cell',
  templateUrl: './accounts-list-cell.component.html',
  styleUrls: ['./accounts-list-cell.component.scss']
})
export class AccountsListCellComponent implements OnInit, ViewCell {

  constructor(private router: Router) { }

  clicked = new EventEmitter<any>();
  showAccountInfo = new EventEmitter<any>();
  value: any;
  rowData: any;

  ngOnInit(): void {
  }

  onClickAccount(account) {
    this.clicked.emit(account.accountId);
  }

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  openAccountRoles(account) {
    this.showAccountInfo.emit(account);
  }
}

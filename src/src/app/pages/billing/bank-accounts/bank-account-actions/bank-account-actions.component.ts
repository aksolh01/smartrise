import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { BankAccountStatusConstants } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-bank-account-actions',
  templateUrl: './bank-account-actions.component.html',
  styleUrls: ['./bank-account-actions.component.scss']
})
export class BankAccountActionsComponent implements OnInit, ViewCell {

  canSetDefault = true;
  canViewDetails = true;
  canEditDetails = true;
  canVerifyAccount = true;
  awaitingVerification = BankAccountStatusConstants.AwaitingVerification;
  isImpersonate = false;
  active = BankAccountStatusConstants.Active;
  showDetails = new EventEmitter<any>();
  verifyAccount = new EventEmitter<any>();
  setDefault = new EventEmitter<any>();
  edit = new EventEmitter<any>();

  constructor(
    private miscellaneousService: MiscellaneousService,
  ) { }

  value: string | number;
  rowData: any;

  ngOnInit(): void {
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
  }

  onShowDetails() {
    this.showDetails.emit(this.rowData.id);
  }

  onVerifyAccount() {
    this.verifyAccount.emit(this.rowData.id);
  }

  onSetDefault() {
    this.setDefault.emit(this.rowData.id);
  }

  onEdit() {
    this.edit.emit(this.rowData);
  }

  enableSetDefault() {
    this.canSetDefault = true;
  }

  disableSetDefault() {
    this.canSetDefault = false;
  }

  enableVerifyAccount() {
    this.canVerifyAccount = true;
  }

  disableVerifyAccount() {
    this.canVerifyAccount = false;
  }
}

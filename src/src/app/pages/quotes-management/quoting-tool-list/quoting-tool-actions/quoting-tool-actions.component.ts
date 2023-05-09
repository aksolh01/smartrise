import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { PermissionService } from '../../../../services/permission.service';
import { PERMISSIONS } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-quoting-tool-actions',
  templateUrl: './quoting-tool-actions.component.html',
  styleUrls: ['./quoting-tool-actions.component.scss']
})
export class QuotingToolActionsComponent implements OnInit, ViewCell {

  edit = new EventEmitter<any>();
  view = new EventEmitter<any>();
  viewHistory = new EventEmitter<any>();
  viewPricing = new EventEmitter<any>();
  isImpersonate: boolean;
  isSmartriseUser: boolean;
  generated = 'Generated';
  canEditQuote = false;
  canViewQuote = false;
  isLoadingActivityHistory: boolean;
  accountId: any;

  constructor(
    private miscellaneousService: MiscellaneousService,
    private permissionService: PermissionService,
    private multiAccountService: MultiAccountsService
  ) { }

  value: string | number;
  rowData: any;

  ngOnInit(): void {
    this.accountId = this.multiAccountService.hasSelectedAccount() ? this.multiAccountService.getSelectedAccount() : this.rowData.accountId;
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this._readSaveOnlineQuotePermission();
    this._readShowOnlineQuoteDetailsPermission();
  }

  private _readShowOnlineQuoteDetailsPermission() {
    if (this.isSmartriseUser) {
      this.canViewQuote = this.permissionService.hasPermission(PERMISSIONS.ShowOnlineQuoteDetails);
    } else {
      this.canViewQuote = this.permissionService.hasPermissionInAccount(PERMISSIONS.ShowOnlineQuoteDetails, this.accountId);
    }
  }

  private _readSaveOnlineQuotePermission() {
    if (this.isSmartriseUser) {
      this.canEditQuote = this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote);
    } else {
      this.canEditQuote = this.permissionService.hasPermissionInAccount(PERMISSIONS.SaveOnlineQuote, this.accountId);
    }
  }

  onEditQuote() {
    this.edit.next(this.rowData);
  }

  onViewQuote() {
    this.view.next(this.rowData);
  }

  onViewHistory() {
    this.viewHistory.next(this.rowData);
  }

  onViewPricing() {
    this.viewPricing.next(this.rowData);
  }
}

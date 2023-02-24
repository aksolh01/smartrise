import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseComponentService } from '../../../../services/base-component.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { IActiveBankAccount } from '../../../../_shared/models/bank-account.model';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../../base.component';
import { ActiveBankAccountActionsComponent } from './active-bank-account-actions/active-bank-account-actions.component';

@Component({
  selector: 'ngx-active-bank-accounts',
  templateUrl: './active-bank-accounts.component.html',
  styleUrls: ['./active-bank-accounts.component.scss']
})
export class ActiveBankAccountsComponent extends BaseComponent implements OnInit {

  accountSelected = false;
  private __selectedAccount: IActiveBankAccount;
  isSmall: boolean;

  set selectedAccount(v: IActiveBankAccount) {
    this.__selectedAccount = v;
    this.accounts.forEach(x => x.selected = false);
    const account = this.accounts.find(x => x.id === v.id);
    account.selected = true;
  }

  get selectedAccount() {
    return this.__selectedAccount;
  }

  source = new LocalDataSource();
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      actionsCol: {
        filter: false,
        sort: false,
        title: '',
        type: 'custom',
        renderComponent: ActiveBankAccountActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
      last4: {
        width: '20%',
        sort: false,
        title: 'Account Number (last 4 digits)',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account Number (last 4 digits)');
        },
        show: false,
        filter: false,
      },
      accountHolderName: {
        sort: false,
        title: 'Name on Account',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Name on Account');
        },
        show: false,
        filter: false,
      },
      accountType: {
        title: 'Account Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account Type');
        },
        show: false,
        filter: false,
        sort: false,
      },
      // status: {
      //   title: 'Status',
      //   type: 'custom',
      //   renderComponent: Ng2TableCellComponent,
      //   onComponentInitFunction: (instance: Ng2TableCellComponent) => {
      //     instance.setHeader('Status');
      //   },
      //   valuePrepareFunction: this.getEnumDescription.bind(this),
      //   show: false,
      //   filter: false,
      // },
      bankName: {
        sort: false,
        title: 'Bank Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Bank Name');
        },
        show: false,
        filter: false,
      },
    },
  };
  private _accounts: IActiveBankAccount[];
  private _selectedAccount: any;

  onActionsInit(actions: ActiveBankAccountActionsComponent) {
    actions.select.subscribe(row => {
      this.accountSelected = true;
      this._selectedAccount = row;
    });
  }

  onSelect(account) {
    this.accountSelected = true;
    this._selectedAccount = account;
  }

  constructor(
    private baseService: BaseComponentService,
    private responsiveService: ResponsiveService,
    private ref: BsModalRef
  ) {
    super(baseService);
  }

  @Input()
  set accounts(val: IActiveBankAccount[]) {
    this._accounts = val;
    this.source = new LocalDataSource(this._accounts);
  }

  get accounts(): IActiveBankAccount[] {
    return this._accounts;
  }

  onChoose() {
    this.selectedAccount = this._selectedAccount;
    this.ref.hide();
  }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (
        w === ScreenBreakpoint.md ||
        w === ScreenBreakpoint.xs ||
        w === ScreenBreakpoint.sm
      ) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
  }

  onCancel() {
    this.ref.hide();
  }
}

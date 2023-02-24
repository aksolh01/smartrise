import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Subscription } from 'rxjs';
import { AccountRolesSelectionService } from '../../../services/account-roles-selection.service';
import { IAccountUserRoles } from '../../models/account-selection.model';
import { IRole } from '../../models/role';
import { RemoveAccountCellComponent } from '../remove-account-cell/remove-account-cell.component';
import { RolesChecklistCellComponent } from '../roles-checklist-cell/roles-checklist-cell.component';
import { SelectableAccountCellComponent } from '../selectable-account-cell/selectable-account-cell.component';

@Component({
  selector: 'ngx-account-roles-selection',
  templateUrl: './account-roles-selection.component.html',
  styleUrls: ['./account-roles-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountRolesSelectionComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: AccountRolesSelectionComponent,
      multi: true,
    },
    AccountRolesSelectionService,
  ],
})
export class AccountRolesSelectionComponent implements Validator, ControlValueAccessor, OnDestroy, OnInit {
  @Input() validationEnabled = false;
  @Input() allowAccountsSelection = false;
  @Input() allowRemoveAccount = true;

  isDisabled: boolean;
  accountsSource: LocalDataSource;
  accountsSettings: any = {
    hideSubHeader: true,
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      remove: {
        width: '2%',
        title: '',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: RemoveAccountCellComponent,
        onComponentInitFunction: (instance: RemoveAccountCellComponent) => {
          instance.setHeader('');
        },
      },
      name: {
        title: 'Accounts',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: SelectableAccountCellComponent,
        onComponentInitFunction: (instance: SelectableAccountCellComponent) => {
          instance.setHeader('Account');
          instance.isSelectable = this.allowAccountsSelection;
        },
      },
      roles: {
        title: 'Roles',
        type: 'custom',
        filter: false,
        sort: false,
        renderComponent: RolesChecklistCellComponent,
        onComponentInitFunction: (instance: RolesChecklistCellComponent) => {
          instance.setHeader('Roles');
          instance.isAccountSelectable = this.allowAccountsSelection;
        },
      },
    },
  };

  private _accounts: IAccountUserRoles[] = [];
  private _onChanged: any;
  private _onTouched: any;
  private _changeSubscription: Subscription;
  private _roles: IRole[] = [];
  private _removeAccountSubscription: Subscription;

  constructor(
    private accountRolesSelectionService: AccountRolesSelectionService
  ) {}

  get roles(): IRole[] {
    return this._roles;
  }

  @Input()
  set roles(value: IRole[]) {
    this._roles = value;
    this.accountRolesSelectionService.roles$.next(value);
  }

  ngOnInit(): void {
    if (!this.allowRemoveAccount) {
      delete this.accountsSettings.columns.remove;
    }
    this._refreshSource();
    this._changeSubscription =
      this.accountRolesSelectionService.change$.subscribe(() => {
        this._notifyFormAboutChange();
      });
    this._removeAccountSubscription =
      this.accountRolesSelectionService.removeAccount$.subscribe(
        (account: IAccountUserRoles) => {
          this._removeAccount(account);
        }
      );
  }

  ngOnDestroy(): void {
    this._changeSubscription?.unsubscribe();
    this._removeAccountSubscription?.unsubscribe();
  }

  registerOnValidatorChange?(): void {}

  writeValue(obj: any): void {
    this._accounts = obj;
    this._refreshSource();
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(control: AbstractControl): ValidationErrors | null {
    if (!this.validationEnabled) {
      return null;
    }

    if (this.allowAccountsSelection) {
      return this._noAccountSelected();
    }
    for (const account of this._accounts) {
      const error = this._noRoleSelected(account);
      if (error) {
        return error;
      }
    }
    return null;
  }

  private _refreshSource() {
    this.accountsSource = new LocalDataSource(this._accounts);
  }

  private _noAccountSelected() {
    if (!this._accounts.some((a) => a.isSelected)) {
      return { noAccountSelceted: true };
    }
    return null;
  }

  private _noRoleSelected(account: IAccountUserRoles) {
    if (!account.roles || account.roles.length === 0) {
      return { noRolesSelected: account.name };
    }
    return null;
  }

  private _notifyFormAboutChange() {
    if (this._onTouched) {
      this._onTouched();
    }
    if (this._onChanged) {
      this._onChanged(this._accounts);
    }
  }

  private _removeAccount(account: IAccountUserRoles) {
    this._removeAccountFromArray(account);
    this._refreshSource();
    this._notifyFormAboutChange();
  }

  private _removeAccountFromArray(account: IAccountUserRoles) {
    const indexOfAccount = this._accounts.indexOf(account);
    this._accounts.splice(indexOfAccount, 1);
  }
}

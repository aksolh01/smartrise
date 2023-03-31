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
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AccountRolesSelectionService } from '../../../services/account-roles-selection.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { IAccountUserRoles } from '../../models/account-selection.model';
import { IRole } from '../../models/role';
import { InfoDialogData } from '../info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
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

  accounts: IAccountUserRoles[] = [];
  private _onChanged: any;
  private _onTouched: any;
  private _changeSubscription: Subscription;
  private _roles: IRole[] = [];
  isDisabled: boolean;

  @Input() validationEnabled: boolean = false;
  private _removeAccountSubscription: Subscription;
  modelRef: any;

  @Input()
  set roles(value: IRole[]) {
    this._roles = value;
    this.accountRolesSelectionService.roles$.next(value);
  }

  get roles(): IRole[] {
    return this._roles;
  }

  @Input() allowAccountsSelection: boolean = false;
  @Input() allowRemoveAccount: boolean = true;

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

  constructor(
    private accountRolesSelectionService: AccountRolesSelectionService,
    private miscellaneousService: MiscellaneousService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    if (!this.allowRemoveAccount) {
      delete this.accountsSettings.columns.remove;
    }
  }
  // ngOnInit(): void {
  //   throw new Error('Method not implemented.');
  // }
  registerOnValidatorChange?(fn: () => void): void {
    throw new Error('Method not implemented.');
  }


  writeValue(obj: any): void {
    this.accounts = obj;
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



  isRoleSelected(account: IAccountUserRoles, role: IRole) {
    return account.roles.some(r => role.name === r);
  }

  roleChecked(checked: boolean, account: IAccountUserRoles, role: IRole) {
    if (checked) {
      account.roles.push(role.name);
    } else {
      this._removeRoleFromAccount(account, role.name);
    }
    this._notifyFormAboutChange();
  }

  onRemove(account) {
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this account?', () => {
      this._removeAccount(account);
    });
  }

  private _removeRoleFromAccount(account: IAccountUserRoles, role: string) {
    const indexOfRole = account.roles.indexOf(role);
    account.roles.splice(indexOfRole, 1);
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
    for (let account of this.accounts) {
      const error = this._noRoleSelected(account);
      if (error) {
        return error;
      }
    }
    return null;
  }

  private _refreshSource() {
    this.accountsSource = new LocalDataSource(this.accounts);
  }

  private _noAccountSelected() {
    if (!this.accounts.some(a => a.isSelected)) {
      return { 'noAccountSelceted': true };
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
      if (this._onChanged)
        this._onChanged(this.accounts);
    }
  }

  private _removeAccount(account: IAccountUserRoles) {
    this._removeAccountFromArray(account);
    this._refreshSource();
    this._notifyFormAboutChange();
  }

  private _removeAccountFromArray(account: IAccountUserRoles) {
    const indexOfAccount = this.accounts.indexOf(account);
    this.accounts.splice(indexOfAccount, 1);
  }

  showPrivileges(role: IRole): void {
    const dialogData: InfoDialogData = {
      title: `${role.displayName} Role Privileges`,
      content: (role.rolesPrivileges || '').split('\n').sort((a, b) => a < b ? -1 : a > b ? 1 : 0),
      dismissButtonLabel: 'Close',
      showDismissButton: true,
      showAsBulltes: true
    };

    this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: dialogData
    });
  }

  onSelectUnSelect(value: boolean, account: IAccountUserRoles) {
    account.isSelected = value;
    if (!value) {
      this._unSelectRoles(account);
    }
    this._notifyFormAboutChange();
  }

  private _unSelectRoles(account: IAccountUserRoles) {
    account.roles = [];
  }

  ngOnDestroy(): void {
    this.modalService.hide();
    this._changeSubscription?.unsubscribe();
    this._removeAccountSubscription?.unsubscribe();
  }
}

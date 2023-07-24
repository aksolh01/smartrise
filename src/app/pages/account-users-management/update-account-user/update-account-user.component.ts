import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../services/account.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from '../../../services/message.service';
import { SmartriseValidators, URLs } from '../../../_shared/constants';
import { IAccountUserRoles } from '../../../_shared/models/account-selection.model';
import { IAccountUserPayload, IAccountUserResponse } from '../../../_shared/models/account-user.model';
import { IAccountLookup } from '../../../_shared/models/customer-lookup';
import { IRole } from '../../../_shared/models/role';
import { AccountsWithoutMatchingContactsComponent } from '../accounts-without-matching-contacts/accounts-without-matching-contacts.component';

@Component({
  selector: 'ngx-update-account-user',
  templateUrl: './update-account-user.component.html',
  styleUrls: ['./update-account-user.component.scss']
})
export class UpdateAccountUserComponent implements OnInit {

  customerUserForm: UntypedFormGroup;
  roles: IRole[] = [];
  isFormReady: boolean;
  oldRoles: IRole[];
  rolesChanged = false;
  customerId: number;
  customerName: string;
  userId: string;
  manageRoute: any;
  formSubmitted: boolean;
  rolesTouched: boolean;

  filteredAccounts: any[];
  isSaving: boolean;
  user: IAccountUserResponse;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private modalService: BsModalService,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('@userName', { skip: true });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');

    this.isFormReady = false;

    forkJoin([
      this.accountService.getCustomerRoles(),
      this.accountService.getAccountUser(this.userId),
    ]).subscribe(([roles, user]) => {
      this.oldRoles = roles;
      this.roles = roles;
      this.user = user;
      this.createCustomerUserForm(user);
      this.isFormReady = true;
      this.bcService.set('@userName', user.firstName + ' ' + user.lastName);
      this.bcService.set('@userName', { skip: false });
    }, (error) => {
      this.router.navigateByUrl(URLs.ViewAccountUsersURL);
    });
  }

  onRoleChanged() {
    this.rolesChanged = true;
  }

  createCustomerUserForm(user: IAccountUserResponse) {
    this.customerUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(user.firstName, Validators.required),
      lastName: new UntypedFormControl(user.lastName, Validators.required),
      email: new UntypedFormControl(user.email, [SmartriseValidators.requiredWithTrim, Validators.email]),
      accounts: new UntypedFormControl(user.accounts, Validators.required)
    });
    this.rolesTouched = true;
    this.customerUserForm.markAllAsTouched();
  }

  onSubmit() {

    if (this.isSaving) {
      return;
    }


    if (this._noAccountIsSelected()) {
      this.messageService.showErrorMessage('At least one account must be selected');
      return;
    }

    if (this._noRoleIsSelected()) {
      this.messageService.showErrorMessage('All accounts must have at least one role');
      return;
    }

    this.formSubmitted = true;
    if (this.customerUserForm.invalid) {
      return;
    }

    this.isSaving = true;

    const accountUser: IAccountUserPayload = {
      userId: this.userId,
      accounts: this.customerUserForm.value.accounts
    };

    this.accountService.updateAccountUserBySmartrise(accountUser).subscribe(
      (updateResponse) => this._onUserUpdated(updateResponse),
      (error) => this._onUserCreationFailed(error)
    );
  }

  private _onUserCreationFailed(error: any): void {
    this.isSaving = false;
    if(error?.error?.failedResult && error.error.failedResult.length > 0) {
      this._showAccountsWithoutMatchingContactsOnFailedScenario(error.error.failedResult).subscribe(() => { });
    }
  }

  private _showAccountsWithoutMatchingContactsOnFailedScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'failed',
        accounts: accountsWithoutMatchingContacts,
        message: 'Failed to update Account User.',
        topMessage: `The Account User could not be linked to the following Account(s):`,
        bottomMessage: 'Please add the Account User as an Account Contact in Salesforce.'
      }
    }).onHide;
  }

  private _onUserUpdated(response) {
    this.isSaving = false;
    if (response.accountsWithoutMatchingContacts.length > 0) {
      this._showAccountsWithoutMatchingContactsOnSuccessScenario(response.accountsWithoutMatchingContacts).subscribe(() => {
        this.router.navigateByUrl(URLs.ViewAccountUsersURL);
      });
      return;
    }
    this.messageService.showSuccessMessage('Account user has been updated successfully');
    this.router.navigateByUrl(URLs.ViewAccountUsersURL);
  }

  private _showAccountsWithoutMatchingContactsOnSuccessScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'success',
        accounts: accountsWithoutMatchingContacts,
        message: 'Account User has been updated successfully.',
        topMessage: `The Account User could not be linked to the following Account(s):`,
        bottomMessage: 'Please add the Account User as an Account Contact in Salesforce.'
      }
    }).onHide;
  }

  onSearchAccounts(searchValue: string) {
    this.customerService.getCustomersPagedLookup(searchValue).subscribe(accounts => {
      this.filteredAccounts = accounts;
    });
  }

  onSelectionChange(selectedAccount: IAccountLookup) {
    if (this._accountAlreadySelected(selectedAccount.id)) {
      this.messageService.showErrorMessage(`${selectedAccount.name} account has been already selected`);
      return;
    }

    this._addAccount(selectedAccount);
  }

  private _accountAlreadySelected(selectedAccountId: number): boolean {
    const accounts = <IAccountUserRoles[]>this.customerUserForm.value.accounts;
    return accounts.some(account => account.accountId === selectedAccountId);
  }

  private _addAccount(selectedAccount: IAccountLookup) {
    const accounts = this.customerUserForm.value.accounts;
    accounts.push({
      accountId: selectedAccount.id,
      name: selectedAccount.name,
      roles: []
    });
    this.customerUserForm.patchValue({
      accounts
    });
  }

  private _noAccountIsSelected() {
    const accounts = <IAccountUserRoles[]>this.customerUserForm.value.accounts;
    return accounts.length === 0;
  }

  private _noRoleIsSelected(): boolean {
    const accounts = <IAccountUserRoles[]>this.customerUserForm.value.accounts;
    return accounts.some(account => account.roles.length === 0);
  }

  onCancel() {
    this.router.navigateByUrl(URLs.ViewAccountUsersURL);
  }

  ngOnDestroy(): void {
    this.manageRoute?.unsubscribe();
    sessionStorage.removeItem('customerName');
  }

  onClose() {
    this.router.navigateByUrl(URLs.ViewAccountUsersURL);
  }
}

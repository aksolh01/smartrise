import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, UntypedFormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IRole } from '../../../../_shared/models/role';
import { MessageService } from '../../../../services/message.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { forkJoin } from 'rxjs';
import { SmartriseValidators, URLs } from '../../../../_shared/constants';
import { IAccountUserRoles } from '../../../../_shared/models/account-selection.model';
import { ICustomerUserPayload, ICustomerUserResponse } from '../../../../_shared/models/customer-user-by-customer-admin.model';
import { AccountService } from '../../../../services/account.service';
import { AccountsWithoutMatchingContactsComponent } from '../../../account-users-management/accounts-without-matching-contacts/accounts-without-matching-contacts.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';

@Component({
  selector: 'ngx-update-customer-user',
  templateUrl: './update-customer-user.component.html',
  styleUrls: ['./update-customer-user.component.scss'],
})
export class UpdateCustomerUserComponent implements OnInit {
  customerUserForm: UntypedFormGroup;
  customerUser: ICustomerUserResponse;
  roles: IRole[] = [];
  isFormReady: boolean;
  oldRoles: IRole[];
  rolesChanged = false;
  formSubmitted = false;
  rolesTouched: boolean;
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private bcService: BreadcrumbService,
    private modalService: BsModalService,
    private multiAccountsService: MultiAccountsService
  ) { }

  ngOnInit(): void {
    this.isFormReady = false;
    this.bcService.set('@userName', { skip: true });
    const userId = this.route.snapshot.paramMap.get('id');
    this._createCustomerUserForm();

    forkJoin([
      this.accountService.getLinkedAccounts(),
      this.accountService.getCustomerRoles(),
      this.accountService.getCustomerUserByCustomerAdmin(userId),
    ]).subscribe(([linkedAccounts, roles, user]) => {
      
      if (this.multiAccountsService.hasManyAccountsAndOneSelectedAccount()) {
        const hasAccess = user.accounts.some(account => account.accountId == this.multiAccountsService.getSelectedAccount());

        if (hasAccess == false) {
          this.router.navigateByUrl(URLs.HomeURL);
        }
      }

      this.oldRoles = roles;
      this.roles = roles;
      this.customerUser = user;

      this.bcService.set('@userName', this.customerUser.firstName + ' ' + this.customerUser.lastName);
      this.bcService.set('@userName', { skip: false });
      this._fillCustomerUserForm(user, linkedAccounts);
      this.isFormReady = true;
    }, (error) => {
      this.router.navigateByUrl('pages/settings-management/customer-users');
    });
  }

  onRoleChanged() {
    this.rolesChanged = true;
  }

  private _createCustomerUserForm() {
    this.customerUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [SmartriseValidators.requiredWithTrim, Validators.email]),
      accounts: new FormControl([], Validators.required)
    });
    this.rolesTouched = true;
    this.customerUserForm.markAllAsTouched();
  }

  private _fillCustomerUserForm(user: ICustomerUserResponse, linkedAccounts: IAccountUserRoles[]) {
    this.customerUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accounts: this._generateAccounts(linkedAccounts, user)
    });
  }

  private _generateAccounts(linkedAccounts: IAccountUserRoles[], user: ICustomerUserResponse): any {
    const accounts = linkedAccounts.map(la => { return { ...la, roles: [] } });
    user.accounts.forEach(acc => {
      const account = accounts.find(a => a.accountId === acc.accountId);
      if (account) {
        account.isSelected = acc.roles.length > 0;
        account.roles = acc.roles;
      }
    });
    return accounts;
  }

  onSubmit() {
    if (this.isSaving) {
      return;
    }

    // if (!this._atLeastOneAccountIsSelected()) {
    //   this.messageService.showErrorMessage('At least one account must be selected');
    //   return;
    // }

    if (this._noRoleIsSelected()) {
      this.messageService.showErrorMessage('Selected accounts must have at least one role');
      return;
    }

    this.formSubmitted = true;
    if (this.customerUserForm.invalid) {
      return;
    }

    this.isSaving = true;

    const customerUser: ICustomerUserPayload = {
      userId: this.customerUser.id,
      accounts: this._getSelectedAccounts(),
    };
    this.accountService.updateCustomerUserByCustomerAdmin(customerUser).subscribe(
      (response) => this._onUserUpdatedSuccessfully(response),
      (error) => this._onUpdatedUserFailed(error)
    );
  }

  private _onUpdatedUserFailed(error: any) {
    this.isSaving = false;
    if (error?.error?.failedResult && error.error.failedResult.length > 0) {
      this._showAccountsWithoutMatchingContactsOnFailedScenario(error.error.failedResult).subscribe(() => { });
    }
  }

  private _showAccountsWithoutMatchingContactsOnFailedScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'failed',
        accounts: accountsWithoutMatchingContacts,
        message: 'Failed to update Account User.',
        topMessage: 'The Account User could not be linked to the following Account(s):',
        bottomMessage: 'Please contact your Regional Sales Team for support.'
      }
    }).onHide;
  }

  private _onUserUpdatedSuccessfully(response) {
    this.isSaving = false;
    if (response.accountsWithoutMatchingContacts.length > 0) {
      this._showAccountsWithoutMatchingContactsOnSuccessScenario(response.accountsWithoutMatchingContacts).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
      return;
    }
    this.messageService.showSuccessMessage('Account User has been updated successfully');
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private _showAccountsWithoutMatchingContactsOnSuccessScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'success',
        accounts: accountsWithoutMatchingContacts,
        message: 'Account User has been updated successfully.',
        topMessage: 'The Account User could not be linked to the following Account(s):',
        bottomMessage: 'Please contact your Regional Sales Team for support.'
      }
    }).onHide;
  }

  private _getSelectedAccounts() {
    const accounts = this.customerUserForm.value
      .accounts as IAccountUserRoles[];
    return accounts.filter((account) => account.isSelected);
  }

  private _atLeastOneAccountIsSelected() {
    const accounts = this.customerUserForm.value
      .accounts as IAccountUserRoles[];
    return accounts.some((account) => account.isSelected);
  }

  private _noRoleIsSelected(): boolean {
    const accounts = this.customerUserForm.value
      .accounts as IAccountUserRoles[];
    return accounts
      .filter((account) => account.isSelected)
      .some((account) => account.roles.length === 0);
  }
}

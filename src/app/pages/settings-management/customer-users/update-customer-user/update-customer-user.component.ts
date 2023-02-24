import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { SmartriseValidators } from '../../../../_shared/constants';
import { IAccountUserRoles } from '../../../../_shared/models/account-selection.model';
import {
  ICustomerUserPayload,
  ICustomerUserResponse
} from '../../../../_shared/models/customer-user-by-customer-admin.model';
import { IRole } from '../../../../_shared/models/role';

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
    private bcService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.isFormReady = false;
    this.bcService.set('@userName', { skip: true });
    const userId = this.route.snapshot.paramMap.get('id');
    this._createCustomerUserForm();

    forkJoin([
      this.accountService.getLinkedAccounts(),
      this.accountService.getCustomerRoles(),
      this.accountService.getCustomerUserByCustomerAdmin(userId),
    ]).subscribe(
      ([linkedAccounts, roles, user]) => {
        this.oldRoles = roles;
        this.roles = roles;
        this.customerUser = user;
        this.bcService.set(
          '@userName',
          this.customerUser.firstName + ' ' + this.customerUser.lastName
        );
        this.bcService.set('@userName', { skip: false });
        this._fillCustomerUserForm(user, linkedAccounts);
        this.isFormReady = true;
      },
      () => {
        this.router.navigateByUrl('pages/settings-management/customer-users');
      }
    );
  }

  onRoleChanged() {
    this.rolesChanged = true;
  }

  onSubmit() {
    if (this.isSaving) {
      return;
    }

    if (!this._atLeastOneAccountIsSelected()) {
      this.messageService.showErrorMessage(
        'At least one account must be selected'
      );
      return;
    }

    if (this._noRoleIsSelected()) {
      this.messageService.showErrorMessage(
        'All accounts must have at least one role'
      );
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
    this.accountService
      .updateCustomerUserByCustomerAdmin(customerUser)
      .subscribe(
        () => {
          this.messageService.showSuccessMessage(
            'Customer user has been updated successfully'
          );
          this.router.navigate(['..'], { relativeTo: this.route });
        },
        () => {
          this.isSaving = false;
        }
      );
  }

  private _createCustomerUserForm() {
    this.customerUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', Validators.required),
      lastName: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        Validators.email,
      ]),
      accounts: new UntypedFormControl([], Validators.required),
    });
    this.rolesTouched = true;
    this.customerUserForm.markAllAsTouched();
  }

  private _fillCustomerUserForm(
    user: ICustomerUserResponse,
    linkedAccounts: IAccountUserRoles[]
  ) {
    this.customerUserForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accounts: this._generateAccounts(linkedAccounts, user),
    });
  }

  private _generateAccounts(
    linkedAccounts: IAccountUserRoles[],
    user: ICustomerUserResponse
  ): any {
    const accounts = linkedAccounts.map((la) => ({ ...la, roles: [] }));
    user.accounts.forEach((acc) => {
      const account = accounts.find((a) => a.accountId === acc.accountId);
      if (account) {
        account.isSelected = true;
        account.roles = acc.roles;
      }
    });
    return accounts;
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

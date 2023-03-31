import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartriseValidators } from '../../../../_shared/constants';
import { IRole } from '../../../../_shared/models/role';
import { MessageService } from '../../../../services/message.service';
import { IAccountUserRoles } from '../../../../_shared/models/account-selection.model';
import { forkJoin } from 'rxjs';
import { ICustomerUserPayload } from '../../../../_shared/models/customer-user-by-customer-admin.model';
import { AccountService } from '../../../../services/account.service';
import { AccountsWithoutMatchingContactsComponent } from '../../../account-users-management/accounts-without-matching-contacts/accounts-without-matching-contacts.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { trimValidator } from '../../../../_shared/validators/trim-validator';
import { AccountRolesSelectionService } from '../../../../services/account-roles-selection.service';

@Component({
  selector: 'ngx-create-customer-user',
  templateUrl: './create-customer-user.component.html',
  styleUrls: ['./create-customer-user.component.scss']
})
export class CreateCustomerUserComponent implements OnInit {
  customerUserForm: UntypedFormGroup;
  roles: IRole[] = [];
  isLoading = false;
  isLoadingForm = true;
  formSubmitted = false;
  rolesTouched: boolean;
  isSaving: boolean = false;
  @ViewChild('firstName') firstName: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private accountRolesSelectionService: AccountRolesSelectionService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.createCustomerUserForm();
    forkJoin([
      this.accountService.getLinkedAccounts(),
      this.accountService.getCustomerRoles()
    ]).subscribe(([linkedAccounts, roles]) => {
      this.roles = roles;
      this.isLoadingForm = false;
      this._updateLinkedAccounts(linkedAccounts);
    }, () => {
      this.isLoadingForm = false;
    });
  }

  onSubmit() {

    if (this.isSaving) {
      return;
    }

    if (!this._atLeastOneAccountIsSelected()) {
      this.messageService.showErrorMessage('At least one account must be selected');
      return;
    }

    if (this._noRoleIsSelected()) {
      this.messageService.showErrorMessage('All accounts must have at least one role');
      return;
    }


    this.formSubmitted = true;
    if (this.customerUserForm.invalid) {
      this._goToTheTopOfPage();
      return;
    }

    this.isLoading = true;

    this.isSaving = true;

    const newCustomerUser = this._generateCustomerUserObjectFromForm();
    this.accountService.createCustomerUserByCustomerAdmin(newCustomerUser).subscribe(
      (response) => this._onCreateUserSuccess(response),
      (error) => this._onCreatedUserFailed(error)
    );
  }

  private _goToTheTopOfPage() {
    this.firstName.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private _onCreatedUserFailed(error: any): void {
    this.isLoading = false;
    this.isSaving = false;
    if (error?.error?.failedResult && error.error.failedResult.length > 0) {
      this._showAccountsWithoutMatchingContactsOnFailedScenario(error.error.failedResult);
    }
  }

  private _showAccountsWithoutMatchingContactsOnFailedScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'failed',
        accounts: accountsWithoutMatchingContacts,
        message: 'Failed to create Account User.',
        topMessage: `The Account User could not be linked to the following Account(s):`,
        bottomMessage: 'Please contact your Regional Sales Team for support.'
      }
    }).onHide;
  }

  private _onCreateUserSuccess(response) {
    this.isLoading = false;
    this.isSaving = false;
    if (response.accountsWithoutMatchingContacts.length > 0) {
      this._showAccountsWithoutMatchingContactsOnSuccessScenario(response.accountsWithoutMatchingContacts).subscribe(() => {
        this.router.navigate(['..'], { relativeTo: this.route });
      });
      return;
    }
    this.messageService.showSuccessMessage('Account User has been created successfully');
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private _showAccountsWithoutMatchingContactsOnSuccessScenario(accountsWithoutMatchingContacts: any[]) {
    return this.modalService.show<AccountsWithoutMatchingContactsComponent>(AccountsWithoutMatchingContactsComponent, {
      initialState: {
        messageStatus: 'success',
        accounts: accountsWithoutMatchingContacts,
        message: 'Account User has been created successfully.',
        topMessage: `The Account User could not be linked to the following Account(s):`,
        bottomMessage: 'Please contact your Regional Sales Team for support.'
      }
    }).onHide;
  }

  createCustomerUserForm() {
    this.customerUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [trimValidator, SmartriseValidators.requiredWithTrim]),
      lastName: new UntypedFormControl('', [trimValidator, SmartriseValidators.requiredWithTrim]),
      email: new UntypedFormControl('', [SmartriseValidators.requiredWithTrim, trimValidator, SmartriseValidators.smartriseEmail]),
      accounts: new UntypedFormControl([], Validators.required)
    });
    this.rolesTouched = true;
    this.customerUserForm.markAllAsTouched();
  }

  private _updateLinkedAccounts(linkedAccounts: IAccountUserRoles[]) {
    this.customerUserForm.patchValue({
      accounts: linkedAccounts.map(la => ({ ...la, roles: [] }))
    });
  }

  private _generateCustomerUserObjectFromForm() {
    const customerUser = { ...this.customerUserForm.value };
    const accounts = this.customerUserForm.value.accounts as IAccountUserRoles[];

    customerUser.accounts = accounts.filter(account => account.isSelected);

    return customerUser;
  }

  private _atLeastOneAccountIsSelected() {
    const accounts = this.customerUserForm.value.accounts as IAccountUserRoles[];
    return accounts.some(account => account.isSelected);
  }

  private _noRoleIsSelected(): boolean {
    const accounts = this.customerUserForm.value.accounts as IAccountUserRoles[];
    return accounts.filter(account => account.isSelected).some(account => account.roles.length === 0);
  }
}

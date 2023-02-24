import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AccountRolesSelectionService } from '../../../../services/account-roles-selection.service';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { SmartriseValidators } from '../../../../_shared/constants';
import { IAccountUserRoles } from '../../../../_shared/models/account-selection.model';
import { IRole } from '../../../../_shared/models/role';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

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
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private accountRolesSelectionService: AccountRolesSelectionService
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
      return;
    }

    this.isLoading = true;

    this.isSaving = true;

    const newCustomerUser = this._generateCustomerUserObjectFromForm();
    this.accountService.createCustomerUserByCustomerAdmin(newCustomerUser).subscribe(() => {
      this.isLoading = false;
      this.messageService.showSuccessMessage('Customer user has been created successfully');
      this.router.navigate(['..'], { relativeTo: this.route });
    }, () => {
      this.isLoading = false;
      this.isSaving = false;
    });
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

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../services/account.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from '../../../services/message.service';
import { AccountRolesSelectionComponent } from '../../../_shared/components/account-roles-selection/account-roles-selection.component';
import { SmartriseValidators, URLs } from '../../../_shared/constants';
import { IAccountUserRoles } from '../../../_shared/models/account-selection.model';
import { IAccountLookup } from '../../../_shared/models/customer-lookup';
import { IRole } from '../../../_shared/models/role';
import { trimValidator } from '../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-create-account-user',
  templateUrl: './create-account-user.component.html',
  styleUrls: ['./create-account-user.component.scss']
})
export class CreateAccountUserComponent implements OnInit {

  customerUserForm: UntypedFormGroup;
  roles: IRole[] = [];
  isLoading = false;
  isLoadingForm = true;
  manageRoute: any;
  formSubmitted: boolean;
  rolesTouched: boolean;
  selectedAccount: IAccountLookup;
  searchAccounts: string;
  lookupAccounts$ = new Subject<string>();
  filteredAccounts: any[];

  @ViewChild('selectedAccountInput') selectedAccountInput: ElementRef<HTMLInputElement>;
  @ViewChild('accounts') accounts: AccountRolesSelectionComponent;
  isSaving: boolean;

  debounceTimeSearchAccounts = new Subject<string>();

  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private customerService: CustomerService,
  ) {
    this.debounceTimeSearchAccounts.pipe(debounceTime(200)).subscribe(val => this.onSearchAccounts(val));
  }

  ngOnDestroy(): void {
    this.manageRoute?.unsubscribe();
  }

  ngOnInit(): void {

    this.createCustomerUserForm();
    forkJoin([
      this.accountService.getCustomerRoles()
    ]).subscribe(([roles]) => {

      if (roles) {
        this.roles = roles;
        this.isLoadingForm = false;
      }

      this.isLoading = false;
    }, error => {
      this.isLoadingForm = false;
      this.router.navigateByUrl(URLs.ViewAccountUsersURL);
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

  onCancel() {
    this.router.navigateByUrl(URLs.ViewAccountUsersURL);
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

    this.isLoading = true;

    this.isSaving = true;

    this.accountService
      .createAccountUserBySmartriseUser(this.customerUserForm.value)
      .subscribe(() => {
        this.isLoading = false;
        this.messageService.showSuccessMessage('Account user has been created successfully');
        this.router.navigateByUrl(URLs.ViewAccountUsersURL);
      }, error => {
        this.isLoading = false;
        this.isSaving = false;
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

  onSearchAccounts(searchValue: string) {
    console.log('calling onSearchAccounts');
    this.customerService.getCustomersPagedLookup(searchValue).subscribe(accounts => {
      this.filteredAccounts = accounts;
    });
  }

  onSelectionChange(selectedAccount: IAccountLookup) {
    this.selectedAccountInput.nativeElement.value = null;

    if (this._accountAlreadySelected(selectedAccount.id)) {
      this.messageService.showErrorMessage(`${selectedAccount.name} account have been already selected`);
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
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationStart } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { AccountService } from '../../../../../../services/account.service';
import { CustomerService } from '../../../../../../services/customer.service';
import { MessageService } from '../../../../../../services/message.service';
import { SmartriseValidators, URLs } from '../../../../../../_shared/constants';
import { ICustomerUserBySmartriseResponse } from '../../../../../../_shared/models/customer-user-by-smartrise.model';
import { IGetCustomerUser } from '../../../../../../_shared/models/IGetCustomerUser';
import { IRole } from '../../../../../../_shared/models/role';

@Component({
  selector: 'ngx-update-customer-user',
  templateUrl: './update-customer-user.component.html',
  styleUrls: ['./update-customer-user.component.scss']
})
export class UpdateCustomerUserBySmartriseComponent implements OnInit, OnDestroy {

  customerUserForm: UntypedFormGroup;
  customerUser: ICustomerUserBySmartriseResponse;
  roles: IRole[] = [];
  isFormReady: boolean;
  oldRoles: IRole[];
  rolesChanged = false;
  customerName: string;
  userId: any;
  manageRoute: any;
  formSubmitted: boolean;
  rolesTouched: boolean;
  accountId: number;
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private customerService: CustomerService,
    private bcService: BreadcrumbService
  ) {
    this._initializeRoutingManagement();
  }

  ngOnInit(): void {
    this.accountId = +this.route.snapshot.paramMap.get('id');

    if (!isFinite(this.accountId)) {
      this.router.navigateByUrl(`pages/customers-management/customers`);
      return;
    }

    const userId = this.route.snapshot.paramMap.get('userId');
    this.isFormReady = false;
    this.bcService.set('@userName', { skip: true });

    forkJoin([
      this.accountService.getCustomerRoles(),
      this.accountService.getCustomerUserBySmartrise(userId, this.accountId),
      this.customerService.getCustomer(this.accountId),
    ]).subscribe(([roles, user, customer]) => {
      this.oldRoles = roles;
      this.roles = roles;
      this.customerUser = user;
      this.bcService.set('@customerName', customer.name);
      this.bcService.set('@userName', user.firstName + ' ' + user.lastName);
      this.bcService.set('@userName', { skip: false });
      this.createCustomerUserForm(user);
      this.isFormReady = true;
    }, () => {
      this.router.navigateByUrl(`pages/customers-management/customers`);
    });
  }

  onRoleChanged() {
    this.rolesChanged = true;
  }

  onClose() {
    this.router.navigateByUrl('pages/customers-management/customers/');
  }

  createCustomerUserForm(user: IGetCustomerUser) {
    this.customerUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(user.firstName, Validators.required),
      lastName: new UntypedFormControl(user.lastName, Validators.required),
      email: new UntypedFormControl(user.email, [SmartriseValidators.requiredWithTrim, Validators.email]),
      roles: new UntypedFormControl(user.roles.map((m) => m.name), Validators.required)
    });
    this.rolesTouched = true;
    this.customerUserForm.markAllAsTouched();
  }

  onSubmit() {

    if (this.isSaving) {
      return;
    }

    this.formSubmitted = true;

    if (!this._atLeastOneRoleIsSelected()) {
      this.messageService.showErrorMessage('At least one role must be selected');
      return;
    }

    if (this.customerUserForm.invalid) {
      return;
    }

    this.isSaving = true;
    const customerUser = {
      userId: this.customerUser.id,
      accountId: this.accountId,
      roles: this.customerUserForm.value.roles,
    };
    this.accountService.updateCustomerUserBySmartrise(customerUser).subscribe(
      () => {
        this.messageService.showSuccessMessage('Account User has been updated successfully');
        this.router.navigateByUrl(this.router.url.substring(0, this.router.url.lastIndexOf('users') - 1), {
          state: {
            tab: 'users'
          }
        });
      },
      (error) => {
        this.isSaving = false;
      }
    );
  }

  private _atLeastOneRoleIsSelected() {
    //The condition is checking the length to be greater than one because 
    //there is CustomerNothing role already selected by default
    return this.customerUserForm.value.roles.length > 1;
  }

  onCancel() {
    this.router.navigateByUrl(this.router.url.substring(0, this.router.url.lastIndexOf('users') - 1), {
      state: {
        tab: 'users'
      }
    });
  }

  ngOnDestroy(): void {
    this.manageRoute?.unsubscribe();
    sessionStorage.removeItem('customerName');
  }

  onGoToAccounts() {
    this.router.navigateByUrl(URLs.ViewCustomersURL);
  }

  onGoToAccount() {
    this.router.navigateByUrl(`${URLs.ViewCustomersURL}/${this.customerUser.account.id}`);
  }

  private _initializeRoutingManagement() {
    this.manageRoute = this.router.events.subscribe(e => {
      if (e instanceof NavigationStart) {
        if (
          e.url.startsWith('/pages/customers-management/customers/') &&
          e.url.endsWith('users')
        ) {
          this.router.navigateByUrl(e.url.substring(0, e.url.lastIndexOf('users') - 1), {
            state: {
              tab: 'users'
            }
          });
        }
      }
    });
  }
}

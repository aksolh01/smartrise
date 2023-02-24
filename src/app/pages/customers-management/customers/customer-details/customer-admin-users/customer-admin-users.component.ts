import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AppComponent } from '../../../../../app.component';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { ICustomerDetails } from '../../../../../_shared/models/customer-details';
import { ICustomerAdminUser } from '../../../../../_shared/models/user';
import { AccountService } from '../../../../../services/account.service';
import { MessageService } from '../../../../../services/message.service';
import { TokenService } from '../../../../../services/token.service';
import { CustomerAdminUsersActionsComponent } from './customer-admin-users-actions/customer-admin-users-actions.component';
import * as guidingTourGlobal from '../../../../guiding.tour.global';
import { JoyrideService } from 'ngx-joyride';
import { CpFilterComponent } from '../../../../../_shared/components/table-filters/cp-filter.component';
import { ResponsiveService } from '../../../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../../../_shared/models/screenBreakpoint';
import { SettingService } from '../../../../../services/setting.service';
import { ICustomerUserRoleLookup } from '../../../../../_shared/models/ICustomerUserRoleLookup';
import { PermissionService } from '../../../../../services/permission.service';
import { PERMISSIONS } from '../../../../../_shared/constants';
import { BaseServerDataSource } from '../../../../../_shared/datasources/base-server.datasource';
import { BaseComponent } from '../../../../base.component';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { CustomerUsersParams } from '../../../../../_shared/models/customerUsersParams';
import { MiscellaneousService } from '../../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../../services/multi-accounts-service';

@Component({
  selector: 'ngx-customer-admin-users',
  templateUrl: './customer-admin-users.component.html',
  styleUrls: ['./customer-admin-users.component.scss']
})
export class CustomerAdminUsersComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() customer: ICustomerDetails;
  @Input() runGuidingTour: boolean;

  email: string;
  firstName: string;
  lastName: string;
  roles: string;

  source: BaseServerDataSource;
  isLoading = false;
  canCreateCustomerUser = false;
  isSmall = false;
  responsiveSubscription: any;
  recordsNumber: number;
  showFilters = false;

  constructor(
    private settingService: SettingService,
    private reponsiveService: ResponsiveService,
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private appComponent: AppComponent,
    private tokenService: TokenService,
    private permissionService: PermissionService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountsService: MultiAccountsService,
    baseService: BaseComponentService
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.stopGuidingTour();
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  ngOnInit(): void {

    this.canCreateCustomerUser = this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountCreate);
    this.settingService.getBusinessSettings().subscribe(r => {
      this.recordsNumber = r.numberOfRecords;
      this.initializeSource();
      this.responsiveSubscription = this.reponsiveService.currentBreakpoint$.subscribe(w => {
        if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
          if (this.isSmall !== false) {
            this.onReset();
            this.isSmall = false;
          }
        } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
          if (this.isSmall !== true) {
            this.onReset();
            this.isSmall = true;
          }
        }
      });
    });
  }

  initializeSource() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber
    };

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
return null;
}

      if (field === 'createdDate') {
        return new Date(value);
      }
      return value;
    };

    this.source.serviceErrorCallBack = (error) => { };
    this.source.serviceCallBack = (params) => {
      if (this.isSmall) {
        const sParam = params as CustomerUsersParams;
        sParam.firstName = this.firstName;
        sParam.lastName = this.lastName;
        sParam.email = this.email;
      }
      return this.accountService.getCustomerUsersForSmartriseUser(params as CustomerUsersParams, this.customer.id);
    };

    this.source.dataLoading.subscribe(isLoading => {
      this.isLoading = isLoading;

      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.source.refresh();
  }

  onReset() {
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.roles = null;
    this.source.reset();
  }

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      firstName: {
        title: 'First Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('First Name');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
        sort: true,
      },
      lastName: {
        title: 'Last Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Last Name');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
        sort: true,
      },
      email: {
        title: 'Email',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Email');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
        sort: true,
      },
      roles: {
        title: 'Roles',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Roles');
        },
        filter: false,
        sort: false,
        valuePrepareFunction: (value) => this.concatRoles(value),
      },
      actionsCol: {
        width: '16%',
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: CustomerAdminUsersActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  concatRoles(_roles: ICustomerUserRoleLookup[]) {
    let roles = '';
    if (_roles.length > 0) {
roles = _roles[0].displayName;
}
    for (let index = 1; index < _roles.length; index++) {
      roles = roles + ', ' + _roles[index].displayName;
    }
    return roles;
  }

  onActionsInit(actions: CustomerAdminUsersActionsComponent) {
    actions.customerIsDeleted = this.customer.isDeleted;
    actions.resendInvitationEmail.subscribe((row) => {
      this.onResendInvitationEmail(row);
    });
    actions.resetPassword.subscribe((row) => {
      this.resetPassword(row);
    });
    actions.activateUser.subscribe(user => {
      this.onActivateUser(user);
    });
    actions.deactivateUser.subscribe(user => {
      this.onDeactivateUser(user);
    });
    actions.editUser.subscribe(user => {
      this.router.navigateByUrl(`pages/customers-management/customers/${this.customer.id}/users/${user.id}`, {
        state: {
          customer: this.customer.name
        }
      });
    });
  }

  onActivateUser(user: any) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to activate this user?',
      () => {
        this._sendActivateUser(user);
      });
  }

  onDeactivateUser(user: any) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to deactivate this user?',
      () => {
        this._sendDeactivateUser(user);
      });
  }

  onResendInvitationEmail(customer: ICustomerAdminUser) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to resend the invitation link?',
      () => {
        this._sendInvitationLink(customer);
      }
    );
  }

  private _sendResetPassword(user: ICustomerAdminUser) {
    this.accountService.resetPasswordRequest(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'User password reset request has been sent successfully'
        );
      },
      (error) => {
      }
    );
  }

  resetPassword(user: ICustomerAdminUser) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to reset the password?',
      () => {
        this._sendResetPassword(user);
      }
    );
  }

  onCreateUser() {
    this.router.navigateByUrl(`pages/customers-management/customers/${this.customer.id}/users/createuser`, {
      state: {
        customer: this.customer.name
      }
    });
    // this.router.navigateByUrl(`pages/customers-management/createuser`);
  }

  onClose() {
    this.router.navigateByUrl('pages/customers-management/customers');
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourCustomerUsers') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour(
        {
          steps: ['customerUsersFirstStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        }
      );
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourCustomerUsers', '1');
    this.runGuidingTour = true;
  }

  private _sendInvitationLink(user: ICustomerAdminUser) {
    this.accountService.resendInvitationLink(this.customer.id, user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'Invitation link has been resent successfully'
        );
      },
      (error) => {
      }
    );
  }

  private _sendActivateUser(user: any) {
    this.accountService.activateUser(user.id).subscribe(() => {
      this.messageService.showSuccessMessage('User has been activated successfully');
      this.source.refresh();
    }, error => {
      this.source.refresh();
    });
  }

  private _sendDeactivateUser(user: any) {
    this.accountService.deactivateUser(user.id).subscribe(() => {
      this.messageService.showSuccessMessage('User has been deactivated successfully');
      this.source.refresh();
    }, error => {
      this.source.refresh();
    });
  }
}

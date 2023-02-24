import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { CustomerUsersParams } from '../../../_shared/models/customerUsersParams';
import { ICustomerUserRoleLookup } from '../../../_shared/models/ICustomerUserRoleLookup';
import { ICustomerUserLookup } from '../../../_shared/models/ICustomerUserLookup';
import { IGetCustomerUser } from '../../../_shared/models/IGetCustomerUser';
import { AccountService } from '../../../services/account.service';
import { MessageService } from '../../../services/message.service';
import { PermissionService } from '../../../services/permission.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { CustomerUserActionsComponent } from './customer-user-actions/customer-user-actions.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-customer-users',
  templateUrl: './customer-users.component.html',
  styleUrls: ['./customer-users.component.scss'],
})
export class CustomerUsersComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('search', { static: false }) searchRef: ElementRef;

  source: BaseServerDataSource;
  runGuidingTour = true;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;

  canCreateCustomerUser = true;

  isSmall?: boolean = null;
  showFilters = false;
  recordsNumber: number;
  users: ICustomerUserLookup[] = [];
  customerUsersParams = new CustomerUsersParams();
  totalCount = 0;
  firstName: string;
  lastName: string;
  email: string;
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
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        width: '110px',
        renderComponent: CustomerUserActionsComponent,
        onComponentInitFunction: this.onComponentInitFunction.bind(this),
      },
    },
  };
  responsiveSubscription: Subscription;

  constructor(
    private router: Router,
    private settingService: SettingService,
    private accountService: AccountService,
    private responsiveService: ResponsiveService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.enableCreateCustomerUser();
    this.settingService.getBusinessSettings().subscribe((rep) => {
      this.recordsNumber = rep.numberOfRecords;
      this.initializeSource();
      this.responsiveSubscription =
        this.responsiveService.currentBreakpoint$.subscribe((w) => {
          if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
            if (this.isSmall !== false) {
              this.onReset();
              this.isSmall = false;
            }
          } else if (
            w === ScreenBreakpoint.md ||
            w === ScreenBreakpoint.xs ||
            w === ScreenBreakpoint.sm
          ) {
            if (this.isSmall !== true) {
              this.onReset();
              this.isSmall = true;
            }
          }
        });
    });
  }

  enableCreateCustomerUser() {
    this.canCreateCustomerUser = this.permissionService.hasPermission(
      'CustomerUsersCreate'
    );
  }

  onCreateUser() {
    this.router.navigateByUrl(
      'pages/settings-management/customer-users/create-customer-user'
    );
  }

  onEditUser(user: ICustomerUserLookup) {
    this.router.navigateByUrl(
      'pages/settings-management/customer-users/' + user.id
    );
  }

  onResetPassword(user: ICustomerUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to reset the password?',
      () => {
        this._sendResetPassword(user);
      }
    );
  }

  onActivateUser(user: ICustomerUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to activate this user?',
      () => {
        this._sendActivateUser(user);
      }
    );
  }

  onDeactivateUser(user: ICustomerUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to deactivate this user?',
      () => {
        this._sendDeactivateUser(user);
      }
    );
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

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

  onReset() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  initializeSource() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }

      return value;
    };
    this.source.serviceErrorCallBack = () => {};
    this.source.serviceCallBack = (params) => {
      if (this.isSmall) {
        const sParam = params as CustomerUsersParams;
        sParam.firstName = this.firstName;
        sParam.lastName = this.lastName;
        sParam.email = this.email;
      }
      return this.accountService.getCustomerUsersByCustomerAdmin(
        params as CustomerUsersParams
      );
    };
    this.source.dataLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;

      setTimeout(
        () => {
          this.startGuidingTour();
        },
        this.isSmall
          ? guidingTourGlobal.smallScreenSuspensionTimeInterval
          : guidingTourGlobal.wideScreenSuspensionTimeInterval
      );
    });
  }

  onComponentInitFunction(instance: CustomerUserActionsComponent) {
    instance.editUser.subscribe((user) => {
      this.onEditUser(user);
    });
    instance.resetPassword.subscribe((user) => {
      this.onResetPassword(user);
    });
    instance.activateUser.subscribe((user) => {
      this.onActivateUser(user);
    });
    instance.deactivateUser.subscribe((user) => {
      this.onDeactivateUser(user);
    });
    instance.resendInvitation.subscribe((user) => {
      this.onResendInvitation(user);
    });
  }

  onResendInvitation(user: IGetCustomerUser) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to resend the invitation link?',
      () => {
        this._sendInvitationLink(user);
      }
    );
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
      this.joyrideService.startTour({
        steps: ['customerUserFirstStep', 'customerUserSecondStep'],
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText,
        },
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourCustomerUsers', '1');
    this.runGuidingTour = false;
  }

  ngOnDestroy() {
    const modalCount = this.modalService.getModalsCount();
    if (modalCount > 0) {
      this.modalService.hide();
    }

    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    this.stopGuidingTour();
    this.joyrideService = null;
  }

  private _sendInvitationLink(user: IGetCustomerUser) {
    this.isLoading = true;
    this.accountService.userResendInvitationLink(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'Invitation link has been resent successfully'
        );
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  private _sendDeactivateUser(user: ICustomerUserLookup) {
    this.accountService.deactivateUser(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'User has been deactivated successfully'
        );
        this.source.refresh();
      },
      () => {
        this.source.refresh();
      }
    );
  }

  private _sendActivateUser(user: ICustomerUserLookup) {
    this.accountService.activateUser(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'User has been activated successfully'
        );
        this.source.refresh();
      },
      () => {
        this.source.refresh();
      }
    );
  }

  private _sendResetPassword(user: ICustomerUserLookup) {
    this.accountService.resetUserPasswordRequest(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'User password reset request has been sent successfully'
        );
      },
      () => {}
    );
  }
}

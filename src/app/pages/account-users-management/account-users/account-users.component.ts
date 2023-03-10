import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { AccountUsersParams, IAccountUserLookup, IAccountUserRoleLookup } from '../../../_shared/models/account-user.model';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { SettingService } from '../../../services/setting.service';
import { MessageService } from '../../../services/message.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { PermissionService } from '../../../services/permission.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { Router } from '@angular/router';
import { AccountUserActionsComponent } from './account-user-actions/account-user-actions.component';
import { BaseComponent } from '../../base.component';
import { URLs } from '../../../_shared/constants';
import { AppComponent } from '../../../app.component';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'ngx-account-users',
  templateUrl: './account-users.component.html',
  styleUrls: ['./account-users.component.scss']
})
export class AccountUsersComponent extends BaseComponent implements OnInit {

  source: BaseServerDataSource;
  runGuidingTour = true;

  @ViewChild('search', { static: false }) searchRef: ElementRef;
  users: IAccountUserLookup[] = [];
  accountUsersParams = new AccountUsersParams();
  totalCount = 0;
  recordsNumber: number;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  canCreateAccountUser = true;

  firstName: string;
  lastName: string;
  email: string;
  isSmall?: boolean = null;
  showFilters = false;

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
        }
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
        }
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
        class: 'minw-100px',
        renderComponent: AccountUserActionsComponent,
        onComponentInitFunction: this.onComponentInitFunction.bind(this),
      }
    },
  };
  responsiveSubscription: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private settingService: SettingService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private appComponent: AppComponent,
    private tokenService: TokenService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
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

      return value;
    };
    this.source.serviceErrorCallBack = (error) => { };
    this.source.serviceCallBack = (params) => {
      if (this.isSmall) {
        const sParam = params as AccountUsersParams;
        sParam.firstName = this.firstName;
        sParam.lastName = this.lastName;
        sParam.email = this.email;
      }
      return this.accountService.getAccountUsers(params as AccountUsersParams);
    };
    this.source.dataLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
  }

  onComponentInitFunction(instance: AccountUserActionsComponent) {
    instance.editUser.subscribe(user => {
      this.onEditUser(user);
    });
    instance.impersonateLogin.subscribe(user => {
      this.onImpersonateLogin(user);
    });
    instance.resetPassword.subscribe(user => {
      this.onResetPassword(user);
    });
    instance.activateUser.subscribe(user => {
      this.onActivateUser(user);
    });
    instance.deactivateUser.subscribe(user => {
      this.onDeactivateUser(user);
    });
    instance.resendInvitation.subscribe(user => {
      this.onResendInvitation(user);
    });
  }

  onImpersonateLogin(user: any) {
    this.miscellaneousService.openConfirmModal(
      `Are you sure you want to login as '${user.firstName} ${user.lastName}'?`,
      () => this._impersonateUser(user)
    );
  }

  private _impersonateUser(user: any): void {
    this.accountService
      .impersonateLogin(user.id)
      .subscribe((response) => {
        this.tokenService.saveToken(response.body.token);
        this.appComponent.loadCurrentUser(() => {
          this.permissionService.notifyPermissionsChanged();
          this.router.navigate(['/', 'pages', 'dashboard']);
        });
      }, (error) => {
      });
  }

  ngOnInit(): void {
    this.enableCreateAccountUser();
    this.settingService.getBusinessSettings().subscribe(rep => {
      this.recordsNumber = rep.numberOfRecords;
      this.initializeSource();
      this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
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

  enableCreateAccountUser() {
    this.canCreateAccountUser = this.permissionService.hasPermission('AccountUsersCreate');
  }

  onCreateUser() {
    this.isLoading = true;
    this.router.navigateByUrl(URLs.CreateAccountUsersURL);
    this.isLoading = false;
  }

  onEditUser(user: IAccountUserLookup) {
    this.router.navigateByUrl(`${URLs.ViewAccountUsersURL}/${user.id}`);
  }

  onResetPassword(user: IAccountUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to reset the password?',
      () => {
        this._sendResetPassword(user);
      });
  }

  onActivateUser(user: IAccountUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to activate this user?',
      () => {
        this._sendActivateUser(user);
      });
  }

  onDeactivateUser(user: IAccountUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to deactivate this user?',
      () => {
        this._sendDeactivateUser(user);
      });
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onResendInvitation(user: any) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to resend the invitation link?',
      () => {
        this._sendInvitationLink(user);
      }
    );
  }

  private _sendInvitationLink(user: IAccountUserLookup) {
    this.accountService.userResendInvitationLink(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'Invitation link has been resent successfully'
        );
      },
      (error) => {
      }
    );
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

  concatRoles(roleNames: IAccountUserRoleLookup[]) {
    let roles = '';
    if (roleNames.length > 0) {
roles = roleNames[0].displayName;
}
    for (let index = 1; index < roleNames.length; index++) {
      roles = roles + ', ' + roleNames[index].displayName;
    }
    return roles;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private _sendResetPassword(user: IAccountUserLookup) {
    this.accountService.resetUserPasswordRequest(user.id)
      .subscribe(() => {
        this.messageService.showSuccessMessage('User password reset request has been sent successfully');
      },
        error => {
        });
  }

  private _sendActivateUser(user: IAccountUserLookup) {
    this.accountService.activateUser(user.id).subscribe(() => {
      this.onSearch();
      this.messageService.showSuccessMessage('User has been activated successfully');
    }, error => {
      this.onSearch();
    });
  }

  private _sendDeactivateUser(user: IAccountUserLookup) {
    this.accountService.deactivateUser(user.id).subscribe(() => {
      this.onSearch();
      this.messageService.showSuccessMessage('User has been deactivated successfully');
    }, error => {
      this.onSearch();
    });
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourAccountUsers') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['accountUserFirstStep', 'accountUserSecondStep'],
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText
        }
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourAccountUsers', '1');
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
}

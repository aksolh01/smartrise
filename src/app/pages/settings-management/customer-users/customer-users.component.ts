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
import { MessageService } from '../../../services/message.service';
import { PermissionService } from '../../../services/permission.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { CustomerUserActionsComponent } from './customer-user-actions/customer-user-actions.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { AccountsListCellComponent } from '../../account-users-management/account-users/accounts-list-cell/accounts-list-cell.component';
import { AccountService } from '../../../services/account.service';
import { TokenService } from '../../../services/token.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { InfoDialogData } from '../../../_shared/components/info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../../../_shared/components/info-dialog/info-dialog.component';
import { ListTitleService } from '../../../services/list-title.service';
import { BaseParams } from '../../../_shared/models/baseParams';
import { IPagination } from '../../../_shared/models/pagination';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { environment } from '../../../../environments/environment';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../_shared/components/pager/pager.component';

@Component({
  selector: 'ngx-customer-users',
  templateUrl: './customer-users.component.html',
  styleUrls: ['./customer-users.component.scss'],
})
export class CustomerUsersComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('search', { static: false }) searchRef: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;

  source: BaseServerDataSource;
  runGuidingTour = true;
  selectedAccountName = this.getSelectedAccountsLabel();

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
      accounts: {
        title: 'Accounts',
        type: 'custom',
        renderComponent: AccountsListCellComponent,
        onComponentInitFunction: (instance: AccountsListCellComponent) => {
          instance.setHeader('Accounts');
          instance.clicked.subscribe((accountId) => {
            this.router.navigateByUrl(`/pages/settings-management/accounts/${accountId}`);
          });
          instance.showAccountInfo.subscribe((account) => {
            this._showAccountRoles(account);
          });
        },
        filter: false,
        sort: false,
        width: '35%'
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
  showAccountRolesDialog: any;
  title: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private responsiveService: ResponsiveService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private tokenService: TokenService,
    private multiAccountService: MultiAccountsService,
    private listTitleService: ListTitleService,
    baseService: BaseComponentService,

  ) {
    super(baseService);
  }

  initializeSource() {
    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);

    this.source.serviceCallBack = (params) => this._getCustomerUsers(params);
    this.source.dataLoading.subscribe(isLoading => this._onDataLoading(isLoading));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;

    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value))
      return null;

    return value;
  }

  private _getCustomerUsers(params: BaseParams): Observable<IPagination> {
    const sParam = params as CustomerUsersParams;
    if (this.isSmall) {
      this._fillFilterParameters(sParam);
    }

    const searchParams = params as CustomerUsersParams;
    searchParams.customerId = this.multiAccountService.getSelectedAccount();

    return this.accountService.getCustomerUsersByCustomerAdmin(searchParams);
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _fillFilterParameters(sParam: CustomerUsersParams) {
    sParam.firstName = this.firstName;
    sParam.lastName = this.lastName;
    sParam.email = this.email;
  }

  onComponentInitFunction(instance: CustomerUserActionsComponent) {
    instance.editUser.subscribe(user => this.onEditUser(user));
    instance.resetPassword.subscribe(user => this.onResetPassword(user));
    instance.resendInvitation.subscribe(user => this.onResendInvitation(user));
  }

  onResendInvitation(user: IGetCustomerUser) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to resend the invitation link?',
      () => {
        this._sendInvitationLink(user);
      }
    );
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
      (error) => {
        this.isLoading = false;
      }
    );
  }

  async ngOnInit() {
    this.title = await this.listTitleService.buildTitle('Account Users');
    this.enableCreateCustomerUser();
    this.recordsNumber = environment.recordsPerPage;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
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
  }

  async enableCreateCustomerUser() {

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasManyAccountsAndOneSelectedAccount()) {
      this.canCreateCustomerUser = await this.permissionService.hasPermissionInAccountAsync(
        "CustomerUsersCreate",
        this.multiAccountService.getSelectedAccount());
    }
    else {
      this.canCreateCustomerUser = this.permissionService.hasPermission('CustomerUsersCreate');
    }
  }

  onCreateUser() {
    this.router.navigateByUrl(
      'pages/settings-management/customer-users/create-customer-user'
    );
  }

  onEditUser(user: ICustomerUserLookup) {
    if (this._isLoggedInUser(user)) {
      this.messageService.showInfoMessage("Please contact your Account Administrator or Regional Business Development Manager to update your account roles");
      return;
    }

    this.router.navigateByUrl('pages/settings-management/customer-users/' + user.id);
  }

  private _isLoggedInUser(user: ICustomerUserLookup) {
    return user.id === this.tokenService.getProperty("UserId");
  }

  onResetPassword(user: ICustomerUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to reset the password?',
      () => {
        this._sendResetPassword(user);
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
    this._resetFilterParameters();

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  private _resetFilterParameters() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  private _sendResetPassword(user: ICustomerUserLookup) {
    this.accountService.resetUserPasswordRequest(user.id)
      .subscribe(() => {
        this.messageService.showSuccessMessage('User password reset request has been sent successfully');
      },
        error => {
        });
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
      if (this.canCreateCustomerUser) {
        this.joyrideService.startTour({
          steps: ['customerUserFirstStep', 'customerUserSecondStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        });
      }
      else {
        this.joyrideService.startTour({
          steps: ['customerUserFirstStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        });
      }

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

  private _showAccountRoles(account: any) {
    const roles = [];
    let showAsBulltes = true;
    if (account.roles && account.roles.length > 0) {
      roles.push(...account.roles);
    } else {
      roles.push('No roles found');
      showAsBulltes = false;
    }
    this.showAccountRolesDialog = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: {
        title: 'Roles',
        content: roles.sort((a, b) => a < b ? -1 : (a > b ? 1 : 0)),
        showAsBulltes: showAsBulltes,
        dismissButtonLabel: 'Close'
      }
    });
  }
}

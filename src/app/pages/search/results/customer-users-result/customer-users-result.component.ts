import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { AccountsListCellComponent } from '../../../account-users-management/account-users/accounts-list-cell/accounts-list-cell.component';
import { CustomerUserActionsComponent } from '../../../settings-management/customer-users/customer-user-actions/customer-user-actions.component';
import { Observable, Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { MessageService } from '../../../../services/message.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { CustomerUsersParams } from '../../../../_shared/models/customerUsersParams';
import { ICustomerUserRoleLookup } from '../../../../_shared/models/ICustomerUserRoleLookup';
import { ICustomerUserLookup } from '../../../../_shared/models/ICustomerUserLookup';
import { PermissionService } from '../../../../services/permission.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { TokenService } from '../../../../services/token.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { ListTitleService } from '../../../../services/list-title.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BaseParams } from '../../../../_shared/models/baseParams';
import { IPagination } from '../../../../_shared/models/pagination';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { IGetCustomerUser } from '../../../../_shared/models/IGetCustomerUser';
import { InfoDialogData } from '../../../../_shared/components/info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../../../../_shared/components/info-dialog/info-dialog.component';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-customer-users-result',
  templateUrl: './customer-users-result.component.html',
  styleUrls: ['./customer-users-result.component.scss']
})
export class CustomerUsersResultComponent extends BaseComponent implements OnInit, OnDestroy {
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
    hideSubHeader: true,
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
    },
  };
  responsiveSubscription: Subscription;
  showAccountRolesDialog: any;
  title: string;
  @Input() searchKey: string;

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
    private searchService: SearchService,
    baseService: BaseComponentService,

  ) {
    super(baseService);
  }

  initializeSource() {
    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);

    this.source.serviceCallBack = (params) => this._getCustomerUsers(params).pipe(tap(x => this.searchService.notifyResultSetReady('CustomerUsers', x.data.length)));
    this.source.dataLoading.subscribe(isLoading => this._onDataLoading(isLoading));
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value))
      return null;

    return value;
  }

  private _getCustomerUsers(params: BaseParams): Observable<IPagination> {
    const sParam = params as CustomerUsersParams;

    this._fillSearchParameters(this.searchKey, sParam);

    const searchParams = params as CustomerUsersParams;

    return this.accountService.searchAllCustomerUsersByCustomerAdmin(searchParams);
  }

  private _fillSearchParameters(searchKey: string, sParam: CustomerUsersParams) {
    sParam.email = searchKey;
    sParam.firstName = searchKey;
    sParam.lastName = searchKey;
    sParam.roles = searchKey;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  onComponentInitFunction(instance: ViewDetailsActionComponent) {
    instance.viewDetails.subscribe(user => this.onEditUser(user));
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
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.title = await this.listTitleService.buildTitle('Account Users');
    this.enableCreateCustomerUser();
    this.recordsNumber = 5;
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

  ngOnDestroy() {
    const modalCount = this.modalService.getModalsCount();
    if (modalCount > 0) {
      this.modalService.hide();
    }

    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

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

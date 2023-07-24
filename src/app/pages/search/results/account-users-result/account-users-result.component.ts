import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { AccountUsersParams, IAccountUserLookup, IAccountUserRoleLookup } from '../../../../_shared/models/account-user.model';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { AccountsListCellComponent } from '../../../account-users-management/account-users/accounts-list-cell/accounts-list-cell.component';
import { AccountUserActionsComponent } from '../../../account-users-management/account-users/account-user-actions/account-user-actions.component';
import { Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { PermissionService } from '../../../../services/permission.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { AppComponent } from '../../../../app.component';
import { TokenService } from '../../../../services/token.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { URLs } from '../../../../_shared/constants';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { InfoDialogData } from '../../../../_shared/components/info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../../../../_shared/components/info-dialog/info-dialog.component';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-account-users-result',
  templateUrl: './account-users-result.component.html',
  styleUrls: ['./account-users-result.component.scss']
})
export class AccountUsersResultComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  source: BaseServerDataSource;
  runGuidingTour = true;
  public Math = Math;
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
      accounts: {
        title: 'Accounts',
        type: 'custom',
        renderComponent: AccountsListCellComponent,
        onComponentInitFunction: (instance: AccountsListCellComponent) => {
          instance.setHeader('Accounts');
          instance.clicked.subscribe(accountId => {
            this.router.navigateByUrl(`pages/customers-management/customers/${accountId}`);
          });
          instance.showAccountInfo.subscribe(account => {
            this._showAccountRoles(account);
          });
        },
        filter: false,
        sort: false,

      },
    },
  };
  responsiveSubscription: Subscription;
  showAccountRolesDialog: any;
  @Input() searchKey: string;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private appComponent: AppComponent,
    private tokenService: TokenService,
    private searchService: SearchService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  initializeSource() {

    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }

      return value;
    };
    this.source.serviceCallBack = (params) => this._getAccountUsers(params).pipe(tap(x => this.searchService.notifyResultSetReady('AccountUsers', x.data.length)));
    this.source.dataLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _getAccountUsers(params: any) {
    const sParam = params as AccountUsersParams;
    
    this._fillSearchParameters(this.searchKey, sParam);

    return this.accountService.searchAllAccountUsers(sParam);
  }

  private _fillSearchParameters(searchKey: string, sParam: AccountUsersParams) {
    sParam.email = searchKey;
    sParam.firstName = searchKey;
    sParam.lastName = searchKey;
    sParam.roles = searchKey;
  }


  onComponentInitFunction(instance: ViewDetailsActionComponent) {
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
          //this.permissionService.notifyPermissionsChanged();
          this.router.navigate(['/', 'pages', 'dashboard']);
        });
      }, (error) => {
      });
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.enableCreateAccountUser();
    this.recordsNumber = 5;
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


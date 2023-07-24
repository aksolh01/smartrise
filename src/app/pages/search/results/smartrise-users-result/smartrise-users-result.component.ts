import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { ISmartriseUserLookup } from '../../../../_shared/models/ISmartriseUserLookup';
import { SmartriseUsersParams } from '../../../../_shared/models/smartriseUsersParams';
import { BaseComponent } from '../../../base.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { SmartriseUserActionsComponent } from '../../../settings-management/smartrise-users/smartrise-user-actions/smartrise-user-actions.component';
import { Observable, Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { PermissionService } from '../../../../services/permission.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BaseParams } from '../../../../_shared/models/baseParams';
import { IPagination } from '../../../../_shared/models/pagination';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { ISmartriseUserRoleLookup } from '../../../../_shared/models/ISmartriseUserRoleLookup';
import { IGetSmartriseUser } from '../../../../_shared/models/IGetSmartriseUser';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-smartrise-users-result',
  templateUrl: './smartrise-users-result.component.html',
  styleUrls: ['./smartrise-users-result.component.scss']
})
export class SmartriseUsersResultComponent  extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;

  @Input() searchKey: string;
  source: BaseServerDataSource;
  runGuidingTour = true;

  users: ISmartriseUserLookup[] = [];
  smartriseUsersParams = new SmartriseUsersParams();
  totalCount = 0;
  recordsNumber: number;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  canCreateSmartriseUser = true;

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
      roles: {
        title: 'Roles',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Roles');
        },
        sort: false,
        filter: false,
        valuePrepareFunction: (value) => this.concatRoles(value),
      },
      // actionsCol: {
      //   filter: false,
      //   sort: false,
      //   title: 'Actions',
      //   type: 'custom',
      //   width: '110px',
      //   class: 'minw-100px',
      //   renderComponent: ViewDetailsActionComponent,
      //   onComponentInitFunction: this.onComponentInitFunction.bind(this),
      // }
    },
  };
  responsiveSubscription: Subscription;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private searchService: SearchService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  initializeSource() {

    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getSmartriseUsers(params).pipe(tap(x => this.searchService.notifyResultSetReady('SmartriseUsers', x.data.length)));
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

  private _convertFilterValue(field, value) {
    if (this.isEmpty(value))
      return null;

    return value;
  }

  private _getSmartriseUsers(params: BaseParams): Observable<IPagination> {
    const sParam = params as SmartriseUsersParams;
    this._fillSearchParameters(this.searchKey, sParam);

    return this.accountService.searchAllSmartriseUsers(params as SmartriseUsersParams);
  }

  private _fillSearchParameters(searchKey: string, sParam: SmartriseUsersParams) {
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

  private _fillFilterParameters(sParam: SmartriseUsersParams) {
    sParam.firstName = this.firstName;
    sParam.lastName = this.lastName;
    sParam.email = this.email;
  }

  onComponentInitFunction(instance: ViewDetailsActionComponent) {
    instance.viewDetails.subscribe(user => this.onEditUser(user));
  }

  ngOnInit(): void {
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.enableCreateSmartriseUser();
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

  enableCreateSmartriseUser() {
    this.canCreateSmartriseUser = this.permissionService.hasPermission('SmartriseUsersCreate');
  }

  onCreateUser() {
    this.isLoading = true;
    this.router.navigateByUrl('pages/settings-management/smartrise-users/create-smartrise-user');
    this.isLoading = false;
  }

  onEditUser(user: ISmartriseUserLookup) {
    this.router.navigateByUrl('pages/settings-management/smartrise-users/' + user.id);
  }

  onResetPassword(user: ISmartriseUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to reset the password?',
      () => {
        this._sendResetPassword(user);
      });
  }

  onActivateUser(user: ISmartriseUserLookup) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to activate this user?',
      () => {
        this._sendActivateUser(user);
      });
  }

  onDeactivateUser(user: ISmartriseUserLookup) {
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

  concatRoles(roleNames: ISmartriseUserRoleLookup[]) {
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

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourSmartriseUsers') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['smartriseUserFirstStep', 'smartriseUserSecondStep'],
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
    localStorage.setItem('GuidingTourSmartriseUsers', '1');
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

  private _sendInvitationLink(user: IGetSmartriseUser) {
    this.accountService.userResendInvitationLink(user.id).subscribe(
      () => {
        this.messageService.showSuccessMessage(
          'Invitation link has been resent successfully'
        );
      },
      () => {
      }
    );
  }

  private _sendResetPassword(user: ISmartriseUserLookup) {
    this.accountService.resetUserPasswordRequest(user.id)
      .subscribe(() => {
        this.messageService.showSuccessMessage('User password reset request has been sent successfully');
      },
        () => {
        });
  }

  private _sendActivateUser(user: ISmartriseUserLookup) {
    this.accountService.activateUser(user.id).subscribe(() => {
      this.onSearch();
      this.messageService.showSuccessMessage('User has been activated successfully');
    }, () => {
      this.onSearch();
    });
  }

  private _sendDeactivateUser(user: ISmartriseUserLookup) {
    this.accountService.deactivateUser(user.id).subscribe(() => {
      this.onSearch();
      this.messageService.showSuccessMessage('User has been deactivated successfully');
    }, () => {
      this.onSearch();
    });
  }
}

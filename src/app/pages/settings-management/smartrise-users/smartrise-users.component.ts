import { AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { SmartriseUsersParams } from '../../../_shared/models/smartriseUsersParams';
import { ISmartriseUserRoleLookup } from '../../../_shared/models/ISmartriseUserRoleLookup';
import { ISmartriseUserLookup } from '../../../_shared/models/ISmartriseUserLookup';
import { IGetSmartriseUser } from '../../../_shared/models/IGetSmartriseUser';
import { AccountService } from '../../../services/account.service';
import { MessageService } from '../../../services/message.service';
import { PermissionService } from '../../../services/permission.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { SmartriseUserActionsComponent } from './smartrise-user-actions/smartrise-user-actions.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { BaseParams } from '../../../_shared/models/baseParams';
import { IPagination } from '../../../_shared/models/pagination';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { environment } from '../../../../environments/environment';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../_shared/components/pager/pager.component';

@Component({
  selector: 'ngx-smartrise-users',
  templateUrl: './smartrise-users.component.html',
  styleUrls: ['./smartrise-users.component.scss']
})
export class SmartriseUsersComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('search', { static: false }) searchRef: ElementRef;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;

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
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        width: '110px',
        class: 'minw-100px',
        renderComponent: SmartriseUserActionsComponent,
        onComponentInitFunction: this.onComponentInitFunction.bind(this),
      }
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
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  initializeSource() {

    this._initializePager();
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getSmartriseUsers(params);
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

    if (field === 'shipmentType' || field === 'status') {
      return +value;
    }
    if (field === 'shipDate' || field === 'deliveryDate') {
      return new Date(value);
    }
    return value;
  }

  private _getSmartriseUsers(params: BaseParams): Observable<IPagination> {
    const sParam = params as SmartriseUsersParams;
    if (this.isSmall) {
      this._fillFilterParameters(sParam);
    }
    return this.accountService.getSmartriseUsers(params as SmartriseUsersParams);
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

  onComponentInitFunction(instance: SmartriseUserActionsComponent) {
    instance.editUser.subscribe(user => this.onEditUser(user));
    instance.resetPassword.subscribe(user => this.onResetPassword(user));
    instance.activateUser.subscribe(user => this.onActivateUser(user));
    instance.deactivateUser.subscribe(user => this.onDeactivateUser(user));
    instance.resendInvitation.subscribe(user => this.onResendInvitation(user));
  }

  ngOnInit(): void {
    this.enableCreateSmartriseUser();
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

  // getSmartriseUsers() {
  //   this.smartriseUsersParams.sort = 'createDate';
  //   this.accountService.getSmartriseUsers(this.smartriseUsersParams).subscribe(
  //     (response) => {
  //       this.users = response;
  //       // this.smartriseUsersParams.pageNumber = response.pageIndex;
  //       // this.smartriseUsersParams.pageSize = response.pageSize;
  //       // this.totalCount = response.count;
  //     },
  //     (error) => {
  //       this.messageService.showError(error);
  //     }
  //   );
  // }

  // onPageChanged(event: any) {
  //   if (this.smartriseUsersParams.pageNumber !== event) {
  //     this.smartriseUsersParams.pageNumber = event;
  //     this.getSmartriseUsers();
  //   }
  // }

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

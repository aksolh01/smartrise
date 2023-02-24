import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbRadioComponent } from '@nebular/theme';
import { Observable, Subscription } from 'rxjs';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { IActivity } from '../../../_shared/models/activity';
import { ActivityParams, ActivitySearchByCustomerUser } from '../../../_shared/models/activityParams';
import { ICustomerLookup } from '../../../_shared/models/customer-lookup';
import { ITextValueLookup } from '../../../_shared/models/text-value.lookup';
import { IUserLookup } from '../../../_shared/models/IUserLookup';
import { Action } from '../../../_shared/models/user-activity.model';
import { AccountService } from '../../../services/account.service';
import { ActivityService } from '../../../services/activity.service';
import { CustomerService } from '../../../services/customer.service';
import { MessageService } from '../../../services/message.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { ViewUserActivityActionsComponent } from './view-user-activity-actions/view-user-activity-actions.component';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { IEnumValue } from '../../../_shared/models/enumValue.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { CommonValues } from '../../../_shared/constants';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountNameCellComponent } from '../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../services/account-info.service';

@Component({
  selector: 'ngx-view-user-activities',
  templateUrl: './view-user-activities.component.html',
  styleUrls: ['./view-user-activities.component.scss']
})
export class ViewUserActivitiesComponent extends BaseComponent implements OnInit, OnDestroy {

  source: BaseServerDataSource;
  runGuidingTour = true;

  isSmall?: boolean = null;
  showFilters = false;
  customerName: string;
  userDisplayName: string;
  impersonationUserDisplayName: string;
  action: string;
  objectType: string;
  objectDisplayMember: string;
  createdDate?: Date;

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      account: {
        title: 'Account',
        type: 'custom',
        renderComponent: AccountNameCellComponent,
        onComponentInitFunction: (instance: AccountNameCellComponent) => {
          instance.setHeader('Account');
          instance.clicked.subscribe((accountId: number) => {
            this.accountInfoService.showAccountInfo(accountId);
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      userDisplayName: {
        title: 'User',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('User');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      impersonationUserDisplayName: {
        title: 'View As User',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('View As User');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      action: {
        title: 'Action',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Action');
        },
        editable: false,
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      objectType: {
        title: 'Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Type');
        },
        editable: false,
        valuePrepareFunction: this.getEnumDescription.bind(this),
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      objectDisplayMember: {
        title: 'Identifier',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Identifier');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },

      createdDate: {
        title: 'Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date/Time');
        },
        valuePrepareFunction: this.formatUSDateTime.bind(this),
        filter: false
      },
    },
  };

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;

  activities: IActivity[] = [];
  totalCount: number;
  pageSize: number;
  recordsNumber: number;
  originRecordsNumber: number;
  activityParams = new ActivityParams();

  selectedAction: ITextValueLookup;
  selectedObjectType: ITextValueLookup;
  selectedUser: IUserLookup;

  selectedCustomer: ICustomerLookup;
  selectedCustomerName = '';

  selectedOption = 'customer';

  actions: IEnumValue[] = [];
  objectTypes: IEnumValue[] = [];
  users: IUserLookup[] = [];

  showUsers = false;
  smartriseUsersSelected = false;
  customers: ICustomerLookup[];
  filteredCustomers$: Observable<ICustomerLookup[]>;
  @ViewChild('smartriseOption') smartriseOption: NbRadioComponent;
  @ViewChild('customerOption') customerOption: NbRadioComponent;

  @ViewChild('autoCustomerInput') autoCustomerInput: ElementRef;
  @ViewChild('autoCustomer') autoCustomer: any;
  responsiveSubscription: Subscription;
  isSmartriseUser = false;

  constructor(
    private activityService: ActivityService,
    private accountService: AccountService,
    private settingService: SettingService,
    private customerService: CustomerService,
    private responsiveService: ResponsiveService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
    private joyrideService: JoyrideService,
    private accountInfoService: AccountInfoService,
    private multiAccountService: MultiAccountsService) {
    super(baseService);
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
  }

  initializeSource() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber
    };

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.settings.columns.objectType.filter.config.list = this.objectTypes.map(x => ({ title: x.description, value: x.value }));
    this.settings.columns.action.filter.config.list = this.actions.map(x => ({ title: x.description, value: x.value }));

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
      const activityParams = params as ActivityParams;
      if (this.isSmall) {
        activityParams.customerName = this.customerName;
        activityParams.userDisplayName = this.userDisplayName;
        activityParams.impersonationUserDisplayName = this.impersonationUserDisplayName;
        activityParams.action = this.isEmpty(this.action) ? null : this.action;
        activityParams.objectType = this.isEmpty(this.objectType) ? null : this.objectType;
        activityParams.objectDisplayMember = this.objectDisplayMember;
        activityParams.createdDate = this.createdDate;
      }

      activityParams.createdDate = this.mockUtcDate(activityParams.createdDate);
      activityParams.isSmartrise = this.isSmartriseUser;

      if (this.miscellaneousService.isSmartriseUser()) {
        return this.activityService.getActivitiesBySmartriseUser(activityParams);
      } else {
        const searchParams = activityParams as ActivitySearchByCustomerUser;
        searchParams.customerId = this.multiAccountService.getSelectedAccount();

        return this.activityService.getActivitiesByCustomerUser(activityParams);
      }
    };

    this.source.dataLoading.subscribe(isLoading => {
      this.isLoading = isLoading;

      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
  }

  populateActionsFilterList() {
    if (!this.miscellaneousService.isSmartriseUser()) {
      return this.populateLookupAsFilterListExcept(Action, [
        Action.LoginAs,
        Action.StopLoginAs,
        Action.UploadFile
      ]);
    } else {
      return this.populateLookupAsFilterList(Action);
    }
  }

  onComponentInitFunction(instance: ViewUserActivityActionsComponent) {
  }

  async ngOnInit() {

    this.objectTypes = await this.activityService.getObjectTypes().toPromise();
    this.actions = await this.activityService.getActions().toPromise();

    this.settingService.getBusinessSettings().subscribe(rep => {
      this.recordsNumber = rep.numberOfRecords;
      this.originRecordsNumber = rep.numberOfRecords;
      this.activityParams.pageSize = +this.recordsNumber;
      this.initializeCustomersLookup();
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

  initializeCustomersLookup() {
    this.filteredCustomers$ = this.customerService.getCustomersLookup('');
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onReset() {

    this.customerName = null;
    this.userDisplayName = null;
    this.impersonationUserDisplayName = null;
    this.action = '';
    this.objectType = '';
    this.objectDisplayMember = null;
    this.createdDate = null;

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onUserSelected(user) {
    this.selectedUser = user;
    this.source.refresh();
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onShowDetails(activity: any) {

  }

  displayActionText(value: any) {
    return (Action[value] || '').replace(/([A-Z])/g, ' $1').trim();
  }


  onSelectOption(option: string) {
    if (option === 'customer') {
      this.smartriseUsersSelected = false;
      this.users = [];
    } else {
      this.users = [];
      this.selectedCustomerName = null;
      this.selectedCustomer = null;
      this.smartriseUsersSelected = true;
    }
    this.source.refresh();
  }

  getSmartriseUsers() {
    this.accountService.getAllSmartriseUsers().subscribe(users => {
      this.users = users;
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourUserActivities') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['userActivitiesFirstStep'],
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
    localStorage.setItem('GuidingTourUserActivities', '1');
    this.runGuidingTour = false;
  }

  ngOnDestroy(): void {
    this.responsiveSubscription.unsubscribe();
    this.stopGuidingTour();
    this.joyrideService = null;
  }
}

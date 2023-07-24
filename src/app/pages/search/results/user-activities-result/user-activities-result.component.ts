import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbRadioComponent } from '@nebular/theme';
import { Observable, Subscription, tap } from 'rxjs';
import { BaseComponent } from '../../../base.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues, URLs } from '../../../../_shared/constants';
import { ITextValueLookup } from '../../../../_shared/models/text-value.lookup';
import { IUserLookup } from '../../../../_shared/models/IUserLookup';
import { ICustomerLookup } from '../../../../_shared/models/customer-lookup';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { ActivityParams, ActivitySearchByCustomerUser } from '../../../../_shared/models/activityParams';
import { IActivity } from '../../../../_shared/models/activity';
import { ActivityService } from '../../../../services/activity.service';
import { AccountService } from '../../../../services/account.service';
import { CustomerService } from '../../../../services/customer.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { JoyrideService } from 'ngx-joyride';
import { AccountInfoService } from '../../../../services/account-info.service';
import { ListTitleService } from '../../../../services/list-title.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { ViewUserActivityActionsComponent } from '../../../audit-management/view-user-activities/view-user-activity-actions/view-user-activity-actions.component';
import { Action } from '../../../../_shared/models/user-activity.model';
import { environment } from '../../../../../environments/environment';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { SearchService } from '../../../../services/search.service';

@Component({
  selector: 'ngx-user-activities-result',
  templateUrl: './user-activities-result.component.html',
  styleUrls: ['./user-activities-result.component.scss']
})
export class UserActivitiesResultComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  @Input() searchKey: string;
  source: BaseServerDataSource;
  runGuidingTour: boolean = true;
  title: string;
  isSmall?: boolean = null;
  showFilters: boolean = false;
  account: string;
  userDisplayName: string;
  impersonationUserDisplayName: string;
  action: string;
  objectType: string;
  objectDisplayMember: string;
  createdDate?: Date;
  public Math = Math;
  settings: any = {
    mode: 'external',
    hideSubHeader: true,
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
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Account');
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
            paramExps: [
              'id'
            ]
          });
        },
        width: '15%',
        show: false,
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
  recordsNumber: number = 5;
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
    private customerService: CustomerService,
    private responsiveService: ResponsiveService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
    private accountInfoService: AccountInfoService,
    private listTitleService: ListTitleService,
    private searchService: SearchService,
    private multiAccountService: MultiAccountsService) {
    super(baseService);
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 500);
  }

  initializeSource() {

    this._initializePager();

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this._fillTableFilterLists();

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getUserActivities(params).pipe(tap(x => this.searchService.notifyResultSetReady('UserActivities', x.data.length)));
    this.source.dataLoading.subscribe(isLoading => this._onDataLoading(isLoading));
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;
  }

  private _convertFilterValue(field, value) {
    if (this.isEmpty(value))
      return null;

    if (field === 'createdDate') {
      return new Date(value);
    }
    return value;
  }

  private _getUserActivities(params: any) {
    const activityParams = params as ActivityParams;

    this._fillSearchParameters(this.searchKey, activityParams);

    activityParams.isSmartrise = this.isSmartriseUser;

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.activityService.searchAllActivitiesBySmartriseUser(activityParams);
    } else {
      return this.activityService.searchAllActivitiesByCustomerUser(activityParams as ActivitySearchByCustomerUser);
    }
  }

  private _fillSearchParameters(searchKey: string, activityParams: ActivityParams) {
    activityParams.account = searchKey;
    activityParams.action = searchKey;
    activityParams.objectDisplayMember = searchKey;
    activityParams.objectType = searchKey;
    activityParams.userDisplayName = searchKey;
    activityParams.impersonationUserDisplayName = searchKey;
  }

  private _searchAllActivitiesByCustomerUser(searchParams: ActivitySearchByCustomerUser) {
    searchParams.customerId = this.multiAccountService.getSelectedAccount();
    return this.activityService.searchAllActivitiesByCustomerUser(searchParams);
  }

  private _fillTableFilterLists() {
    this.settings.columns.objectType.filter.config.list = this.objectTypes.map(x => {
      return { title: x.description, value: x.value };
    });
    this.settings.columns.action.filter.config.list = this.actions.map(x => {
      return { title: x.description, value: x.value };
    });
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: 5
    };
  }

  private _fillFilterParameters(activityParams: ActivityParams) {
    activityParams.account = this.account;
    activityParams.userDisplayName = this.userDisplayName;
    activityParams.impersonationUserDisplayName = this.impersonationUserDisplayName;
    activityParams.action = this.isEmpty(this.action) ? null : this.action;
    activityParams.objectType = this.isEmpty(this.objectType) ? null : this.objectType;
    activityParams.objectDisplayMember = this.objectDisplayMember;
    activityParams.createdDate = this.createdDate;
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

    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });

    this.objectTypes = await this.activityService.getObjectTypes().toPromise();
    this.actions = await this.activityService.getActions().toPromise();

    this.recordsNumber = 5;
    this.originRecordsNumber = 5;
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
  }

  initializeCustomersLookup() {
    this.filteredCustomers$ = this.customerService.getCustomersLookup('');
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
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
    this.account = null;
    this.userDisplayName = null;
    this.impersonationUserDisplayName = null;
    this.action = '';
    this.objectType = '';
    this.objectDisplayMember = null;
    this.createdDate = null;
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

  ngOnDestroy(): void {
    this.responsiveSubscription.unsubscribe();
    this.accountInfoService.closePopup();
  }
}


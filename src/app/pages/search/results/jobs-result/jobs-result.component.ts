import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { JobSearchByCustomerParams, JobSearchParams } from '../../../../_shared/models/jobParams';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { JobActionsComponent } from '../../../jobs-management/jobs/jobs-list/job-actions/job-actions.component';
import { JoyrideService } from 'ngx-joyride';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { ListTitleService } from '../../../../services/list-title.service';
import { PasscodeService } from '../../../../services/passcode.service';
import { MessageService } from '../../../../services/message.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JobTabService } from '../../../../services/job-tabs.service';
import { JobService } from '../../../../services/job.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../../services/account.service';
import { Subscription, tap } from 'rxjs';
import { CommonValues, URLs } from '../../../../_shared/constants';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { BaseComponent } from '../../../base.component';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { Tab } from '../../../../_shared/models/jobTabs';
import { PendingInfoCellComponent } from '../../../jobs-management/jobs/jobs-list/pending-info-cell.component';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-jobs-result',
  templateUrl: './jobs-result.component.html',
  styleUrls: ['./jobs-result.component.scss']
})
export class JobsResultComponent extends BaseComponent implements OnInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  @Input() searchKey: string;
  recordsNumber: number;
  public Math = Math;
  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  isSmall?: boolean = null;
  showFilters = false;
  runGuidingTour = true;
  actualShipDate?: Date;
  installedBy: string;
  maintainedBy: string;
  account: string;
  jobName: string;
  jobNumber: string;
  customerPONumber: string;
  grantedShipDate?: Date = null;
  createDate?: Date = null;
  // orderDate?: Date = null;
  shipDate?: Date = null;
  epicorWaitingInfo: string;
  yesNoList: { value?: boolean; title: string }[];
  selectedAccountName = this.getSelectedAccountsLabel();
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
          instance.setHeader(this._getAccountTitle());
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
      installedBy: {
        title: 'Installation By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Installation By');
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
      maintainedBy: {
        title: 'Currently Maintained By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Currently Maintained By');
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
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.preNavigateFunction = () => {
            this.jobTabService.setSelectedTab(Tab.JobDetails);
          };
          instance.setHeader('Job Name');
          instance.setOptions({
            tooltip: 'View Job Details',
            link: 'pages/jobs-management/jobs',
            paramExps: ['id'],
          });
        },
        width: '15%',
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      jobNumber: {
        title: 'Job Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      customerPONumber: {
        title: 'PO Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('PO Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      shipDate: {
        title: 'Desired Ship Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Desired Ship Date');
        },
        editable: false,
        valuePrepareFunction: this.formatUSDate.bind(this),
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      grantedShipDate: {
        title: 'Tentative Ship Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Tentative Ship Date');
        },
        editable: false,
        valuePrepareFunction: this.formatUSDate.bind(this),
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      actualShipDate: {
        title: 'Actual Ship Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: this.formatUSDate.bind(this),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Actual Ship Date');
        },
        editable: false,
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      epicorWaitingInfo: {
        title: 'Waiting on Info',
        type: 'custom',
        renderComponent: PendingInfoCellComponent,
        onComponentInitFunction: (instance: PendingInfoCellComponent) => {
          instance.setHeader('Waiting on Info');
        },
        editable: false,
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
            list: this.populateYesNo(),
          },
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: ViewDetailsActionComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  responsiveSubscription: Subscription;

  source: BaseServerDataSource;
  hasRecords: boolean = false;

  constructor(
    private accountService: AccountService,
    private jobService: JobService,
    private router: Router,
    private responsiveService: ResponsiveService,
    private jobTabService: JobTabService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    private listTitleService: ListTitleService,
    private passcodeService: PasscodeService,
    private messageService: MessageService,
    private searchService: SearchService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe(id => this._showJobDetails(id));
  }

  private _showJobDetails(id: any) {
    this.jobTabService.setSelectedTab(Tab.JobDetails);
    this.router.navigateByUrl('pages/jobs-management/jobs/' + id.toString());
  }

  initializeSource() {

    this._initializePager();

    this.settings.columns.account.title = this._getAccountTitle();

    if (this.miscellaneousService.isCustomerUser()) {
      delete this.settings.columns.maintainedBy;
      delete this.settings.columns.installedBy;
      if (this.multiAccountService.hasOneAccount()) {
        delete this.settings.columns.account;
      }
    }

    this.source = new BaseServerDataSource();

    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getJobs(params).pipe(
      tap(x => this.searchService.notifyResultSetReady('Jobs', x.data.length)),
      );

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });

    this.source.setSort([
      { field: 'jobName', direction: 'asc' }  // primary sort
    ], false);
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'epicorWaitingInfo')
      return (/true/i).test(value);

    if (field === 'orderDate' || field === 'createDate' || field === 'shipDate' || field === 'grantedShipDate')
      return new Date(value);

    return value;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _getJobs(params: any) {
    const jobParams = params as JobSearchParams;

    this._mockDateParameters(jobParams);

    this._fillSearchParameters(this.searchKey, jobParams);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.jobService.searchAllJobsBySmartriseUser(jobParams);
    } else {
      return this.jobService.searchAllJobsByCustomerUser(jobParams);
    }
  }

  private _fillSearchParameters(searchKey: string, p: JobSearchParams) {
    p.account = searchKey;
    p.installedBy = searchKey;
    p.maintainedBy = searchKey;
    p.customerPONumber = searchKey;
    p.jobName = searchKey;
    p.jobNumber = searchKey;
  }

  private _mockDateParameters(jobParams: JobSearchParams) {
    jobParams.actualShipDate = this.mockUtcDate(jobParams.actualShipDate);
    jobParams.grantedShipDate = this.mockUtcDate(jobParams.grantedShipDate);
    jobParams.createDate = this.mockUtcDate(jobParams.createDate);
    jobParams.shipDate = this.mockUtcDate(jobParams.shipDate);
  }

  async ngOnInit() {
    this.recordsNumber = 5;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    this.yesNoList = this.populateYesNo();
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

  onJobFilterChange() { }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEdit(event) {
    this.router.navigateByUrl('pages/jobs-management/jobs/' + event.data.id);
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
    this.jobName = null;
    this.jobNumber = null;
    this.createDate = null;
    // this.orderDate = null;
    this.customerPONumber = null;
    this.shipDate = null;
    this.grantedShipDate = null;
    this.epicorWaitingInfo = '';
    this.actualShipDate = null;
    this.installedBy = null;
    this.maintainedBy = null;
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }
  goToJobs() {
    this.router.navigateByUrl('/pages/jobs-management/jobs');
  }
  goToShipments() {
    this.router.navigateByUrl('/pages/jobs-management/shipments');
  }
  goToJobsFile() {
    this.router.navigateByUrl('/pages/jobs-management/job-files');
  }
  onLoad(value: any) {
    console.log(value);
  }

  onCustom(event) {
    if (event.action === 'view') {
      this.router.navigateByUrl(
        'pages/jobs-management/jobs/' + event.data.id.toString()
      );
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }
    this.modalService?.hide();

    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourJobs') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['jobFirstStep'],
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

  ngAfterContentInit(): void { }

  onFinishingTour() {
    localStorage.setItem('GuidingTourJobs', '1');
    this.runGuidingTour = false;
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }
}

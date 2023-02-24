import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../../services/account.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { JobTabService } from '../../../../services/job-tabs.service';
import { JobService } from '../../../../services/job.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { SettingService } from '../../../../services/setting.service';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues } from '../../../../_shared/constants';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { JobSearchByCustomerParams, JobSearchParams } from '../../../../_shared/models/jobParams';
import { Tab } from '../../../../_shared/models/jobTabs';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../../base.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { FillPasscodeComponent } from '../fill-passcode/fill-passcode.component';
import { AccountNameCellComponent } from '../../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../../services/account-info.service';
import { PendingInfoCellComponent } from './pending-info-cell.component';
import { JobActionsComponent } from './job-actions/job-actions.component';

@Component({
  selector: 'ngx-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss'],
})
export class JobsListComponent extends BaseComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('search') search: ElementRef;
  recordsNumber: number;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  isSmall?: boolean = null;
  showFilters = false;
  runGuidingTour = true;
  actualShipDate?: Date;
  customerName: string;
  jobName: string;
  jobNumber: string;
  customerPONumber: string;
  grantedShipDate?: Date = null;
  createDate?: Date = null;
  // orderDate?: Date = null;
  shipDate?: Date = null;
  epicorWaitingInfo: string;

  yesNoList: { value?: boolean; title: string }[];

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
      // orderDate: {
      //   title: 'Order Date',
      //   type: 'custom',
      //   renderComponent: Ng2TableCellComponent,
      //   onComponentInitFunction: (instance: Ng2TableCellComponent) => {
      //     instance.setHeader('Order Date');
      //   },
      //   editable: false,
      //   valuePrepareFunction: this.formatUSDate.bind(this),
      //   filter: {
      //     type: 'custom',
      //     component: CpDateFilterComponent,
      //   },
      // },
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
        renderComponent: JobActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  responsiveSubscription: Subscription;

  source: BaseServerDataSource;
  canFillPasscode: boolean;

  constructor(
    private accountService: AccountService,
    private jobService: JobService,
    private router: Router,
    private responsiveService: ResponsiveService,
    private settingService: SettingService,
    private jobTabService: JobTabService,
    private modalService: BsModalService,
    private joyrideService: JoyrideService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  onActionsInit(actions: JobActionsComponent) {
    actions.showDetails.subscribe((id) => {
      this.jobTabService.setSelectedTab(Tab.JobDetails);
      this.router.navigateByUrl('pages/jobs-management/jobs/' + id.toString());
    });
    actions.fillPasscode.subscribe(job => {
      const ref = this.modalService.show<FillPasscodeComponent>(FillPasscodeComponent,
        {
          initialState: {
            jobId: job.id,
            tempPasscode: job.tempPasscode,
          },
          class: 'passcode-model centered',
        }
      );
      ref.onHide.subscribe(() => {
        this.source.refresh();
      });
    });
  }

  initializeSource() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();

    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }

      if (field === 'epicorWaitingInfo') {
        return /true/i.test(value);
      }

      if (
        field === 'orderDate' ||
        field === 'createDate' ||
        field === 'shipDate' ||
        field === 'grantedShipDate'
      ) {
        return new Date(value);
      }

      return value;
    };

    this.source.serviceErrorCallBack = () => {};

    this.source.serviceCallBack = (params) => {
      const jobParams = params as JobSearchParams;

      if (this.isSmall) {
        jobParams.customerName = this.customerName;
        jobParams.jobName = this.jobName;
        jobParams.jobNumber = this.jobNumber;
        jobParams.epicorWaitingInfo = this.epicorWaitingInfo
          ? /true/.test(this.epicorWaitingInfo)
          : null;
        jobParams.customerPONumber = this.customerPONumber;
        jobParams.grantedShipDate = this.grantedShipDate;
        jobParams.actualShipDate = this.actualShipDate;
        jobParams.createDate = this.createDate;
        jobParams.shipDate = this.shipDate;
      }

      jobParams.actualShipDate = this.mockUtcDate(jobParams.actualShipDate);
      jobParams.grantedShipDate = this.mockUtcDate(jobParams.grantedShipDate);
      jobParams.createDate = this.mockUtcDate(jobParams.createDate);
      jobParams.shipDate = this.mockUtcDate(jobParams.shipDate);

      if (this.miscellaneousService.isSmartriseUser()) {
        return this.jobService.searchJobsBySmartriseUser(jobParams);
      } else {
        const searchParameters = jobParams as JobSearchByCustomerParams;
        searchParameters.customerId =
          this.multiAccountService.getSelectedAccount();

        return this.jobService.searchJobsByCustomerUser(jobParams);
      }
    };
    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
      setTimeout(
        () => {
          this.startGuidingTour();
        },
        this.isSmall
          ? guidingTourGlobal.smallScreenSuspensionTimeInterval
          : guidingTourGlobal.wideScreenSuspensionTimeInterval
      );
    });
    this.source.setSort(
      [
        { field: 'jobName', direction: 'asc' }, // primary sort
      ],
      false
    );
  }

  ngOnInit(): void {
    this.canFillPasscode =
      this.accountService.loadedUser.roles.indexOf('SmartriseSupport') > -1;
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

    this.yesNoList = this.populateYesNo();
  }

  onJobFilterChange() {}

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
    this.customerName = null;
    this.jobName = null;
    this.jobNumber = null;
    this.createDate = null;
    // this.orderDate = null;
    this.customerPONumber = null;
    this.shipDate = null;
    this.grantedShipDate = null;
    this.epicorWaitingInfo = '';
    this.actualShipDate = null;

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

  ngAfterContentInit(): void {}

  onFinishingTour() {
    localStorage.setItem('GuidingTourJobs', '1');
    this.runGuidingTour = false;
  }

}

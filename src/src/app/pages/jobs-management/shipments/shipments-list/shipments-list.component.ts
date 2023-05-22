import {
  AfterContentInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IShipmentRecord,
  ShipmentStatus,
  ShipmentType,
} from '../../../../_shared/models/shipment';
import { ShipmentByCustomerParams, ShipmentParams } from '../../../../_shared/models/shipmentParams';
import { ITextValueLookup } from '../../../../_shared/models/text-value.lookup';
import { ShipmentService } from '../../../../services/shipment.service';
import { BaseComponent } from '../../../base.component';
import { SettingService } from '../../../../services/setting.service';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { ShipmentActionsComponent } from './shipment-actions/shipment-actions.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JobTabService } from '../../../../services/job-tabs.service';
import { ShipmentStatusCellComponent } from '../../../../_shared/components/business/shipment-status.component';
import { YesNoCellComponent } from '../../../../_shared/components/yes-no-cell.component';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { Tab } from '../../../../_shared/models/jobTabs';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../../services/base-component.service';
import { CommonValues, URLs } from '../../../../_shared/constants';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { ListTitleService } from '../../../../services/list-title.service';

@Component({
  selector: 'ngx-shipments-list',
  templateUrl: './shipments-list.component.html',
  styleUrls: ['./shipments-list.component.scss'],
})
export class ShipmentsListComponent extends BaseComponent implements OnInit, OnDestroy, AfterContentInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  public Math = Math;
  isSmartriseUser = false;
  shipments: IShipmentRecord[] = [];
  totalCount: number;
  pageSize: number;
  recordsNumber: number;
  originRecordsNumber: string;
  shipmentStatuses: ITextValueLookup[] = [];
  shipmentTypes: IEnumValue[] = [];
  statuses: IEnumValue[] = [];
  source: BaseServerDataSource;
  isSmall?: boolean = null;
  showFilters = false;
  runGuidingTour = true;
  yesNoList: { value?: boolean; title: string }[];
  account: string;
  jobName: string;
  jobNumber: string;
  shipmentType: string;
  shipDate?: Date;
  deliveryDate?: Date;
  status = '';
  isDropShipment = '';
  trackingNumber: string;

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
            breakWord: true,
            tooltip: 'View Job Details',
            link: '/pages/jobs-management/jobs',
            paramExps: ['jobId'],
          });
        },
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
      shipmentType: {
        title: 'Package',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Package');
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
      trackingNumber: {
        title: 'Tracking Number',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Tracking Number');
          instance.preNavigateFunction = (rowData) => {
            this.jobTabService.setSelectedTab(Tab.Shipments, rowData['id']);
          };
          instance.setOptions({
            breakWord: true,
            link: 'pages/jobs-management/jobs',
            paramExps: ['jobId'],
            tooltip: 'View Shipment Details',
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      isDropShipment: {
        title: 'Drop Shipment',
        type: 'custom',
        renderComponent: YesNoCellComponent,
        onComponentInitFunction: (instance: YesNoCellComponent) => {
          instance.setHeader('Drop Shipment');
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
      shipDate: {
        title: 'Ship Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Ship Date');
        },
        editable: false,
        valuePrepareFunction: this.formatUSDate.bind(this),
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      deliveryDate: {
        title: 'Delivery Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Delivery Date/Time');
        },
        editable: false,
        valuePrepareFunction: this.formatUSDateTimeWithoutSeconds.bind(this),
        filter: false,
        // filter: {
        //   type: 'custom',
        //   component: CpDateFilterComponent,
        // },
      },
      status: {
        title: 'Status',
        type: 'custom',
        renderComponent: ShipmentStatusCellComponent,
        onComponentInitFunction: (instance: ShipmentStatusCellComponent) => {
          instance.setHeader('Status');
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
      // shipAddress: {
      //   title: 'Ship Address',
      //   type: 'string',
      //   filter: {
      //     type: 'custom',
      //     component: CpFilterComponent,
      //   },
      // },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: ShipmentActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  responsiveSubscription: Subscription;
  title: string;
  installedBy: string;
  maintainedBy: string;

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private shipmentService: ShipmentService,
    private jobTabService: JobTabService,
    private responsiveService: ResponsiveService,
    private settingService: SettingService,
    private joyrideService: JoyrideService,
    private multiAccountService: MultiAccountsService,
    private miscellaneousService: MiscellaneousService,
    private accountInfoService: AccountInfoService,
    private listTitleService: ListTitleService
  ) {
    super(baseService);

    this.populateLookup(this.shipmentStatuses, ShipmentStatus);
  }

  onActionsInit(actions: ShipmentActionsComponent) {
    actions.showDetails.subscribe((shipment) => {
      this.jobTabService.setSelectedTab(Tab.Shipments, shipment.id);
      this.router.navigateByUrl(
        'pages/jobs-management/shipments/' + shipment.jobId.toString()
      );
    });
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

    this._fillTableFilterLists();

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getShipments(params);
    this.source.dataLoading.subscribe((isLoading) => this._onDataLoading(isLoading));

    this.source.setSort([
      { field: 'jobName', direction: 'asc' }  // primary sort
    ], false);
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;

    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'shipDate' || field === 'deliveryDate') {
      return new Date(value);
    }
    return value;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25,
    };
  }

  private _fillTableFilterLists() {
    this.settings.columns.shipmentType.filter.config.list = this.shipmentTypes.map(x => {
      return { title: x.description, value: x.value };
    });
    this.settings.columns.status.filter.config.list = this.statuses.map(x => {
      return { title: x.description, value: x.value };
    });
  }

  private _getShipments(params: any) {
    const shipmentParams = params as ShipmentParams;
    if (this.isSmall) {
      this._fillFilterParameters(shipmentParams);
    }

    this._mockDateParameters(shipmentParams);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.shipmentService.getShipmentsBySmartriseUser(shipmentParams);
    } else {
      const searchParameters = shipmentParams as ShipmentByCustomerParams;
      searchParameters.customerId = this.multiAccountService.getSelectedAccount();
      return this.shipmentService.getShipmentsByCustomerUser(searchParameters);
    }
  }

  private _mockDateParameters(shipmentParams: ShipmentParams) {
    shipmentParams.shipDate = this.mockUtcDate(shipmentParams.shipDate);
    shipmentParams.deliveryDate = this.mockUtcDate(shipmentParams.deliveryDate);
  }

  private _fillFilterParameters(shipmentParams: ShipmentParams) {
    shipmentParams.account = this.account;
    shipmentParams.jobName = this.jobName;
    shipmentParams.jobNumber = this.jobNumber;
    shipmentParams.shipmentType = this.isEmpty(this.shipmentType) ? null : this.shipmentType;
    shipmentParams.shipDate = this.shipDate;
    shipmentParams.deliveryDate = this.deliveryDate;
    shipmentParams.status = this.isEmpty(this.status) ? null : this.status;
    shipmentParams.isDropShipment = !this.isEmpty(this.isDropShipment) ? /true/.test(this.isDropShipment) : null;
    shipmentParams.trackingNumber = this.trackingNumber;
    shipmentParams.installedBy = this.installedBy;
    shipmentParams.maintainedBy = this.maintainedBy;
}

  async ngOnInit() {

    this.title = await this.listTitleService.buildTitle('Shipments');

    this.shipmentTypes = await this.shipmentService.getShipmentTypes().toPromise();

    this.statuses = await this.shipmentService.getShipmentStatuses().toPromise();

    this.settingService.getBusinessSettings().subscribe((rep) => {
      this.recordsNumber = rep.numberOfRecords || 25;
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

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  displayStatusText(value: any) {
    return ShipmentStatus[value];
  }

  displayShipmentTypeText(value: any) {
    return ShipmentType[value];
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
    this.jobName = null;
    this.jobNumber = null;
    this.shipmentType = '';
    this.shipDate = null;
    this.deliveryDate = null;
    this.status = '';
    this.isDropShipment = '';
    this.trackingNumber = null;
    this.installedBy = null;
    this.maintainedBy = null;
  }
  onPagePrev(): void {
    const currentPage = this.source.getPaging().page;
    const perPage = this.source.getPaging().perPage;
    if (currentPage > 1) {
      this.source.setPaging(currentPage - 1, perPage);
    }
  }

  onPageNext(): void {
    const currentPage = this.source.getPaging().page;
    const perPage = this.source.getPaging().perPage;
    const totalPages = Math.ceil(this.source.count() / perPage);
    if (currentPage < totalPages) {
      this.source.setPaging(currentPage + 1, perPage);
    }
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourShipments') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['shipmentFirstStep'],
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
    localStorage.setItem('GuidingTourShipments', '1');
    this.runGuidingTour = false;
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
  populateLookupForDropShipment() {
    return [
      {
        value: true,
        title: 'Yes',
      },
      {
        value: false,
        title: 'No',
      },
    ];
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }
}
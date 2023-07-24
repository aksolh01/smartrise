import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { IShipmentRecord, ShipmentStatus, ShipmentType } from '../../../../_shared/models/shipment';
import { ITextValueLookup } from '../../../../_shared/models/text-value.lookup';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { CommonValues, URLs } from '../../../../_shared/constants';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { Tab } from '../../../../_shared/models/jobTabs';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { YesNoCellComponent } from '../../../../_shared/components/yes-no-cell.component';
import { ShipmentStatusCellComponent } from '../../../../_shared/components/business/shipment-status.component';
import { ShipmentActionsComponent } from '../../../jobs-management/shipments/shipments-list/shipment-actions/shipment-actions.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { Subscription, tap } from 'rxjs';
import { ListTitleService } from '../../../../services/list-title.service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { JoyrideService } from 'ngx-joyride';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JobTabService } from '../../../../services/job-tabs.service';
import { ShipmentService } from '../../../../services/shipment.service';
import { Router } from '@angular/router';
import { BaseComponentService } from '../../../../services/base-component.service';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { ShipmentByCustomerParams, ShipmentParams } from '../../../../_shared/models/shipmentParams';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-shipments-result',
  templateUrl: './shipments-result.component.html',
  styleUrls: ['./shipments-result.component.scss']
})
export class ShipmentsResultComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  
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
  @Input() searchKey: string;
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
            breakWord: false,
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
            breakWord: false,
            link: 'pages/jobs-management/shipments',
            paramExps: [
              'jobId'
            ],
            tooltip: 'View Shipment Details'
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
        renderComponent: ViewDetailsActionComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  responsiveSubscription: Subscription;
  title: string;
  installedBy: string;
  maintainedBy: string;
  selectedAccountName = this.getSelectedAccountsLabel();

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private shipmentService: ShipmentService,
    private jobTabService: JobTabService,
    private responsiveService: ResponsiveService,
    private joyrideService: JoyrideService,
    private multiAccountService: MultiAccountsService,
    private miscellaneousService: MiscellaneousService,
    private accountInfoService: AccountInfoService,
    private searchService: SearchService,
    private listTitleService: ListTitleService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super(baseService);

    this.populateLookup(this.shipmentStatuses, ShipmentStatus);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    });
  }

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe((shipment) => {
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
    this.source.serviceCallBack = (params) => this._getShipments(params).pipe(tap(x => this.searchService.notifyResultSetReady('Shipments', x.data.length)));
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

    this._mockDateParameters(shipmentParams);

    this._fillSearchParameters(this.searchKey, shipmentParams);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.shipmentService.searchAllShipmentsBySmartriseUser(shipmentParams);
    } else {
      return this.shipmentService.searchAllShipmentsByCustomerUser(shipmentParams as ShipmentByCustomerParams);
    }
  }

  private _fillSearchParameters(searchKey: string, shipmentParams: ShipmentParams) {
    shipmentParams.account = searchKey;
    shipmentParams.installedBy = searchKey;
    shipmentParams.jobName = searchKey;
    shipmentParams.jobNumber = searchKey;
    shipmentParams.maintainedBy = searchKey
    shipmentParams.shipmentType = searchKey
    shipmentParams.status = searchKey
    shipmentParams.trackingNumber = searchKey
  }

  private _mockDateParameters(shipmentParams: ShipmentParams) {
    shipmentParams.shipDate = this.mockUtcDate(shipmentParams.shipDate);
    shipmentParams.deliveryDate = this.mockUtcDate(shipmentParams.deliveryDate);
  }

  async ngOnInit() {

    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });

    this.title = await this.listTitleService.buildTitle('Shipments');

    this.shipmentTypes = await this.shipmentService.getShipmentTypes().toPromise();

    this.statuses = await this.shipmentService.getShipmentStatuses().toPromise();

    this.recordsNumber = 5;
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


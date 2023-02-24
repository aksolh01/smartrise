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
import { CommonValues } from '../../../../_shared/constants';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { AccountNameCellComponent } from '../../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../../services/account-info.service';

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
  customerName: string;
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
        renderComponent: AccountNameCellComponent,
        onComponentInitFunction: (instance: AccountNameCellComponent) => {
          instance.setHeader('Account');
          instance.clicked.subscribe((accountId: number) => {
            this.accountInfoService.showAccountInfo(accountId);
          });
        },
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
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.settings.columns.shipmentType.filter.config.list =
      this.shipmentTypes.map((x) => ({ title: x.description, value: x.value }));
    this.settings.columns.status.filter.config.list = this.statuses.map(
      (x) => ({ title: x.description, value: x.value })
    );

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }

      if (field === 'shipDate' || field === 'deliveryDate') {
        return new Date(value);
      }
      return value;
    };

    this.source.serviceErrorCallBack = (error) => {
    };

    this.source.serviceCallBack = (params) => {
      const shipmentParams = params as ShipmentParams;
      if (this.isSmall) {
        shipmentParams.customerName = this.customerName;
        shipmentParams.jobName = this.jobName;
        shipmentParams.jobNumber = this.jobNumber;
        shipmentParams.shipmentType = this.isEmpty(this.shipmentType)
          ? null
          : this.shipmentType;
        shipmentParams.shipDate = this.shipDate;
        shipmentParams.deliveryDate = this.deliveryDate;
        shipmentParams.status = this.isEmpty(this.status) ? null : this.status;
        shipmentParams.isDropShipment = !this.isEmpty(this.isDropShipment)
          ? /true/.test(this.isDropShipment)
          : null;
        shipmentParams.trackingNumber = this.trackingNumber;
      }

      shipmentParams.shipDate = this.mockUtcDate(shipmentParams.shipDate);
      shipmentParams.deliveryDate = this.mockUtcDate(shipmentParams.deliveryDate);


      if (this.miscellaneousService.isSmartriseUser()) {
        return this.shipmentService.getShipmentsBySmartriseUser(shipmentParams);
      }
      else {
        const searchParameters = shipmentParams as ShipmentByCustomerParams;
        searchParameters.customerId = this.multiAccountService.getSelectedAccount();

        return this.shipmentService.getShipmentsByCustomerUser(searchParameters);
      }
    };

    this.source.dataLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;

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

  async ngOnInit() {
    this.shipmentTypes = await this.shipmentService
      .getShipmentTypes()
      .toPromise();
    this.statuses = await this.shipmentService
      .getShipmentStatuses()
      .toPromise();
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
    this.customerName = null;
    this.jobName = null;
    this.jobNumber = null;
    this.shipmentType = '';
    this.shipDate = null;
    this.deliveryDate = null;
    this.status = '';
    this.isDropShipment = '';
    this.trackingNumber = null;

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
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
}

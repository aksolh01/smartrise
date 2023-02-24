import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobAlertStatusCellComponent } from '../../../_shared/components/business/job-alert-status.component';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { AlertStatus } from '../../../_shared/models/alertStatus';
import { IFaultData } from '../../../_shared/models/faultData';
import { Part } from '../../../_shared/models/part';
import { IPartReview } from '../../../_shared/models/partReview';
import { PartsParams } from '../../../_shared/models/partsParams';
import { PeriodType } from '../../../_shared/models/periodType';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { ITextValueLookup } from '../../../_shared/models/text-value.lookup';
import { BaseComponentService } from '../../../services/base-component.service';
import { PartsService } from '../../../services/parts.service';
import { PredictiveMaintenanceService } from '../../../services/predictiveMaintenanceService';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { PartsReviewActionsComponent } from './parts-review-actions/parts-review-actions.component';

@Component({
  selector: 'ngx-parts-review',
  templateUrl: './parts-review.component.html',
  styleUrls: ['./parts-review.component.scss']
})
export class PartsReviewComponent extends BaseComponent implements OnInit {

  pJobName: string;
  pJobNumber: string;
  group: string;
  car: string;
  part?: Part;
  partType: string;
  alertsCount?: number;
  status?: AlertStatus;

  pParts: ITextValueLookup[] = [];
  statuses: ITextValueLookup[] = [];

  isSmall = false;
  showFilters = false;
  source: BaseServerDataSource;
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 20,
    },
    columns: {
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Name');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
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
        }
      },
      group: {
        title: 'Group',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Group');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      car: {
        title: 'Car',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Car');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      part: {
        title: 'Part',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part');
        },
        valuePrepareFunction: (value) => (Part[value] || '').replace(/([A-Z])/g, ' $1').trim(),
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(Part),
          },
        }
      },
      partType: {
        filter: true,
        title: 'Part Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part Type');
        },
      },
      alertsCount: {
        title: 'Alerts Count',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alerts Count');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      status: {
        title: 'Status',
        type: 'custom',
        renderComponent: JobAlertStatusCellComponent,
        valuePrepareFunction: (value) => AlertStatus[value],
        onComponentInitFunction: (instance: JobAlertStatusCellComponent) => {
          instance.setHeader('Status');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.getAlertStatus(),
          },
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: PartsReviewActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    }
  };
  parts: IPartReview[] = [];
  faults: IFaultData[] = [];
  jobName: string;
  jobNumber: string;
  recordsNumber: number;

  constructor(
    baseService: BaseComponentService,
    private route: ActivatedRoute,
    private predictiveMaintenanceService: PredictiveMaintenanceService,
    private router: Router,
    private settingsService: SettingService,
    private partsService: PartsService,
    private responsiveService: ResponsiveService,
  ) {
    super(baseService);
  }

  getAlertStatus() {
    const alerts = this.populateLookupAsFilterList(AlertStatus);
    const alarm = alerts.find(x => x.value === AlertStatus.Alarm);
    alarm.title = 'Attention Needed';
    return alerts;
  }

  populatePartTypes() {
    return [
      'Contactor',
      'Braker',
      'Door Lock',
    ];
  }

  onRecordsNumberChanged(value: number) {
    this.source.setPaging(1, value);
  }

  ngOnInit(): void {
    this.settingsService.getBusinessSettings().subscribe(bs => {
      this.recordsNumber = bs.numberOfRecords;
      this.onRecordsNumberChanged(bs.numberOfRecords);
    });
    this.pParts = this.populateLookupAsFilterList(Part);
    this.statuses = this.populateLookupAsFilterList(AlertStatus);

    this.source = new BaseServerDataSource();
    this.source.serviceCallBack = (params) => {
      const partsParams = params as PartsParams;
      return this.partsService.getParts(partsParams);
    };
    this.source.refresh();

    this.responsiveService.currentBreakpoint$.subscribe(w => {
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


    const filter = this.route.snapshot.queryParams['filter'];
    if (filter === 'jobid') {
      const jobData = this.predictiveMaintenanceService.getFilterData();
      if (jobData != null) {
        this.jobName = jobData?.jobName;
        this.jobNumber = jobData?.jobNumber;

        delete this.settings.columns.jobName;
        delete this.settings.columns.jobNumber;
      }
    } else {
      this.jobName = null;
      this.jobNumber = null;
    }
  }

  displayPeriodTypeText(value: PeriodType) {
    return PeriodType[value];
  }

  onActionsInit(actions: PartsReviewActionsComponent) {
    actions.viewAlerts.subscribe((row: IPartReview) => {
      this.predictiveMaintenanceService.setFilterData({
        car: row.car,
        partType: row.partType,
        jobName: row.jobName,
        jobNumber: row.jobNumber,
      });
      this.router.navigateByUrl('pages/predictive-maintenance/alerts-details');
    });
  }

  onReset() {
    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}

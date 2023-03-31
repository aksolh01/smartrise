import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JobAlertStatusCellComponent } from '../../../_shared/components/business/job-alert-status.component';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues } from '../../../_shared/constants';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { AlertStatus } from '../../../_shared/models/alertStatus';
import { PredictiveJobBaseParams } from '../../../_shared/models/jobParams';
import { IMaintenanceJob } from '../../../_shared/models/maintenanceJob';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { ITextValueLookup } from '../../../_shared/models/text-value.lookup';
import { BaseComponentService } from '../../../services/base-component.service';
import { JobService } from '../../../services/job.service';
import { PredictiveMaintenanceService } from '../../../services/predictiveMaintenanceService';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { JobsListActionsComponent } from './jobs-list-actions/jobs-list-actions.component';

@Component({
  selector: 'ngx-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.scss']
})
export class JobsListComponent extends BaseComponent implements OnInit {

  jobName: string;
  jobNumber: string;
  alertsCount?: number;
  status?: AlertStatus;

  isSmall = false;
  source = new BaseServerDataSource();
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
        valuePrepareFunction: (value) => {
          const label = AlertStatus[value];
          return label;
        },
        renderComponent: JobAlertStatusCellComponent,
        onComponentInitFunction: (instance: JobAlertStatusCellComponent) => {
          instance.setHeader('Status');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
            list: this.populateLookupAsFilterList(AlertStatus),
          },
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: JobsListActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    }
  };
  jobs: IMaintenanceJob[];
  recordsNumber: number;
  responsiveSubscription: any;
  showFilters = false;
  alertStatuses: ITextValueLookup[] = [];

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private predictiveMaintenanceService: PredictiveMaintenanceService,
    private settingService: SettingService,
    private responsiveService: ResponsiveService,
    private jobService: JobService,
  ) {
    super(baseService);
    this.populateLookup(this.alertStatuses, AlertStatus);
  }

  ngOnInit(): void {
    this.settingService.getBusinessSettings().subscribe(rep => {
      this.recordsNumber = rep.numberOfRecords || 25;
      this.onRecordsNumberChanged(rep.numberOfRecords);
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
    this.source.serviceCallBack = (param) => {
      const predictiveJobBaseParams = param as PredictiveJobBaseParams;
      if (this.isSmall) {
        predictiveJobBaseParams.jobName = this.jobName;
        predictiveJobBaseParams.jobNumber = this.jobNumber;
        predictiveJobBaseParams.alertsCount = this.alertsCount;
        predictiveJobBaseParams.status = this.status;
      }
      return this.jobService.getPredictiveMaintenanceJobs(predictiveJobBaseParams);
    };
  }

  onActionsInit(actions: JobsListActionsComponent) {
    actions.viewAlerts.subscribe((row: IMaintenanceJob) => {
      this.router.navigateByUrl('pages/predictive-maintenance/elevator-map');
      this.predictiveMaintenanceService.setFilterData({
        filterBy: 'job',
        jobId: row.jobId,
        jobName: row.jobName,
        jobNumber: row.jobNumber,
      });
    });
    actions.viewParts.subscribe((row: IMaintenanceJob) => {
      this.predictiveMaintenanceService.setFilterData({
        jobId: row.jobId,
        jobName: row.jobName,
        jobNumber: row.jobNumber,
      });
      this.router.navigateByUrl('pages/predictive-maintenance/parts-review?filter=jobid');
    });
  }

  onSearch() {
    this.source.refresh();
  }

  onReset() {
    if (this.isSmall) {

      this.jobName = null;
      this.jobNumber = null;
      this.status = null;
      this.alertsCount = null;

      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onRecordsNumberChanged(event) {
    this.source.setPaging(1, event);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}

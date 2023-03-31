import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { IAlertRecord } from '../../../_shared/models/alertRecord';
import { AlertType } from '../../../_shared/models/alertType';
import { Severity } from '../../../_shared/models/predictiveMaintenanceEnums';
import { AlertService } from '../../../services/alert.service';
import { PredictiveMaintenanceService } from '../../../services/predictiveMaintenanceService';
import { AlertDetailsSingleComponent } from '../alert-details-single/alert-details-single.component';
import { AlertsListActionsComponent } from './alerts-list-actions/alerts-list-actions.component';
import { AlertSeverityCellComponent } from '../../../_shared/components/business/alert-severity.component';
import { BaseComponent } from '../../base.component';
import { SettingService } from '../../../services/setting.service';
import { AlertParams } from '../../../_shared/models/alertParams';
import { BaseComponentService } from '../../../services/base-component.service';

@Component({
  selector: 'ngx-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent extends BaseComponent implements OnInit {

  isSmall = false;
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
      alertName: {
        title: 'Alert Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alert Name');
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
      partType: {
        title: 'Part Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part Type');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      severity: {
        title: 'Severity',
        type: 'custom',
        renderComponent: AlertSeverityCellComponent,
        valuePrepareFunction: (value) => Severity[value],
        onComponentInitFunction: (instance: AlertSeverityCellComponent) => {
          instance.setHeader('Severity');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      date: {
        title: 'Date\\Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date\\Time');
        },
        valuePrepareFunction: this.formatUSDateTime.bind(this),
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: AlertsListActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    }
  };
  alerts: IAlertRecord[];
  jobData: any;
  recordsNumber: number;

  constructor(
    baseService: BaseComponentService,
    private route: ActivatedRoute,
    private predictiveMaintenance: PredictiveMaintenanceService,
    private alertService: AlertService,
    private modelService: BsModalService,
    private settingsService: SettingService,
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.settingsService.getBusinessSettings().subscribe(x => {
      this.recordsNumber = x.numberOfRecords || 25;
      this.onRecordsNumberChanged(x.numberOfRecords);
    });
    const filter = this.route.snapshot.queryParams['filter'];
    if (filter === 'jobid') {
      this.jobData = this.predictiveMaintenance.getFilterData();
    } else {
      this.jobData = null;
    }
    this.alerts = [
      {
        alertName: 'Attention needed to emergency Brake',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 1',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Critical,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
    ];
    this.source = new BaseServerDataSource();
    this.source.serviceCallBack = (params) => {
      const alertParams = params as AlertParams;
      return this.alertService.getAlerts(alertParams);
    };
  }

  onActionsInit(actions: AlertsListActionsComponent) {
    actions.viewAlert.subscribe(() => {
      const alert = {

        alertId: 1,

        alertName: 'Attention needed in the door lock',
        alertType: AlertType.CountBasedPart,
        alertDescription: 'Count based one alert',
        alertDate: new Date('2/2/2010'),

        fault: 'Count based 1',
        faultCount: 3,
        faultPossibleAffectedParts: ['Contactor', 'Braker'],
        faultThreshold: 2,

        alarm: 'Alarm 1',
        alarmCount: 4,
        alarmPossibleAffectedParts: ['Contactor', 'Braker'],
        alarmThreshold: 3,

        countBasedPart: 'Door Lock',
        countBasedVendor: 'Sony',

        nbOfDays: null,
        nbOfDaysThreshold: null,
        nbOfLatchesOfTurns: 21000,
        nbOfLatchesOfTurnsThreshold: 20000,

        severity: Severity.High,

        timeBasedPart: null,
        timeBasedVendor: null,
      };

      const modalRef = this.modelService.show<AlertDetailsSingleComponent>(AlertDetailsSingleComponent, {
        initialState: { alert },
        class: 'alert-details-model'
      });

      const subscription = modalRef.onHidden
        .subscribe(() => {
          subscription.unsubscribe();
          this.source.refresh();
        });
    });
  }

  onReset() {
    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onRecordsNumberChanged(event) {
    this.source.setPaging(1, event);
  }
}

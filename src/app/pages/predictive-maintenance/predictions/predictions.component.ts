import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { PeriodType } from '../../../_shared/models/periodType';
import { IPrediction } from '../../../_shared/models/prediction';
import { Severity, ThresholdType, NotificationMethod } from '../../../_shared/models/predictiveMaintenanceEnums';
import { AlertsSettingsActionsComponent } from '../alerts-settings/alerts-settings-actions/alerts-settings-actions.component';

@Component({
  selector: 'ngx-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})
export class PredictionsComponent implements OnInit {

  preditions: IPrediction[] = [];
  source = new LocalDataSource();
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      partType: {
        sort: false,
        title: 'Part Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part Type');
        },
      },
      severity: {
        sort: false,
        title: 'Severity',
        type: 'custom',
        valuePrepareFunction: (value) => Severity[value],
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Severity');
        },
      },
      thresholdType: {
        sort: false,
        title: 'Threshold Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => ThresholdType[value],
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Threshold Type');
        },
      },
      counter: {
        sort: false,
        title: 'Counter',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Counter');
        },
      },
      periodType: {
        sort: false,
        title: 'Period Type',
        type: 'custom',
        valuePrepareFunction: (value) => PeriodType[value],
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Period Type');
        },
      },
      period: {
        sort: false,
        title: 'Period',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Period');
        },
      },
      numberOfFaults: {
        sort: false,
        title: 'Number of Faults',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Number of Faults');
        },
      },
      notificationMethod: {
        sort: false,
        title: 'Notification Method',
        type: 'custom',
        valuePrepareFunction: (value) => NotificationMethod[value],
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Notification Method');
        },
      },
      // actionsCol: {
      //   filter: false,
      //   sort: false,
      //   title: 'Actions',
      //   type: 'custom',
      //   renderComponent: NotificationSettingsActionsComponent,
      //   onComponentInitFunction: this.onActionsInit.bind(this),
      // },
    },
  };

  constructor() { }

  ngOnInit(): void {
    this.preditions = [
      {
        counter: 2,
        numberOfFaults: 3,
        notificationMethod: NotificationMethod.Email,
        partType: '',
        period: null,
        periodType: null,
        severity: Severity.Low,
        thresholdType: ThresholdType.Counter,
      },
      {
        counter: 4,
        numberOfFaults: 5,
        notificationMethod: NotificationMethod.Email,
        partType: '',
        period: null,
        periodType: null,
        severity: Severity.Low,
        thresholdType: ThresholdType.Counter,
      },
      {
        counter: null,
        numberOfFaults: 5,
        notificationMethod: NotificationMethod.SMS,
        partType: '',
        period: 3,
        periodType: PeriodType.Month,
        severity: Severity.Low,
        thresholdType: ThresholdType.Period,
      },
      {
        counter: 2,
        numberOfFaults: 3,
        notificationMethod: NotificationMethod.Email,
        partType: '',
        period: 1,
        periodType: PeriodType.Year,
        severity: Severity.High,
        thresholdType: ThresholdType.Counter,
      },
    ];
    this.source = new LocalDataSource(this.preditions);
    this.source.refresh();
  }

  onActionsInit(notificationSettingsActionsComponent: AlertsSettingsActionsComponent) {
  }
}

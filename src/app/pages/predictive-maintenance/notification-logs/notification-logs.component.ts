import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertSeverityCellComponent } from '../../../_shared/components/business/alert-severity.component';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { AlertType } from '../../../_shared/models/alertType';
import { INotificationLog } from '../../../_shared/models/notificationLog';
import { NotificationParams } from '../../../_shared/models/notificationParam';
import { NotificationMethod, Severity } from '../../../_shared/models/predictiveMaintenanceEnums';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { ITextValueLookup } from '../../../_shared/models/text-value.lookup';
import { BaseComponentService } from '../../../services/base-component.service';
import { NotificationService } from '../../../services/notification.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-notification-logs',
  templateUrl: './notification-logs.component.html',
  styleUrls: ['./notification-logs.component.scss']
})

export class NotificationLogsComponent extends BaseComponent implements OnInit {

  reciepients: string;
  notificationMethod?: NotificationMethod;
  severity?: Severity;
  partType: string;
  alertType?: AlertType;
  alert: string;
  sentTime?: Date;

  severities: ITextValueLookup[] = [];

  source: BaseServerDataSource;
  notificationLogs: INotificationLog[] = [];
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      reciepients: {
        filter: true,
        sort: false,
        title: 'Recipient',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Recipient');
        },
      },
      notificationMethod: {
        sort: true,
        title: 'Notification Method',
        type: 'custom',
        valuePrepareFunction: (value) => NotificationMethod[value],
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Notification Method');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(NotificationMethod),
          },
        },
      },
      severity: {
        sort: true,
        title: 'Severity ' ,
        type: 'custom',
        valuePrepareFunction: (value) => Severity[value],
        renderComponent: AlertSeverityCellComponent,
        onComponentInitFunction: (instance: AlertSeverityCellComponent) => {
          instance.setHeader('Severity ');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(Severity),
          },
        },
      },
      partType: {
        sort: true,
        title: 'Part Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part Type');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populatePartTypes(),
          },
        },
      },
      alertType: {
        sort: true,
        title: 'Alert Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => (AlertType[value] || '').replace(/([A-Z])/g, ' $1').trim(),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alert Type');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(AlertType),
          },
        },
      },
      alert: {
        filter: true,
        sort: true,
        title: 'Alert',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Alert');
        },
      },
      sentTime: {
        sort: true,
        title: 'Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => this.formatUSDateTime(value),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date/Time');
        },
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        }
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
  recordsNumber: number;
  isSmall = false;
  isLoading: any;
  showFilters = false;
  responsiveSubscription: Subscription;

  constructor(
    baseService: BaseComponentService,
    private settingService: SettingService,
    private responsiveService: ResponsiveService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    super(baseService);
    this.populateLookup(this.severities, Severity);
  }

  ngOnInit(): void {
    this.settingService.getBusinessSettings().subscribe(bs => {
      this.recordsNumber = bs.numberOfRecords;
      this.onRecordsNumberChanged(bs.numberOfRecords);
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

    this.notificationLogs = [
      {
        alert: 'Attention Needed',
        alertType: AlertType.Alarm,
        notificationMethod: NotificationMethod.Email,
        partType: 'Braker',
        severity: Severity.Critical,
        reciepients: 'Moufid',
        sentTime: new Date('2/2/2022'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.CountBasedPart,
        notificationMethod: NotificationMethod.Email,
        partType: 'Braker',
        severity: Severity.Critical,
        reciepients: 'Moufid',
        sentTime: new Date('3/2/2022'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.CountBasedPart,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.TimeBasedPart,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
      {
        alert: 'Attention Needed',
        alertType: AlertType.Fault,
        notificationMethod: NotificationMethod.SMS,
        partType: 'Contactor',
        severity: Severity.High,
        reciepients: 'Moufid',
        sentTime: new Date('8/6/2021'),
      },
    ];

    this.source = new BaseServerDataSource();
    this.source.serviceCallBack = (param) => this.notificationService.getNotificationsLogs(param as NotificationParams);
    this.source.refresh();
  }

  onReset() {
    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  populatePartTypes(): { value: string; title: string }[] {
    return [
      { value: 'Contactor', title: 'Contactor' },
      { value: 'Braker', title: 'Braker' },
      { value: 'Door Lock', title: 'Door Lock' },
    ];
  }

  onRecordsNumberChanged(value: number) {
    this.source.setPaging(1, value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.source.refresh();
  }

  onBackToNotificationSettings() {
    this.router.navigateByUrl('pages/predictive-maintenance/notification-settings');
  }
}

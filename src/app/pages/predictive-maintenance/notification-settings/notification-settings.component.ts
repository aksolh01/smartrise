import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { AlertSeverityCellComponent } from '../../../_shared/components/business/alert-severity.component';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { AlertStatus } from '../../../_shared/models/alertStatus';
import { AlertType } from '../../../_shared/models/alertType';
import { ConfigurationType } from '../../../_shared/models/configurationType';
import { NotificationParams } from '../../../_shared/models/notificationParam';
import { INotificationSetting } from '../../../_shared/models/notificationSetting';
import { NotificationMethod, Severity } from '../../../_shared/models/predictiveMaintenanceEnums';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { NotificationService } from '../../../services/notification.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { NotificationSettingComponent } from '../notification-setting/notification-setting.component';
import { NotificationSettingsActionsComponent } from './notification-settings-actions/notification-settings-actions.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss']
})
export class NotificationSettingsComponent extends BaseComponent implements OnInit {

  configurationType?: ConfigurationType;
  notificationMethod?: NotificationMethod;
  severity?: Severity;
  status?: AlertStatus;
  partType: string;
  alertType?: AlertType;
  alert: string;
  modifiedDate?: Date;

  responsiveSubscription: Subscription;
  canCreateNotificationSetting = true;
  canViewLogs = true;
  source = new BaseServerDataSource();
  notificationSettings: INotificationSetting[] = [];
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      configurationType: {
        sort: true,
        title: 'Configuration Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => (ConfigurationType[value] || '').replace(/([A-Z])/g, ' $1').trim(),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Configuration Type');
        },
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: 'All',
            list: this.populateLookupAsFilterList(ConfigurationType),
          },
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
        title: 'Severity',
        type: 'custom',
        valuePrepareFunction: (value) => Severity[value],
        renderComponent: AlertSeverityCellComponent,
        onComponentInitFunction: (instance: AlertSeverityCellComponent) => {
          instance.setHeader('Severity');
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
        filter: true,
        sort: true,
        title: 'Part Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Part Type');
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
      modifiedDate: {
        sort: true,
        title: 'Modified Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: (value) => this.formatUSDate(value),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Modified Date');
        },
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: NotificationSettingsActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  recordsNumber = 5;
  isSmall = false;
  showFilters = false;

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private bsModelService: BsModalService,
    private responsiveService: ResponsiveService,
    private notificationService: NotificationService,
  ) {
    super(baseService);
  }

  onActionsInit(notificationSettingsActionsComponent: NotificationSettingsActionsComponent) {
    notificationSettingsActionsComponent.edit.subscribe((data: INotificationSetting) => {
      this.bsModelService.show<NotificationSettingComponent>(NotificationSettingComponent, {
        class: 'notification-setting-model'
      });
    });
  }

  ngOnInit(): void {
    this.recordsNumber = environment.recordsPerPage;
    this.onRecordsNumberChanged(this.recordsNumber);
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

    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };

    this.source.serviceCallBack = (params) => {
      const notificationParams = params as NotificationParams;

      if (this.isSmall) {
        notificationParams.configurationType = this.configurationType;
        notificationParams.notificationMethod = this.notificationMethod;
        notificationParams.status = this.status;
        notificationParams.alertType = this.alertType;
        notificationParams.alert = this.alert;
        notificationParams.severity = this.severity;
      }

      return this.notificationService.getNotificationsSettings(notificationParams);
    };

    this.source.setPaging(1, this.recordsNumber);
    this.source.refresh();
    // this.source.serviceCallBack = (params) => {
    //   return of({
    //     count: 2,
    //     data: this.notificationSettings,
    //     pageIndex: params.pageIndex,
    //     pageSize: params.pageSize,
    //   });
    // }
  }

  onReset() {
    if (this.isSmall) {

      this.configurationType = null;
      this.notificationMethod = null;
      this.partType = null;
      this.status = null;
      this.severity = null;
      this.alertType = null;

      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  onCreateNotificationSetting() {
    this.router.navigateByUrl('pages/predictive-maintenance/notification-setting');
  }

  onViewLogs() {
    this.router.navigateByUrl('pages/predictive-maintenance/notification-logs');
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
}

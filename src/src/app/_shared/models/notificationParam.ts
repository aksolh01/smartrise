import { AlertStatus } from './alertStatus';
import { AlertType } from './alertType';
import { BaseParams } from './baseParams';
import { ConfigurationType } from './configurationType';
import { NotificationMethod, Severity } from './predictiveMaintenanceEnums';

export class NotificationParams extends BaseParams {
  status?: AlertStatus;
  configurationType?: ConfigurationType;
  notificationMethod?: NotificationMethod;
  alertType?: AlertType;
  alert: string;
  severity?: Severity;
}

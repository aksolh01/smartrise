import { AlertType } from './alertType';
import { BaseParams } from './baseParams';
import { Severity } from './predictiveMaintenanceEnums';

export class AlertSettingsParams extends BaseParams {
    jobId: number;
  name: string;
  severity: Severity;
  type: AlertType;
  createdDate: Date;
  modifiedDate: Date;
  totalAlerts: number;
}

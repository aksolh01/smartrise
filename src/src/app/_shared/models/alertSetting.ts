import { AlertType } from './alertType';
import { Severity } from './predictiveMaintenanceEnums';

export interface IAlertSetting {
    name: string;
    severity: Severity;
    type: AlertType;
    createdDate: Date;
    modifiedDate: Date;
    totalAlerts: number;
    // Add area property
}

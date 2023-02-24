import { AlertType } from './alertType';
import { ConfigurationType } from './configurationType';
import { NotificationMethod, Severity } from './predictiveMaintenanceEnums';

export interface INotificationSetting {
    id: number;
    configurationType: ConfigurationType;
    notificationMethod: NotificationMethod;
    severity: Severity;
    partType: string;
    alertType: AlertType;
    alert: string;
    modifiedDate: Date;
}

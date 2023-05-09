import { AlertType } from './alertType';
import { NotificationMethod, Severity } from './predictiveMaintenanceEnums';

export interface INotificationLog {
    reciepients: string;
    notificationMethod: NotificationMethod;
    severity: Severity;
    partType: string;
    alertType: AlertType;
    alert: string;
    sentTime: Date;
}

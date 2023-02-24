import { PeriodType } from './periodType';
import { NotificationMethod, Severity, ThresholdType } from './predictiveMaintenanceEnums';

export interface IPartNotificationSetting {
    partType: string;
    severity: Severity;
    thresholdType: ThresholdType;
    counter: number;
    periodType: PeriodType;
    period: number;
    numberOfFaults: number;
    notificationMethod: NotificationMethod;
}

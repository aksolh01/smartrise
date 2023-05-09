import { PeriodType } from './periodType';
import { Severity, ThresholdType, NotificationMethod } from './predictiveMaintenanceEnums';

export interface IPrediction {
    partType: string;
    severity: Severity;
    thresholdType: ThresholdType;
    counter: number;
    periodType: PeriodType;
    period: number;
    numberOfFaults: number;
    notificationMethod: NotificationMethod;
}

import { PeriodType } from './periodType';
import { ThresholdType } from './predictiveMaintenanceEnums';

export interface IAlertSettingsPartType {
    name: string;
    thresholdType: ThresholdType;
    threshold: number;
    periodType: PeriodType;
    period: number;
    counter: number;
    faultsCount: number;
}

import { AlertType } from './alertType';
import { Severity } from './predictiveMaintenanceEnums';

export interface IAlertDetails {

    alertId: number;
    alertName: string;
    alertDescription: string;
    alertDate: Date;

    severity: Severity;
    alertType: AlertType;

    fault: string;
    faultCount: number;
    faultPossibleAffectedParts: string[];
    faultThreshold: number;

    alarm: string;
    alarmCount: number;
    alarmPossibleAffectedParts: string[];
    alarmThreshold: number;

    countBasedPart: string;
    countBasedVendor: string;
    nbOfLatchesOfTurns?: number;
    nbOfLatchesOfTurnsThreshold?: number;

    timeBasedPart: string;
    timeBasedVendor: string;
    nbOfDays?: number;
    nbOfDaysThreshold?: number;
}

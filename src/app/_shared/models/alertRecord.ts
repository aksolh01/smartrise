import { Severity } from './predictiveMaintenanceEnums';

export interface IAlertRecord {
    id: number;
    alertName: string;
    jobName: string;
    jobNumber: string;
    group: string;
    car: string;
    partType: string;
    part: string;
    severity: Severity;
    date: Date;
}

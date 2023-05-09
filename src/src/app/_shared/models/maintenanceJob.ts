import { AlertStatus } from './alertStatus';

export interface IMaintenanceJob {
    jobId: number;
    jobName: string;
    jobNumber: string;
    faultsCount: number;
    alertsCount: number;
    status: AlertStatus;
}


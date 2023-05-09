import { AlertStatus } from './alertStatus';
import { BaseParams } from './baseParams';
import { Part } from './part';

export class PartsParams extends BaseParams {
    group: string;
    car: string;
    jobName: string;
    jobNumber: string;
    part: Part;
    partType: string;
    alertsCount: number;
    alertsExceedHalfThreshold: boolean;
    alertsExceedThreshold: boolean;
    status: AlertStatus;
}

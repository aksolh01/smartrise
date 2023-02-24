import { AlertStatus } from './alertStatus';
import { Part } from './part';

export interface IPartReview {
    jobNumber: string;
    jobName: string;
    group: string;
    car: string;

    part: Part;
    partType: string;

    alertsCount: number;
    alertsExceedHalfThreshold: boolean;
    alertsExceedThreshold: boolean;
    status: AlertStatus;
}

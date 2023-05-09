import { BaseParams } from './baseParams';

export interface PaymentParams extends BaseParams {
    customer: string;
    jobName: string;
    jobNumber: string;
    amount?: number;
    balance?: number;
}

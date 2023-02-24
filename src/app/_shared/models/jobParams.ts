import { AlertStatus } from './alertStatus';
import { BaseParams } from './baseParams';

export class JobSearchParams extends BaseParams {
  epicorWaitingInfo?: boolean;
  customerName: string;
  jobName: string;
  jobNumber: string;
  grantedShipDate?: Date;
  createDate?: Date;
  shipDate?: Date;
  customerPONumber: string;
  actualShipDate?: Date;
}

export class JobSearchByCustomerParams extends JobSearchParams {
  customerId?: number;
}

export class PredictiveJobBaseParams extends BaseParams {
  jobName: string;
  jobNumber: string;
  alertsCount: number;
  status: AlertStatus;
}

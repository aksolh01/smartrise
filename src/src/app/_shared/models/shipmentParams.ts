import { BaseParams } from './baseParams';

export class ShipmentParams extends BaseParams {
  jobId?: number;
  shipmentType: string;
  shipDate?: Date;
  status: string;
  deliveryDate?: Date;
  account: string;
  jobName: string;
  jobNumber: string;
  isDropShipment?: Boolean;
  trackingNumber: string;
  installedBy: string;
  maintainedBy: string;
}

export class ShipmentByCustomerParams extends ShipmentParams {
  customerId?: number;
}

import { BaseParams } from './baseParams';

export class ShipmentParams extends BaseParams {
  jobId?: number;
  shipmentType: string;
  shipDate?: Date;
  status: string;
  deliveryDate?: Date;
  customerName: string;
  jobName: string;
  jobNumber: string;
  isDropShipment?: Boolean;
  trackingNumber: string;
}

export class ShipmentByCustomerParams extends ShipmentParams {
  customerId?: number;
}

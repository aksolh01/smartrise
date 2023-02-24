import { IShippingTrackingAction } from './shipping-tracking-action';
import { IAddress } from './address.model';
import { IEnumValue } from './enumValue.model';

export interface IShipment {
  id: number;
  trackingNumber: string;
  carrier: string;
  carrierWebsite: string;
  shipDate: Date;
  estimatedDeliverDate: string;
  status: string;
  shipAddress: string;
  isDropShipping: boolean;
  shipmentType: IEnumValue;
  shippingTrackingActions: IShippingTrackingAction[];
  partsDescription: string;
  shipmentActionsTimeZone: string;
}

export enum ShipmentStatus {
  // used by shippo
  Delivered = 1,
  // used by shippo
  Failure = 3,
  // used by shippo
  PreTransit = 5,
  // used by shippo
  Returned = 4,

  Shipped = 6,

  // used by shippo
  Transit = 2,
  // used by shippo
  Unknown = 0,
}

export enum ShipmentType {
  Controller = 1,
  HoistwayCable = 9,
  IsolationTransformer = 2,
  KellumGrips = 10,
  Motor = 3,
  Other = 7,
  Prewire = 4,
  RippleFilter = 5,
  TPV = 6,
  TravelerCable = 8
}

export interface IShipmentRecord {
  id: number;
  jobId: number;
  jobNumber: string;
  shipmentType: IEnumValue;
  shipDate?: Date;
  status?: ShipmentStatus;
  shipAddress: string;
  deliveryDate: Date;
  address: IAddress;
  addressStr: string;
  trackingNumber: string;
}

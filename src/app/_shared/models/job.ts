import { AlertStatus } from './alertStatus';
import { IEnumValue } from './enumValue.model';
import { IShipment } from './shipment';

export interface IJob {
  id: number;
  jobNumber: string;
  createDate: Date;
  orderDate: Date;
  shipDate: Date;
  passCode: number;
  needByDate: Date;
  epicorWaitingInfo?: boolean;
  shipments: IShipment[];
  resourceFiles: IJobResource[];
}

export interface IRecentJob {
  jobId: number;
  jobName: string;
  jobNumber: string;
  customerName: string;
}

export interface IJob {
  id: number;
  jobNumber: string;
  customerPONumber: string;
  jobName: string;
  customerId: number;
  customerName: string;
  createDate: Date;
  orderDate: Date;
  shipDate: Date;
  passCode: number;
  needByDate: Date;
  tempPasscode: string;
  epicorWaitingInfo?: boolean;
  grantedShipDate?: Date;
  actualShipDate?: Date;
  shipments: IShipment[];
  resourceFiles: IJobResource[];
}

export interface IJobResource {
  resourceType: IEnumValue;
  id: number;
  readyForDownload: boolean;
  canCreateANewRequest: boolean;
  customerMessage: string;
  smartriseMessage: string;
  status: string;
}

export interface IConsolidatedResource {
  resourceFileId: number;
  jobId: number;
  customerName: string;
  jobName: string;
  jobNumber: string;
  resourceType: IEnumValue;
  fileDescription: string;
  message: string;
  status: IEnumValue;
  canCreateANewRequest: boolean;
  readyForDownload: boolean;
}

export interface IConsolidatedResourceDetails {
  resourceFileId: number;
  jobId: number;
  customer: string;
  jobName: string;
  resourceTypeValue: string;
  fileDescription: string;
  message: string;
  status: IEnumValue;
}

// export enum ResourceType {
//   Drawing = 1,
//   Other = 31,
//   PowerReport = 35,
//   Prewire = 15,
//   Software = 10,
//   SupplementalDocuments = 5,
// }

export enum TaskStatus {
  Completed = 3,
  Failed = 4,
  InProgress = 2,
  Pending = 1,
}

export interface IJobFile {
  canCreateANewRequest: boolean;
  customerMessage: string;
  readyForDownload: boolean;
  resourceFileId: number;
  jobName: string;
  jobId: number;
  customerName: string;
  resourceType: IEnumValue;
  status: IEnumValue;
  fileDescription: string;
  hasUploadedFile: boolean;
  isDownloading: boolean;
}

export interface IPredictiveLookupJob {
  jobId: number;
  alertsCount: number;
  faultsCount: number;
  jobName: string;
  jobNumber: string;
  status: AlertStatus;
}

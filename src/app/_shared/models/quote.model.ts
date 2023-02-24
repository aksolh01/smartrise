import { BaseParams } from './baseParams';

export interface IOpenQuoteDetails {
  id: number;
  customer: string;
  customerId: number;
  jobName: string;
  quoteNumber: string;
  quoteCreated: Date;
  numberOfCars: number;
  controllerType: string;
  amount: number;
  contact: IOpenQuoteContact;
  isDeleted?: boolean;
  createdBy: string;
}

export interface IOpenQuote {
  id: number;
  customer: string;
  jobName: string;
  jobId: number;
  quoteNumber: string;
  quoteCreated: Date;
  numberOfCars: number;
  controllerType: string;
  amount: number;
  contact: IOpenQuoteContact;
}

export class QouteSearchParams extends BaseParams {
  customer: string;
  jobName: string;
  quoteNumber: string;
  controllerType: string;
  quoteCreated?: Date;
  contact: string;
  numberOfCars?: number;
  amount?: number;
  createdBy: string;
}

export class OpenQuoteByCustomerSearchParams extends QouteSearchParams {
  customerId?: number;
}

export class QuoteToolParams extends BaseParams {
  customer: string;
  jobName: string;
  controllerType: string;
  neededPriceBy?: Date;
  status?: string;
  creationDate?: Date;
  jobStatus: string;
}

export class SearchQuotesByCustomerParams extends QuoteToolParams {
  customerId: number;
}

export interface IOpenQuoteContact {
  id: number;
  name: string;
  email: string;
  fax: string;
  mobilePhone: string;
  phone: string;
  title: string;
}

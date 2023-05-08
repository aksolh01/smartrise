import { BaseParams } from './baseParams';

export interface InvoiceParams extends BaseParams {
    customer: string;
    jobName: string;
    jobNumber: string;
    amount?: number;
    balance?: number;
}

export interface AgedRecievablesSearchParams extends BaseParams {
    installedBy: string;
    maintainedBy: string;
    account: string;
    balance?: number;
    invoiceNumber: string;
    poNumbers: string;
    invoiceDate?: Date;
    dueDate?: Date;
    amount?: number;
    aged: string;
}

export interface AgedRecievablesByCustomerSearchParams extends AgedRecievablesSearchParams {
    customerId?: number;
}

export interface BillingInvoiceParams extends BaseParams {
    jobNumber: string;
    account: string;
    balance?: number;
    invoiceNumber: string;
    poNumbers: string;
    invoiceDate?: Date;
    dueDate?: Date;
    amount?: number;
    aged: string;
    maintainedBy: string;
    installedBy: string;
}

export interface BillingInvoiceByCustomerUserParams extends BillingInvoiceParams {
    customerId?: number;
}

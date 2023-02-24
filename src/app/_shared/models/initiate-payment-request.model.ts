export interface IInitiatePaymentRequest {
    invoices: IInvoiceInfo[];
    customerId: number;
}

export interface IInvoiceInfo {
    invoiceId: number;
    customerId: number;
    paymentAmount: number;
    invoiceNumber: string;
    pONumbers: string;
}

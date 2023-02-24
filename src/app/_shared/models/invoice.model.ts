export interface IInvoice {
    id: number;
    customer: string;
    jobName: string;
    jobNumber: string;
    amount: number;
    balance: number;
}

export interface IInvoiceDetails {
    id: number;
    customer: string;
    jobName: string;
    jobNumber: string;
    amount: number;
    balance: number;
    payments: IPayments[];
}

export interface IPayments {
    paymentAmount: number;
    dueDate: Date;
    paymentDate: Date;
}

import { IEnumValue } from './enumValue.model';

export interface IAgedInvoiceDetails {
    paypalPaymentTransactions: IPaymentTransaction[];
    stripePaymentTransactions: IPaymentTransaction[];
    id: number;
    customerId: number;
    customer: string;
    invoiceNumber: string;
    poNumbers: string;
    message: string;
    invoiceDate: Date;
    dueDate: Date;
    amount: number;
    balance: number;
    showPayPalMessage: boolean;
    showStripeMessage: boolean;
    paymentMessage: string;
}

export interface IPaymentTransaction {
    paymentNetworkReference: string;
    paymentAmount: string;
    paymentStatus: IEnumValue;
    paymentMethod: string;
    creditCardLastDigits: string;
}

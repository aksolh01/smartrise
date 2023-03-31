import { BaseParams } from './baseParams';
import { IEnumValue } from './enumValue.model';

export class BankAccountParams extends BaseParams {
    account: string;
    accountType: string;
    accountHolderName: string;
    bankName: string;
    status: string;
    last4: string;
    customerId?: number;
}

export interface IBankAccountDetails {
    id: number;
    accountType: string;
    accountHolderName: string;
    last4: string;
    status: IEnumValue;
    bankName: string;
    isDefault: boolean;
    customer: ICustomerForBankAccount;
}

export interface ICustomerForBankAccount {
    id: number;
    name: string;
}

export interface IBankAccount {
    id: number;
    accountType: string;
    accountHolderName: string;
    last4: string;
    status: IEnumValue;
    bankName: string;
}

export interface IActiveBankAccount {
    id: number;
    accountType: string;
    accountHolderName: string;
    last4: string;
    isDefault: boolean;
    bankName: string;
    selected: boolean;
}

export interface ILinkToken {
    expiration: Date;
    linkToken: string;
    requestId: string;
}

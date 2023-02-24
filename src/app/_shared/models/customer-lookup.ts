export interface ICustomerRecord {
    id: number;
    epicorCustomerNumber: number;
    epicorCustomerId: string;
    salesforceAccountId: string;
    name: string;
    email: string;
    fax: string;
    lastLogin?: Date;
    lastLoginStr: string;
    hasAdminAccount?: boolean;
    isDeleted: boolean;
    isFavorite: boolean;
}

export interface IRecentCustomer {
    id: number;
    name: string;
}

export interface IAccountLookup {
    id: number;
    name: string;
}

export interface ICustomerLookup {
    id: number;
    name: string;
}

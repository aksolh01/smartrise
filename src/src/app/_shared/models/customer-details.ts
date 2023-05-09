import { IAddress } from './address.model';
import { ICustomerAdminUser } from './user';

export interface ICustomerDetails {
    id: number;
    epicorCustomerNumber: number;
    epicorCustomerId: string;
    salesforceAccountId: string;
    name: string;
    email: string;
    phone: string;
    fax: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fullAddress: string;
    addressStr: string;
    customerType: string;
    lastLogin?: Date;
    hasAdminAccount?: boolean;
    isDeleted: boolean;
    salesRepresentative: ISalesRepresentative;
    address: IAddress;
    adminUsers: ICustomerAdminUser[];
}

export interface ISalesRepresentative {
    name: string;
    role: string;
    business: string;
    mobile: string;
    email: string;
}

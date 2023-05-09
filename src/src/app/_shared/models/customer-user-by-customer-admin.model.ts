import { BaseParams } from './baseParams';

export interface ICustomerUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accounts: ICustomerUserRolesResponse[];
}

export interface ICustomerUserRolesResponse {
    accountId: number;
    name: string;
    roles: string[];
}

export interface ICustomerUserPayload {
    userId: string;
    accounts: ICustomerUserRolesPayload[];
}

export interface ICustomerUserRolesPayload {
    accountId: number;
    roles: string[];
}

export interface ICustomerUserLookup {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    isDeactivated: boolean;
    twoFactorEnabled: boolean;
    roles: ICustomerUserRoleLookup[];
}

export interface ICustomerUserRoleLookup {
    name: string;
    displayName: string;
}

export class CustomerUsersParams extends BaseParams {
    firstName: string;
    lastName: string;
    email: string;
}

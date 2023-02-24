import { BaseParams } from './baseParams';

export interface IAccountUserResponse {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    accounts: IAccountUserRolesResponse[];
}

export interface IAccountUserRolesResponse {
    accountId: number;
    name: string;
    roles: string[];
}

export interface IAccountUserPayload {
    userId: string;
    accounts: IAccountUserRolesPayload[];
}

export interface IAccountUserRolesPayload {
    accountId: number;
    roles: string[];
}

export interface IAccountUserLookup {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    isDeactivated: boolean;
    twoFactorEnabled: boolean;
    roles: IAccountUserRoleLookup[];
}

export interface IAccountUserRoleLookup {
    name: string;
    displayName: string;
}

export class AccountUsersParams extends BaseParams {
    firstName: string;
    lastName: string;
    email: string;
    roles: string;
}

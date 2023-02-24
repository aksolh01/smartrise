export interface ICustomerUserBySmartriseResponse {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    roles: ICustomerUserBySmartriseRoleResponse[];
}

export interface ICustomerUserBySmartriseRoleResponse {
    name: string;
    displayName: string;
}

export interface ICustomerUserBySmartrisePayload {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    roles: ICustomerUserBySmartriseRolePayload[];
}

export interface ICustomerUserBySmartriseRolePayload {
    name: string;
    displayName: string;
}

export interface ICreateCustomerUserBySmartrisePayload {
    firstName: string;
    lastName: string;
    email: string;
    accountId: number;
    rolesNames: string[];
}

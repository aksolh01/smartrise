export interface ICustomerUser {
    rolesNames: string[];
    firstName: string;
    lastName: string;
    email: string;
}

export interface IAccountUserBySmartriseResponse {
    firstName: string;
    lastName: string;
    email: string;
    accounts: IAccountUserRolesBySmartriseResponse[];
}

export interface IAccountUserRolesBySmartriseResponse {
    accountId: number;
    roles: string[];
}

export interface IAccountUserBySmartriseView {
    firstName: string;
    lastName: string;
    email: string;
    accounts: IAccountUserRolesBySmartriseView[];
}

export interface IAccountUserRolesBySmartriseView {
    accountId: number;
    roles: string[];
}

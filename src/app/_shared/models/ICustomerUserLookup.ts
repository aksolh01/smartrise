import { ICustomerUserRoleLookup } from './ICustomerUserRoleLookup';


export interface ICustomerUserLookup {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    isDeactivated: boolean;
    twoFactorEnabled: boolean;
    emailConfirmed: boolean;
    roles: ICustomerUserRoleLookup[];
}

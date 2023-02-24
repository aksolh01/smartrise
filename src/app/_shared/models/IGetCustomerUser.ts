import { IGetCustomerUserRole } from './IGetCustomerUserRole';


export interface IGetCustomerUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    roles: IGetCustomerUserRole[];
}

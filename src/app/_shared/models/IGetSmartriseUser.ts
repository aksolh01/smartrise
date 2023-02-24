import { IGetSmartriseUserRole } from './IGetSmartriseUserRole';


export interface IGetSmartriseUser {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    emailConfirmed: boolean;
    roles: IGetSmartriseUserRole[];
}

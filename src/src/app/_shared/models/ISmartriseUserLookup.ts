import { ISmartriseUserRoleLookup } from './ISmartriseUserRoleLookup';


export interface ISmartriseUserLookup {
    id: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    isDeactivated: boolean;
    twoFactorEnabled: boolean;
    roles: ISmartriseUserRoleLookup[];
}

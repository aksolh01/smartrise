import { IUserProfileInfo } from './IUserProfileInfo';


export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    token: string;
    impersonationModeIsActivated: boolean;
    permissions: string[];
    roles: string[];
    accounts: IUserAccountLookup[];
    rolesPrivileges: string[];
    isSmartriseUser: boolean;
    userProfileInfo: IUserProfileInfo;
    is2StepVerificationRequired: boolean;
    twoStepVerificationActivated: boolean;
    warnUserAboutAccountLock: boolean;
    provider: string;
}

export interface IUserAccountLookup {
    accountId: number;
    name: string;
    permissions: string[];
    privileges: string[];
}

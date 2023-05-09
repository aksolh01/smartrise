import { IUserProfileInfo } from './IUserProfileInfo';


export interface IUser {
    email: string;
    firstName: string;
    lastName: string;
    primaryPhoneNumber?:number;
    secondaryPhoneNumber?:number;
    primaryEmailAddress?:string;
    secondaryEmailAddress?:string;
    companyName?:string;
    businessAddress?:string;
    city?:string;
    state?:string;
    zipcode?:string;
    country?:string;
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

export interface ISelectableAccountInfo {
    accountId: number;
    name: string;
}

import { IProfilePhoto } from './IProfilePhoto';

export interface IUserProfileInfo {
    title: string;
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
    zipCode?:string;
    country?:string;
    profilePhoto: IProfilePhoto;
    twoFactorAuthentication: boolean;
    canChangeTwoFactorAuthentication: boolean;
}

import { IProfilePhoto } from './IProfilePhoto';

export interface IUserProfileInfo {
    title: string;
    profilePhoto: IProfilePhoto;
    twoFactorAuthentication: boolean;
    canChangeTwoFactorAuthentication: boolean;
}

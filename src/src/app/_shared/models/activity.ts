import { IEnumValue } from './enumValue.model';

export interface IActivity {
    action: IEnumValue;
    objectType: IEnumValue;
    objectId: string;
    objectDisplayMember: string;
    userId: string;
    user: string;
    impersonationUserId: string;
    impersonationUser:  string;
    createdDate: Date;
}

import { BaseParams } from './baseParams';

export class ActivityParams extends BaseParams {
    action: string;
    objectType: string;
    objectDisplayMember: string;
    createdDate?: Date;
    userDisplayName: string;
    impersonationUserDisplayName: string;
    customerName: string;
    isSmartrise: boolean;
}

export class ActivitySearchByCustomerUser extends ActivityParams{
    customerId?: number;
}

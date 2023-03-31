import { BaseParams } from './baseParams';

export class CustomerUsersParams extends BaseParams {
    firstName: string;
    lastName: string;
    email: string;
    roles: string;
    customerId?: number;
}

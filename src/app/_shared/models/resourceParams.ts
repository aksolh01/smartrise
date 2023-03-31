import { BaseParams } from './baseParams';

export class ResourceParams extends BaseParams {
    jobName: string = '';
    account: string = '';
    customerMessage: string = '';
    resourceType: string = null;
    status: string;
    fileDescription = '';
    jobNumber = '';
    epicorWaitingInfo: any = null;
    orderDate: any = null;
    grantedShipDate: any = null;
    createDate: any = null;
    shipDate: any = null;
    message = '';
    hasUploadedFile?: boolean = null;
}

export class ResourceByCustomerUserParams extends ResourceParams {
    customerId?: number;
}

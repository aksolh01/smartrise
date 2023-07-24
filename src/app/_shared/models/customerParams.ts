import { BaseParams } from './baseParams';

export class CustomerParams extends BaseParams {
    hasAdministratorAccount?: boolean;
    hasLogin?: boolean;
    epicorCustomerId: string;
    name: string;
    phone: string;
    fax: string;
    lastLogin?: Date;
    favoriteCustomer?: boolean = true;
}

export class SearchCompanyInfoParams extends BaseParams {
    name: string;
    phone: string;
    fax: string;
    email: string;
  }

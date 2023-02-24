import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ICustomerDetails } from '../_shared/models/customer-details';
import { IAccountLookup, ICustomerLookup, ICustomerRecord, IRecentCustomer } from '../_shared/models/customer-lookup';
import { CustomerParams } from '../_shared/models/CustomerParams';
import { Pagination } from '../_shared/models/pagination';

@Injectable()
export class CustomerService {
  baseUrl = environment.apiUrl;
  emailSenderObs = new Subject<string>();

  constructor(
    private http: HttpClient) {

  }

  getCustomersPagedLookup(searchValue: string) {
    return this.http.post<IAccountLookup[]>(`${this.baseUrl}customer/lookup/paged`, {
      nameFilter: searchValue,
      pageSize: 20,
    });
  }

  getRecentCustomers() {
    return this.http.get<IRecentCustomer[]>(`${this.baseUrl}customer/recent`);
  }

  addToFavorite(customerId: number) {
    return this.http.post(`${this.baseUrl}customer/favorite/add/${customerId}`,
      { observe: 'response' })
      .pipe(
        map((response) => response),
      );
  }

  removeFromFavorite(customerId: number) {
    return this.http.post(`${this.baseUrl}customer/favorite/remove/${customerId}`,
      { observe: 'response' })
      .pipe(
        map((response) => response),
      );
  }

  getCustomersRecords() {
    return this.http.get<ICustomerRecord[]>(this.baseUrl + 'customer', { observe: 'response' })
      .pipe(
        map((response) => response.body),
      );
  }

  getCustomersLookup(filter: string) {
    return this.http.post<ICustomerLookup[]>(this.baseUrl + 'customer/lookup',
      { nameFilter: filter },
      { observe: 'response' })
      .pipe(
        map((response) => response.body),
      );
  }

  load(pageIndex: number, pageSize: number, search: string) {
    return this.http.post<Pagination<ICustomerRecord>>(this.baseUrl + 'customer/search',
      {
        pageSize,
        pageIndex,
        search,
      },
      { observe: 'response' })
      .pipe(
        map((response) => response.body),
      );
  }

  getCustomers(customerParams: CustomerParams) {

    // let params = new HttpParams();

    // params = params.append('sort', customerParams.sort);
    // params = params.append('pageIndex', customerParams.pageIndex.toString());
    // params = params.append('pageSize', customerParams.pageSize.toString());

    // if (customerParams.hasLogin != null) {
    //   params = params.append('hasLogin', customerParams.hasLogin.toString());
    // }
    // if (customerParams.hasAdministratorAccount != null) {
    //   params = params.append('hasAdministratorAccount', customerParams.hasAdministratorAccount.toString());
    // }
    // if (customerParams.name) {
    //   params = params.append('name', customerParams.name);
    // }

    return this.http
      .post<Pagination<ICustomerRecord>>(this.baseUrl + 'customer/search', customerParams, { observe: 'response' })
      .pipe(
        map((response) => response.body)
      );

    // return this.http.post<Pagination<ICustomerLookup>>(this.baseUrl + 'customer/search',
    // {
    //   pageSize: customerParams.pageSize,
    //   pageIndex: customerParams.pageNumber,
    //   search: customerParams.search,
    // },
    //  { observe: 'response' })
    //   .pipe(
    //     map((response) => {
    //       return response.body;
    //     }),
    //   );
  }

  getCustomer(id: number) {
    return this.http
      .get<ICustomerDetails>(this.baseUrl + 'customer/' + id.toString(), { observe: 'response' })
      .pipe(
        map((response) => {
          const result = response.body;
          result.adminUsers.forEach(o => o.customerIsDeleted = result.isDeleted);
          return result;
        })
      );
  }

  getCompayInfo() {
    return this.http
      .get<ICustomerDetails>(this.baseUrl + 'customer/companyinfo', { observe: 'response' })
      .pipe(
        map((response) => response.body)
      );
  }

  getCompayInfoByAccountId(accountId: number) {
    return this.http
      .get<ICustomerDetails>(`${this.baseUrl}customer/${accountId}/companyinfo`, { observe: 'response' })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
}

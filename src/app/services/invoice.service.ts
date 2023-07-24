import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IInvoiceInfo } from '../_shared/models/initiate-payment-request.model';
import { IInvoiceDetails } from '../_shared/models/invoice.model';
import {
  AgedRecievablesByCustomerSearchParams,
  AgedRecievablesSearchParams,
  BillingInvoiceByCustomerUserParams,
  BillingInvoiceParams as BillingInvoiceSearchParams,
  InvoiceParams,
} from '../_shared/models/invoiceParams.model';
import { IPagination } from '../_shared/models/pagination';

@Injectable()
export class InvoiceService {
  /**
   *
   */
  constructor(private httpClient: HttpClient) { }

  private get markedAsPay(): IInvoiceInfo[] {
    const _markedAsPayString = sessionStorage.getItem('markedAsPay');
    if (_markedAsPayString) {
      const _markedAsPay = JSON.parse(_markedAsPayString);
      return _markedAsPay;
    }
    const _array: IInvoiceInfo[] = [];
    sessionStorage.setItem('markedAsPay', JSON.stringify(_array));
    return _array;
  }

  getInvoices(invoiceParams: InvoiceParams) {
    const array = [
      {
        id: 1,
        customer: 'Customer 1',
        jobName: 'Job 1',
        jobNumber: 'Job Number',
        amount: 50,
        balance: 100,
      },
      {
        id: 2,
        customer: 'Customer 2',
        jobName: 'Job 2',
        jobNumber: 'Job Number',
        amount: 60,
        balance: 200,
      },
      {
        id: 3,
        customer: 'Customer 3',
        jobName: 'Job 3',
        jobNumber: 'Job Number',
        amount: 90,
        balance: 140,
      },
      {
        id: 4,
        customer: 'Customer 4',
        jobName: 'Job 4',
        jobNumber: 'Job Number',
        amount: 20,
        balance: 90,
      },
      {
        id: 5,
        customer: 'Customer 5',
        jobName: 'Job 5',
        jobNumber: 'Job Number',
        amount: 10,
        balance: 40,
      },
    ];
    const data = array.filter(
      (x) =>
        (invoiceParams.amount ? x.amount >= invoiceParams.amount : true) &&
        (invoiceParams.balance ? x.balance >= invoiceParams.balance : true) &&
        (invoiceParams.customer
          ? x.customer.indexOf(invoiceParams.customer) > -1
          : true) &&
        (invoiceParams.jobName
          ? x.jobName.indexOf(invoiceParams.jobName) > -1
          : true) &&
        (invoiceParams.jobNumber
          ? x.jobNumber.indexOf(invoiceParams.jobNumber) > -1
          : true)
    );
    return of({
      pageIndex: 0,
      pageSize: 5,
      count: 5,
      data,
    });
    //return this.httpClient.get<IPagination>('');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getInvoice(id: number): Observable<IInvoiceDetails> {
    return of({
      id: 1,
      customer: 'Customer 1',
      jobName: 'Job 1',
      jobNumber: 'Job Number 1',
      amount: 120,
      balance: 344,
      payments: [
        {
          paymentAmount: 20,
          dueDate: new Date(),
          paymentDate: new Date(),
        },
        {
          paymentAmount: 60,
          dueDate: new Date(),
          paymentDate: new Date(),
        },
        {
          paymentAmount: 40,
          dueDate: new Date(),
          paymentDate: new Date(),
        },
      ],
    });
  }

  getAgedRecievablesBySmartriseUser(params: AgedRecievablesSearchParams): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(environment.apiUrl + 'invoice/agedRecievables', params, { observe: 'body' })
      .pipe(map((response) => response));
  }

  searchAllAgedRecievablesBySmartriseUser(params: AgedRecievablesSearchParams): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(environment.apiUrl + 'invoice/agedRecievables/searchAll', params, { observe: 'body' })
      .pipe(map((response) => response));
  }

  getAgedRecievablesByCustomerUser(
    params: AgedRecievablesByCustomerSearchParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/customer/agedRecievables',
        params,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  searchAllAgedRecievablesByCustomerUser(
    params: AgedRecievablesByCustomerSearchParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/customer/agedRecievables/searchAll',
        params,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  getBillingInvoices(
    params: BillingInvoiceSearchParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/billingInvoices',
        params,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  searchAllBillingInvoices(params: BillingInvoiceSearchParams): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/billingInvoices/searchAll',
        params,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  getBillingInvoicesBuCustomerUser(
    params: BillingInvoiceByCustomerUserParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/customer/billingInvoices',
        params,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  searchAllBillingInvoicesBuCustomerUser(searchParameters: BillingInvoiceByCustomerUserParams): Observable<IPagination> {
    return this.httpClient
      .post<IPagination>(
        environment.apiUrl + 'invoice/customer/billingInvoices/searchAll',
        searchParameters,
        { observe: 'body' }
      )
      .pipe(map((response) => response));
  }

  getARInvoice(invoiceID: number) {
    return this.httpClient
      .get<any>(environment.apiUrl + `invoice/${invoiceID}`, {
        observe: 'body',
      })
      .pipe(map((response) => response));
  }

  holdToBePaidInvoices(markedAsPay: any[]) {
    sessionStorage.setItem('markedAsPay', JSON.stringify(markedAsPay));
  }

  releaseToBePaidInvoices() {
    return this.markedAsPay;
  }

  deleteToBePaidInvoices() {
    sessionStorage.removeItem('markedAsPay');
  }

  removeInvoiceByIndex(indexOfInvoice: number) {
    const _markedAsPayString = sessionStorage.getItem('markedAsPay');
    if (_markedAsPayString) {
      const _markedAsPay = JSON.parse(_markedAsPayString);
      _markedAsPay.splice(indexOfInvoice, 1);
      sessionStorage.setItem('markedAsPay', JSON.stringify(_markedAsPay));
    }
  }
}

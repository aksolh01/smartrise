import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { Pagination } from '../_shared/models/pagination';
import {
  IOpenQuote,
  IOpenQuoteDetails,
  OpenQuoteByCustomerSearchParams,
  QouteSearchParams as QuoteSearchParams,
} from '../_shared/models/quote.model';

@Injectable()
export class QuoteService {
  baseUrl: string = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getOpenQuotesBySmartriseUser(openQuoteParams: QuoteSearchParams) {
    return this.httpClient
      .post<Pagination<IOpenQuote>>(
        this.baseUrl + 'openQuotes/smartrise/search',
        openQuoteParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getOpenQuotesByCustomerUser(
    openQuoteParams: OpenQuoteByCustomerSearchParams
  ) {
    return this.httpClient
      .post<Pagination<IOpenQuote>>(
        this.baseUrl + 'openQuotes/customer/search',
        openQuoteParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  getControllerTypes() {
    return this.httpClient
      .get<IEnumValue[]>(
        this.baseUrl + 'openQuotes/enumeration/controllerTypes'
      )
      .pipe(map((response) => response));
  }

  getOpenQuote(quoteId: number) {
    return this.httpClient.get<IOpenQuoteDetails>(
      this.baseUrl + 'openQuotes/' + quoteId.toString()
    );
  }
}

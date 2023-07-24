import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class SearchService {

    baseUrl = environment.apiUrl;
    private _search = new Subject<string>();
    private _resetSearch = new Subject();
    private resultSetReady = new Subject<{resultSet: 'Jobs' | 'Invoices' | 'BankAccounts' | 'QuotesCreatedByAccount' | 'QuotesCreatedBySmartrise' | 'UserActivities' | 'SmartriseUsers' | 'StatementOfAccounts' | 'AccountUsers'  | 'Shipments' | 'JobFiles' | 'Accounts' | 'CustomerUsers' | 'CompanyInfo', recordsCount: number}>();
    resetSearch$ = this._resetSearch.asObservable();
    resultSetReady$ = this.resultSetReady.asObservable();
    search$ = this._search.asObservable();

    constructor(private httpClient: HttpClient) {

    }

    search(key: string) {
        this._search.next(key);
    }

    notifyResultSetReady(resultSet: 'Jobs' | 'Invoices' | 'BankAccounts' | 'QuotesCreatedByAccount' | 'QuotesCreatedBySmartrise' | 'UserActivities' | 'SmartriseUsers' | 'StatementOfAccounts' | 'AccountUsers' | 'Shipments' | 'JobFiles' | 'Accounts' | 'CustomerUsers' | 'CompanyInfo', recordsCount: number) {
        this.resultSetReady.next({ resultSet: resultSet, recordsCount: recordsCount });
    }

    resetSearch() {
    }

    clearSearch() {
        this._resetSearch.next(null);
    }
}
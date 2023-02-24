import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { BankAccountParams, IActiveBankAccount, IBankAccount, IBankAccountDetails, ILinkToken } from '../_shared/models/bank-account.model';
import { IUpdateBankAccountDto } from '../_shared/models/banks/dtos';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { IPagination, Pagination } from '../_shared/models/pagination';

@Injectable()
export class BankAccountService {


    baseUrl: string = environment.apiUrl;

    constructor(private httpClient: HttpClient) {

    }

    addAccountsInfo(arg: any) {
        return this.httpClient
            .post(this.baseUrl + `bankAccounts/plaid/add`, arg, { observe: 'response' })
            .pipe(
                map((response) => response)
            );
    }

    setDefault(id: any) {
        return this.httpClient
            .post(this.baseUrl + `customerAccounting/bankAccounts/${id}/default`, { observe: 'response' })
            .pipe(
                map((response) => response)
            );
    }

    preVerifyBankAccount(id: number) {
        return this.httpClient
            .post<any>(this.baseUrl + 'customerAccounting/bankAccounts/preverify/' + id.toString(), {
                observe: 'response',
            })
            .pipe(
                map((response) => response)
            );
    }

    verifyBankAccount(value: any) {
        return this.httpClient
            .post(this.baseUrl + 'customerAccounting/bankAccounts/verify', value, {
                observe: 'response',
            })
            .pipe(
                map((response) => response.body)
            );
    }

    createBankAccount(value: any) {
        return this.httpClient
            .post(this.baseUrl + 'customerAccounting/bankAccounts/create', value, {
                observe: 'response',
            })
            .pipe(
                map((response) => response.body)
            );
    }

    getBankAccount(bankAccountId: number): Observable<IBankAccountDetails> {
        return this.httpClient.get<IBankAccountDetails>(this.baseUrl + 'customerAccounting/bankAccounts/' + bankAccountId.toString());
    }

    getAccountStatuses(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'customerAccounting/bankAccounts/enumeration/statuses')
            .pipe(
                map((response) => response),
            );
    }

    getBankAccounts(bankAccountParams: BankAccountParams): Observable<IPagination> {
        return this.httpClient.post<Pagination<IBankAccount>>(this.baseUrl + 'customerAccounting/bankAccounts/search', bankAccountParams, { observe: 'response' })
            .pipe(map(response => response.body));
    }

    getActiveBankAccounts(customerId: number) {
        return this.httpClient.get<IActiveBankAccount[]>(`${this.baseUrl}customerAccounting/bankAccounts/active/${customerId}`)
            .pipe(
                map((response) => response),
            );
    }

    createLink() {
        return this.httpClient.get<ILinkToken>(this.baseUrl + 'bankAccounts/plaid/token/create')
            .pipe(
                map((response) => response),
            );
    }

    updateBankAccount(updateBankAccount: IUpdateBankAccountDto) {
        return this.httpClient.put(this.baseUrl + 'customerAccounting/bankAccounts/update', updateBankAccount)
            .pipe(
                map((response) => response),
            );
    }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ICreditCard } from '../_shared/models/credit-card.model';

@Injectable()
export class BillingService {
    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {

    }

    createCreditCard(creditCard: ICreditCard) {
        return this.httpClient.post(this.baseUrl + 'onlinePayment/creditCard', creditCard);
    }
}

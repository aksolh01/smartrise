import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IInitiatePaymentRequest } from '../_shared/models/initiate-payment-request.model';
import { IInitiatePaymentResponse } from '../_shared/models/initiate-payment-respponse.model';
import { PaymentParams } from '../_shared/models/paymentParams.model';

@Injectable({ providedIn: 'root' })
export class PaymentService {


    constructor(private httpClient: HttpClient) {
    }

    initiatePaypalPayment(params: IInitiatePaymentRequest) {
        return this.httpClient.post<IInitiatePaymentResponse>(environment.apiUrl + 'payments/initiate/paypal', params, {
            observe: 'body'
        });
    }

    chargeStripeACHPayment(value: any) {
        return this.httpClient.post<any>(environment.apiUrl + 'payments/stripe/charge', value, {
            observe: 'body'
        });
    }

    getPayments(invoiceParams: PaymentParams) {
        const array = [
            {
                customer: 'Customer 1',
                jobName: 'Job 1',
                jobNumber: 'Job Number',
                amount: 50,
                balance: 100,
            },
            {
                customer: 'Customer 2',
                jobName: 'Job 2',
                jobNumber: 'Job Number',
                amount: 60,
                balance: 200,
            },
            {
                customer: 'Customer 3',
                jobName: 'Job 3',
                jobNumber: 'Job Number',
                amount: 90,
                balance: 140,
            },
            {
                customer: 'Customer 4',
                jobName: 'Job 4',
                jobNumber: 'Job Number',
                amount: 20,
                balance: 90,
            },
            {
                customer: 'Customer 5',
                jobName: 'Job 5',
                jobNumber: 'Job Number',
                amount: 10,
                balance: 40,
            },
        ];
        const data = array.filter(x =>
            (invoiceParams.amount ? x.amount >= invoiceParams.amount : true) &&
            (invoiceParams.balance ? x.balance >= invoiceParams.balance : true) &&
            (invoiceParams.customer ? x.customer.indexOf(invoiceParams.customer) > -1 : true) &&
            (invoiceParams.jobName ? x.jobName.indexOf(invoiceParams.jobName) > -1 : true) &&
            (invoiceParams.jobNumber ? x.jobNumber.indexOf(invoiceParams.jobNumber) > -1 : true)
        );
        return of({
            pageIndex: 0,
            pageSize: 5,
            count: 5,
            data,
        });
    }

    checkIfTokenLinkedToUser(token: string) {
        return this.httpClient.get(`${environment.apiUrl}payments/paypalTokens/${token}/validate`);
    }
}

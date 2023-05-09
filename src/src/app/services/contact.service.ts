import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class ContactService {
    baseUrl: any;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiUrl;
    }

    getCustomerContacts(customerId: number) {
        return this.http
            .get<any[]>(`${this.baseUrl}contacts/customer/${customerId}`)
            .pipe(map(response => response));
    }
}

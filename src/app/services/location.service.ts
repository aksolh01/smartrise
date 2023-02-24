import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable()
export class LocationService {

    constructor(private httpClient: HttpClient) {

    }

    getCountries() {
        return this.httpClient.get<any[]>(`${environment.apiUrl}location/countries`);
    }

    getStates(country: string) {
        return this.httpClient.get<any[]>(`${environment.apiUrl}location/${country}/states`);
    }
}

import { HttpClient } from "@angular/common/http";

export class GeoLocationService {

    constructor(private httpClient: HttpClient) {

    }


    validationZipCode(zipCode: string) {
        return this.httpClient.get('');
    }
}
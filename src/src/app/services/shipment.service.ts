import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { Pagination } from '../_shared/models/pagination';
import { IShipmentRecord } from '../_shared/models/shipment';
import { ShipmentByCustomerParams, ShipmentParams } from '../_shared/models/shipmentParams';

@Injectable()
export class ShipmentService {

    baseUrl: string = environment.apiUrl;

    constructor(private httpClient: HttpClient) {
    }

    getShipmentsBySmartriseUser(shipmentParams: ShipmentParams) {
        return this.httpClient.post<Pagination<IShipmentRecord>>(this.baseUrl + 'shipment/smartrise/search', shipmentParams, { observe: 'response' })
            .pipe(map(response => {
                return response.body;
            }));
    }

    getShipmentsByCustomerUser(shipmentParams: ShipmentByCustomerParams) {
        return this.httpClient.post<Pagination<IShipmentRecord>>(this.baseUrl + 'shipment/customer/search', shipmentParams, { observe: 'response' })
            .pipe(map(response => {
                return response.body;
            }));
    }

    getShipmentTypes(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'shipment/enumeration/shipmentTypes')
            .pipe(
                map((response) => {
                    return response;
                }),
            );
    }

    getShipmentStatuses(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'shipment/enumeration/shipmentStatuses')
            .pipe(
                map((response) => {
                    return response;
                }),
            );
    }
}

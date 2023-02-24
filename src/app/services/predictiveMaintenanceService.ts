import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertStatus } from '../_shared/models/alertStatus';
import { IPagination } from '../_shared/models/pagination';

@Injectable()
export class PredictiveMaintenanceService {

    getFilterData() {
        const filterDataAsString = localStorage.getItem('filterData');
        const filterData = JSON.parse(filterDataAsString);
        return filterData;
    }

    setFilterData(filterData: any) {
        const filterDataAsString = JSON.stringify(filterData);
        localStorage.setItem('filterData', filterDataAsString);
    }

    getAlerts(): Observable<IPagination> {
        return of({
            pageIndex: 1,
            pageSize: 10,
            count: 10,
            data: [
                {
                    id: 1,
                    alertName: 'Alert 1',
                    car: 'Car 1',
                    partType: 'Contactor',
                    part: 'Contactor',
                    status: AlertStatus.Alarm,
                },
                {
                    id: 2,
                    alertName: 'Alert 2',
                    car: 'Car 1',
                    partType: 'Braker',
                    part: 'Braker',
                    status: AlertStatus.Alarm,
                },
            ]
        });
    }
}

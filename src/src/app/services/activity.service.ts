import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { IActivity } from '../_shared/models/activity';
import { ActivityParams, ActivitySearchByCustomerUser } from '../_shared/models/activityParams';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { Pagination } from '../_shared/models/pagination';

@Injectable()
export class ActivityService {
    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {

    }

    getActivitiesBySmartriseUser(activityParams: ActivityParams) {
        return this.httpClient.post<Pagination<IActivity>>(this.baseUrl + 'useractivity/smartrise/search', activityParams, { observe: 'response' })
            .pipe(map(response => response.body));
    }

    getActivitiesByCustomerUser(activityParams: ActivitySearchByCustomerUser) {
        return this.httpClient.post<Pagination<IActivity>>(this.baseUrl + 'useractivity/customer/search', activityParams, { observe: 'response' })
            .pipe(map(response => response.body));
    }

    getObjectTypes(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'useractivity/enumeration/objectTypes')
            .pipe(
                map((response) => response),
            );
    }

    getActions(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'useractivity/enumeration/actions')
            .pipe(
                map((response) => response),
            );
    }
}

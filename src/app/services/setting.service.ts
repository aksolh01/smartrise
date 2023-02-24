import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ISystemSettings, IBusinessSettings } from '../_shared/models/settings';

@Injectable({providedIn: 'root'})
export class SettingService {
    baseUrl = environment.apiUrl;

    constructor(private httpClient: HttpClient) {
    }

    getSystemSettings() {
        return this.httpClient
            .get<ISystemSettings>(this.baseUrl + 'setting/system')
            .pipe(
                    map((response) => response
                )
            );
    }

    updateSystemSettings(systemSetting: ISystemSettings) {
        return this.httpClient
            .put(this.baseUrl + 'setting/system', systemSetting)
            .pipe(
                    map((response) => response
                )
            );
    }

    getBusinessSettings() {
        return this.httpClient
        .get<IBusinessSettings>(this.baseUrl + 'setting/business')
        .pipe(
                map((response) => response
            )
        );
    }

    updateBusinessSettings(businessSetting: IBusinessSettings) {
        return this.httpClient
        .put(this.baseUrl + 'setting/business', businessSetting)
        .pipe(
                map((response) => response
            )
        );
    }
}

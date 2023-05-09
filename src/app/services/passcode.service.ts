import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { environment } from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PasscodeService {
    baseUrl: string = environment.apiUrl;

    constructor(private http: HttpClient) {

    }

    uploadConfigFile(file: File) {
        const headers = new HttpHeaders();
        const formData = new FormData();
        formData.append('file', file);

        return this.http
            .post(
                this.baseUrl + 'jobs/configfile/upload/',
                formData,
                {
                    headers: headers,
                    params: {
                    },
                    reportProgress: true,
                    observe: 'events',
                }
            ).pipe(
                map((response) => {
                    return response;
                }),
            );
    }

    getPasscode(jobId: number) {
        return this.http.get<any>(`${this.baseUrl}jobs/passcode/${jobId}`);
    }
}
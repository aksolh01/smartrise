import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";
import { Observable, of } from "rxjs";
import { IPasscode, PasscodeCallResponse } from "../_shared/models/passcode.model";

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

    getPasscode(jobId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}jobs/passcode/${jobId}`).pipe(
            catchError(() => {
                return of(new PasscodeCallResponse(false, "Unable to load passcodes", null));
            })
        );
    }
}
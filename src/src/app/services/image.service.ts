import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class ImageService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  getImage(photoGuid: string): Observable<Blob> {
    return this.httpClient.get(this.baseUrl + 'account/profile/downloadprofilephoto/' + photoGuid, { responseType: 'blob' });
  }
}

import { Injectable } from "@angular/core";
import { PartSearchParams } from "../_shared/models/part.model";
import { HttpClient } from "@angular/common/http";
import { IPagination } from "../_shared/models/pagination";
import { environment } from "../../environments/environment";

@Injectable()
export class PartService {
  
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {

  }

  getParts(partParams: PartSearchParams) {
    return this.httpClient.post<IPagination>(`${this.baseUrl}parts/search`, partParams, { observe: 'body' });
  }

  getPart(partId: number) {
    return this.httpClient.get<IPagination>(`${this.baseUrl}parts/${partId}`);
  }
}

@Injectable()
export class PartTabService {
  setSelectedTab(PartDetails: any) {
    throw new Error('Method not implemented.');
  }

}
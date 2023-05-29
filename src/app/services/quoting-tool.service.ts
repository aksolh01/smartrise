import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DownloadProgressComponent } from '../_shared/components/download-progress/download-progress.component';
import { ProgressStatusEnum } from '../_shared/models/download.models';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { IPagination, Pagination } from '../_shared/models/pagination';
import { IQuoteEnums } from '../_shared/models/quote-job.model';
import {
  QuoteToolParams,
  SearchQuotesByCustomerParams,
} from '../_shared/models/quote.model';
import { IQuoteDetailsResponse } from '../_shared/models/quotes/quote-details-response-i.mode';
import { QuoteDetailsResponse } from '../_shared/models/quotes/quote-details-response.mode';
import {
  ICarResponse,
  IQuoteResponse,
} from '../_shared/models/quotes/quote-response-i.model';
import {
  CarResponse,
  QuoteResponse,
} from '../_shared/models/quotes/quote-response.model';
import { ISaveQuotePayload } from '../_shared/models/quotes/save-quote-i.model';
import { ISubmitQuotePayload } from '../_shared/models/quotes/submit-quote-i.model';

@Injectable()
export class QuotingToolService {
  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private modalService: BsModalService
  ) { }

  getRfq(quoteId: number) {
    return this.httpClient
      .get<any>(this.baseUrl + `quotes/${quoteId}/rfq`)
      .pipe(map((response) => response));
  }

  cloneQuote(quoteId: number, jobName: string) {
    return this.httpClient.post<any>(this.baseUrl + `quotes/${quoteId}/clone`, {
      jobName: jobName
    })
      .pipe(
        map((response) => {
          return response;
        }),
      );
  }


  getQuoteHistory(id: any) {
    return this.httpClient
      .get<any>(this.baseUrl + `quotes/${id}/history`)
      .pipe(map((response) => response));
  }

  getEnums(customerId: number | null) {
    const localCustomerId = customerId == null ? 0 : customerId;

    return this.httpClient
      .get<IQuoteEnums>(
        `${this.baseUrl}quotes/enumeration/all/${localCustomerId}`
      )
      .pipe(map((response) => response));
  }

  getDefaultQuote() {
    return this.httpClient
      .get<ICarResponse>(this.baseUrl + 'quotes/defaultCar', {
        observe: 'response',
      })
      .pipe(map((response) => new CarResponse(response.body)));
  }

  getQuoteDetails(quoteId: string): Observable<QuoteDetailsResponse> {
    if (!quoteId)
      return of(null);

    return this.httpClient
      .get<IQuoteDetailsResponse>(this.baseUrl + 'quotes/get/' + quoteId, {
        observe: 'response',
      })
      .pipe(map((response) => new QuoteDetailsResponse(response.body)));
  }

  getQuote(id: number): Observable<IQuoteResponse> {
    return this.httpClient
      .get<IQuoteResponse>(this.baseUrl + 'quotes/' + id, {
        observe: 'response',
      })
      .pipe(map((response) => new QuoteResponse({ ...response.body })));
  }

  getDoors() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/doors')
      .pipe(map((response) => response));
  }

  getControllerLayouts() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/controllerLayouts')
      .pipe(map((response) => response));
  }

  getJobStatuses() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/jobStatuses')
      .pipe(map((response) => response));
  }

  getNemaRatings() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/nemaRatings')
      .pipe(map((response) => response));
  }

  getNemaLocations() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/nemaLocations')
      .pipe(map((response) => response));
  }

  uploadAttachments(files: File[], quoteId: number) {
    const formData = new FormData();
    files.forEach((f) => {
      formData.append('file', f);
    });

    return this.httpClient
      .post(
        this.baseUrl + `quoteAttachments/quote/upload/${quoteId}`,
        formData,
        {
          observe: 'body',
        }
      )
      .pipe(map((response) => response));
  }

  deleteAttachments(attachments: number[]) {
    return this.httpClient
      .post(this.baseUrl + `quoteAttachments/quote/delete`, {
        iDs: attachments,
      })
      .pipe(map((response) => response));
  }

  getStatuses() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/statuses')
      .pipe(map((response) => response));
  }

  getGroups() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/groups')
      .pipe(map((response) => response));
  }

  getSmartConnects() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/smartConnects')
      .pipe(map((response) => response));
  }

  getStarters() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/starters')
      .pipe(map((response) => response));
  }

  getTravelerCables() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/travelerCables')
      .pipe(map((response) => response));
  }

  getHoistwayCables() {
    return this.httpClient
      .get<IEnumValue[]>(this.baseUrl + 'quotes/enumeration/hoistwayCables')
      .pipe(map((response) => response));
  }

  searchQuotesBySmartriseUsers(
    quoteParams: QuoteToolParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<Pagination<any>>(
        this.baseUrl + 'quotes/smartrise/search',
        quoteParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  searchQuotesByCustomerUsers(
    quoteParams: SearchQuotesByCustomerParams
  ): Observable<IPagination> {
    return this.httpClient
      .post<Pagination<any>>(
        this.baseUrl + 'quotes/customer/search',
        quoteParams,
        { observe: 'response' }
      )
      .pipe(map((response) => response.body));
  }

  submitQuote(quote: ISubmitQuotePayload) {
    return this.httpClient
      .post(this.baseUrl + 'quotes/submit', quote, { observe: 'response' })
      .pipe(map((response) => response.body));
  }

  createQuote(quote: any) {
    return this.httpClient
      .post(this.baseUrl + 'quotes/create', quote, { observe: 'response' })
      .pipe(map((response) => response.body));
  }

  saveQuote(quote: ISaveQuotePayload) {
    return this.httpClient
      .post(this.baseUrl + 'quotes/save', quote, { observe: 'response' })
      .pipe(map((response) => response.body));
  }

  prePreviewAttachment(attachmentId: number): any {
    return this.httpClient
      .get(`${this.baseUrl}quoteAttachments/quote/pre-preview/${attachmentId}`)
      .pipe(map((response) => response));
  }

  previewAttachment(token: string) {
    const a = document.createElement('a');
    a.download = 'test';
    a.href = `${this.baseUrl}quoteAttachments/quote/preview/${token}`;
    a.target = '_blank';
    a.click();
  }

  preDownloadAttachment(attachmentId: number) {
    return this.httpClient
      .get(`${this.baseUrl}quoteAttachments/quote/pre-download/${attachmentId}`)
      .pipe(map((response) => response));
  }

  downloadAttachment(attachmentId: number, showUI: boolean = false) {
    const delegate = this.httpClient.get(
      this.baseUrl + `quoteAttachments/quote/download/${attachmentId}`,
      {
        observe: 'events',
        responseType: 'blob',
        reportProgress: true,
      }
    );
    const statusEvent = new EventEmitter<any>();
    setTimeout(() => {
      let modalRef: BsModalRef;
      const sub: Subscription = delegate.subscribe(
        (response) => {
          switch (response.type) {
            case HttpEventType.DownloadProgress:
              const percentage = Math.round(
                (response.loaded / response.total) * 100
              );
              if (modalRef?.content?.progress !== undefined) {
                modalRef.content.progress = percentage;
              }
              statusEvent.next({
                status: ProgressStatusEnum.IN_PROGRESS,
                percentage,
              });
              break;
            case HttpEventType.Response:
              this.modalService.hide();
              const fileName = this._getFileNameFromHttpResponse(response);
              statusEvent.next({ status: ProgressStatusEnum.COMPLETE });
              const downloadedFile = new Blob([response.body], {
                type: response.body.type,
              });
              this.createDownloadAttachmentUserActivity(attachmentId);
              this._createLinkForDownload(fileName, downloadedFile);
              break;
          }
        },
        (error) => {
          this.modalService.hide();
          statusEvent.next({ status: ProgressStatusEnum.ERROR, error });
          sub?.unsubscribe();
        }
      );
      if (showUI) {
        modalRef = this.modalService.show<DownloadProgressComponent>(
          DownloadProgressComponent,
          {
            initialState: {
              progress: 0,
            },
          }
        );
        modalRef.onHide.subscribe(() => {
          sub?.unsubscribe();
          statusEvent.complete();
        });
      }
    });
    return statusEvent;
  }

  createDownloadAttachmentUserActivity(attachmentId: number) {
    const subscribion = this.httpClient
      .get(
        this.baseUrl +
        'quoteAttachments/quote/useractivity-downloadfile/' +
        attachmentId.toString(),
        {
          observe: 'body',
        }
      )
      .subscribe(() => {
        subscribion.unsubscribe();
      });
  }

  downloadRfqReport(quoteId: number, showUI: boolean = false) {
    const statusEvent = new EventEmitter<any>();
    const delegate = this.httpClient.get(this.baseUrl + `quotes/${quoteId}/download`,
      {
        observe: 'events',
        responseType: 'blob',
        reportProgress: true,
      }
    );

    setTimeout(() => {
      let modalRef: BsModalRef;
      const sub: Subscription = delegate.subscribe((response) => {
        switch (response.type) {
          case HttpEventType.DownloadProgress:
            const percentage = Math.round(
              (response.loaded / response.total) * 100
            );
            if (modalRef?.content?.progress !== undefined) {
              modalRef.content.progress = percentage;
            }
            statusEvent.next({
              status: ProgressStatusEnum.IN_PROGRESS,
              percentage,
            });
            break;
          case HttpEventType.Response:
            modalRef?.hide();
            const fileName = this._getFileNameFromHttpResponse(response);
            statusEvent.next({ status: ProgressStatusEnum.COMPLETE });
            const downloadedFile = new Blob([response.body], {
              type: response.body.type,
            });
            this.createDownloadFileUserActivity(quoteId);
            this._createLinkForDownload(fileName, downloadedFile);
            break;
        }
      },
        (error) => {
          modalRef?.hide();
          statusEvent.next({ status: ProgressStatusEnum.ERROR, error });
          sub?.unsubscribe();
        }
      );
      if (showUI) {
        modalRef = this.modalService.show<DownloadProgressComponent>(
          DownloadProgressComponent,
          {
            initialState: {
              progress: 0,
            },
          }
        );
        modalRef.onHide.subscribe(() => {
          sub?.unsubscribe();
          statusEvent.complete();
        });
      }
    });
    return statusEvent;
  }

  createDownloadFileUserActivity(quoteId: number) {
    const subscribion = this.httpClient
      .get(
        this.baseUrl + 'quotes/useractivity-downloadfile/' + quoteId.toString(),
        {
          observe: 'body',
        }
      )
      .subscribe(() => {
        subscribion.unsubscribe();
      });
  }

  private _createLinkForDownload(fileName: string, downloadedFile: Blob) {
    const a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
  }

  private _getFileNameFromHttpResponse(httpResponse: HttpResponse<any>) {
    const contentDispositionHeader = httpResponse.headers.get(
      'Content-Disposition'
    );
    const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
  }
}

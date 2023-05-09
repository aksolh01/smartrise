import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { DownloadProgressComponent } from '../_shared/components/download-progress/download-progress.component';
import { ProgressStatusEnum } from '../_shared/models/download.models';
import { IEnumValue } from '../_shared/models/enumValue.model';
import { IConsolidatedResource, IJobFile, IJobResource } from '../_shared/models/job';
import { Pagination } from '../_shared/models/pagination';
import { IUploadFilesResponse } from '../_shared/models/resource';
import { ResourceByCustomerUserParams, ResourceParams } from '../_shared/models/resourceParams';

@Injectable()
export class ResourceService {

    baseUrl = environment.apiUrl;
    downloadResourceSub: Subscription;
    constructor(private httpClient: HttpClient, private modalService: BsModalService) {
    }

    createDownloadFileUserActivity(resourceFileId: number) {
        // useractivity-downloadfile
        const subscribion = this.httpClient.get(this.baseUrl + 'resources/useractivity-downloadfile/' + resourceFileId.toString(), {
            observe: 'body',
        }).subscribe(() => {
            subscribion.unsubscribe();
        });

    }

    validateDownloadResource(resourceFileId: number) {
        return this.httpClient
            .get(this.baseUrl + 'resources/validateDownload/' + resourceFileId.toString());
    }

    downloadResourceFile(
        resourceFileId: number,
        callbacks: {
            startCallback?: any;
            errorCallback?: any;
            successCallBack?: any;
            progressCallBack?: any;
            finallyCallback?: any;
        },
        //This flag indicates whether to show the download progress modal by default
        //or not.
        showUI: boolean = false
    ) {
        const headers = new HttpHeaders();

        if (callbacks?.startCallback) {
            callbacks.startCallback({ status: ProgressStatusEnum.START });
        }

        let modalRef: BsModalRef;
        if (showUI) {
            modalRef = this.modalService.show<DownloadProgressComponent>(
                DownloadProgressComponent,
                {
                    initialState: {
                        progress: 0
                    },
                }
            );
            modalRef.onHide.subscribe(() => {
                this.downloadResourceSub?.unsubscribe();
                if (callbacks?.finallyCallback) {
                    callbacks?.finallyCallback();
                }
            });
        }

        this.downloadResourceSub = this.httpClient.get(this.baseUrl + 'resources/download/' + resourceFileId.toString(), {
            observe: 'events',
            headers,
            responseType: 'blob',
            reportProgress: true,
        }).subscribe(response => {
            switch (response.type) {
                case HttpEventType.DownloadProgress:
                    const percentage = Math.round((response.loaded / response.total) * 100);

                    if (modalRef?.content?.progress !== undefined) {
                        modalRef.content.progress = percentage;
                    }

                    if (callbacks?.progressCallBack) {
                        callbacks.progressCallBack({
                            status: ProgressStatusEnum.IN_PROGRESS,
                            percentage
                        });
                    }
                    break;
                case HttpEventType.Response:

                    this.modalService.hide();

                    const fileName = this.getFileNameFromHttpResponse(response);

                    if (callbacks?.successCallBack) {
                        callbacks.successCallBack({ status: ProgressStatusEnum.COMPLETE });
                    }

                    this.createDownloadFileUserActivity(resourceFileId);
                    const downloadedFile = new Blob([response.body], { type: response.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = fileName;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        }, error => {
            this.modalService.hide();
            if (callbacks?.errorCallback) {
                callbacks.errorCallback({ status: ProgressStatusEnum.ERROR, error });
            }
            this.downloadResourceSub?.unsubscribe();
        });
    }

    getFileNameFromHttpResponse(httpResponse: HttpResponse<any>) {
        const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');
        const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }

    refreshResource(currentResource: IJobResource) {
        return this.httpClient.get<IJobResource>(this.baseUrl + 'resourceFile/jobresource/' + currentResource.id.toString()).pipe(
            map((response) => ({ response, currentResource })),
        );
    }

    refreshConsolidatedResource(currentResource: IConsolidatedResource) {
        return this.httpClient.get<IConsolidatedResource>(this.baseUrl +
            'resourceFile/consolidatedResource/' + currentResource.resourceFileId.toString()).pipe(
                map((newResource) => ({ newResource, currentResource })),
            );
    }

    getResources(jobId: number) {
        return this.httpClient.get<IJobResource[]>(this.baseUrl + 'resourceFile/jobresources/' + jobId.toString()).pipe(
            map((response) => response),
        );
    }

    createRequest(arg0: { jobId: number; resourceFileId: number }) {
        return this.httpClient.post(this.baseUrl + 'resources/create', arg0).pipe(
            map((response) => response),
        );
    }

    searchResources(resourceParams: ResourceParams) {
        return this.httpClient.post<Pagination<IJobFile>>(this.baseUrl + 'resourceFile/search', resourceParams, {
            observe: 'body'
        }).pipe(
            map((response) => response),
        );
    }

    getConsolidateResourcesBySmartriseUser(resourceParams: ResourceParams) {
        return this.httpClient.post<Pagination<IJobFile>>(this.baseUrl + 'resourceFile/smartrise/consolidatedResources', resourceParams)
        .pipe(map((response) => response));
    }

    getConsolidateResourcesByCustomerUser(resourceParams: ResourceParams) {
        return this.httpClient.post<Pagination<IJobFile>>(this.baseUrl + 'resourceFile/customer/consolidatedResources', resourceParams)
        .pipe(map((response) => response));
    }

    validateUploadFile(resourceId: number) {
        return this.httpClient
            .get(
                this.baseUrl + 'resourceFile/validateUpload?resourceFileId=' + resourceId.toString(),
                {
                    observe: 'body',
                }
            ).pipe(
                map((response) => response),
            );
    }

    uploadFile(file: File, reourceId: number, fileDescription: string) {
        const headers = new HttpHeaders();
        const formData = new FormData();
        formData.append('file', file);
        if (fileDescription === null) {
fileDescription = '';
}

        return this.httpClient
            .post<IUploadFilesResponse>(
                this.baseUrl + 'resourceFile/upload/',
                formData,
                {
                    headers,
                    params: {
                        resourceFileId: reourceId.toString(),
                        fileDescription,
                    },
                    reportProgress: true,
                    observe: 'events',
                }
            ).pipe(
                map((response) => response),
            );
    }

    removeUploadedFile(resourceId: number) {
        return this.httpClient
            .delete(this.baseUrl + 'resourceFile/removeFile/' + resourceId.toString()).pipe(
                map((response) => response),
            );
    }

    getLatestUploadedFilesBySmartriseUser(resourceParams: ResourceParams) {
        return this.httpClient.post<Pagination<IJobFile>>
            (this.baseUrl + 'resourceFile/smartrise/latest/uploaded', resourceParams).pipe(
                map((response) => response),
            );
    }

    getLatestUploadedFilesByCustomerUser(resourceParams: ResourceByCustomerUserParams) {
        return this.httpClient.post<Pagination<IJobFile>>
            (this.baseUrl + 'resourceFile/customer/latest/uploaded', resourceParams).pipe(
                map((response) => response),
            );
    }

    refreshJobFile(currentJobFile: any) {
        return this.httpClient.get<IJobFile>(this.baseUrl + 'resourceFile/jobfile/' + currentJobFile.resourceFileId.toString()).pipe(
            map((response) => ({ newJobFile: response, currentJobFile })),
        );
    }

    getResourceTypes(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'resourceFile/enumeration/resourceTypes')
            .pipe(
                map((response) => response),
            );
    }

    getStatuses(): Observable<IEnumValue[]> {
        return this.httpClient.get<IEnumValue[]>(this.baseUrl + 'resources/enumeration/statuses')
            .pipe(
                map((response) => response),
            );
    }

    dispose() {
        this.downloadResourceSub?.unsubscribe();
        this.modalService.hide();
    }
}

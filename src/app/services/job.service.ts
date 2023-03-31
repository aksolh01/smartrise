import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JobSearchByCustomerParams, JobSearchParams, PredictiveJobBaseParams } from '../_shared/models/jobParams';
import { IPagination } from '../_shared/models/pagination';
import { map } from 'rxjs/operators';
import { IJob, IRecentJob } from '../_shared/models/job';
import { Observable, of } from 'rxjs';
import { AlertStatus } from '../_shared/models/alertStatus';

@Injectable()
export class JobService {
  baseUrl = environment.apiUrl;
  selectedShipmentId: number | null;

  constructor(private http: HttpClient) { }

  searchJobsBySmartriseUser(jobParams: JobSearchParams) {
    return this.http
      .post<IPagination>(this.baseUrl + 'jobs/smartrise/search', jobParams, { observe: 'response' })
      .pipe(
        map((response) => response.body),
      );
  }

  searchJobsByCustomerUser(jobParams: JobSearchByCustomerParams) {
    return this.http
      .post<IPagination>(this.baseUrl + 'jobs/customer/search', jobParams, { observe: 'response' })
      .pipe(
        map((response) => response.body),
      );
  }

  getjob(id: number) {
    return this.http.get<IJob>(this.baseUrl + 'jobs/' + id);
  }

  getRecentJobsBySmartriseUser() {
    return this.http.get<IRecentJob[]>(`${this.baseUrl}jobs/smartrise/recent`);
  }

  getRecentJobsByCustomerUser(customerId: number) {
    return this.http.get<IRecentJob[]>(`${this.baseUrl}jobs/customer/recent/${customerId}`);
  }

  // getJobsLookup(filter: string) {
  //   return this.http.post<IJobLookup[]>(this.baseUrl + 'jobs/lookup',
  //     { nameFilter: filter },
  //     { observe: 'response' })
  //     .pipe(
  //       map((response) => response.body),
  //     );
  // }

  fillPasscode(passcode: any) {
    return this.http.put(this.baseUrl + 'jobs/passcode/update', passcode)
      .pipe(
        map((response) => response),
      );
  }
  getSelectedShipment() {
    return this.selectedShipmentId;
  }

  getPredictiveMaintenanceJobs(param: PredictiveJobBaseParams): Observable<IPagination> {
    let array = [
      {
        jobId: 1,
        alertsCount: 12,
        faultsCount: 23,
        jobName: 'Job Name 1',
        jobNumber: 'Job Number 1',
        status: AlertStatus.Alarm,
      },
      {
        jobId: 2,
        alertsCount: 23,
        faultsCount: 9,
        jobName: 'Job Name 2',
        jobNumber: 'Job Number 2',
        status: AlertStatus.Alarm,
      },
      {
        jobId: 2,
        alertsCount: 23,
        faultsCount: 9,
        jobName: 'Job Name 2',
        jobNumber: 'Job Number 2',
        status: AlertStatus.Fault,
      },
      {
        jobId: 2,
        alertsCount: 23,
        faultsCount: 9,
        jobName: 'Job Name 2',
        jobNumber: 'Job Number 2',
        status: AlertStatus.Normal,
      },
      {
        jobId: 3,
        alertsCount: 11,
        faultsCount: 2,
        jobName: 'Job Name 3',
        jobNumber: 'Job Number 3',
        status: AlertStatus.Fault,
      },
      {
        jobId: 4,
        alertsCount: 14,
        faultsCount: 1,
        jobName: 'Job Name 4',
        jobNumber: 'Job Number 4',
        status: AlertStatus.Fault,
      },
      {
        jobId: 5,
        alertsCount: 10,
        faultsCount: 2,
        jobName: 'Job Name 4',
        jobNumber: 'Job Number 4',
        status: AlertStatus.Fault,
      },
      {
        jobId: 6,
        alertsCount: 8,
        faultsCount: 1,
        jobName: 'Job Name 5',
        jobNumber: 'Job Number 5',
        status: AlertStatus.Fault,
      },
      {
        jobId: 6,
        alertsCount: 7,
        faultsCount: 2,
        jobName: 'Job Name 6',
        jobNumber: 'Job Number 6',
        status: AlertStatus.Fault,
      },
      {
        jobId: 7,
        alertsCount: 7,
        faultsCount: 2,
        jobName: 'Job Name 6',
        jobNumber: 'Job Number 6',
        status: AlertStatus.Fault,
      },
    ];

    if (param['jobName']) {
array = array.filter(x =>
        x.jobName.toLowerCase().indexOf(param['jobName'].toLowerCase()) > -1
      );
}

    if (param['jobNumber']) {
array = array.filter(x =>
        x.jobNumber.toLowerCase().indexOf(param['jobNumber'].toLowerCase()) > -1
      );
}

    if (param['status']) {
array = array.filter(x =>
        x.status === param['status']
      );
}

    if (param['alertsCount']) {
array = array.filter(x =>
        x.alertsCount === param['alertsCount']
      );
}

    if (param['faultsCount']) {
array = array.filter(x =>
        x.faultsCount === param['faultsCount']
      );
}

    const startIndex = (param.pageIndex - 1) * param.pageSize;
    const endIndex = startIndex + param.pageSize;
    const pArray = array.slice(startIndex, endIndex);

    return of({
      pageIndex: param.pageIndex,
      pageSize: param.pageSize,
      count: array.length,
      data: pArray
    });
  }
}

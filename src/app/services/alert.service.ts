/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IAlertDetails } from '../_shared/models/alertData';
import { AlertParams } from '../_shared/models/alertParams';
import { AlertSettingsParams } from '../_shared/models/alertSettingsParams';
import { AlertType } from '../_shared/models/alertType';
import { IPagination } from '../_shared/models/pagination';
import { Severity } from '../_shared/models/predictiveMaintenanceEnums';

@Injectable()
export class AlertService {
  getAlertsWithDetails(partType: string): Observable<IAlertDetails[]> {
    throw new Error('Method not implemented.');
  }

  getAlerts(alertParams: AlertParams): Observable<IPagination> {
    let array = [
      {
        alertName: 'Attention needed to emergency Brake',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 1',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Critical,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.High,
        date: new Date('2/3/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
      {
        alertName: 'Fault occured in Contactor',
        jobName: 'BEIRUT - LEBANON',
        jobNumber: '655409-113',
        group: 'Group 1',
        car: 'Car 2',
        id: 1,
        part: '',
        partType: 'Brake',
        severity: Severity.Low,
        date: new Date('2/2/2021'),
      },
    ];

    if (alertParams['alertName']) {
      array = array.filter(
        (x) =>
          x.alertName
            .toLowerCase()
            .indexOf(alertParams['alertName'].toLowerCase()) > -1
      );
    }
    if (alertParams['jobName']) {
      array = array.filter(
        (x) =>
          x.jobName
            .toLowerCase()
            .indexOf(alertParams['jobName'].toLowerCase()) > -1
      );
    }

    if (alertParams['jobNumber']) {
      array = array.filter(
        (x) =>
          x.jobNumber
            .toLowerCase()
            .indexOf(alertParams['jobNumber'].toLowerCase()) > -1
      );
    }

    if (alertParams['group']) {
      array = array.filter(
        (x) =>
          x.group.toLowerCase().indexOf(alertParams['group'].toLowerCase()) > -1
      );
    }

    if (alertParams['car']) {
      array = array.filter(
        (x) =>
          x.car.toLowerCase().indexOf(alertParams['car'].toLowerCase()) > -1
      );
    }

    if (alertParams['part']) {
      array = array.filter(
        (x) =>
          x.part.toLowerCase().indexOf(alertParams['part'].toLowerCase()) > -1
      );
    }

    if (alertParams['partType']) {
      array = array.filter(
        (x) =>
          x.partType
            .toLowerCase()
            .indexOf(alertParams['partType'].toLowerCase()) > -1
      );
    }

    if (
      alertParams['severity'] !== undefined &&
      alertParams['severity'] !== null &&
      alertParams['severity'] !== ''
    ) {
      array = array.filter((x) => x.severity === alertParams['severity']);
    }

    if (alertParams['date']) {
      array = array.filter((x) => x.date >= alertParams['date']);
    }

    const startIndex = (alertParams.pageIndex - 1) * alertParams.pageSize;
    const endIndex = startIndex + alertParams.pageSize;
    const pArray = array.slice(startIndex, endIndex);

    return of({
      pageIndex: alertParams.pageIndex,
      pageSize: alertParams.pageSize,
      count: array.length,
      data: pArray,
    });
  }

  getAlertsSettings(alertParams: AlertSettingsParams): Observable<IPagination> {
    let array = [
      {
        name: 'Attention needed on emergency Brakes',
        severity: Severity.Critical,
        type: AlertType.TimeBasedPart,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 77,
      },
      {
        name: 'Attention needed on Door Contactor',
        severity: Severity.High,
        type: AlertType.Alarm,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 12,
      },
      {
        name: 'Attention needed on Brakes',
        severity: Severity.Critical,
        type: AlertType.Fault,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 23,
      },
      {
        name: 'Attention needed on Brakes',
        severity: Severity.Critical,
        type: AlertType.CountBasedPart,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2025'),
        totalAlerts: 45,
      },
      {
        name: 'Attention needed on emergency Brakes',
        severity: Severity.Critical,
        type: AlertType.TimeBasedPart,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 77,
      },
      {
        name: 'Attention needed on Door Contactor',
        severity: Severity.High,
        type: AlertType.Alarm,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 12,
      },
      {
        name: 'Attention needed on Brakes',
        severity: Severity.Critical,
        type: AlertType.Fault,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2022'),
        totalAlerts: 23,
      },
      {
        name: 'Attention needed on Brakes',
        severity: Severity.Critical,
        type: AlertType.CountBasedPart,
        createdDate: new Date('2/2/2022'),
        modifiedDate: new Date('2/2/2025'),
        totalAlerts: 45,
      },
    ];

    if (alertParams['name']) {
      array = array.filter(
        (x) =>
          x.name.toLowerCase().indexOf(alertParams['name'].toLowerCase()) > -1
      );
    }

    if (alertParams['totalAlerts']) {
      array = array.filter((x) => x.totalAlerts === alertParams['totalAlerts']);
    }

    if (
      alertParams['severity'] !== undefined &&
      alertParams['severity'] !== null &&
      alertParams['severity'].toString() !== ''
    ) {
      array = array.filter((x) => x.severity === alertParams['severity']);
    }

    if (alertParams['modifiedDate']) {
      array = array.filter(
        (x) => x.modifiedDate >= alertParams['modifiedDate']
      );
    }

    if (alertParams['createdDate']) {
      array = array.filter((x) => x.createdDate >= alertParams['createdDate']);
    }

    if (
      alertParams['type'] !== undefined &&
      alertParams['type'] !== null &&
      alertParams['type'].toString() !== ''
    ) {
      array = array.filter((x) => x.type === alertParams['type']);
    }

    const startIndex = (alertParams.pageIndex - 1) * alertParams.pageSize;
    const endIndex = startIndex + alertParams.pageSize;
    const pArray = array.slice(startIndex, endIndex);

    return of({
      pageIndex: alertParams.pageIndex,
      pageSize: alertParams.pageSize,
      count: array.length,
      data: pArray,
    });
  }

  resetNbOfDays(alertId: number) {}

  resetNbOfLatches(alertId: number) {}

  resolveTimeBasedPart(alertId: number) {}

  resolveCountBasedPart(alertId: number) {}

  resetAlarm(alertId: number) {}

  resolveAlarm(alertId: number) {}

  resetFaultCount(alertId: number) {}

  resolveFault(alertId: number) {}
}

import { Observable, of } from 'rxjs';
import { AlertStatus } from '../_shared/models/alertStatus';
import { IPagination } from '../_shared/models/pagination';
import { Part } from '../_shared/models/part';
import { PartsParams } from '../_shared/models/partsParams';
import { Injectable } from '@angular/core';

@Injectable()
export class PartsService {
    getParts(partsParams: PartsParams): Observable<IPagination> {
        let array = [
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.ACAuxContactor,
                partType: 'Contactor Auxiliary Contacts',
                alertsCount: 8,
                alertsExceedHalfThreshold: true,
                alertsExceedThreshold: false,
                status: AlertStatus.Alarm,
            },
            {
                group: 'Group 1',
                car: 'Car 2',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.ACAuxContactor,
                partType: 'Contactor Auxiliary Contacts',
                alertsCount: 3,
                alertsExceedHalfThreshold: false,
                alertsExceedThreshold: true,
                status: AlertStatus.Fault,
            },
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.BRBreaker,
                partType: 'BPS',
                alertsCount: 3,
                alertsExceedHalfThreshold: false,
                alertsExceedThreshold: true,
                status: AlertStatus.Normal,
            },
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.Relay,
                partType: 'Roller Guides',
                alertsCount: 2,
                alertsExceedHalfThreshold: true,
                alertsExceedThreshold: false,
                status: AlertStatus.Offline,
            },
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.ContactorConver,
                partType: 'Contactors',
                alertsCount: 8,
                alertsExceedHalfThreshold: false,
                alertsExceedThreshold: true,
                status: AlertStatus.Alarm,
            },
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.B1Contactor,
                partType: 'Contactors',
                alertsCount: 1,
                alertsExceedHalfThreshold: false,
                alertsExceedThreshold: false,
                status: AlertStatus.Normal,
            },
            {
                group: 'Group 1',
                car: 'Car 1',
                jobName: 'Job Name 1',
                jobNumber: 'Job Number 1',
                part: Part.B1Contactor,
                partType: 'Contactors',
                alertsCount: 2,
                alertsExceedHalfThreshold: false,
                alertsExceedThreshold: false,
                status: AlertStatus.Normal,
            },
        ];

        if (partsParams['alertsCount']) {
            array = array.filter(x => x.alertsCount === partsParams['alertsCount']);
        }
        if (partsParams['car']) {
            array = array.filter(x => x.car.toLowerCase().indexOf(partsParams['car'].toLowerCase()) > -1);
        }
        if (partsParams['group']) {
            array = array.filter(x => x.group.toLowerCase().indexOf(partsParams['group'].toLowerCase()) > -1);
        }
        if (partsParams['partType']) {
            array = array.filter(x => x.partType.toLowerCase().indexOf(partsParams['partType'].toLowerCase()) > -1);
        }
        if (partsParams['jobName']) {
            array = array.filter(x => x.jobName === partsParams['jobName']);
        }
        if (partsParams['jobNumber']) {
            array = array.filter(x => x.jobNumber.toLowerCase().indexOf(partsParams['alert'].toLowerCase()) > -1);
        }
        if (partsParams['part'] !== undefined && partsParams['part'] !== null && partsParams['part'].toString() !== '') {
            array = array.filter(x => x.part === partsParams['part']);
        }
        if (partsParams['status'] !== undefined && partsParams['status'] !== null
        && partsParams['status'].toString() !== '') {
            array = array.filter(x => x.status === partsParams['status']);
        }

        const startIndex = (partsParams.pageIndex - 1) * partsParams.pageSize;
        const endIndex = startIndex + partsParams.pageSize;
        const pArray = array.slice(startIndex, endIndex);

        return of({
            pageIndex: partsParams.pageIndex,
            pageSize: partsParams.pageSize,
            count: array.length,
            data: pArray
        });
    }
}

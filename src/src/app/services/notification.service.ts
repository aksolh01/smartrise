import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AlertType } from '../_shared/models/alertType';
import { ConfigurationType } from '../_shared/models/configurationType';
import { NotificationParams } from '../_shared/models/notificationParam';
import { IPagination } from '../_shared/models/pagination';
import { NotificationMethod, Severity } from '../_shared/models/predictiveMaintenanceEnums';

@Injectable()
export class NotificationService {

    getNotificationsSettings(notificationParams: NotificationParams): Observable<IPagination> {

        let array = [
            {
                id: 1,
                alertType: AlertType.Alarm,
                configurationType: ConfigurationType.AlertType,
                alert: null,
                notificationMethod: NotificationMethod.Email,
                partType: null,
                severity: null,
                modifiedDate: null,
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.SeverityAndPartType,
                alert: null,
                notificationMethod: NotificationMethod.SMS,
                partType: 'Contactors',
                severity: Severity.Critical,
                modifiedDate: new Date('2/2/2021'),
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.PartType,
                alert: null,
                notificationMethod: NotificationMethod.Email,
                partType: 'Contactors',
                severity: null,
                modifiedDate: new Date('2/2/2021'),
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.Alert,
                alert: 'Attention needed to emergency Brake',
                notificationMethod: NotificationMethod.Email,
                partType: null,
                severity: null,
                modifiedDate: new Date('2/2/2021'),
            },
            {
                id: 1,
                alertType: AlertType.Alarm,
                configurationType: ConfigurationType.AlertType,
                alert: null,
                notificationMethod: NotificationMethod.Email,
                partType: null,
                severity: null,
                modifiedDate: null,
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.SeverityAndPartType,
                alert: null,
                notificationMethod: NotificationMethod.SMS,
                partType: 'Contactors',
                severity: Severity.Critical,
                modifiedDate: new Date('7/9/2021'),
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.PartType,
                alert: null,
                notificationMethod: NotificationMethod.Email,
                partType: 'Contactors',
                severity: null,
                modifiedDate: new Date('5/4/2021'),
            },
            {
                id: 2,
                alertType: null,
                configurationType: ConfigurationType.PartType,
                alert: 'Attention needed to emergency Brake',
                notificationMethod: NotificationMethod.Email,
                partType: null,
                severity: null,
                modifiedDate: new Date('4/4/2021'),
            },
        ];

        if (notificationParams['alertType'] !== undefined && notificationParams['alertType'] !== null
        && notificationParams['alertType'].toString() !== '') {
            array = array.filter(x => x.alertType === notificationParams['alertType']);
        }
        if (notificationParams['configurationType'] !== undefined && notificationParams['configurationType'] != null
        && notificationParams['configurationType'].toString() !== '') {
            array = array.filter(x => x.configurationType === notificationParams['configurationType']);
        }
        if (notificationParams['alert']) {
            array = array.filter(x => x.alert.toLowerCase().indexOf(notificationParams['alert']));
        }
        if (notificationParams['notificationMethod']) {
            array = array.filter(x => x.notificationMethod === notificationParams['notificationMethod']);
        }
        if (notificationParams['partType']) {
            array = array.filter(x => x.partType.toLowerCase().indexOf(notificationParams['partType']));
        }
        if (notificationParams['severity'] !== undefined && notificationParams['severity'] !== null
        && notificationParams['severity'].toString() !== '') {
            array = array.filter(x => x.severity === notificationParams['severity']);
        }

        const startIndex = (notificationParams.pageIndex - 1) * notificationParams.pageSize;
        const endIndex = startIndex + notificationParams.pageSize;
        const pArray = array.slice(startIndex, endIndex);
        return of({
          pageIndex: notificationParams.pageIndex,
          pageSize: notificationParams.pageSize,
          count: array.length,
          data: pArray
        });
    }

    getNotificationsLogs(notificationParams: NotificationParams): Observable<IPagination> {

        let array = [
            {
                reciepients: '',
                notificationMethod: NotificationMethod.SMS,
                severity: Severity.Critical,
                partType: 'Braker',
                alertType: AlertType.CountBasedPart,
                alert: '',
                sentTime: new Date('07/01/2021'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.Email,
                severity: Severity.High,
                partType: 'Braker',
                alertType: AlertType.Fault,
                alert: '',
                sentTime: new Date('06/06/2021'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.SMS,
                severity: Severity.Low,
                partType: 'Braker',
                alertType: AlertType.CountBasedPart,
                alert: '',
                sentTime: new Date('05/03/2021'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.Email,
                severity: Severity.Medium,
                partType: 'Contactor',
                alertType: AlertType.TimeBasedPart,
                alert: '',
                sentTime: new Date('04/04/2021'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.SMS,
                severity: Severity.High,
                partType: 'Contactor',
                alertType: AlertType.Fault,
                alert: '',
                sentTime: new Date('04/04/2021'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.SMS,
                severity: Severity.Low,
                partType: 'Contactor',
                alertType: AlertType.Alarm,
                alert: '',
                sentTime: new Date('02/03/2023'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.Email,
                severity: Severity.High,
                partType: 'Contactor',
                alertType: AlertType.CountBasedPart,
                alert: '',
                sentTime: new Date('02/03/2023'),
            },
            {
                reciepients: '',
                notificationMethod: NotificationMethod.SMS,
                severity: Severity.Critical,
                partType: 'Contactor',
                alertType: AlertType.Alarm,
                alert: '',
                sentTime: new Date('02/03/2023'),
            },
        ];

        if (notificationParams['reciepients'] !== undefined && notificationParams['reciepients'] !== null
        && notificationParams['alertType'].toString() !== '') {
            array = array.filter(x => x.reciepients === notificationParams['reciepients']);
        }
        if (notificationParams['notificationMethod'] !== undefined && notificationParams['notificationMethod'] !== null
        && notificationParams['configurationType'].toString() !== '') {
            array = array.filter(x => x.notificationMethod === notificationParams['notificationMethod']);
        }
        if (notificationParams['severity'] !== undefined && notificationParams['severity'] !== null
        && notificationParams['severity'].toString() !== '') {
            array = array.filter(x => x.severity === notificationParams['severity']);
        }
        if (notificationParams['partType']) {
            array = array.filter(x => x.partType === notificationParams['partType']);
        }
        if (notificationParams['alertType'] !== undefined && notificationParams['alertType'] !== null
        && notificationParams['alertType'].toString() !== '') {
            array = array.filter(x => x.alertType === notificationParams['alertType']);
        }
        if (notificationParams['alert']) {
            array = array.filter(x => x.alert.toLowerCase().indexOf(notificationParams['alert']));
        }
        if (notificationParams['sentTime'] !== undefined && notificationParams['sentTime'] !== null
        && notificationParams['sentTime'] !== '') {
            array = array.filter(x => x.sentTime >= notificationParams['sentTime']);
        }

        const startIndex = (notificationParams.pageIndex - 1) * notificationParams.pageSize;
        const endIndex = startIndex + notificationParams.pageSize;
        const pArray = array.slice(startIndex, endIndex);

        return of({
          pageIndex: notificationParams.pageIndex,
          pageSize: notificationParams.pageSize,
          count: array.length,
          data: pArray
        });
    }
}

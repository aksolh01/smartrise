import { Component, OnInit } from '@angular/core';
import { IAlertDetails } from '../../../_shared/models/alertData';
import { AlertType } from '../../../_shared/models/alertType';
import { Severity } from '../../../_shared/models/predictiveMaintenanceEnums';
import { PredictiveMaintenanceService } from '../../../services/predictiveMaintenanceService';

@Component({
  selector: 'ngx-alert-details',
  templateUrl: './alert-details.component.html',
  styleUrls: ['./alert-details.component.scss']
})
export class AlertDetailsComponent implements OnInit {


  jobName: string;
  jobNumber: string;
  carName: string;
  partType: string;

  alerts: IAlertDetails[] =
    [
      {
        alertId: 1,
        alertType: AlertType.Fault,
        alertDescription: 'Fault detected in contactor and braker',
        alertDate: new Date('2/2/2021'),
        fault: 'Fault 1',
        faultCount: 3,
        faultPossibleAffectedParts: ['Contactor', 'Braker'],
        faultThreshold: 2,
        alarm: null,
        alarmCount: null,
        alarmPossibleAffectedParts: null,
        alarmThreshold: null,
        alertName: 'Fault detected in contactor and braker',
        countBasedPart: null,
        countBasedVendor: null,
        nbOfDays: null,
        nbOfDaysThreshold: null,
        nbOfLatchesOfTurns: null,
        nbOfLatchesOfTurnsThreshold: null,
        severity: Severity.Low,
        timeBasedPart: null,
        timeBasedVendor: null,
      },
      {
        alertId: 1,
        alertName: 'Alarm detected in the contactor and braker parts',
        alertType: AlertType.Alarm,
        alertDate: new Date('2/2/2021'),
        alertDescription: 'Alarm one alert',
        fault: 'Alarm 1',
        faultCount: 3,
        faultPossibleAffectedParts: ['Contactor', 'Braker'],
        faultThreshold: 2,
        alarm: 'Alarm 1',
        alarmCount: 4,
        alarmPossibleAffectedParts: ['Contactor', 'Braker'],
        alarmThreshold: 3,
        countBasedPart: null,
        countBasedVendor: null,
        nbOfDays: null,
        nbOfDaysThreshold: null,
        nbOfLatchesOfTurns: null,
        nbOfLatchesOfTurnsThreshold: null,
        severity: Severity.High,
        timeBasedPart: null,
        timeBasedVendor: null,
      },
      {
        alertId: 1,
        alertName: 'Attention needed in the door lock',
        alertType: AlertType.CountBasedPart,
        alertDate: new Date('2/2/2021'),
        alertDescription: 'Count based one alert',
        fault: 'Count based 1',
        faultCount: 3,
        faultPossibleAffectedParts: ['Contactor', 'Braker'],
        faultThreshold: 2,
        alarm: 'Alarm 1',
        alarmCount: 4,
        alarmPossibleAffectedParts: ['Contactor', 'Braker'],
        alarmThreshold: 3,
        countBasedPart: 'Door Lock',
        countBasedVendor: 'Sony',
        nbOfDays: null,
        nbOfDaysThreshold: null,
        nbOfLatchesOfTurns: 21000,
        nbOfLatchesOfTurnsThreshold: 20000,
        severity: Severity.High,
        timeBasedPart: null,
        timeBasedVendor: null,
      },
      {
        alertId: 1,
        alertName: 'Door lock time span might be over',
        alertType: AlertType.TimeBasedPart,
        alertDate: new Date('2/2/2021'),
        alertDescription: 'Time based one alert',
        fault: 'Time based 1',
        faultCount: 3,
        faultPossibleAffectedParts: ['Contactor', 'Braker'],
        faultThreshold: 2,
        alarm: 'Alarm 1',
        alarmCount: 4,
        alarmPossibleAffectedParts: ['Contactor', 'Braker'],
        alarmThreshold: 3,
        countBasedPart: 'Door Lock',
        countBasedVendor: 'Sony',
        nbOfDays: 50,
        nbOfDaysThreshold: 40,
        nbOfLatchesOfTurns: 21000,
        nbOfLatchesOfTurnsThreshold: 20000,
        severity: Severity.Critical,
        timeBasedPart: 'Contactor',
        timeBasedVendor: 'Samsung',
      }
    ];

  faultAlertType = AlertType.Fault;
  alarmAlertType = AlertType.Alarm;
  countBasedAlertType = AlertType.CountBasedPart;
  timeBasedAlertType = AlertType.TimeBasedPart;

  constructor(
    private predictiveMaintenanceService: PredictiveMaintenanceService,
  ) { }

  ngOnInit(): void {
    const data = this.predictiveMaintenanceService.getFilterData();
    this.carName = data.car;
    this.jobName = data.jobName;
    this.jobNumber = data.jobNumber;
    this.partType = data.partType;
    // this.alertService.getAlertsWithDetails(data.partType).subscribe((alerts: IAlertDetails[]) => {
    //     this.alerts = alerts;
    // });
  }

  // // getText(enmValue: any) {
  // //   return AlertType[enmValue];
  // // }

  // // getSeverity(enmValue: any) {
  // //   return Severity[enmValue];
  // // }

  // // onResolveFault(alert: IAlertDetails) {
  // //   this.alertService.resolveFault(alert.alertId);
  // // }

  // // onResetFaultCounter(alert: IAlertDetails) {
  // //   this.alertService.resetFaultCount(alert.alertId);
  // // }

  // // onResolveAlarm(alert: IAlertDetails) {
  // //   this.alertService.resolveAlarm(alert.alertId);
  // // }

  // // onResetAlarmCounter(alert: IAlertDetails) {
  // //   this.alertService.resetAlarm(alert.alertId);
  // // }

  // // onResolveCountBasedPart(alert: IAlertDetails) {
  // //   this.alertService.resolveCountBasedPart(alert.alertId);
  // // }

  // // onResetNbOfLatches(alert: IAlertDetails) {
  // //   this.alertService.resetNbOfLatches(alert.alertId);
  // // }

  // // onResolveTimeBasedPart(alert: IAlertDetails) {
  // //   this.alertService.resolveTimeBasedPart(alert.alertId);
  // // }

  // // onResetNbOfDays(alert: IAlertDetails) {
  // //   this.alertService.resetNbOfDays(alert.alertId);
  // // }

  // getSeverityClass(severity: Severity) {
  //   if (severity == Severity.Critical) {
  //     return 'badge text-white severity-critical';
  //   } else if (severity == Severity.High) {
  //     return 'badge text-white severity-high';
  //   } else if (severity == Severity.Medium) {
  //     return 'badge text-white severity-medium';
  //   } else if (severity == Severity.Low) {
  //     return 'badge text-white severity-low';
  //   }
  // }
}

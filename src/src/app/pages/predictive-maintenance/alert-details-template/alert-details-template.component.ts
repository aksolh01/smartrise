import { Component, Input, OnInit } from '@angular/core';
import { IAlertDetails } from '../../../_shared/models/alertData';
import { AlertType } from '../../../_shared/models/alertType';
import { Severity } from '../../../_shared/models/predictiveMaintenanceEnums';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'ngx-alert-details-template',
  templateUrl: './alert-details-template.component.html',
  styleUrls: ['./alert-details-template.component.scss']
})
export class AlertDetailsTemplateComponent implements OnInit {

  @Input() alert: IAlertDetails;

  faultAlertType = AlertType.Fault;
  alarmAlertType = AlertType.Alarm;
  countBasedAlertType = AlertType.CountBasedPart;
  timeBasedAlertType = AlertType.TimeBasedPart;

  constructor(private alertService: AlertService) { }

  ngOnInit(): void {
  }

  getText(enmValue: any) {
    return AlertType[enmValue];
  }

  getSeverity(enmValue: any) {
    return Severity[enmValue];
  }

  onResolveFault(alert: IAlertDetails) {
    this.alertService.resolveFault(alert.alertId);
  }

  onResetFaultCounter(alert: IAlertDetails) {
    this.alertService.resetFaultCount(alert.alertId);
  }

  onResolveAlarm(alert: IAlertDetails) {
    this.alertService.resolveAlarm(alert.alertId);
  }

  onResetAlarmCounter(alert: IAlertDetails) {
    this.alertService.resetAlarm(alert.alertId);
  }

  onResolveCountBasedPart(alert: IAlertDetails) {
    this.alertService.resolveCountBasedPart(alert.alertId);
  }

  onResetNbOfLatches(alert: IAlertDetails) {
    this.alertService.resetNbOfLatches(alert.alertId);
  }

  onResolveTimeBasedPart(alert: IAlertDetails) {
    this.alertService.resolveTimeBasedPart(alert.alertId);
  }

  onResetNbOfDays(alert: IAlertDetails) {
    this.alertService.resetNbOfDays(alert.alertId);
  }

  getSeverityClass(severity: Severity) {
    if (severity === Severity.Critical) {
      return 'badge text-white severity-critical';
    } else if (severity === Severity.High) {
      return 'badge text-white severity-high';
    } else if (severity === Severity.Medium) {
      return 'badge text-white severity-medium';
    } else if (severity === Severity.Low) {
      return 'badge text-white severity-low';
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AlertType } from '../../../../_shared/models/alertType';
import { Severity } from '../../../../_shared/models/predictiveMaintenanceEnums';
import { AlertDetailsSingleComponent } from '../../alert-details-single/alert-details-single.component';

@Component({
  selector: 'ngx-last-active-alerts',
  templateUrl: './last-active-alerts.component.html',
  styleUrls: ['./last-active-alerts.component.scss']
})
export class LastActiveAlertsComponent implements OnInit {

  alertStatus1: Severity = Severity.Critical;
  alertStatus2: Severity = Severity.High;
  alertStatus3: Severity = Severity.Low;

  constructor(private modelService: BsModalService, private router: Router) { }

  ngOnInit(): void {
  }

  onViewAllMyAlerts() {
    this.router.navigateByUrl('pages/predictive-maintenance/alerts-list');
  }

  onClickRow(event) {
    const alert = {
      alertId: 1,
      alertName: 'Attention needed in the door lock',
      alertType: AlertType.CountBasedPart,
      alertDescription: 'Count based one alert',
      alertDate: new Date('2/2/2021'),
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
    };

    const modalRef = this.modelService.show<AlertDetailsSingleComponent>(AlertDetailsSingleComponent, {
      initialState: { alert },
      class: 'alert-details-model'
    });

    const subscription = modalRef.onHidden
      .subscribe(() => {
        subscription.unsubscribe();
      });
  }
}

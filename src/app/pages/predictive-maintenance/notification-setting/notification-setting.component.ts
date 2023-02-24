import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AlertType } from '../../../_shared/models/alertType';
import { ConfigurationType } from '../../../_shared/models/configurationType';
import { INotificationSetting } from '../../../_shared/models/notificationSetting';
import { NotificationMethod, Severity, ThresholdType } from '../../../_shared/models/predictiveMaintenanceEnums';
import { BaseComponentService } from '../../../services/base-component.service';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-notification-setting',
  templateUrl: './notification-setting.component.html',
  styleUrls: ['./notification-setting.component.scss']
})
export class NotificationSettingComponent extends BaseComponent implements OnInit {

  partTypes = [];
  alerts = [];
  alertTypes = [];
  notificationMethods = [];
  severities = [];
  nfcMtds = [];
  cnfTypes = [];
  notificationSettingForm: UntypedFormGroup;
  notificationSetting: INotificationSetting;
  configurationType: ConfigurationType;

  configurationTypeAlertType = ConfigurationType.AlertType;
  configurationTypeAlert = ConfigurationType.Alert;
  configurationTypePartType = ConfigurationType.PartType;
  configurationTypeSeverityAndPartType = ConfigurationType.SeverityAndPartType;

  constructor(
    private router: Router,
    private modelref: BsModalRef,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnInit(): void {

    this.createForm();
    this.initializeSpecialLists();


    this.alertTypes = this.populateLookupAsFilterList(AlertType);
    this.alertTypes[AlertType.CountBasedPart].title = 'Count-based Part';
    this.alertTypes[AlertType.TimeBasedPart].title = 'Time-based Part';

    this.nfcMtds = this.populateLookupAsFilterList(NotificationMethod);
    this.nfcMtds[NotificationMethod.SMS].title = 'SMS';

    this.severities = this.populateLookupAsFilterList(Severity);
    this.cnfTypes = this.populateLookupAsFilterList(ConfigurationType);

    this.populateNotificationSetting();
  }

  onClose() {
    this.modelref.hide();
  }

  populateNotificationSetting() {
    this.notificationSettingForm.patchValue({
      configurationType: ConfigurationType.AlertType,
      alertType: AlertType.Alarm,
      notificationMethod: NotificationMethod.Email,
    });
    this.configurationType = ConfigurationType.AlertType;
  }

  initializeSpecialLists() {
    this.alerts = [
      {
        id: 1,
        name: 'Attention needed to Contractor'
      },
      {
        id: 2,
        name: 'Attention needed to Braker'
      },
    ];
    this.partTypes = [
      {
        name: 'BPS',
        thresholdType: ThresholdType.Counter,
        threshold: 1,
        periodType: null,
        period: null,
        counter: null,
        faultsCount: null
      },
      {
        name: 'Brakes', thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'DZ sensor',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Contactors',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Slim line relays when used',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Roller Guides',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Guide Shoes',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Safety String Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Door Locks',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Closed Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Gate switch',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Door restrictor',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Cam Solenoid / If applicable',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Contactor Auxiliary Contacts',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null,
        counter: null, faultsCount: null
      },
      {
        name: 'Force guided relays on the MRU board. ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'CC lamps ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'HC lamps ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Position Indicators ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Discrete PI driver board relays ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Governor Switch ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Governor Mechanical ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: '(1 Year Test)',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: '(5 Year Test) ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: '(10 Year Test) ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'ERD and Battery Lowering Batteries ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Time battery ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Tape Cleaning ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Load weighing calibration ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Cab lights ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Cab fan ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Controller fan',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'COP backup battery ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'CC security contacts ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Photo eye/light curtain/ safety edge ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Door cleaning/ inspection ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'GUI ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Encoder ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Ride quality ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Floor adjustments ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Oil level ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Jack packing ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Cleaning pit ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Clean car top ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Clean door sills ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
      {
        name: 'Check valves ',
        thresholdType: ThresholdType.Counter,
        threshold: 1, periodType: null, period: null, counter: null, faultsCount: null
      },
    ];
  }

  createForm() {
    this.notificationSettingForm = new UntypedFormGroup({
      configurationType: new UntypedFormControl('', [Validators.required]),
      notificationMethod: new UntypedFormControl('', [Validators.required]),

      severity: new UntypedFormControl('', [Validators.required]),
      partType: new UntypedFormControl('', [Validators.required]),

      alertType: new UntypedFormControl('', [Validators.required]),
      alert: new UntypedFormControl('', [Validators.required]),
    });
  }

  onSave() {
  }

  getNotificationMethod(notificationMethod) {
    return NotificationMethod[notificationMethod];
  }

  getConfigurationType(configurationType) {
    return ConfigurationType[configurationType];
  }

  getSeverity(severity) {
    return Severity[severity];
  }

  getAlertType(alertType) {
    return AlertType[alertType];
  }

  onSubmit() {
    this.router.navigateByUrl('pages/predictive-maintenance/notification-settings');
  }

  onCancel() {
    this.modelref.hide();
  }

  onConfigurationTypeChanged(event) {
    this.configurationType = event;
    this.notificationSettingForm.patchValue({
      severity: null,
      partType: null,
      alertType: null,
      alert: null,
    });
  }
}

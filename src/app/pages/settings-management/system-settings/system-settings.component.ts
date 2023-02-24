import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SmartriseValidators } from '../../../_shared/constants';
import { ISystemSettings } from '../../../_shared/models/settings';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { PermissionService } from '../../../services/permission.service';
import { SettingService } from '../../../services/setting.service';
import { trimValidator } from '../../../_shared/validators/trim-validator';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent extends BaseComponent implements OnInit {

  isSaving = false;
  systemSettings: ISystemSettings;
  systemSettingsForm: UntypedFormGroup;
  canUpdateSystemSettings: boolean;
  formSubmitted: boolean;

  constructor(
    private settingsService: SettingService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    baseService: BaseComponentService
    ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.createSystemSettingsForm();
    this.enableUpdateSystemSettings();
    this.settingsService.getSystemSettings().subscribe((response) => {
      this.systemSettings = response;
      this.createSystemSettingsForm();
    }, () => {
    });
  }

  enableUpdateSystemSettings() {
    this.canUpdateSystemSettings = this.permissionService.hasPermission('SystemSettingsUpdate');
  }

  onSubmit() {

    this.formSubmitted = true;
    if(this.systemSettingsForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.settingsService.updateSystemSettings(this.systemSettingsForm.value).subscribe(() => {
      this.messageService.showSuccessMessage('System settings have been updated successfully');
      this.isSaving = false;
    }, () => {
      this.isSaving = false;
    });
  }

  createSystemSettingsForm() {

    if (!this.systemSettings) {
      this.systemSettings = {
        smtpFrom: '',
        smtpHost: '',
        smtpUsername: '',
        smtpPassword: '',
        smtpPort: '',
        smtpSsl: false,
        smtpReplyTo: '',
        smtpBccs: '',
        uiUrl: ''
      };
    }

    this.systemSettingsForm = new UntypedFormGroup({
      smtpFrom: new UntypedFormControl('', [Validators.required, SmartriseValidators.smartriseEmail, trimValidator]),
      smtpReplyTo: new UntypedFormControl('', [Validators.required, SmartriseValidators.smartriseEmail, trimValidator]),
      smtpPassword: new UntypedFormControl('', [Validators.required]),
      smtpUsername: new UntypedFormControl('', [Validators.required]),
      smtpPort: new UntypedFormControl('', [Validators.required]),
      smtpHost: new UntypedFormControl('', [Validators.required]),
      smtpBccs: new UntypedFormControl('', ),
      smtpSsl: new UntypedFormControl(false),
      uiUrl: new UntypedFormControl('', [Validators.required]),
    });
    this.systemSettingsForm.markAllAsTouched();
    this.systemSettingsForm.setValue(this.systemSettings);
  }
}

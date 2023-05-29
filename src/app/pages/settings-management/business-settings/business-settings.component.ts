import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { PermissionService } from '../../../services/permission.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { SelectHelperService } from '../../../services/select-helper.service';

@Component({
  selector: 'ngx-business-settings',
  templateUrl: './business-settings.component.html',
  styleUrls: ['./business-settings.component.scss']
})
export class BusinessSettingsComponent extends BaseComponent implements OnInit {

  isSaving = false;
  businessSettings: IBusinessSettings;

  numberOfRecords = new UntypedFormControl('', [Validators.required]);

  businessSettingsForm: UntypedFormGroup = new UntypedFormGroup({
    numberOfRecords: this.numberOfRecords,
  });

  canUpdateBusinessSettings: boolean;
  formSubmitted: boolean;

  constructor(
    private settingsService: SettingService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    private selectHelperService: SelectHelperService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    // this.createBusinessSettingsForm();
    this.businessSettingsForm.markAllAsTouched();
    this.enableUpdateSystemSettings();

    this.settingsService.getBusinessSettings().subscribe((response) => {
      this.businessSettings = response;
      this.createBusinessSettingsForm();
    }, () => {
    });
  }

  enableUpdateSystemSettings() {
    this.canUpdateBusinessSettings = this.permissionService.hasPermission('BusinessSettingsUpdate');
  }

  onSubmit() {

    this.formSubmitted = true;
    if (this.businessSettingsForm.invalid) {
      return;
    }


    this.isSaving = true;
    this.businessSettings = this.businessSettingsForm.value;
    this.businessSettings.numberOfRecords = +this.businessSettings.numberOfRecords;
    this.settingsService.updateBusinessSettings(this.businessSettings).subscribe(() => {
      this.isSaving = false;
      this.messageService.showSuccessMessage('Business settings have been updated successfully');
    }, () => {
      this.isSaving = false;
    });
  }

  onClickNumberOfRecords() {
    this.selectHelperService.allowOnScroll.next(false);
  }

  createBusinessSettingsForm() {

    if (this.businessSettings === null) {
      this.businessSettings = {
        numberOfRecords: null,
      };
    }

    this.numberOfRecords.setValue(this.businessSettings.numberOfRecords.toString());
  }
}

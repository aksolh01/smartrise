import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRole } from '../../../../_shared/models/role';
import { ISmartriseUser } from '../../../../_shared/models/ISmartriseUser';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { SmartriseValidators } from '../../../../_shared/constants';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-create-smartrise-user',
  templateUrl: './create-smartrise-user.component.html',
  styleUrls: ['./create-smartrise-user.component.scss'],
})
export class CreateSmartriseUserComponent implements OnInit {
  smartriseUserForm: UntypedFormGroup;
  smartriseUser: ISmartriseUser;
  roles: IRole[] = [];
  isLoading = false;
  isLoadingForm = true;
  formSubmitted = false;
  rolesTouched: boolean;
  isSaving = false;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private messageService: MessageService
  ) {}

  static requiredWithTrim(control: UntypedFormControl): { [key: string]: boolean } {
    if (control.value.trim() === '') {
      return { requiredWithTrim: true };
    }
    return null;
  }

  ngOnInit(): void {
    this.accountService.getSmartriseRoles().subscribe(
      (roles) => {
        this.roles = roles;
        this.isLoadingForm = false;
      },
      () => {
        this.isLoadingForm = false;
      }
    );
    this.createSmartriseUserForm();
  }

  createSmartriseUserForm() {
    this.smartriseUser = {
      firstName: '',
      lastName: '',
      email: '',
      rolesNames: [],
    };
    this.smartriseUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [
        CreateSmartriseUserComponent.requiredWithTrim,
        trimValidator,
      ]),
      lastName: new UntypedFormControl('', [
        CreateSmartriseUserComponent.requiredWithTrim,
        trimValidator,
      ]),
      email: new UntypedFormControl('', [
        SmartriseValidators.requiredWithTrim,
        trimValidator,
        SmartriseValidators.smartriseEmail,
      ]),
      rolesNames: new UntypedFormControl([], Validators.required),
    });
    this.rolesTouched = true;
    this.smartriseUserForm.markAllAsTouched();
  }

  onSubmit() {
    if (this.isSaving) {
      return;
    }

    this.formSubmitted = true;
    if (this.smartriseUserForm.invalid) {
      return;
    }

    this.isSaving = true;
    this.smartriseUser = {
      ...this.smartriseUserForm.value,
    };
    this.isLoading = true;
    this.accountService.createSmartriseUser(this.smartriseUser).subscribe(
      () => {
        this.isLoading = false;
        this.messageService.showSuccessMessage(
          'Smartrise user has been created successfully'
        );
        this.router.navigateByUrl('pages/settings-management/smartrise-users');
      },
      () => {
        this.isLoading = false;
        this.isSaving = false;
      }
    );
  }

  onClose() {
    this.router.navigateByUrl('pages/settings-management/smartrise-users');
  }
}

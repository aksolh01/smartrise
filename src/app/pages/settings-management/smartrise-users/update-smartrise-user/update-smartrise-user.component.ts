import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IRole } from '../../../../_shared/models/role';
import { IGetSmartriseUser } from '../../../../_shared/models/IGetSmartriseUser';
import { AccountService } from '../../../../services/account.service';
import { MessageService } from '../../../../services/message.service';
import { trimValidator } from '../../../../_shared/validators/trim-validator';

@Component({
  selector: 'ngx-update-smartrise-user',
  templateUrl: './update-smartrise-user.component.html',
  styleUrls: ['./update-smartrise-user.component.scss'],
})
export class UpdateSmartriseUserComponent implements OnInit {
  smartriseUserForm: UntypedFormGroup;
  smartriseUser: IGetSmartriseUser;
  roles: IRole[] = [];
  isLoading = false;
  isFormReady: boolean;
  rolesChanged = false;
  formSubmitted = false;
  rolesTouched: boolean;
  isSaving = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private messageService: MessageService,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('@userName', { skip: true });
  }

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    this.isFormReady = false;

    forkJoin([
      this.accountService.getSmartriseRoles(),
      this.accountService.getSmartriseUser(userId),
    ]).subscribe(([roles, user]) => {
      this.roles = roles;
      this.smartriseUser = user;
      this.bcService.set('@userName', this.smartriseUser.firstName + ' ' + this.smartriseUser.lastName);
      this.bcService.set('@userName', { skip: false });
      this.createSmartriseUserForm(user);
      this.isFormReady = true;
    }, () => {
      this.router.navigate(['..'], { relativeTo: this.route });
    });
  }

  createSmartriseUserForm(user: IGetSmartriseUser) {
    this.smartriseUserForm = new UntypedFormGroup({
      firstName: new UntypedFormControl(user.firstName, Validators.required),
      lastName: new UntypedFormControl(user.lastName, Validators.required),
      email: new UntypedFormControl(user.email, [Validators.required, trimValidator, Validators.email]),
      roles: new UntypedFormControl(user.roles.map((m) => m.name), Validators.required)
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
    const smartriseUser = {
      id: this.smartriseUser.id,
      roles: this.smartriseUserForm.value.roles,
    };
    this.isLoading = true;
    this.accountService.updateSmartriseUser(smartriseUser).subscribe(
      () => {
        this.isLoading = false;
        this.messageService.showSuccessMessage('Smartrise user has been updated successfully');
        this.router.navigate(['..'], { relativeTo: this.route });
      },
      () => {
        this.isLoading = false;
        this.isSaving = false;
      }
    );
  }

  onRoleChanged() {
    this.rolesChanged = true;
  }

  onClose() {
    this.router.navigateByUrl('pages/settings-management/smartrise-users');
  }
}

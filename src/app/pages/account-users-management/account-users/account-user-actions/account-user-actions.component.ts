import { Component, EventEmitter, OnInit } from '@angular/core';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { PERMISSIONS } from '../../../../_shared/constants';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-account-user-actions',
  templateUrl: './account-user-actions.component.html',
  styleUrls: ['./account-user-actions.component.scss']
})
export class AccountUserActionsComponent extends BaseComponent implements OnInit {

  editUser = new EventEmitter<any>();
  resetPassword = new EventEmitter<any>();
  activateUser = new EventEmitter<any>();
  deactivateUser = new EventEmitter<any>();
  resendInvitation = new EventEmitter<any>();
  impersonateLogin = new EventEmitter<any>();

  value: string | number;
  rowData: any;

  canUpdateAccountUser = true;
  canResendInvitation = true;
  canResetPassword = true;
  canActivateAccountUser = true;
  canDeactivateAccountUser = true;
  canActivateUser2FA = true;
  canDeactivateUser2FA = true;
  canViewAs = true;

  constructor(
    baseService: BaseComponentService,
    private permissionService: PermissionService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.enableUpdateAccountUser();
    this.enableResendInvitation();
    this.enableResetPasswordRequest();
    this.enableActivateAccountUser();
    this.enableDeactivateAccountUser();
    this._enableDisableViewAs();
  }

  private _enableDisableViewAs() {
    this.canViewAs =
      this.rowData.emailConfirmed === true &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountImpersonate);
  }

  enableUpdateAccountUser() {
    this.canUpdateAccountUser = this.permissionService.hasPermission('AccountUsersUpdate');
  }

  enableResendInvitation() {
    if (!this.permissionService.hasPermission('AccountUsersResendLink')) {
this.canResendInvitation = false;
} else if (this.rowData.emailConfirmed) {
this.canResendInvitation = false;
} else {
this.canResendInvitation = true;
}
  }

  enableResetPasswordRequest() {
    if (!this.permissionService.hasPermission('AccountUsersResetPassword')) {
      this.canResetPassword = false;
    } else if (!this.rowData.emailConfirmed) {
      this.canResetPassword = false;
    } else {
      this.canResetPassword = true;
    }
  }

  enableActivateAccountUser() {
    this.canActivateAccountUser = this.permissionService.hasPermission('AccountUsersActivate');
  }

  enableDeactivateAccountUser() {
    this.canDeactivateAccountUser = this.permissionService.hasPermission('AccountUsersDeactivate');
  }

  onEditUser(data: any) {
    this.editUser.emit(data);
  }

  onResetPassword(data: any) {
    this.resetPassword.emit(data);
  }

  onActivateUser(data: any) {
    this.activateUser.emit(data);
  }

  onDeactivateUser(data: any) {
    this.deactivateUser.emit(data);
  }

  onResendInvitation(data: any) {
    this.resendInvitation.emit(data);
  }

  disableResendInvitationAction() {
    if (this.disable('AccountUsersResendInvitation') === 'true') {
return 'true';
} else if (this.rowData.emailConfirmed) {
return 'true';
}
    return null;
  }

  disableResetPasswordRequest() {
    if (this.disable('AccountUsersResetPassword') === 'true') {
      return 'true';
    } else if (!this.rowData.emailConfirmed) {
      return 'true';
    }
    return null;
  }

  onImpersonateLogin(rowData) {
    this.impersonateLogin.emit(rowData);
  }
}

import { Component, EventEmitter, OnInit } from '@angular/core';
import { PERMISSIONS } from '../../../../_shared/constants';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-customer-user-actions',
  templateUrl: './customer-user-actions.component.html',
  styleUrls: ['./customer-user-actions.component.scss']
})
export class CustomerUserActionsComponent extends BaseComponent implements OnInit {

  editUser = new EventEmitter<any>();
  resetPassword = new EventEmitter<any>();
  activateUser = new EventEmitter<any>();
  deactivateUser = new EventEmitter<any>();
  resendInvitation = new EventEmitter<any>();

  value: string | number;
  rowData: any;

  canUpdateCustomerUser = true;
  canResendInvitationLink = true;
  canSendResetPasswordRequest = true;
  canActivateUser = true;
  canDeactivateUser = true;
  canActivateUser2FA = true;
  canDeactivateUser2FA = true;

  constructor(
    baseService: BaseComponentService,
    private permissionService: PermissionService,
    ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.enableUpdateCustomerUser();
    this.enableSendResetPasswordRequest();
    this.enableResendInvitationLink();
    this.enableActivateUser();
    this.enableDeactivateUser();
    this.enableActivateUser2FA();
    this.enableDeactivateUser2FA();
  }

  enableDeactivateUser2FA() {
    this.canDeactivateUser2FA = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersDeactivate2FA);
  }

  enableActivateUser2FA() {
    this.canActivateUser2FA = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersActivate2FA);
  }

  enableUpdateCustomerUser() {
    this.canUpdateCustomerUser = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersUpdate);
  }

  enableResendInvitationLink() {
    if (!this.permissionService.hasPermission(PERMISSIONS.CustomerUsersResendInvitationLink)) {
this.canResendInvitationLink = false;
} else if (this.rowData.emailConfirmed) {
this.canResendInvitationLink = false;
} else {
this.canResendInvitationLink = true;
}
  }

  enableSendResetPasswordRequest() {
    if (!this.permissionService.hasPermission(PERMISSIONS.CustomerUsersResetPassword)) {
      this.canSendResetPasswordRequest = false;
    } else if (!this.rowData.emailConfirmed) {
      this.canSendResetPasswordRequest = false;
    } else {
      this.canSendResetPasswordRequest = true;
    }
  }

  enableActivateUser() {
    this.canActivateUser = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersActivate);
  }

  enableDeactivateUser() {
    this.canDeactivateUser = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersDeactivate);
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
    if (this.disable('CustomerUsersResendInvitation') === 'true') {
return 'true';
} else if (this.rowData.emailConfirmed) {
return 'true';
}
    return null;
  }

  disableResetPasswordRequest() {
    if (this.disable('CustomerUsersResetPassword') === 'true') {
      return 'true';
    } else if (!this.rowData.emailConfirmed) {
      return 'true';
    }
    return null;
  }
}

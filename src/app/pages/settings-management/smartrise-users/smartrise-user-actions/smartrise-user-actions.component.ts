import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-smartrise-user-actions',
  templateUrl: './smartrise-user-actions.component.html',
  styleUrls: ['./smartrise-user-actions.component.scss']
})
export class SmartriseUserActionsComponent extends BaseComponent implements OnInit, ViewCell {

  editUser = new EventEmitter<any>();
  resetPassword = new EventEmitter<any>();
  activateUser = new EventEmitter<any>();
  deactivateUser = new EventEmitter<any>();
  resendInvitation = new EventEmitter<any>();

  value: string | number;
  rowData: any;

  canUpdateSmrtriseUser = true;
  canResendInvitation = true;
  canResetPassword = true;
  canActivateSmartriseUser = true;
  canDeactivateSmartriseUser = true;
  canActivateUser2FA = true;
  canDeactivateUser2FA = true;

  constructor(baseService: BaseComponentService,
    private permissionService: PermissionService) {
    super(baseService);
  }

  ngOnInit(): void {
    this.enableUpdateSmartriseUser();
    this.enableResendInvitation();
    this.enableResetPasswordRequest();
    this.enableActivateSmartriseUser();
    this.enableDeactivateSmartriseUser();
  }

  enableUpdateSmartriseUser() {
    this.canUpdateSmrtriseUser = this.permissionService.hasPermission('SmartriseUsersUpdate');
  }

  enableResendInvitation() {
    if (!this.permissionService.hasPermission('SmartriseUsersResendLink')) {
this.canResendInvitation = false;
} else if (this.rowData.emailConfirmed) {
this.canResendInvitation = false;
} else {
this.canResendInvitation = true;
}
  }

  enableResetPasswordRequest() {
    if (!this.permissionService.hasPermission('SmartriseUsersResetPassword')) {
      this.canResetPassword = false;
    } else if (!this.rowData.emailConfirmed) {
      this.canResetPassword = false;
    } else {
      this.canResetPassword = true;
    }
  }

  enableActivateSmartriseUser() {
    this.canActivateSmartriseUser = this.permissionService.hasPermission('SmartriseUsersActivate');
  }

  enableDeactivateSmartriseUser() {
    this.canDeactivateSmartriseUser = this.permissionService.hasPermission('SmartriseUsersDeactivate');
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
    if (this.disable('SmartriseUsersResendInvitation') === 'true') {
return 'true';
} else if (this.rowData.emailConfirmed) {
return 'true';
}
    return null;
  }

  disableResetPasswordRequest() {
    if (this.disable('SmartriseUsersResetPassword') === 'true') {
      return 'true';
    } else if (!this.rowData.emailConfirmed) {
      return 'true';
    }
    return null;
  }
}

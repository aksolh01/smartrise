import { Component, EventEmitter, OnInit } from '@angular/core';
import { PERMISSIONS } from '../../../../_shared/constants';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { BaseComponent } from '../../../base.component';
import { TokenService } from '../../../../services/token.service';
import { ICustomerUserLookup } from '../../../../_shared/models/ICustomerUserLookup';

@Component({
  selector: 'ngx-customer-user-actions',
  templateUrl: './customer-user-actions.component.html',
  styleUrls: ['./customer-user-actions.component.scss']
})
export class CustomerUserActionsComponent extends BaseComponent implements OnInit {

  editUser = new EventEmitter<any>();
  resetPassword = new EventEmitter<any>();
  resendInvitation = new EventEmitter<any>();

  value: string | number;
  rowData: any;

  canUpdateCustomerUser = true;
  canResendInvitationLink = true;
  canSendResetPasswordRequest = true;

  constructor(
    baseService: BaseComponentService,
    private permissionService: PermissionService,
    private tokenService: TokenService
  ) {
    super(baseService);
  }

  get recordBelongsToLoggedInUser() {
    return this._isLoggedInUser();
  }

  ngOnInit(): void {
    this.enableUpdateCustomerUser();
    this.enableSendResetPasswordRequest();
    this.enableResendInvitationLink();
  }

  enableUpdateCustomerUser() {
    this.canUpdateCustomerUser = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersUpdate)
      && this.rowData.canUpdateUser === true;
  }

  enableResendInvitationLink() {
    this.canResendInvitationLink = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersResendInvitationLink)
      && this.rowData.emailConfirmed === false
      && this.rowData.canTakeAction === true;
  }

  enableSendResetPasswordRequest() {
    this.canSendResetPasswordRequest = this.permissionService.hasPermission(PERMISSIONS.CustomerUsersResetPassword)
      && this.rowData.emailConfirmed === true
      && this.rowData.canTakeAction === true;
  }

  onEditUser(data: any) {
    this.editUser.emit(data);
  }

  onResetPassword(data: any) {
    this.resetPassword.emit(data);
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

  private _isLoggedInUser(): boolean {
    return this.rowData.id === this.tokenService.getProperty("UserId");
  }
}

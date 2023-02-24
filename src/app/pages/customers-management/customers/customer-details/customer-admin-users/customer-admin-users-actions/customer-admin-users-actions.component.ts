import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { PERMISSIONS } from '../../../../../../_shared/constants';
import { PermissionService } from '../../../../../../services/permission.service';

@Component({
  selector: 'ngx-customer-admin-users-actions',
  templateUrl: './customer-admin-users-actions.component.html',
  styleUrls: ['./customer-admin-users-actions.component.scss']
})
export class CustomerAdminUsersActionsComponent implements OnInit, ViewCell {

  resetPassword = new EventEmitter<any>();
  resendInvitationEmail = new EventEmitter<any>();
  activateUser = new EventEmitter<any>();
  deactivateUser = new EventEmitter<any>();
  editUser = new EventEmitter<any>();

  canActivateUser = true;
  canDeactivateUser = true;
  canResendInvitationLink = true;
  canResetAdminAccountPassword = true;
  canUpdateCustomerUser = true;
  customerIsDeleted = false;

  constructor(
    protected permissionService: PermissionService) { }

  value: string | number;
  rowData: any;

  ngOnInit(): void {
    this.enableResendInvitationLink();
    this.enableResetAdminAccountPassword();
    this.enableActivateUser();
    this.enableDeactivateUser();
    this.enableEditUser();
  }

  enableResendInvitationLink() {
    this.canResendInvitationLink =
      this.rowData.emailConfirmed === false &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountResendInvitationLink) &&
      !this.rowData.customerIsDeleted;
  }

  enableResetAdminAccountPassword() {
    this.canResetAdminAccountPassword =
      this.rowData.emailConfirmed === true &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountResetPassword) &&
      !this.rowData.customerIsDeleted;
  }

  enableActivateUser() {
    this.canActivateUser = this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountActivate);
  }

  enableDeactivateUser() {
    this.canDeactivateUser = this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountDeactivate);
  }

  enableEditUser() {
    this.canUpdateCustomerUser = this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountUpdate);
  }

  onResetPassword(rowData) {
    this.resetPassword.emit(rowData);
  }

  onResendInvitationEmail(rowData) {
    this.resendInvitationEmail.emit(rowData);
  }

  onActivateUser(data: any) {
    this.activateUser.emit(data);
  }

  onDeactivateUser(data: any) {
    this.deactivateUser.emit(data);
  }

  onEditUser(data: any) {
    this.editUser.emit(data);
  }
}

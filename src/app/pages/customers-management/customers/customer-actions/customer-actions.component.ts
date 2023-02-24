import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { PERMISSIONS } from '../../../../_shared/constants';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-customer-actions',
  templateUrl: './customer-actions.component.html',
  styleUrls: ['./customer-actions.component.scss']
})
export class CustomerActionsComponent extends BaseComponent implements OnInit, ViewCell {

  value: string | number;
  rowData: any;

  canCreateAdministratorAccount = true;
  canViewCustomerDetails = true;
  canResendInvitationLink = true;
  canAddToFavorite = true;
  canRemoveFromFavorite = true;
  canResetAdminAccountPassword = true;
  canViewAs = true;

  showDetails = new EventEmitter<any>();
  manageUsers = new EventEmitter<any>();
  resetPassword = new EventEmitter<any>();
  resendInvitationEmail = new EventEmitter<any>();
  impersonateLogin = new EventEmitter<any>();
  addToFavorite = new EventEmitter<any>();
  removeFromFavorite = new EventEmitter<any>();

  constructor(baseService: BaseComponentService,
    private permissionService: PermissionService,
    ) {
    super(baseService);
  }

  enableCreateAdministratorAccount() {
    this.canCreateAdministratorAccount =
      !this.rowData.isDeleted &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountCreate);
  }

  enableViewDetails() {
    this.canViewCustomerDetails = this.permissionService.hasPermission(PERMISSIONS.CustomerDetail);
  }

  enableResendInvitationLink() {
    this.canResendInvitationLink =
      this.rowData.hasAdminAccount === true &&
      this.rowData.lastLogin === null &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountResendInvitationLink) &&
      !this.rowData.isDeleted;
  }

  enableAddToFavorite() {
    this.canAddToFavorite = !this.rowData.isDeleted;
  }

  enableRemoveFromFavorite() {
    this.canRemoveFromFavorite = !this.rowData.isDeleted;
  }

  enableResetAdminAccountPassword() {
    this.canResetAdminAccountPassword =
      this.rowData.hasAdminAccount === true &&
      this.rowData.lastLogin !== null &&
      this.permissionService.hasPermission(PERMISSIONS.AdministratorAccountResetPassword) &&
      !this.rowData.isDeleted;
  }

  enableViewAs() {
    this.canViewAs = this.rowData.hasAdminAccount === true &&
      this.rowData.lastLogin !== null &&
      !this.rowData.isDeleted;
  }

  ngOnInit(): void {
    this.enableCreateAdministratorAccount();
    this.enableViewDetails();
    this.enableResendInvitationLink();
    this.enableAddToFavorite();
    this.enableRemoveFromFavorite();
    this.enableResetAdminAccountPassword();
    this.enableViewAs();
  }

  onShowDetails(rowData) {
    this.showDetails.emit(rowData);
  }

  onOpenCreateAccountModal(rowData) {
    this.manageUsers.emit(rowData);
  }

  onResetPassword(rowData) {
    this.resetPassword.emit(rowData);
  }

  onResendInvitationEmail(rowData) {
    this.resendInvitationEmail.emit(rowData);
  }

  onImpersonateLogin(rowData) {
    this.impersonateLogin.emit(rowData);
  }

  AddToFavorite(rowData) {
    this.addToFavorite.emit(rowData);
  }

  RemoveFromFavorite(rowData) {
    this.removeFromFavorite.emit(rowData);
  }
}

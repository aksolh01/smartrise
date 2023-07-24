import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { PERMISSIONS, ResourceTypeConstants, TaskStatusConstants } from '../../../../../_shared/constants';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { PermissionService } from '../../../../../services/permission.service';
import { BaseComponent } from '../../../../base.component';
import { MiscellaneousService } from '../../../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-job-files-list-actions',
  templateUrl: './job-files-list-actions.component.html',
  styleUrls: ['./job-files-list-actions.component.scss']
})
export class JobFilesListActionsComponent extends BaseComponent implements OnInit, ViewCell {

  viewDetails = new EventEmitter<any>();
  generateFile = new EventEmitter<any>();
  download = new EventEmitter<any>();
  refreshResource = new EventEmitter<any>();
  refreshChanged = new EventEmitter<any>();
  uploadFile = new EventEmitter<any>();
  removeUploadedFile = new EventEmitter<any>();

  otherResourceType = ResourceTypeConstants.Other;
  pendingStatus = TaskStatusConstants.Pending;

  canDownloadFile = true;
  canGenerateFile = true;
  canViewDetails = true;
  canManageFiles = false;

  value: string | number;
  rowData: any;
  isRefreshing: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  onUpload() {
    this.uploadFile.emit(this.rowData);
  }

  ngOnInit(): void {
    this.enableGenerateFile();
    this.enableDownloadFile();
    this.enableViewDetails();
    this.refreshChanged.subscribe(isRefreshing => {
      this.isRefreshing = isRefreshing;
    });
    this.canManageFiles = this.permissionService.hasPermission(PERMISSIONS.ManageJobFiles);
  }

  onRemoveUploadedFile() {
    this.removeUploadedFile.emit(this.rowData);
  }

  enableDownloadFile() {
    this.changeDetectorRef.markForCheck();
    this.canDownloadFile = this.rowData.readyForDownload;
  }

  disableDownloadFile() {
    this.changeDetectorRef.markForCheck();
    this.canDownloadFile = false;
  }

  enableGenerateFile() {
    this.changeDetectorRef.markForCheck();
    if (this.miscellaneousService.isCustomerUser()) {
      this.canGenerateFile = this.permissionService.hasPermissionInAccount(PERMISSIONS.GenerateResourceFile,
        this.rowData.account.id);
    } else {
      this.canGenerateFile = this.permissionService.hasPermission(PERMISSIONS.GenerateResourceFile);
    }
  }

  disableGenerateFile() {
    this.changeDetectorRef.markForCheck();
    this.canGenerateFile = false;
  }

  enableViewDetails() {
    this.changeDetectorRef.markForCheck();
    this.canViewDetails = this.permissionService.hasPermission('JobsDetail');
  }

  onDownload(rowData: any) {
    this.download.emit(rowData);
  }

  onViewDetails(rowData: any) {
    this.viewDetails.emit(rowData);
  }

  onGenerateFile(rowData: any) {
    this.generateFile.emit(rowData);
  }

  onRefreshResource(rowData: any) {
    this.refreshResource.emit(rowData);
  }
}

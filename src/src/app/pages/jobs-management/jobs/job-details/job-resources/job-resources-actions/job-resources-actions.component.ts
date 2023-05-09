import { ChangeDetectorRef, Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { ResourceTypeConstants, TaskStatusConstants } from '../../../../../../_shared/constants';
import { PermissionService } from '../../../../../../services/permission.service';

@Component({
  selector: 'ngx-smr-job-resources-actions',
  templateUrl: './job-resources-actions.component.html',
  styleUrls: ['./job-resources-actions.component.scss']
})
export class JobResourcesActionsComponent implements ViewCell, OnInit {

  value: string | number;
  rowData: any;

  isRefreshing = false;
  otherResourceType = ResourceTypeConstants.Other;
  pendingStatus = TaskStatusConstants.Pending;

  createNewRequest = new EventEmitter<any>();
  downloadFile = new EventEmitter<any>();
  refreshResource = new EventEmitter<any>();
  refreshChanged = new EventEmitter<any>();
  rowChanged = new EventEmitter<any>();
  canDownloadFile = false;
  canGenerateFile = false;
  denyGenerateFile = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private permissionService: PermissionService) {
    // this.ref.detectChanges();
  }
  
  onCreateNewRequest(rowData) {
    this.createNewRequest.emit(rowData);
  }

  onDownloadFile(rowData) {
    this.downloadFile.emit(rowData);
  }

  onRefreshResource(rowData) {
    this.isRefreshing = true;
    this.refreshResource.emit(rowData);
  }

  ngOnInit(): void {
    this.canGenerateFile = this.permissionService.hasPermission('GenerateResourceFile');
    this.enableGenerateFile();
    this.enableDownloadFile();
    this.refreshChanged.subscribe(isRefreshing => {
      this.isRefreshing = isRefreshing;
    });
    this.rowChanged.subscribe((row) => {
      this.rowData = row;
      
    });
    
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
    this.denyGenerateFile = !this.rowData?.canCreateANewRequest || this.rowData?.resourceType?.value === this.otherResourceType;
  }

  disableGenerateFile() {
    this.changeDetectorRef.markForCheck();
    this.denyGenerateFile = true;
  }
}

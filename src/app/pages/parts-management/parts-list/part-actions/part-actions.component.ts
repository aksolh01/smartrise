import { Component, EventEmitter, OnInit } from '@angular/core';
import { BaseComponentService } from '../../../../services/base-component.service';
import { PermissionService } from '../../../../services/permission.service';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-part-actions',
  templateUrl: './part-actions.component.html',
  styleUrls: ['./part-actions.component.scss']
})
export class PartActionsComponent implements ViewCell, OnInit {

  value: string | number;
  rowData: any;

  canViewDetails = true;

  showDetails = new EventEmitter<any>();

  constructor(
    private permissionService: PermissionService,
  ) {
  }

  ngOnInit(): void {
    this.enableViewDetails();
  }

  enableViewDetails() {
    this.canViewDetails = this.permissionService.hasPermission('PartsListing');
  }

  onShowDetails() {
    this.showDetails.emit(this.rowData.id);
  }
}

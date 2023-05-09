import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { PermissionService } from '../../../../../services/permission.service';
import { BaseComponent } from '../../../../base.component';

@Component({
  selector: 'ngx-shipment-actions',
  templateUrl: './shipment-actions.component.html',
  styleUrls: ['./shipment-actions.component.scss']
})
export class ShipmentActionsComponent extends BaseComponent implements OnInit, ViewCell {

  value: string | number;
  rowData: any;

  canViewDetails = true;

  showDetails = new EventEmitter<any>();

  constructor(
    private permissionService: PermissionService,
    baseService: BaseComponentService,
    ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.enableViewDetails();
  }

  enableViewDetails() {
    this.canViewDetails = this.permissionService.hasPermission('JobsDetail');
  }

  onShowDetails() {
    this.showDetails.emit(this.rowData);
  }
}

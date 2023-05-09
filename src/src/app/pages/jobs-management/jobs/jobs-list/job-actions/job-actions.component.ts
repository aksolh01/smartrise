import { Component, OnInit } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AccountService } from '../../../../../services/account.service';
import { BaseComponentService } from '../../../../../services/base-component.service';
import { PermissionService } from '../../../../../services/permission.service';
import { BaseComponent } from '../../../../base.component';

@Component({
  selector: 'ngx-job-actions',
  templateUrl: './job-actions.component.html',
  styleUrls: ['./job-actions.component.scss']
})
export class JobActionsComponent extends BaseComponent implements ViewCell, OnInit {

  value: string | number;
  rowData: any;

  canViewDetails = true;

  showDetails = new EventEmitter<any>();

  constructor(
    baseService: BaseComponentService,
    private accountService: AccountService,
    private permissionService: PermissionService,
    private modelService: BsModalService
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
    this.showDetails.emit(this.rowData.id);
  }
}
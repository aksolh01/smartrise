import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { PermissionService } from '../../../../services/permission.service';
import { PERMISSIONS } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-detail-actions-bar',
  templateUrl: './detail-actions-bar.component.html',
  styleUrls: ['./detail-actions-bar.component.scss']
})
export class DetailActionsBarComponent implements OnInit {

  @Input() status: string = '';
  @Input() canEditQuote = false;
  @Input() isLocked: boolean = false;
  @Output() edit = new EventEmitter<any>();
  @Output() viewPricing = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<any>();

  constructor(
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService
  ) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.cancel.next("test");
  }

  onEdit() {
    this.edit.next("test");
  }

  onViewPricing() {
    this.viewPricing.next("test");
  }
}

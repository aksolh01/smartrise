import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountRolesSelectionService } from '../../../services/account-roles-selection.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { Ng2TableCellComponent } from '../ng2-table-cell/ng2-table-cell.component';

@Component({
  selector: 'ngx-remove-account-cell',
  templateUrl: './remove-account-cell.component.html',
  styleUrls: ['./remove-account-cell.component.scss']
})
export class RemoveAccountCellComponent extends Ng2TableCellComponent implements OnInit, OnDestroy {

  constructor(
    private accountRolesSelectionService: AccountRolesSelectionService,
    private miscellaneousService: MiscellaneousService,
    ) {
    super();
  }

  ngOnInit(): void {
    this.miscellaneousService.clean();
  }

  ngOnDestroy(): void {
  }

  onRemoveAccount() {
    this.miscellaneousService.openConfirmModal('Are you sure you want to remove this account?', () => {
      this.accountRolesSelectionService.removeAccount(this.rowData);
    });
  }
}

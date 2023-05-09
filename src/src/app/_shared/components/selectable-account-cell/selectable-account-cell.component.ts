import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AccountRolesSelectionService } from '../../../services/account-roles-selection.service';
import { Ng2TableCellComponent } from '../ng2-table-cell/ng2-table-cell.component';

@Component({
  selector: 'ngx-selectable-account-cell',
  templateUrl: './selectable-account-cell.component.html',
  styleUrls: ['./selectable-account-cell.component.scss'],
})
export class SelectableAccountCellComponent extends Ng2TableCellComponent implements OnInit, OnDestroy {

  @Input() isSelectable: boolean;

  constructor(private accountRolesSelectionService: AccountRolesSelectionService) {
    super();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  onAccountChecked(event) {
    this.rowData.isSelected = event;
    this.accountRolesSelectionService.accountSelected$.next(this.rowData);
    this.accountRolesSelectionService.roles$.next([]);
    this.accountRolesSelectionService.bubbleUpChangeNotification();
  }
}

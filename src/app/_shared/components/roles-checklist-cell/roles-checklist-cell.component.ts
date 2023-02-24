import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AccountRolesSelectionService } from '../../../services/account-roles-selection.service';
import { IRole } from '../../models/role';
import { InfoDialogData } from '../info-dialog/info-dialog-data';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';
import { Ng2TableCellComponent } from '../ng2-table-cell/ng2-table-cell.component';

@Component({
  selector: 'ngx-roles-checklist-cell',
  templateUrl: './roles-checklist-cell.component.html',
  styleUrls: ['./roles-checklist-cell.component.scss'],
})
export class RolesChecklistCellComponent extends Ng2TableCellComponent implements OnInit, OnDestroy {
  roles: IRole[];

  @Input() isAccountSelectable = false;

  modelRef: BsModalRef<InfoDialogData>;
  selectedRoles: string[] = [];
  anyRolesSelected = false;
  private _rolesSubscription: Subscription;
  private _roles: IRole[];
  private _accountSelectedSubscription: Subscription;


  constructor(
    private modalService: BsModalService,
    private accountRolesSelectionService: AccountRolesSelectionService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnDestroy(): void {
    this._rolesSubscription?.unsubscribe();
    this._accountSelectedSubscription?.unsubscribe();
    this.modalService?.hide();
  }

  ngOnInit(): void {

    this._rolesSubscription = this.accountRolesSelectionService.roles$.pipe(
      map(roles => {
        if (roles) {
          this._roles = roles;
        }
        return this._roles;
      }),
      map(roles => roles.map(r => ({ ...r }))),
      tap(roles => {
        this._loadSelectedRoles(roles);
      }),
    ).subscribe(roles => {
      this.roles = roles;
      this.cd.detectChanges();
    });

    this._accountSelectedSubscription = this.accountRolesSelectionService.accountSelected$.subscribe(row => {
      if (row === this.rowData) {
        this.rowData.roles = [];
      }
    });
  }

  private _loadSelectedRoles(roles: IRole[]) {
    this.selectedRoles = this.rowData.roles ?? [];
    this.selectedRoles.forEach(
      (m) => ((
        roles.filter((n) => n.name === m)[0] || { selected: undefined }
      ).selected = true)
    );
  }

  showPrivileges(role: IRole): void {
    const dialogData: InfoDialogData = {
      title: `${role.displayName} Role Privileges`,
      content: (role.rolesPrivileges || '').split('\n').sort((a, b) => a < b ? -1 : a > b ? 1 : 0),
      dismissButtonLabel: 'Close',
      showDismissButton: true,
      showAsBulltes: true
    };
    this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: dialogData
    });
  }

  onRoleChecked(role: IRole): void {
    if (this.selectedRoles.indexOf(role.name) === -1) {
      this.selectedRoles.push(role.name);
    } else {
      this.selectedRoles.splice(this.selectedRoles.indexOf(role.name), 1);
    }
    this.rowData.roles = this.selectedRoles;
    this._updateCountSelected();
    this.accountRolesSelectionService.bubbleUpChangeNotification();
  }

  private _updateCountSelected(): void {
    this.anyRolesSelected = !!this.selectedRoles.length;
  }
}

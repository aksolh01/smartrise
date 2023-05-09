import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IRole } from '../../models/role';
import {
  InfoDialogComponent,
} from '../info-dialog/info-dialog.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { InfoDialogData } from '../info-dialog/info-dialog-data';

@Component({
  selector: 'ngx-smr-roles-checklist',
  templateUrl: './roles-checklist.component.html',
  styleUrls: ['./roles-checklist.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RolesChecklistComponent),
      multi: true,
    },
  ],
})
export class RolesChecklistComponent implements ControlValueAccessor, OnDestroy, OnInit {
  @Input() hideTitle = false;
  @Input() title = 'Roles';
  @Input() roles: IRole[];
  @Input() disable = false;
  @Input() hideError = false;
  @Output() roleChanged: EventEmitter<any> = new EventEmitter();

  private _onChanged: any;
  private _onTouched: any;
  anyRolesSelected = false;
  @Input() isTouched = false;

  private selectedRoles: string[] = [];
  modelRef: any;

  constructor(private modalService: BsModalService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateCountSelected();
    });
  }

  markAsTouched() {
    if (!this.isTouched) {
      this._onTouched();
      this.isTouched = true;
    }
  }

  ngOnDestroy(): void {
    if (this.modelRef !== null && this.modelRef !== undefined) {
this.modelRef.hide();
}
  }

  onRoleChecked(role: IRole): void {
    if (this.selectedRoles.indexOf(role.name) === -1) {
      this.selectedRoles.push(role.name);
    } else {
      this.selectedRoles.splice(this.selectedRoles.indexOf(role.name), 1);
    }
    this.updateCountSelected();
    this.isTouched = true;
    if (this._onTouched) {
this._onTouched();
}
    if (this._onChanged) {
this._onChanged(this.selectedRoles);
}
    this.roleChanged.emit();
  }

  showPrivileges(role: IRole): void {
    const dialogData: InfoDialogData = {
      title: `${role.displayName} Role Privileges`,
      content: (role.rolesPrivileges || '').split('\n').sort((a,b) => a < b ? -1 : a > b ? 1 : 0),
      dismissButtonLabel: 'Close',
      showDismissButton: true,
      showAsBulltes: true
    };
    this.modelRef = this.modalService.show<InfoDialogData>(InfoDialogComponent, {
      initialState: dialogData
    });
  }

  writeValue(obj: string[]): void {
    this.selectedRoles = obj || [];
    this.selectedRoles.forEach(
      (m) =>
      ((
        this.roles.filter((n) => n.name === m)[0] || { selected: undefined }
      ).selected = true)
    );

    this.updateCountSelected();
  }

  registerOnChange(fn: any): void {
    this._onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disable = isDisabled || false;
  }

  private updateCountSelected(): void {
    this.anyRolesSelected = !!this.selectedRoles.length;
  }
}

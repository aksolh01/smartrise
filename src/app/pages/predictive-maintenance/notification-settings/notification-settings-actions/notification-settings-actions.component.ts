import { Component, OnInit, EventEmitter } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-notification-settings-actions',
  templateUrl: './notification-settings-actions.component.html',
  styleUrls: ['./notification-settings-actions.component.scss']
})
export class NotificationSettingsActionsComponent implements OnInit, ViewCell {

  value: string | number;
  rowData: any;
  edit = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onEdit() {
    this.edit.emit(this.rowData);
  }
}

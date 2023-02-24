import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-alerts-settings-actions',
  templateUrl: './alerts-settings-actions.component.html',
  styleUrls: ['./alerts-settings-actions.component.scss']
})
export class AlertsSettingsActionsComponent implements OnInit, ViewCell {

  value: string | number;
  rowData: any;

  removeNotificationSetting = new EventEmitter<any>();
  editNotificationSettings =  new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onDelete() {
    this.removeNotificationSetting.emit(this.rowData);
  }

  onEdit() {
    this.editNotificationSettings.emit(this.rowData);
  }
}

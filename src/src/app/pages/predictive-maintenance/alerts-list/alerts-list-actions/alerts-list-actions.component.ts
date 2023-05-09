import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-alerts-list-actions',
  templateUrl: './alerts-list-actions.component.html',
  styleUrls: ['./alerts-list-actions.component.scss']
})
export class AlertsListActionsComponent implements OnInit, ViewCell {

  viewAlert = new EventEmitter<any>();

  constructor() { }

  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onViewAlert() {
    this.viewAlert.emit(this.rowData);
  }
}

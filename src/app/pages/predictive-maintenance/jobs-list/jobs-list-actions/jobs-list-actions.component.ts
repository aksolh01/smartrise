import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-jobs-list-actions',
  templateUrl: './jobs-list-actions.component.html',
  styleUrls: ['./jobs-list-actions.component.scss']
})
export class JobsListActionsComponent implements OnInit, ViewCell {

  viewAlerts = new EventEmitter<any>();
  viewParts = new EventEmitter<any>();


  constructor() { }
  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onViewAlerts() {
    this.viewAlerts.emit(this.rowData);
  }

  onViewParts() {
    this.viewParts.emit(this.rowData);
  }
}

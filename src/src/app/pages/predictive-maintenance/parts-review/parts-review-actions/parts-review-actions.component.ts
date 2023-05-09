import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-parts-review-actions',
  templateUrl: './parts-review-actions.component.html',
  styleUrls: ['./parts-review-actions.component.scss']
})
export class PartsReviewActionsComponent implements OnInit, ViewCell {

  viewAlerts = new EventEmitter<any>();

  constructor() { }
  value: string | number;
  rowData: any;

  ngOnInit(): void {
  }

  onViewAlerts() {
    this.viewAlerts.emit(this.rowData);
  }
}

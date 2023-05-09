import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-open-quote-actions',
  templateUrl: './open-quote-actions.component.html',
  styleUrls: ['./open-quote-actions.component.scss']
})
export class OpenQuoteActionsComponent implements OnInit, ViewCell {

  canViewDetails = true;
  showDetails = new EventEmitter<any>();
  value: string | number;
  rowData: any;

  constructor() { }

  onShowDetails() {
    this.showDetails.emit(this.rowData);
  }

  ngOnInit(): void {

  }
}

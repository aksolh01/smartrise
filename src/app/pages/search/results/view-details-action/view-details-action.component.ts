import { Component, EventEmitter, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-view-details-action',
  templateUrl: './view-details-action.component.html',
  styleUrls: ['./view-details-action.component.scss']
})
export class ViewDetailsActionComponent implements OnInit, ViewCell {

  viewDetails = new EventEmitter<any>();

  constructor() { }
  
  value: any;
  rowData: any;

  ngOnInit(): void {
  }

  onShowDetails() {
    this.viewDetails.next(this.rowData);
  }
}

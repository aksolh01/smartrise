import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BaseComponentService } from '../../../../services/base-component.service';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { NumberTableCellComponent } from '../../../../_shared/components/number-table-cell/number-table-cell.component';
import { QuoteStatusComponent } from '../../../../_shared/components/quote-status/quote-status.component';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'ngx-quote-activity-history',
  templateUrl: './quote-activity-history.component.html',
  styleUrls: ['./quote-activity-history.component.scss']
})
export class QuoteActivityHistoryComponent extends BaseComponent implements OnInit {

  source: LocalDataSource;
  settings: any = {
    mode: 'external',
    filter: false,
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 10000,
    },
    columns: {
      action: {
        title: 'Action',
        type: 'custom',
        valuePrepareFunction: this.getEnumDescription.bind(this),
        renderComponent: QuoteStatusComponent,
        onComponentInitFunction: (instance: QuoteStatusComponent) => {
          instance.setHeader('Action');
        },
        filter: false,
        sort: false,
      },
      createdBy: {
        title: 'User',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('User');
        },
        filter: false,
        sort: false,
      },
      createdDate: {
        title: 'Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: this.formatLocalDateTime.bind(this),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date/Time');
        },
        filter: false,
        sort: false,
      },
      amount: {
        title: 'Amount',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
          instance.setHeader('Amount');
        },
        filter: false,
        sort: false,
      },
    },
  };
  quoteName: string;


  constructor(
    private _modalRef: BsModalRef,
    baseService: BaseComponentService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.source = new LocalDataSource();
  }

  onCancel() {
    this._modalRef.hide();
  }

  updateHistory(history: any[]) {
    this.source = new LocalDataSource(history);
    this.source.setSort([
      { field: 'createdDate', direction: 'desc' }
    ], false);
    this.source.refresh();
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../../../_shared/components/table-filters/cp-filter.component';
import { LocalDataSource } from 'ng2-smart-table';
import { IField } from '../../../../../_shared/models/quotes/fields.model';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'ngx-fields-information-panel',
  templateUrl: './fields-information-panel.component.html',
  styleUrls: ['./fields-information-panel.component.scss']
})
export class FieldsInformationPanelComponent implements OnInit {

  constructor(private ref: BsModalRef) { }

  searchKey: string;
  source = new LocalDataSource();
  settings: any = {
    hideSubHeader: true,
    pager: {
      display: false,
      page: 1,
      perPage: 20000
    },
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      section: {
        title: 'Section',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Section');
        },
        filter: false
      },
      field: {
        title: 'Field',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Field');
        },
        filter: false
      },
      description: {
        title: 'Description',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Description');
        },
        filter: false
      },
    }
  };

  ngOnInit(): void {
  }

  @Input() public set fields(v: IField[]) {
    this.source = new LocalDataSource(v);
    this.source.refresh();
  }

  onClose() {
    this.ref.hide();
  }

  onSearch(searchKey) {

    if (!searchKey) {
      this.source.setFilter([]);
      this.source.refresh();
      return;
    }

    this.source.setFilter([
      {
        field: 'section',
        search: searchKey,
      },
      {
        field: 'field',
        search: searchKey,
      },
      {
        field: 'description',
        search: searchKey,
      },
    ], false); 
    this.source.refresh();
  }
}

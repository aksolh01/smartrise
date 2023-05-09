import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { QuotingToolValidationService } from '../../../../../services/quoting-tool-validation.service';
import { HLinkTableCellComponent } from '../../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { Ng2TableCellComponent } from '../../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';

@Component({
  selector: 'ngx-errors-panel',
  templateUrl: './errors-panel.component.html',
  styleUrls: ['./errors-panel.component.scss']
})
export class ErrorsPanelComponent implements OnInit {

  @Input() hasError!: boolean;
  @Input() errors: any[] = [];
  @Input() disabled = false;

  @Output() hasErrorChange = new EventEmitter<boolean>();
  @ViewChild('item') accordion;

  errorsSettings: any = {
    pager: {
      display: true,
      page: 1,
      perPage: 10000
    },
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      displayName: {
        title: 'Group - Car',
        filter: false,
        sort: false,
      },
      field: {
        title: 'Field',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Field');
          instance.setOptions({
            tooltip: 'Go to Field',
            showHeader: false
          });
          instance.preNavigateFunction = (rowData) => {
            this.quotingToolService.focus.next(rowData.id);
          };
        },
        filter: false,
        sort: false,
      },
      error: {
        title: 'Message',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Message');
        },
        filter: false,
        sort: false,
      },
    },
  };
  errorsSource: LocalDataSource;


  showList = false;
  isCollapsed = false;

  constructor(private quotingToolService: QuotingToolValidationService) { }

  collapse() {
    this.accordion?.close();
    this.isCollapsed = true;
  }

  collapseWithoutDisable() {
    this.accordion?.close();
  }

  enable() {
    this.isCollapsed = false;
  }

  ngOnInit(): void {

    this.quotingToolService.updateCar.subscribe(item => {
      this.errors.forEach(x => {
        if (x.carRef === item.ref) {
          x.displayName = item.displayName;
        }
      });
      this.errorsSource = new LocalDataSource(this.errors);
    });

    this.quotingToolService.errorChanged.subscribe(e => {

      if (e.sort) {
        this.sortErrors();
        return;
      }

      const nErrors = e.errors.map(x => ({
          carIndex: e.carIndex,
          index: e.index,
          carRef: e.carRef,
          instance: e.instance,
          field: e.field,
          displayName: e.carLabel,
          error: x,
          id: e.id,
          tab: e.tab
        }));
      const errors = this.errors.filter(x =>
        x.id === e.id
      );
      if (!errors) {
        if (e.errors.length > 0) {
          this.errors.push(...nErrors);
        }
      } else {
        if (Object.prototype.toString.call(errors) === '[object Array]') {
          this.errors.splice(
            this.errors.indexOf(errors[0]),
            errors.length
          );
        } else {
          this.errors.splice(
            this.errors.indexOf(errors),
            1
          );
        }
        if (e.errors.length > 0) {
          this.errors.push(...nErrors);
        }
      }
      this.hasError = this.errors.length > 0;
      this.hasErrorChange.next(this.hasError);
    });
  }

  onMouseEnter() {
    this.showList = true;
  }

  onMouseLeave() {
    this.showList = false;
  }

  sortErrors() {
    const sorted = this.errors.sort((a, b) => {
      const aCarIndex = (a.carIndex === undefined || a.carIndex === null) ? -1 : a.carIndex;
      const bCarIndex = (b.carIndex === undefined || b.carIndex === null) ? -1 : b.carIndex;

      if (aCarIndex === bCarIndex) {
        return a.index < b.index ? -1 : 1;
      } else {
        return aCarIndex < bCarIndex ? -1 : 1;
      }
    });
    this.errorsSource = new LocalDataSource(sorted);
  }
}

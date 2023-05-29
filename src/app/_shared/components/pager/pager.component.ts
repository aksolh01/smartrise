import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';

@Component({
  selector: 'ngx-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss'],
})
export class PagerComponent implements OnInit {

  @Input() pagerPages: number;
  @Input() pagesCount: number;
  @Input() table: Ng2SmartTableComponent;


  get min(): number {
    if (!this.table) {
      return null;
    }
    return Math.min(
      this.table.source.count(),
      (this.table.source.getPaging().page - 1) * (<any>this.table.settings).pager.perPage +
      (<any>this.table.settings).pager.perPage
    );
  }

  get recordsCount(): number {
    if (!this.table) {
      return null;
    }
    return this.table.source.count();
  }

  get navigatedRecords(): number {
    if (!this.table) {
      return null;
    }

    if (this.min === 0) {
      return 0;
    }

    return (this.table.source.getPaging().page - 1) * (<any>this.table.settings).pager.perPage + 1;
  }

  constructor() { }

  ngOnInit(): void {
  }

  onPagePrev(): void {
    const currentPage = this.table.source.getPaging().page;
    const perPage = this.table.source.getPaging().perPage;
    if (currentPage > 1) {
      this.table.source.setPaging(currentPage - 1, perPage);
    }
  }

  onPageNext(): void {
    const currentPage = this.table.source.getPaging().page;
    const perPage = this.table.source.getPaging().perPage;
    const totalPages = Math.ceil(this.table.source.count() / perPage);
    if (currentPage < totalPages) {
      this.table.source.setPaging(currentPage + 1, perPage);
    }
  }
}

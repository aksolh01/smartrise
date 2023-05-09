import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-smr-epicore-id-cell',
  template: `
    <div class="d-flex flex-column flex-lg-row justify-content-lg-between align-items-center">
        <div class="d-md-block d-lg-none p-2 font-weight-bold">{{ header }}</div>
        <ng-template [ngIf]="!!value" [ngIfElse]="naOnMobile">
          {{ value }}
        </ng-template>
        <ng-template #naOnMobile>
          <div class="d-lg-none d-block">N/A</div>
        </ng-template>
        <div *ngIf="rowData.isDeleted" class="badge badge-pill badge-danger font-weight-normal">DELETED</div>
      </div>
    `
    ,
})

export class EpicoreIdCellComponent implements ViewCell {
  @Input() value: any;
  @Input() rowData: any;
  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

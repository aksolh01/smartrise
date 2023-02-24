import { Component, Input } from '@angular/core';

@Component({
  template: `<div class="container">
  <div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge badge-warning pending-info-cell text-white" *ngIf="isPendingInfo === true">Yes</div>
    <div class="badge badge-info pending-info-cell text-white" *ngIf="isPendingInfo === false">No</div>
    <div class="d-lg-none d-block badge badge-info pending-info-cell text-white" *ngIf="isPendingInfo === null">N/A</div>
    </div>`,
  styleUrls: ['./pending-info-cell.component.scss'],
})
export class PendingInfoCellComponent {
  @Input() rowData: any;

  isPendingInfo?: boolean = null;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  @Input() set value(val: any) {
    this.isPendingInfo = val === '' ? null : /true/i.test(val.toString());
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

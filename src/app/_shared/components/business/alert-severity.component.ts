import { Component, Input } from '@angular/core';
import { Severity } from '../../models/predictiveMaintenanceEnums';

@Component({
  selector: 'ngx-alert-severity',
  template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge text-white alert-severity-low" *ngIf="status === 0">Low</div>
    <div class="badge text-white alert-severity-medium" *ngIf="status === 1">Medium</div>
    <div class="badge text-white alert-severity-high" *ngIf="status === 2">High</div>
    <div class="badge text-white alert-severity-critical" *ngIf="status === 3">Critical</div>
    <ng-template [ngIf]="status !== null && status > -1" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="status === null">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class AlertSeverityCellComponent {
  @Input() status?: number = null;
  @Input() set value(val: any) {
    const type = Severity;
    this.status = val === '' ? null : +type[val.replace(/\s/g, '')];
  }

  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

import { Component, Input } from '@angular/core';
import { AlertStatus } from '../../models/alertStatus';

@Component({
  selector: 'ngx-alert-status',
  template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge text-white job-status-fault" *ngIf="status === 0">At Fault</div>
    <div class="badge text-white job-status-alarm" *ngIf="status === 1">Attention Needed</div>
    <div class="badge text-white job-status-normal" *ngIf="status === 2">Normal</div>
    <div class="badge text-white job-status-offline" *ngIf="status === 3">Offline</div>
    <ng-template [ngIf]="status !== null && status > -1" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="status === null">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class JobAlertStatusCellComponent {
  @Input() status?: number = null;
  @Input() set value(val: any) {
    const type = AlertStatus;
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

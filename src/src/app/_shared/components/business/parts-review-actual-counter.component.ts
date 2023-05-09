import { Component, Input } from '@angular/core';

@Component({
    template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div [class]="rowData.alertsExceedThreshold ? 'exceed-threshold' : (rowData.alertsExceedHalfThreshold ? 'exceed-half-threshold' : 'not-exceed-threshold')">{{ rowData.alertsCount }}</div>
    <ng-template [ngIf]="!rowData.alertsCount" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="!rowData.alertsCount">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class PartReviewCounterCellComponent {
    counter: number;
    @Input() set value(val: any) {
        this.counter = val;
    }

    @Input() rowData: any;

    private headerText: string = null;

    get header() {
        return this.headerText;
    }

    public setHeader(header: string) {
        this.headerText = header;
    }

    displayText(data: any) {
        return '';
    }
}

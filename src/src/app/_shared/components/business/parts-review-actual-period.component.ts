import { Component, Input } from '@angular/core';

@Component({
    template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div [class]="rowData.period >= rowData.periodThreshold ? 'actual-counter' : ''">{{ rowData.period }}</div>
    <ng-template [ngIf]="!rowData.period" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="!rowData.period">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class PartReviewActualPeriodCellComponent {
    period: number;
    @Input() set value(val: any) {
        this.period = val;
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

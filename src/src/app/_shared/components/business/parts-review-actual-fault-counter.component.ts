import { Component, EventEmitter, Input } from '@angular/core';

@Component({
  template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div tooltip="Show Faults History" class="action-tooltip-holder">
      <button (click)="onShowFaultsHistory()" class="btn btn-primary actual-fault-count-button">
        <div [class]="rowData.actualFaultCount >= rowData.configuredFaultCount ? 'actual-fault-count' : ''">{{ actualFaultCount }}</div>
      </button>
    </div>
    <ng-template [ngIf]="!rowData.actualFaultCount" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="!rowData.actualFaultCount">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class PartReviewActualFaultCounterCellComponent {

  showFaultsHistoryEmitter = new EventEmitter<any>();

  actualFaultCount: number;
  @Input() set value(val: any) {
    this.actualFaultCount = val;
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

  onShowFaultsHistory() {
    this.showFaultsHistoryEmitter.emit();
  }
}

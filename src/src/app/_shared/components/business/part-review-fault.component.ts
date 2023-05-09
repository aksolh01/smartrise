import { Component, Input } from '@angular/core';

@Component({
  template: `<div class="d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge badge-danger part-review-fault" *ngIf="fault">Fault</div>
    <ng-template [ngIf]="!fault" [ngIfElse]="naOnMobile">
      <div class="d-lg-none d-block badge badge-info text-white" *ngIf="!fault">N/A</div>
    </ng-template>
    <ng-template #naOnMobile>
      <div class="d-lg-none d-block">N/A</div>
    </ng-template>
`
})
export class PartReviewFaultCellComponent {
  fault = false;
  @Input() set value(val: any) {
    this.fault = val;
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

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngx-yes-no',
  template: `<div class="cell-header d-md-block d-lg-none p-2 font-weight-bold">
      {{ header }}
    </div>
    <div class="badge badge-pill badge-warning pending-info-cell text-white" *ngIf="isTrue === true && isPill">Yes</div>
    <div class="badge badge-pill badge-info pending-info-cell text-white" *ngIf="isTrue === false && isPill">No</div>

    <div class="badge badge-warning pending-info-cell text-white" *ngIf="isTrue === true && !isPill">Yes</div>
    <div class="badge badge-info pending-info-cell text-white" *ngIf="isTrue === false && !isPill">No</div>`
})
export class YesNoCellComponent {

  @Input() isPill = false;
  isTrue?: boolean = null;

  @Input() set value(val: any) {
    this.isTrue = val === '' ? null : /true/i.test(val.toString());
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

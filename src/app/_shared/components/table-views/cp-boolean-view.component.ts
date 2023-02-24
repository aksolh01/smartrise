import {Component, Input} from '@angular/core';
import {ViewCell} from 'ng2-smart-table';

@Component({
  template: `
    <div class="d-md-block d-lg-none p-2 font-weight-bold">{{ header }}</div>
    <nb-checkbox disabled="true" [checked]="isChecked"></nb-checkbox> `,
})
export class CpBooleanViewComponent implements ViewCell {
  isChecked?: boolean = null;

  @Input() set value(val: any) {
    this.isChecked = val === '' ? null : /true/i.test(val.toString());
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

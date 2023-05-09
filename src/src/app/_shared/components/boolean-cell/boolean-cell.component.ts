import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-boolean-cell',
  templateUrl: './boolean-cell.component.html',
  styleUrls: ['./boolean-cell.component.scss']
})
export class BooleanCellComponent implements ViewCell {

  val: any;
  disable = false;
  @Input() set value(val: any) {
    if (val !== false && val !== true) {
      this.val = false;
      return;
    }
    this.val = val;
  }
  data: any;
  @Input() set rowData(data: any) {
    this.data = data;
    if (this.enableCheckCallback) {
this.disable = !this.enableCheckCallback(data);
}
  }
  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  onChecked(event) {
    if (this.checkCallback) {
this.checkCallback(event, this.data);
}
  }

  get status(): string {
    if (this.statusCallback) {
      return this.statusCallback();
    }
    return '';
  }

  public checkCallback: (value: boolean, rowData: any) => void;
  public statusCallback: () => string;
  public enableCheckCallback: (rowData: any) => boolean;
}

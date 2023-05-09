import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-passcode-cell',
  templateUrl: './passcode-cell.component.html',
  styleUrls: ['./passcode-cell.component.scss']
})
export class PasscodeCellComponent {

  @Input() value: any;
  @Input() rowData: any;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  get isPasscode(): boolean {
    return !isNaN(this.value);
  }

  public setHeader(header: string) {
    this.headerText = header;
  }
}

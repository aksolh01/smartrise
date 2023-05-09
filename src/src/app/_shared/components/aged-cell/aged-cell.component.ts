import { Component, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-aged-cell',
  templateUrl: './aged-cell.component.html',
  styleUrls: ['./aged-cell.component.scss']
})
export class AgedCellComponent implements ViewCell {

  constructor() { }

  agedStatus: number;
  @Input() set value(val: any) {
    this.agedStatus = val;
  }

  @Input() rowData: any;
  @Input() withSattled = false;
  @Input() isPillStyle = false;

  private headerText: string = null;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  ngOnInit(): void {
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
  selector: 'ngx-informative-cell-component',
  templateUrl: './informative-cell-component.component.html',
  styleUrls: ['./informative-cell-component.component.scss']
})
export class InformativeCellComponentComponent  implements ViewCell, OnInit {
  @Input() value: any;
  @Input() rowData: any;
  private headerText: string = null;
  show = true;
  showInfoIconFunction: (rowData) => boolean;
  generateTooltipContent: (rowData) => string;
  onClickCallBack: (rowData) => void;
  tooltip: string;

  get header() {
    return this.headerText;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  ngOnInit(): void {
    if (this.showInfoIconFunction) {
this.show = this.showInfoIconFunction(this.rowData);
}
    if (this.generateTooltipContent) {
this.tooltip = this.generateTooltipContent(this.rowData);
}
  }

  onClick() {
    if (this.onClickCallBack) {
this.onClickCallBack(this.rowData);
}
  }
}

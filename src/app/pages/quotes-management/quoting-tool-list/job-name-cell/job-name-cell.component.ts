import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-job-name-cell',
  templateUrl: './job-name-cell.component.html',
  styleUrls: ['./job-name-cell.component.scss']
})
export class JobNameCellComponent implements OnInit, ViewCell {

  showHeader = true;
  href: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Input() preNavigateFunction: (rowData) => void;
  breakWord: boolean;
  tooltip: string;
  @Input() options: {
    tooltip: string;
    link?: string;
    paramExps?: string[];
    breakWord?: boolean;
    showHeader?: boolean;
  };
  isSmartriseUser: boolean;

  constructor(
    private router: Router,
    private miscellaneousService: MiscellaneousService
    ) { }

  ngOnInit(): void {
    this.href = this.options?.link;
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    if(this.options.showHeader === false) {
      this.showHeader = false;
    }
    if (this.options.paramExps && this.options.paramExps.length > 0) {
      this.options.paramExps.forEach(p => {
        if (p.startsWith('#')) {
          this.href = this.href + '/' + p.substring(1);
        } else {
          this.href = this.href + '/' + this.rowData[p];
        }
      });
    }
  }

  private headerText: string = null;

  @Input()
  get header() {
    return this.headerText;
  }
  set header(v: string) {
    this.headerText = v;
  }

  public setHeader(header: string) {
    this.headerText = header;
  }

  onGoToLink() {
    if (this.preNavigateFunction) {
this.preNavigateFunction(this.rowData);
}
    if (this.href) {
this.router.navigateByUrl(this.href);
}
  }

  setOptions(options: {
    tooltip: string;
    link?: string;
    paramExps?: string[];
    breakWord?: boolean;
    showHeader?: boolean;
  }) {
    this.options = options;
  }
}

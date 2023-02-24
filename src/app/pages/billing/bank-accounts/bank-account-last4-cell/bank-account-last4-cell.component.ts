import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { ResponsiveService } from '../../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';

@Component({
  selector: 'ngx-bank-account-last4-cell',
  templateUrl: './bank-account-last4-cell.component.html',
  styleUrls: ['./bank-account-last4-cell.component.scss']
})
export class BankAccountLast4CellComponent implements OnInit, ViewCell {

  href: string;
  @Input() value: string | number;
  @Input() rowData: any;
  @Input() preNavigateFunction: (rowData) => void;
  breakWord: boolean;
  tooltip: string;
  @Input() options: { tooltip: string; link?: string; paramExps?: string[]; breakWord?: boolean };
  isSmall: boolean;

  constructor(
    private router: Router,
    private responsiveService: ResponsiveService,
  ) { }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
    this.href = this.options.link;
    if (this.options.paramExps && this.options.paramExps.length > 0) {
      this.options.paramExps.forEach(p => {
        this.href = this.href + '/' + this.rowData[p];
      });
    }
  }



  private headerText: string = null;

  get header() {
    return this.headerText;
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
  }) {
    this.options = options;
  }
}

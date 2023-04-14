import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewCell } from 'ng2-smart-table';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { URLs } from '../../constants';

@Component({
  selector: 'ngx-account-table-cell',
  templateUrl: './account-table-cell.component.html',
  styleUrls: ['./account-table-cell.component.scss']
})
export class AccountTableCellComponent implements ViewCell, OnInit {

  showHeader = true;

  value: string | number;
  @Input() rowData: any;

  breakWord: boolean;
  tooltip: string;
  @Input() options: {
    tooltip: string;
    link?: string;
    breakWord?: boolean;
    showHeader?: boolean;
  };

  constructor(
    private readonly miscellaneousService: MiscellaneousService,
    private router: Router) { }

  ngOnInit(): void {
    if (this.options.showHeader === false) {
      this.showHeader = false;
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
    if (this.miscellaneousService.isSmartriseUser()) {
      this.router.navigateByUrl(`${URLs.ViewCustomersURL}/${this.rowData.account.id}`);
    }
    else {
      this.router.navigateByUrl(`${URLs.CompanyInfoURL}/${this.rowData.account.id}`);
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

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';

@Component({
  selector: 'ngx-invoice-basic-info',
  templateUrl: './invoice-basic-info.component.html',
  styleUrls: ['./invoice-basic-info.component.scss']
})
export class InvoiceBasicInfoComponent implements OnInit {

  @Input() invoice: any;
  @Input() isSmartriseUser: boolean;
  @Input() displayAccountName: boolean;
  prevUrl: string;
  accountTitle: string;
  isSmartrise: boolean;

  constructor(
    private router: Router,
    private miscellaneousService: MiscellaneousService
  ) { }

  ngOnInit(): void {
    this.prevUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));
    this._setAccountTitle();
    this.isSmartrise = this.miscellaneousService.isSmartriseUser();
  }

  onClose() {
    this.router.navigateByUrl(this.prevUrl);
  }

  private _setAccountTitle() {
    this.accountTitle = this.miscellaneousService.isSmartriseUser() ? 'Ordered By' : 'Account Name';
  }
}

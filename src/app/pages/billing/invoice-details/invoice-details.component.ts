import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IAgedInvoiceDetails } from '../../../_shared/models/pay-invoice.model';
import { BaseComponentService } from '../../../services/base-component.service';
import { InvoiceService } from '../../../services/invoice.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { BaseComponent } from '../../base.component';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { StorageConstants, URLs } from '../../../_shared/constants';

@Component({
  selector: 'ngx-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  invoiceDetailsTitle: string;
  isSmartriseUser = false;
  invoice: IAgedInvoiceDetails;
  SecureToken: string;
  SecureTokenId: string;
  prevUrl = '';

  @ViewChild('payPalForm') payPalForm: HTMLFormElement;
  isLoading = true;
  displayAccountName: boolean;

  constructor(
    private miscellaneousService: MiscellaneousService,
    private invoiceService: InvoiceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private bcService: BreadcrumbService,
    baseService: BaseComponentService,
    private multiAccountsService: MultiAccountsService) {
    super(baseService);
    this.bcService.set('@invoiceNumber', { skip: true });
  }

  private _disposeAccountID() {
    if (this.router.url !== URLs.ViewStatementOfAccountURL) {
      sessionStorage.removeItem(StorageConstants.StatementOfAccountSelectedAccount);
    }
  }

  ngOnInit(): void {

    this.prevUrl = this.router.url.substring(0, this.router.url.lastIndexOf('/'));

    if (this.prevUrl === URLs.ViewBillingInvoicesURL) {
      this.invoiceDetailsTitle = 'Invoices';
    } else if (this.prevUrl === URLs.ViewStatementOfAccountURL) {
      this.invoiceDetailsTitle = 'Statement Of Accounts';
    }

    const invoiceID = +this.activatedRoute.snapshot.paramMap.get('id');

    if (!isFinite(invoiceID)) {
      this.router.navigateByUrl(this.prevUrl);
      return;
    }

    this.invoiceService.getARInvoice(invoiceID).subscribe(result => {
      this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
      this.displayAccountName = this.isSmartriseUser || this.multiAccountsService.hasMultipleAccounts();
      this.isLoading = false;
      this.invoice = result;
      this.bcService.set('@invoiceNumber', this.invoice.invoiceNumber === '' ? 'N/A' : this.invoice.invoiceNumber);
      this.bcService.set('@invoiceNumber', { skip: false });
    }, error => {
      this.isLoading = false;
      this.router.navigateByUrl(this.prevUrl);
    });
  }

  onClose() {
    this.router.navigateByUrl(this.prevUrl);
  }

  ngOnDestroy(): void {
    this._disposeAccountID();
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvoiceDetails } from '../../../../_shared/models/invoice.model';
import { BaseComponentService } from '../../../../services/base-component.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { BaseComponent } from '../../../base.component';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';

@Component({
  selector: 'ngx-invoice-details',
  templateUrl: './invoice-details.component.html',
  styleUrls: ['./invoice-details.component.scss']
})
export class InvoiceDetailsComponent extends BaseComponent implements OnInit {

  invoice: IInvoiceDetails;
  value = 'N/A';
  isSmartriseUser: boolean;
  displayAccountName: boolean;

  constructor(
    baseService: BaseComponentService,
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private miscellaneousService: MiscellaneousService,
    private router: Router,
    private multiAccountsService: MultiAccountsService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.data['id'];

    if (!isFinite(id)) {
      this.router.navigateByUrl(`pages/billing/invoices`);
      return;
    }

    this.invoiceService.getInvoice(id).subscribe(x => {
      this.invoice = x;
    });

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.displayAccountName = this.isSmartriseUser || this.multiAccountsService.hasMultipleAccounts();
  }
}

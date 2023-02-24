import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BankAccountService } from '../../../services/bank-account.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { ResponsiveService } from '../../../services/responsive.service';
import { IBankAccountDetails } from '../../../_shared/models/bank-account.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'ngx-bank-account-details',
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent extends BaseComponent implements OnInit {

  isLoading = true;
  bankAccount: IBankAccountDetails = null;
  runGuidingTour: boolean;
  isSmartriseUser: boolean;
  modelref: any;
  isSmall = false;
  responsiveSubscription: Subscription;
  displayAccountName: boolean;

  constructor(
    private bankAccountService: BankAccountService,
    private router: Router,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService,
    private modalService: BsModalService,
    private responsiveService: ResponsiveService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
    private multiAccountsService: MultiAccountsService
  ) {
    super(baseService);
    this.bcService.set('@bankAccount', { skip: true });
  }

  ngOnDestroy(): void {
    this.responsiveSubscription.unsubscribe();
    this.modalService.hide();
  }

  async ngOnInit() {
    const bankAccountId = +this.route.snapshot.paramMap.get('id');

    if (!isFinite(bankAccountId)) {
      this.router.navigateByUrl('pages/billing/bank-accounts');
      return;
    }

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.displayAccountName = this.multiAccountsService.hasMultipleAccounts();

    this.bcService.set('@bankAccount', { skip: true });

    this.bankAccountService.getBankAccount(bankAccountId)
      .subscribe((result) => {
        this.bankAccount = result;
        this.bcService.set('@bankAccount', this.bankAccount.last4);
        this.bcService.set('@bankAccount', { skip: false });
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        this.router.navigateByUrl('pages/billing/bank-accounts');
      });

    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
  }

  onClose() {
    this.router.navigateByUrl('pages/billing/bank-accounts');
  }
}

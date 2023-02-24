import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { IOpenQuoteDetails } from '../../../../_shared/models/quote.model';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../../services/base-component.service';
import { MessageService } from '../../../../services/message.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { QuoteService } from '../../../../services/quote.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { TokenService } from '../../../../services/token.service';
import { BaseComponent } from '../../../base.component';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';

@Component({
  selector: 'ngx-open-quote-details',
  templateUrl: './open-quote-details.component.html',
  styleUrls: ['./open-quote-details.component.scss']
})
export class OpenQuoteDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  isLoading = true;
  openQuote: IOpenQuoteDetails = null;
  runGuidingTour: boolean;
  isSmartriseUser: boolean;
  displayAccountName: boolean;
  modelref: any;
  isSmall = false;
  responsiveSubscription: Subscription;

  constructor(
    private quoteService: QuoteService,
    private router: Router,
    private route: ActivatedRoute,
    private _tokenService: TokenService,
    private messageService: MessageService,
    private bcService: BreadcrumbService,
    private modalService: BsModalService,
    private responsiveService: ResponsiveService,
    private miscellaneousService: MiscellaneousService,
    baseService: BaseComponentService,
    private multiAccountsService: MultiAccountsService
  ) {
    super(baseService);
    this.bcService.set('@quoreName', { skip: true });
  }

  ngOnDestroy(): void {
    this.responsiveSubscription?.unsubscribe();
    this.modalService?.hide();
  }

  async ngOnInit() {
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.displayAccountName = this.isSmartriseUser || this.multiAccountsService.hasMultipleAccounts();

    this.bcService.set('@quoteName', { skip: true });

    const openQuoteId = +this.route.snapshot.paramMap.get('id');

    if (!isFinite(openQuoteId)) {
      this.router.navigateByUrl('pages/quotes-management/open-quotes');
      return;
    }

    this.quoteService.getOpenQuote(openQuoteId)
      .subscribe((result) => {

        if (this.miscellaneousService.isCustomerUser()) {
          const selectedAccount = this.multiAccountsService.getSelectedAccount();

          if (selectedAccount != null && selectedAccount !== result.customerId) {
            this.router.navigateByUrl('pages/quotes-management/open-quotes?tab=smart');
            return;
          }
        }

        this.openQuote = result;
        this.bcService.set('@quoteName', this.openQuote.jobName);
        this.bcService.set('@quoteName', { skip: false });
        this.isLoading = false;
      }, (error) => {
        this.isLoading = false;
        this.router.navigateByUrl('pages/quotes-management/open-quotes');
      });

    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        this.isSmall = false;
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        this.isSmall = true;
      }
    });
  }

  onShowContact() {
    this.modalService.show<ContactDetailsComponent>(ContactDetailsComponent, {
      initialState: {
        contact: this.openQuote.contact
      }
    });
  }

  onClose() {
    this.router.navigateByUrl('pages/quotes-management/open-quotes?tab=smart');
  }
}

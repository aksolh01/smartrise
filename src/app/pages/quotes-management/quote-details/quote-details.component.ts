import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { PermissionService } from '../../../services/permission.service';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { NumberTableCellComponent } from '../../../_shared/components/number-table-cell/number-table-cell.component';
import { QuoteStatusComponent } from '../../../_shared/components/quote-status/quote-status.component';
import { FunctionConstants, PERMISSIONS, URLs } from '../../../_shared/constants';
import { ProgressStatusEnum } from '../../../_shared/models/download.models';
import { IQuoteDetailsResponse } from '../../../_shared/models/quotes/quote-details-response-i.mode';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../base.component';
import { RfqDetailsComponent } from '../rfq-details/rfq-details.component';

@Component({
  selector: 'ngx-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss']
})
export class QuoteDetailsComponent extends BaseComponent implements OnInit, OnDestroy {

  historySettings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 10,
    },
    columns: {
      action: {
        title: 'Action',
        type: 'custom',
        renderComponent: QuoteStatusComponent,
        valuePrepareFunction: this.getEnumDescription.bind(this),
        onComponentInitFunction: (instance: QuoteStatusComponent) => {
          instance.setHeader('Action');
        },
        filter: false,
        sort: false,
      },
      createdBy: {
        title: 'User',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('User');
        },
        filter: false,
        sort: false,
      },
      createdDate: {
        title: 'Date/Time',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        valuePrepareFunction: this.formatLocalDateTime.bind(this),
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Date/Time');
        },
        filter: false,
        sort: false,
      },
      amount: {
        title: 'Amount',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
          instance.setHeader('Amount');
        },
        filter: false,
        sort: false,
      },
    },
  };
  historySource: LocalDataSource;

  isDownloadingAttachment = false;
  isSubmitted = false;
  cols = 4;
  canEditQuote = false;

  get showHydraulic(): boolean {
    return this.quote.cars.filter(car => car.controllerType?.value === 'Hydraulic').length > 0;
  }

  get showTraction(): boolean {
    return this.quote.cars.filter(car => car.controllerType?.value === 'ACTraction' || car.controllerType?.value === 'DCTraction').length > 0;
  }

  get showC4RiserBoards(): boolean {
    return this.quote.cars.filter(car => (car.controllerType?.value === 'Hydraulic' && car.carHydraulicField.hydroEvolved) || car.carTractionField.c4).length > 0;
  }

  quote: IQuoteDetailsResponse;
  isLoading = true;
  displayAccountName = true;

  constructor(
    baseService: BaseComponentService,
    private quotingToolService: QuotingToolService,
    private responsiveService: ResponsiveService,
    private bcService: BreadcrumbService,
    private modalService: BsModalService,
    private messageService: MessageService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private route: ActivatedRoute,
    private router: Router,
    private multiAccountsService: MultiAccountsService
  ) {
    super(baseService);
  }

  ngOnDestroy(): void {
    this.modalService.hide();
  }

  ngOnInit(): void {
    this.canEditQuote = this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote) && !this.miscellaneousService.isImpersonateMode();
    this.displayAccountName = this.miscellaneousService.isSmartriseUser() || this.multiAccountsService.hasMultipleAccounts();

    this.bcService.set('@quoteName', { skip: true });
    const quoteId = this.route.snapshot.paramMap.get('id');

    forkJoin([
      this.quotingToolService.getQuoteDetails(quoteId),
      this.quotingToolService.getQuoteHistory(quoteId)]
    ).subscribe(([details, hisory]) => {

      this._readSaveOnlineQuotePermission(details.contactId);

      if (this.miscellaneousService.isCustomerUser()) {
        const selectedAccount = this.multiAccountsService.getSelectedAccount();

        if (selectedAccount != null && selectedAccount !== details.contactId) {
          this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
          return;
        }
      }

      this.quote = details;
      this.isSubmitted = this.quote.status.value === 'Generated';
      this.bcService.set('@quoteName', this.isEmpty(this.quote.jobName) ? 'N/A' : this.quote.jobName);
      this.bcService.set('@quoteName', { skip: false });
      this.isLoading = false;
      this.historySource = new LocalDataSource(hisory.history);
      this.historySource.setSort([
        { field: 'createdDate', direction: 'desc' }
      ], false);
    }, error => {
      this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
    });

    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg) {
        this.cols = 4;
      } else if (w === ScreenBreakpoint.md) {
        this.cols = 3;
      } else if (w === ScreenBreakpoint.sm) {
        this.cols = 2;
      } else if (w === ScreenBreakpoint.xs) {
        this.cols = 1;
      }
    });

  }

  private _readSaveOnlineQuotePermission(accountId: number) {
    if (this.miscellaneousService.isSmartriseUser()) {
      this.canEditQuote = this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote);
    } else {
      this.canEditQuote = this.permissionService.hasPermissionInAccount(PERMISSIONS.SaveOnlineQuote, accountId);
    }
  }

  hasLeftPadding(i) {
    if (this.cols === 1) {
return true;
}
    return (i % this.cols) < this.cols;
  }

  hasRightPadding(i) {
    if (this.cols === 1) {
return true;
}
    return i % this.cols === this.cols - 1;
  }

  onCancel() {
    this.router.navigateByUrl(URLs.ViewOpenQuotesURL);
  }

  onViewPricing() {
    const modelRef = this.modalService.show<RfqDetailsComponent>(RfqDetailsComponent, {
      initialState: {
        quoteId: this.quote.id,
      }
    });
  }

  formatBytes(bytes, decimals) {
    return FunctionConstants.FormatBytes(bytes, decimals);
  }

  onPreviewAttachment(id: number) {
    this.quotingToolService.prePreviewAttachment(id).subscribe((result: { token: string }) => {
      this.quotingToolService.previewAttachment(result.token);
    }, () => {
      this.refreshPage();
    });
  }

  onDownloadAttachment(id) {

    if (this.isDownloadingAttachment) {
      return;
    }

    this.isDownloadingAttachment = true;

    this.quotingToolService.preDownloadAttachment(id).subscribe(() => {
      this.quotingToolService.downloadAttachment(id, true).subscribe(s => {
        if (s.status === ProgressStatusEnum.ERROR) {
          this.isDownloadingAttachment = false;
          this.messageService.showErrorMessage('An error occured while downloading attachment');
          this.refreshPage();
        } else if (s.status === ProgressStatusEnum.COMPLETE) {
          this.isDownloadingAttachment = false;
          this.messageService.showSuccessMessage(
            'Attachment has been downloaded successfully'
          );
        }
      });
    }, () => {
      this.isDownloadingAttachment = false;
      this.refreshPage();
    });
  }

  onEdit() {
    this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${this.quote.id}`);
  }

  getTractionCars() {
    return this.quote.cars.filter(car => car.controllerType?.value === 'ACTraction' || car.controllerType?.value === 'DCTraction');
  }

  getHydraulicCars() {
    return this.quote.cars.filter(car => car.controllerType?.value === 'Hydraulic');
  }

  getAdditionalC4RiserBoardsCars() {
    return this.quote.cars.filter(car => (car.controllerType?.value === 'Hydraulic' && car.carHydraulicField.hydroEvolved) || car.carTractionField.c4);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { IEnumValue } from '../../../_shared/models/enumValue.model';
import { QuoteToolParams, SearchQuotesByCustomerParams } from '../../../_shared/models/quote.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../base.component';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { QuotingToolService } from '../../../services/quoting-tool.service';
import { QuotingToolActionsComponent } from './quoting-tool-actions/quoting-tool-actions.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues, PERMISSIONS, URLs } from '../../../_shared/constants';
import { QuoteStatusComponent } from '../../../_shared/components/quote-status/quote-status.component';
import { PermissionService } from '../../../services/permission.service';
import { QuoteActivityHistoryComponent } from './quote-activity-history/quote-activity-history.component';
import { RfqDetailsComponent } from '../rfq-details/rfq-details.component';
import { JobNameCellComponent } from './job-name-cell/job-name-cell.component';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../services/account-info.service';
import { AccountTableCellComponent } from '../../../_shared/components/account-table-cell/account-table-cell.component';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';
import { RoutingService } from '../../../services/routing.service';
import { CloneDialogComponent } from './clone-dialog/clone-dialog.component';
import { MessageService } from '../../../services/message.service';

@Component({
  selector: 'ngx-quoting-tool-list',
  templateUrl: './quoting-tool-list.component.html',
  styleUrls: ['./quoting-tool-list.component.scss']
})
export class QuotingToolListComponent extends BaseComponent implements OnInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  mRef: BsModalRef;
  source: BaseServerDataSource;
  isSmall?: boolean = null;
  showFilters: boolean = false;
  runGuidingTour: boolean = true;
  account: string;
  jobName: string;
  controllerType: string;
  status?: string = '';
  isSmartriseUser = true;
  isImpersonate = true;
  canEditQuote = false;
  public Math = Math;
  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      account: {
        title: 'Account',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader(this._getAccountTitle());
          instance.setOptions({
            tooltip: 'View Account Details',
            link: URLs.CompanyInfoURL,
            paramExps: [
              'id'
            ]
          });
        },
        width: '15%',
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: JobNameCellComponent,
        onComponentInitFunction: (instance: JobNameCellComponent) => {
          instance.setHeader('Job Name');
          instance.setOptions({
            tooltip: 'View Quote Details',
            link: URLs.CustomerOnlineQuote,
            paramExps: [
              'id', '#view'
            ]
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      creationDate: {
        title: 'Created Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Created Date');
        },
        valuePrepareFunction: this.formatUSDate.bind(this),
        editable: false,
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      jobStatus: {
        title: 'Job Status',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        editable: false,
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      status: {
        title: 'Quote Status',
        type: 'custom',
        renderComponent: QuoteStatusComponent,
        onComponentInitFunction: (instance: QuoteStatusComponent) => {
          instance.setHeader('Quote Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        editable: false,
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: QuotingToolActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  responsiveSubscription: Subscription;
  controllerTypes: IEnumValue[];
  recordsNumber: any;
  quoteCreated: Date;
  isLoading = true;
  numberOfCars?: number;
  amount?: number;
  creationDate: any;
  statuses: IEnumValue[];
  jobStatuses: IEnumValue[];
  jobStatus = '';
  canSaveOnlineQuote = false;
  private _isCreatingQuote = false;

  onActionsInit(actions: QuotingToolActionsComponent) {
    actions.edit.subscribe((quote: any) => {
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${quote.id}`);
    });
    actions.view.subscribe((quote: any) => {
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${quote.id}/view`);
    });
    actions.viewHistory.subscribe((quote: any) => this._onViewHistory(actions, quote));
    actions.viewPricing.subscribe((quote: any) => this._onViewPricing(quote));
    actions.cloneQuote.subscribe((quote: any) => this._onCloneQuote(quote));
  }

  private _onCloneQuote(quote: any) {
    const modal = this.modalService.show<CloneDialogComponent>(CloneDialogComponent, {

    });
    modal.onHide.subscribe(() => {
      if (modal.content.confirmed) {
        this.isLoading = true;
        this.quoteService.cloneQuote(quote.id, modal.content.jobName).subscribe(() => {
          this.isLoading = false;
          this.routingService.reloadCurrentRoute();
          this.messageService.showSuccessMessage('Quote has been cloned successfully');
        }, error => {
          this.isLoading = false;
        });
      }
    });
  }

  constructor(
    private router: Router,
    private quoteService: QuotingToolService,
    private joyrideService: JoyrideService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private quotingToolService: QuotingToolService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    private routingService: RoutingService,
    baseService: BaseComponentService,
    private messageService: MessageService
  ) {
    super(baseService);
    router.events.subscribe(event => {

      if (!(event instanceof NavigationStart)) {
        return;
      }

      if (event.url === URLs.CreateOnlineQuote) {
        this._isCreatingQuote = true;
      }
    });
  }

  private _onViewPricing(quote: any) {
    const ref = this.modalService.show<RfqDetailsComponent>(RfqDetailsComponent, {
      initialState: {
        quoteId: quote.id
      }
    });
    ref.onHidden.subscribe(() => {
      this.source.refresh();
    });
  }

  private _onViewHistory(actions: QuotingToolActionsComponent, quote: any) {
    actions.isLoadingActivityHistory = true;
    this.quotingToolService.getQuoteHistory(quote.id).subscribe(
      history => this._onHistoryRecordsReady(history),
      error => this.source.refresh()
    );
  }

  private _onHistoryRecordsReady(history: any) {
    const ref = this.modalService.show<QuoteActivityHistoryComponent>(QuoteActivityHistoryComponent, {
      initialState: {}
    });
    ref.content.quoteName = history.quoteName;
    ref.content.updateHistory(history.history);
    ref.onHidden.subscribe(() => {
      this.source.refresh();
    });
  }

  ngOnDestroy(): void {
    this._isCreatingQuote = false;
    this.modalService.hide();

    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    this.stopGuidingTour();
    this.joyrideService = null;
    this.mRef?.hide();
    this.accountInfoService.closePopup();
  }

  initializeSource() {
    this._initializePager();
    this._fillTableFilterLists();

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    this.settings.columns.account.title = this._getAccountTitle();
    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);

    this.source.serviceCallBack = (params) => this._getQuotes(params);
    this.source.dataLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
    this.source.setSort([
      { field: 'creationDate', direction: 'desc' }  // primary sort
    ], false);
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }

  private _convertFilterValue(field: string, value: string): any {
    if (this.isEmpty(value)) return null;

    if (field === 'quoteCreated') {
      return new Date(value);
    }

    if (field === 'numberOfCars') {
      return +value;
    }
    return value;
  }

  private _getQuotes(params: any) {
    const quoteParams = params as QuoteToolParams;
    if (this.isSmall) {
      this._fillFilterParameters(quoteParams);
    }

    if (quoteParams.creationDate)
      quoteParams.creationDate = this.mockUtcDate(quoteParams.creationDate);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.quoteService.searchQuotesBySmartriseUsers(quoteParams);
    } else {
      return this._searchQuotesByCustomerUsers(quoteParams);
    }
  }

  private _searchQuotesByCustomerUsers(quoteParams: QuoteToolParams) {
    const searchParams = quoteParams as SearchQuotesByCustomerParams;
    searchParams.customerId = this.multiAccountService.getSelectedAccount();

    return this.quoteService.searchQuotesByCustomerUsers(searchParams);
  }

  private _fillTableFilterLists() {
    this.settings.columns.status.filter.config.list = this.statuses.map(x => {
      return { title: x.description, value: x.value };
    });
    this.settings.columns.jobStatus.filter.config.list = this.jobStatuses.map(x => {
      return { title: x.description, value: x.value };
    });
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _fillFilterParameters(quoteParams: QuoteToolParams) {
    quoteParams.account = this.account;
    quoteParams.jobName = this.jobName;
    quoteParams.controllerType = this.controllerType;
    quoteParams.status = this.status;
    quoteParams.jobStatus = this.jobStatus;
    quoteParams.creationDate = this.creationDate;
  }

  triggerGuidingTour() {
    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourQuotes') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      const steps = [];
      steps.push('quoteFirstStep');
      if (this.canEditQuote) {
        steps.push('quoteSecondStep');
      }
      this.joyrideService.startTour({
        steps,
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText
        }
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  async ngOnInit() {

    if (this.multiAccountService.hasSelectedAccount()) {
      this.canEditQuote = this.permissionService.hasPermissionInAccount(PERMISSIONS.SaveOnlineQuote, this.multiAccountService.getSelectedAccount());
    } else {
      this.canEditQuote = this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote) && !this.miscellaneousService.isImpersonateMode();
    }

    forkJoin([
      this.quotingToolService.getStatuses(),
      this.quotingToolService.getJobStatuses()
    ]).subscribe(([
      statuses,
      jobStatuses,
    ]) => this._onResponseReady(statuses, jobStatuses));
  }

  private _onResponseReady(statuses: IEnumValue[], jobStatuses: IEnumValue[]) {
    this.statuses = statuses;
    this.jobStatuses = jobStatuses;
    this.recordsNumber = environment.recordsPerPage;
    this.initializeSource();
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
  }

  private _onScreenSizeChanged(w: ScreenBreakpoint) {
    if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
      if (this.isSmall !== false) {
        this.onReset();
        this.isSmall = false;
      }
    } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
      if (this.isSmall !== true) {
        this.onReset();
        this.isSmall = true;
      }
    }
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onSearch() {
    this.source?.setPage(1, false);
    this.source?.refresh();
  }

  onReset() {

    this._resetFilterParameters();

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  private _resetFilterParameters() {
    this.account = null;
    this.jobName = null;
    this.creationDate = null;
    this.controllerType = null;
    this.status = '';
    this.jobStatus = '';
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourQuotes', '1');
    this.runGuidingTour = false;
  }

  preventNonNumericalInput(e) {

    e = e || window.event;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);

    const min = +e.target.min;

    if (isNaN(+(e.target.value + charStr))) {
      e.preventDefault();
      return;
    }


    if (+(e.target.value + charStr) < min) {
      e.preventDefault();
      return;
    }

    if (min > 0) {
      if (!charStr.match(/^[0-9]+$/)) {
        e.preventDefault();
      }
    }
  }

  onRequestQuote() {
    if (this._isCreatingQuote) {
      return;
    }
    this._isCreatingQuote = true;
    this.router.navigateByUrl(URLs.CreateOnlineQuote);
  }
}

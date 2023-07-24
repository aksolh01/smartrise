import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { forkJoin, Subscription, tap } from 'rxjs';
import { BaseComponentService } from '../../../../services/base-component.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { QuoteToolParams, SearchQuotesByCustomerParams } from '../../../../_shared/models/quote.model';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../../base.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { QuotingToolService } from '../../../../services/quoting-tool.service';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues, PERMISSIONS, URLs } from '../../../../_shared/constants';
import { QuoteStatusComponent } from '../../../../_shared/components/quote-status/quote-status.component';
import { PermissionService } from '../../../../services/permission.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { RoutingService } from '../../../../services/routing.service';
import { MessageService } from '../../../../services/message.service';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../../environments/environment';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { JobNameCellComponent } from '../../../quotes-management/quoting-tool-list/job-name-cell/job-name-cell.component';
import { JobStatusCellComponent } from '../../../quotes-management/quoting-tool/custom-components/job-status-cell/job-status-cell.component';
import { QuotingToolActionsComponent } from '../../../quotes-management/quoting-tool-list/quoting-tool-actions/quoting-tool-actions.component';
import { CloneDialogComponent } from '../../../quotes-management/quoting-tool-list/clone-dialog/clone-dialog.component';
import { RfqDetailsComponent } from '../../../quotes-management/rfq-details/rfq-details.component';
import { QuoteActivityHistoryComponent } from '../../../quotes-management/quoting-tool-list/quote-activity-history/quote-activity-history.component';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-quotes-createdby-account-result',
  templateUrl: './quotes-createdby-account-result.component.html',
  styleUrls: ['./quotes-createdby-account-result.component.scss']
})
export class QuotesCreatedbyAccountResultComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  @Input() searchKey: string;
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
    hideSubHeader: true,
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
        renderComponent: JobStatusCellComponent,
        onComponentInitFunction: (instance: JobStatusCellComponent) => {
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
        title: 'View Details',
        type: 'custom',
        renderComponent: ViewDetailsActionComponent,
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

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe((quote: any) => {
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/customer/${quote.id}/view`);
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
    private messageService: MessageService,
    private searchService: SearchService
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 1000);
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

    this.source.serviceCallBack = (params) => this._getQuotes(params).pipe(tap(x => this.searchService.notifyResultSetReady('QuotesCreatedByAccount', x.data.length)));
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

    this._fillSearchParameters(this.searchKey, quoteParams);

    if (quoteParams.creationDate)
      quoteParams.creationDate = this.mockUtcDate(quoteParams.creationDate);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.quoteService.searchAllQuotesBySmartriseUsers(quoteParams);
    } else {
      return this.quoteService.searchAllQuotesByCustomerUsers(quoteParams as SearchQuotesByCustomerParams);
    }
  }

  private _fillSearchParameters(searchKey: string, quoteParams: QuoteToolParams) {
    quoteParams.account = searchKey;
    quoteParams.controllerType = searchKey;
    quoteParams.jobName = searchKey;
    quoteParams.jobStatus = searchKey;
    quoteParams.status = searchKey;
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
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    if (this.multiAccountService.hasSelectedAccount()) {
      this.canEditQuote = this.permissionService.hasPermissionInAccount(PERMISSIONS.SaveOnlineQuote, this.multiAccountService.getSelectedAccount());
    } else {
      this.canEditQuote = this.permissionService.hasPermission(PERMISSIONS.SaveOnlineQuote) && !this.miscellaneousService.isImpersonateMode();
    }

    forkJoin([
      this.quotingToolService.getStatuses(),
      this.quotingToolService.getJobStatuses()
    ]).subscribe(([statuses, jobStatuses]) => {
      this._onResponseReady(statuses, jobStatuses)
    });

  }

  private _onResponseReady(statuses: IEnumValue[], jobStatuses: IEnumValue[]) {
    this.statuses = statuses;
    this.jobStatuses = jobStatuses;
    this.recordsNumber = 5;
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

  goToCreatedByAccount() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('pages/quotes-management/open-quotes');
    });
  }

  goToCreatedBySmartriseSales() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigateByUrl('pages/quotes-management/open-quotes?tab=smartrise');
    });
  }
}


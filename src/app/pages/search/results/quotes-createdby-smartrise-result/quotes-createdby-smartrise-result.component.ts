import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { BaseComponent } from '../../../base.component';
import { ShipmentStatus } from '../../../../_shared/models/shipment';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { URLs } from '../../../../_shared/constants';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { HLinkTableCellComponent } from '../../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { Tab } from '../../../../_shared/models/jobTabs';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpNumberFilterComponent } from '../../../../_shared/components/table-filters/cp-number-filter.component';
import { NumberTableCellComponent } from '../../../../_shared/components/number-table-cell/number-table-cell.component';
import { CpDateFilterComponent } from '../../../../_shared/components/table-filters/cp-date-filter.component';
import { ContactDetailsComponent } from '../../../quotes-management/open-quotes/contact-details/contact-details.component';
import { IOpenQuote, IOpenQuoteContact, OpenQuoteByCustomerSearchParams, QouteSearchParams } from '../../../../_shared/models/quote.model';
import { OpenQuoteActionsComponent } from '../../../quotes-management/open-quotes/open-quote-actions/open-quote-actions.component';
import { Subscription, tap } from 'rxjs';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { Router } from '@angular/router';
import { JobTabService } from '../../../../services/job-tabs.service';
import { QuoteService } from '../../../../services/quote.service';
import { QuotingToolService } from '../../../../services/quoting-tool.service';
import { JoyrideService } from 'ngx-joyride';
import { ResponsiveService } from '../../../../services/responsive.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { allowOnlyNumbers } from '../../../../_shared/functions';
import { SearchService } from '../../../../services/search.service';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-quotes-createdby-smartrise-result',
  templateUrl: './quotes-createdby-smartrise-result.component.html',
  styleUrls: ['./quotes-createdby-smartrise-result.component.scss']
})
export class QuotesCreatedbySmartriseResultComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
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
  quoteNumber: string;
  controllerType: string;
  contact: string;
  shipDate?: Date;
  deliveryDate?: Date;
  status?: ShipmentStatus;
  isDropShipment: string;
  trackingNumber: string;
  isSmartriseUser = false;
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
              'account.id'
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
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.preNavigateFunction = (rowData) => {
            this.jobTabService.setSelectedTab(Tab.JobDetails);
          };
          instance.setHeader('Job Name');
          instance.setOptions({
            tooltip: 'View Quote Details',
            link: URLs.SmartriseOnlineQuote,
            paramExps: [
              'id'
            ]
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      quoteNumber: {
        title: 'Quote Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Quote Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
          config: {
            allowOnlyNumbers: true
          }
        },
      },
      numberOfCars: {
        title: 'Cars',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Cars');
        },
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 1,
          },
        },
      },
      controllerType: {
        title: 'Controller Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Controller Type');
        },
        editable: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      amount: {
        title: 'Amount',
        type: 'custom',
        renderComponent: NumberTableCellComponent,
        onComponentInitFunction: (instance: NumberTableCellComponent) => {
          instance.setHeader('Amount');
          instance.setPrefix('$');
          instance.setParameter('1.2-2');
        },
        editable: false,
        valuePrepareFunction: this.formatMoney.bind(this),
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 0,
          },
        },
      },
      createdBy: {
        title: 'Created By',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Created By');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        },
      },
      quoteCreated: {
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
      contact: {
        title: 'Contact',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Contact');
          instance.preNavigateFunction = (value) => {
            this.mRef = this.modalService.show<ContactDetailsComponent>(ContactDetailsComponent, {
              initialState: {
                contact: value.contact
              }
            });
          };
          instance.setOptions({
            breakWord: false,
            tooltip: 'View Contact Details'
          });
        },
        valuePrepareFunction: (value: IOpenQuoteContact) => value?.name,
        editable: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
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
  createdBy: string;

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe((quote: IOpenQuote) => {
      this.router.navigateByUrl(`${URLs.ViewOpenQuotesURL}/smartrise/${quote.id}`);
    });
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }

  constructor(
    private router: Router,
    private jobTabService: JobTabService,
    private quoteService: QuoteService,
    private quotingToolService: QuotingToolService,
    private joyrideService: JoyrideService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    private searchService: SearchService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnDestroy(): void {
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

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    this.settings.columns.account.title = this._getAccountTitle();
    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);

    this.source.serviceCallBack = (params) => this._getOpenQuotes(params).pipe(tap(x => this.searchService.notifyResultSetReady('QuotesCreatedBySmartrise', x.data.length)));
    this.source.dataLoading.subscribe((isLoading) => this.isLoading = isLoading);
    this.source.setSort([
      { field: 'quoteCreated', direction: 'desc' }  // primary sort
    ], false);
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

  private _getOpenQuotes(params: any) {
    const quoteParams = params as QouteSearchParams;

    this._fillSearchParameters(this.searchKey, quoteParams);

    if (quoteParams.quoteCreated)
      quoteParams.quoteCreated = this.mockUtcDate(quoteParams.quoteCreated);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.quoteService.searchAllOpenQuotesBySmartriseUser(quoteParams);
    } else {
      return this.quoteService.searchAllOpenQuotesByCustomerUser(quoteParams as OpenQuoteByCustomerSearchParams);
    }
  }

  private _fillSearchParameters(searchKey: string, quoteParams: QouteSearchParams) {
    quoteParams.account = searchKey;
    quoteParams.contact = searchKey;
    quoteParams.controllerType = searchKey;
    quoteParams.jobName = searchKey;
    quoteParams.quoteNumber = searchKey;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
        perPage: this.recordsNumber || 25
    };
  }

  private _fillFilterParameters(quoteParams: QouteSearchParams) {
    quoteParams.account = this.account;
    quoteParams.jobName = this.jobName;
    quoteParams.quoteNumber = this.quoteNumber;
    quoteParams.controllerType = this.controllerType;
    quoteParams.contact = this.contact;
    quoteParams.quoteCreated = this.quoteCreated;
    quoteParams.numberOfCars = this.numberOfCars;
    quoteParams.amount = this.amount;
    quoteParams.createdBy = this.createdBy;
  }

  triggerGuidingTour() {
    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourOpenQuotes') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['openQuoteFirstStep'],
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
    this.recordsNumber = 5;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => {
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
    });
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
    this.quoteNumber = null;
    this.quoteCreated = null;
    this.controllerType = null;
    this.contact = null;
    this.numberOfCars = null;
    this.amount = null;
    this.createdBy = null;
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourOpenQuotes', '1');
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

  onKeyPress(e) {
    e = e || window.event;
    if (!allowOnlyNumbers(e)) {
      return;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pager.table = this.table;
    }, 1000);
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


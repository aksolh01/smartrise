import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpNumberFilterComponent } from '../../../_shared/components/table-filters/cp-number-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { BillingInvoiceByCustomerUserParams, BillingInvoiceParams } from '../../../_shared/models/invoiceParams.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { InvoiceService } from '../../../services/invoice.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { BaseComponent } from '../../base.component';
import { InvoicesActionsComponent } from './invoices-actions/invoices-actions.component';
import { HLinkTableCellComponent } from '../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { InvoiceAgedCellComponent } from '../../../_shared/components/invoice-aged-cell/invoice-aged-cell.component';
import { SelectHelperService } from '../../../services/select-helper.service';
import { allowOnlyNumbers } from '../../../_shared/functions';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountInfoService } from '../../../services/account-info.service';
import { AccountTableCellComponent } from '../../../_shared/components/account-table-cell/account-table-cell.component';
import { URLs } from '../../../_shared/constants';
import { ListTitleService } from '../../../services/list-title.service';
import { BaseParams } from '../../../_shared/models/baseParams';
import { IPagination } from '../../../_shared/models/pagination';
import { Observable } from 'rxjs';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('table') table: Ng2SmartTableComponent;
  account: string;
  invoiceNumber: string;
  jobNumber: string;
  poNumbers: string;
  invoiceDate: Date;
  paymentDate: Date;
  dueDate: Date;
  amount: number;
  aged = '';
  showFilters = false;
  runGuidingTour = true;
  public Math = Math;
  source: BaseServerDataSource;
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
      installedBy: {
        title: 'Installation By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Installation By');
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
      maintainedBy: {
        title: 'Currently Maintained By',
        type: 'custom',
        renderComponent: AccountTableCellComponent,
        onComponentInitFunction: (instance: AccountTableCellComponent) => {
          instance.setHeader('Currently Maintained By');
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
      jobNumber: {
        title: 'Job Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      invoiceNumber: {
        title: 'Invoice Number',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Invoice Number');
          instance.setOptions({
            breakWord: true,
            tooltip: 'View Invoice Details',
            link: 'pages/billing/invoices',
            paramExps: [
              'id'
            ]
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
          config: {
            allowOnlyNumbers: true,
          }
        }
      },
      poNumbers: {
        title: 'PO Number',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('PO Number');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      invoiceDate: {
        title: 'Invoice Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Invoice Date');
        },
        valuePrepareFunction: this.formatUSDate.bind(this),
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
      },
      balance: {
        width: '15%',
        title: 'Balance',
        type: 'custom',
        renderComponent: InvoiceAgedCellComponent,
        onComponentInitFunction: (instance: InvoiceAgedCellComponent) => {
          instance.setHeader('Balance');
        },
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 0
          }
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: InvoicesActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };
  isLoading = true;
  isSmall: any;
  recordsNumber: any;
  responsiveSubscription: any;
  balance: number;
  agedOptions: { value: string; title: string }[];
  isSmartriseUser: boolean;
  title: any;
  installedBy: string;
  maintainedBy: string;

  constructor(
    private miscellaneousService: MiscellaneousService,
    private invoiceService: InvoiceService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private joyrideService: JoyrideService,
    private selectHelperService: SelectHelperService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
    private listTitleService: ListTitleService
  ) {
    super(baseService);
  }

  ngOnDestroy(): void {
    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }

  onActionsInit(actions: InvoicesActionsComponent) {
    actions.payEvent.subscribe(row => {
      this.router.navigateByUrl(`pages/billing/invoices/${row.id}`);
    });
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  async ngOnInit() {
    this.title = await this.listTitleService.buildTitle('Invoices');
    this.recordsNumber = environment.recordsPerPage;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));
  }

  private _onBusinessSettingsReady(rep: IBusinessSettings) {
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

  initializeSource() {

    this._initializePager();
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    this.settings.columns.account.title = this._getAccountTitle();

    if (this.miscellaneousService.isCustomerUser()) {
      delete this.settings.columns.maintainedBy;
      delete this.settings.columns.installedBy;
      if (this.multiAccountService.hasOneAccount()) {
        delete this.settings.columns.account;
      }
    }

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getInvoices(params);
    this.source.setSort([
      { field: 'invoiceDate', direction: 'asc' }  // primary sort
    ], false);
    this.source.dataLoading.subscribe(isLoading => this._onDataLoading(isLoading));
  }

  private _getAccountTitle(): string {
    return this.miscellaneousService.isCustomerUser() ? 'Account' : 'Ordered By';
  }

  private _onDataLoading(isLoading: any) {
    this.isLoading = isLoading;
    setTimeout(() => {
      this.startGuidingTour();
    }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
  }

  private _convertFilterValue(field, value) {
    if (this.isEmpty(value))
      return null;

    if (field === 'dueDate' || field === 'invoiceDate') {
      return new Date(value);
    }

    return value;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };
  }

  private _getInvoices(params: BaseParams): Observable<IPagination> {
    const sParam = params as BillingInvoiceParams;
    sParam.aged = this.isEmpty(this.aged) ? null : this.aged;

    if (this.isSmall) {
      this._fillFilterParameters(sParam);
    }

    this._mockDateParameters(sParam);

    if (this.miscellaneousService.isSmartriseUser()) {
      return this.invoiceService.getBillingInvoices(params as BillingInvoiceParams);
    } else {
      return this._getBillingInvoicesByCustomerUser(sParam as BillingInvoiceByCustomerUserParams);
    }
  }

  private _getBillingInvoicesByCustomerUser(searchParameters: BillingInvoiceByCustomerUserParams): Observable<IPagination> {
    searchParameters.customerId = this.multiAccountService.getSelectedAccount();
    return this.invoiceService.getBillingInvoicesBuCustomerUser(searchParameters);
  }

  private _mockDateParameters(sParam: BillingInvoiceParams) {
    sParam.invoiceDate = this.mockUtcDate(sParam.invoiceDate);
    sParam.dueDate = this.mockUtcDate(sParam.dueDate);
  }

  private _fillFilterParameters(sParam: BillingInvoiceParams) {
    sParam.account = this.account;
    sParam.invoiceNumber = this.invoiceNumber;
    sParam.jobNumber = this.jobNumber;
    sParam.poNumbers = this.poNumbers;
    sParam.invoiceDate = this.invoiceDate;
    sParam.dueDate = this.dueDate;
    sParam.amount = this.amount;
    sParam.balance = this.balance;
    sParam.installedBy = this.installedBy;
    sParam.maintainedBy = this.maintainedBy;
  }

  onAgedSelected(event) {
    this.aged = event;
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onReset() {
    if (this.isSmall) {

      this._resetFilterParameters();

      this.source.refreshAndGoToFirstPage();
    } else {
      if (!this.isEmpty(this.aged)) {
        this.aged = '';
        if (this.source.hasFilter()) {
          this.source.resetFilters();
        } else {
          this.source.notifyReset();
          this.source.refresh();
        }
      } else {
        this.source.resetFilters();
      }
    }
  }

  private _resetFilterParameters() {
    this.account = null;
    this.invoiceNumber = null;
    this.jobNumber = null;
    this.poNumbers = null;
    this.invoiceDate = null;
    this.dueDate = null;
    this.paymentDate = null;
    this.amount = null;
    this.balance = null;
    this.aged = '';
    this.installedBy = null;
    this.maintainedBy = null;
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  preventNonNumericalInput(e) {

    e = e || window.event;
    const charCode = (typeof e.which === 'undefined') ? e.keyCode : e.which;
    const charStr = String.fromCharCode(charCode);

    const min = 0;

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

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourInvoices') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['invoicesFirstStep'],
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

  onFinishingTour() {
    localStorage.setItem('GuidingTourInvoices', '1');
    this.runGuidingTour = false;
  }

  onAgedDropDownClick() {
    this.selectHelperService.allowOnScroll.next(false);
  }
}

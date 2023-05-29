import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpDateFilterComponent } from '../../../_shared/components/table-filters/cp-date-filter.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpNumberFilterComponent } from '../../../_shared/components/table-filters/cp-number-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import {
  AgedRecievablesByCustomerSearchParams,
  AgedRecievablesSearchParams as AgedRecievablesSearchParams,
} from '../../../_shared/models/invoiceParams.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { InvoiceService } from '../../../services/invoice.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { BaseComponent } from '../../base.component';
import { AgedRecievablesActionsComponent } from './statement-of-account-actions/statement-of-account-actions.component';
import { NavigationStart, Router } from '@angular/router';
import { NumberTableCellComponent } from '../../../_shared/components/number-table-cell/number-table-cell.component';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { PERMISSIONS, StorageConstants, URLs } from '../../../_shared/constants';
import { BooleanCellComponent } from '../../../_shared/components/boolean-cell/boolean-cell.component';
import { filter, map, tap } from 'rxjs/operators';
import { IInvoiceInfo } from '../../../_shared/models/initiate-payment-request.model';
import { HLinkTableCellComponent } from '../../../_shared/components/hlink-table-cell/hlink-table-cell.component';
import { JoyrideService } from 'ngx-joyride';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { AccountService } from '../../../services/account.service';
import { PermissionService } from '../../../services/permission.service';
import { InvoiceAgedCellComponent } from '../../../_shared/components/invoice-aged-cell/invoice-aged-cell.component';
import { allowOnlyNumbers } from '../../../_shared/functions';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { MessageService } from '../../../services/message.service';
import { AccountInfoService } from '../../../services/account-info.service';
import { AccountTableCellComponent } from '../../../_shared/components/account-table-cell/account-table-cell.component';
import { IUserAccountLookup } from '../../../_shared/models/IUser';
import { ListTitleService } from '../../../services/list-title.service';
import { BaseParams } from '../../../_shared/models/baseParams';
import { Observable } from 'rxjs';
import { IPagination } from '../../../_shared/models/pagination';
import { IBusinessSettings } from '../../../_shared/models/settings';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ngx-statement-of-account',
  templateUrl: './statement-of-account.component.html',
  styleUrls: ['./statement-of-account.component.scss'],
})
export class StatementOfAccountComponent extends BaseComponent implements OnInit, OnDestroy {

  @ViewChild('table') table: Ng2SmartTableComponent;

  private sub = this.router.events
    .pipe(
      filter(event => event instanceof NavigationStart),
      map(event => event as NavigationStart)
    )
    .subscribe(() =>
      this.invoiceService.deleteToBePaidInvoices()
    );

  runGuidingTour: boolean = true;
  account: string;
  invoiceNumber: string;
  poNumbers: string;
  invoiceDate: Date;
  dueDate: Date;
  amount: number;
  balance: number;
  showFilters = false;

  showList = true;
  markedAsPay: IInvoiceInfo[] = [];
  source: BaseServerDataSource;
  public Math = Math;
  settings: any = {
    rowClassFunction: (rowData) => {
      if (rowData.data?.isTransactionLocked) {
        return 'locked-row';
      }
      return '';
    },
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      pay: {
        title: 'Pay',
        type: 'custom',
        renderComponent: BooleanCellComponent,
        onComponentInitFunction: (instance: BooleanCellComponent) => {
          instance.setHeader('Pay');
          instance.statusCallback = this._getCheckBboxStatus.bind(this);
          instance.checkCallback = this._markInvoiceToPay.bind(this);
          instance.enableCheckCallback = this._canPay.bind(this);
        },
        filterFunction: (value) => {
          console.log('filterFunction:' + value);
        },
        filter: false,
        sort: false,
      },
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
      invoiceNumber: {
        title: 'Invoice Number',
        type: 'custom',
        renderComponent: HLinkTableCellComponent,
        onComponentInitFunction: (instance: HLinkTableCellComponent) => {
          instance.setHeader('Invoice Number');
          instance.setOptions({
            tooltip: 'View Invoice Details',
            link: 'pages/billing/statement-of-account',
            paramExps: ['id'],
          });
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
          config: {
            allowOnlyNumbers: true,
          },
        },
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
        },
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
      dueDate: {
        title: 'Due Date',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Due Date');
        },
        valuePrepareFunction: this.formatUSDate.bind(this),
        filter: {
          type: 'custom',
          component: CpDateFilterComponent,
        },
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
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 0,
          },
        },
      },
      balance: {
        width: '18%',
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
            min: 0,
          },
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'View Details',
        type: 'custom',
        renderComponent: AgedRecievablesActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  isLoading = true;
  isSmall: any;
  recordsNumber: any;
  responsiveSubscription: any;
  agedOptions: { value: string; title: string }[];
  isSmartriseUser: boolean;
  isImpersonate: boolean;
  canMakePayment = false;
  aged = '';
  allowedCustomerIds: number[] = [];
  accounts: IUserAccountLookup[];
  showSelectAccount: boolean = this.multiAccountService.hasMultipleAccounts();
  hasMultipleAccounts: boolean = this.multiAccountService.hasMultipleAccounts();
  installedBy: string;
  maintainedBy: string;

  get accountSelected(): boolean {
    return this.accountId ? true : false;
  }

  set accountId(value: number | null) {
    if (value == null) {
      sessionStorage.removeItem(StorageConstants.StatementOfAccountSelectedAccount);
      return;
    }
    sessionStorage.setItem(StorageConstants.StatementOfAccountSelectedAccount, value.toString());
  }

  get accountId(): number | null {
    const accountId = sessionStorage.getItem(StorageConstants.StatementOfAccountSelectedAccount);

    return accountId == null ? null : +accountId;
  }

  // private sub = this.router.events
  //   .pipe(
  //     filter((event) => event instanceof NavigationStart),
  //     map((event) => event as NavigationStart)
  //   )
  //   .subscribe(() => this.invoiceService.deleteToBePaidInvoices());

  constructor(
    private permissionService: PermissionService,
    private accountService: AccountService,
    private miscellaneousService: MiscellaneousService,
    private invoiceService: InvoiceService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private joyrideService: JoyrideService,
    private multiAccountService: MultiAccountsService,
    private messageService: MessageService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  async ngOnInit(): Promise<void> {

    await this._loadUserAccounts();

    if (this.accounts.length === 1) {
      this._handleSingleAccount();
    }

    this.canMakePayment = this.permissionService.hasPermission(PERMISSIONS.MakePayment);
    this.showList = true;
    this.markedAsPay = this.invoiceService.releaseToBePaidInvoices();
    this.recordsNumber = environment.recordsPerPage;
    this.initializeSource();
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

  private _handleSingleAccount() {
    this.accountId = this.accounts[0].accountId;
    this.showSelectAccount = false;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
    this._disposeAccountID();
  }

  private _disposeAccountID() {
    if (!this.router.url.startsWith(URLs.ViewStatementOfAccountURL)) {
      this.accountId = null;
    }
  }

  private _loadUserAccounts() {
    return this.accountService
      .loadCurrentUser()
      .pipe(
        tap(user => this.accounts = this._getAuthorizedAccounts(user.accounts))
      ).toPromise();
  }

  private _getAuthorizedAccounts(accounts: IUserAccountLookup[]) {
    return accounts.filter(acc => acc.permissions.some(p => p === PERMISSIONS.InvoicesListing));
  }

  onActionsInit(actions: AgedRecievablesActionsComponent) {
    actions.payEvent.subscribe((row) => {
      this.router.navigateByUrl(`pages/billing/statement-of-account/${row.id}`);
    });
  }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  initializeSource() {

    this._initializePager();
    this.agedOptions = this._generateAgedOptions();
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    if (this.isImpersonate || !this.canMakePayment) {
      delete this.settings.columns.pay;
    }

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
    this.source.injectPipe(
      map(x => {
        x.data.forEach(item => this._updatePayFlag(item));
        return x;
      })
    );
    this.source.serviceCallBack = (params) => this._getStatementOfAccount(params);
    this.source.setSort([
      { field: 'dueDate', direction: 'asc' }  // primary sort
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
      perPage: this.recordsNumber
    };
  }

  private _getStatementOfAccount(params: BaseParams): Observable<IPagination> {
    if (this.isSmartriseUser === false && this.hasMultipleAccounts && !this.accountSelected) {
      return this.emptyData();
    }

    const sParam = params as AgedRecievablesSearchParams;
    sParam.aged = this.isEmpty(this.aged) ? null : this.aged;

    if (this.isSmall) {
      this._fillFilterParameters(sParam);
    }
    this._mockDateParameters(sParam);

    if (this.isSmartriseUser) {
      return this.invoiceService.getAgedRecievablesBySmartriseUser(params as AgedRecievablesSearchParams);
    } else {
      const searchParameters = sParam as AgedRecievablesByCustomerSearchParams;
      searchParameters.customerId = this.accountId;

      return this.invoiceService.getAgedRecievablesByCustomerUser(searchParameters as AgedRecievablesByCustomerSearchParams);
    }
  }

  private _mockDateParameters(sParam: AgedRecievablesSearchParams) {
    sParam.invoiceDate = this.mockUtcDate(sParam.invoiceDate);
    sParam.dueDate = this.mockUtcDate(sParam.dueDate);
  }

  private _fillFilterParameters(sParam: AgedRecievablesSearchParams) {
    sParam.account = this.account;
    sParam.invoiceNumber = this.invoiceNumber;
    sParam.poNumbers = this.poNumbers;
    sParam.invoiceDate = this.invoiceDate;
    sParam.dueDate = this.dueDate;
    sParam.amount = this.amount;
    sParam.balance = this.balance;
    sParam.installedBy = this.installedBy;
    sParam.maintainedBy = this.maintainedBy;
  }

  private _updatePayFlag(item: any): void {
    const _item = this.markedAsPay.find(x => x.invoiceId == item.id);
    if (_item) {
      if (item.invoiceCanBePaid) {
        item.pay = true;
      } else {
        item.pay = false;
        const indexOfInvoice = this.markedAsPay.indexOf(_item);
        if (indexOfInvoice > -1) {
          this.invoiceService.removeInvoiceByIndex(indexOfInvoice);
          this.markedAsPay.splice(indexOfInvoice, 1);
        }
      }
    } else {
      item.pay = false;
    }
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
    this.poNumbers = null;
    this.invoiceDate = null;
    this.dueDate = null;
    this.amount = null;
    this.balance = null;
    this.aged = '';
    this.installedBy = null;
    this.maintainedBy = null;
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onFilterPay(checkStatus: boolean | null) {
    this.source.refresh();
  }

  onAccountSelected(event) {
    this.accountId = event;
    this._saveAccountInfoToStorage(this.accountId);
    this.onSearch();
  }
  private _saveAccountInfoToStorage(accountId: number) {
    sessionStorage.setItem(StorageConstants.StatementOfAccountSelectedAccount, accountId.toString());
  }

  onPay() {
    const customerIds = this.markedAsPay.map(invoice => invoice.customerId);
    const uniqueCustomerIds = new Set(customerIds);

    if (uniqueCustomerIds.size > 1) {
      this.messageService.showErrorMessage("Invoices do not belong to the same Account");
      return;
    }

    this.accountService.checkSessionExpiry().subscribe(() => {
      this.showList = false;
    });
  }

  closePay() {
    this.accountService.checkSessionExpiry().subscribe(() => {
      this.markedAsPay = [];
      this.invoiceService.deleteToBePaidInvoices();
      this.showList = true;
      this.onReset();
      this.onSearch();
    });
  }

  preventNonNumericalInput(e) {
    e = e || window.event;
    const charCode = typeof e.which === 'undefined' ? e.keyCode : e.which;
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

  private _canPay(rowData: any): boolean {
    return rowData.invoiceCanBePaid &&
      (
        (this.isSmartriseUser === false && this.permissionService.hasPermissionInAccount("MakePayment", +rowData.customerId))
      );
  }

  // private _markInvoiceToBePaid(invoice) {
  //   this.markedAsPay.push(invoice);
  //   this.invoiceService.holdToBePaidInvoices(this.markedAsPay);
  // }

  // private _unmarkInvoiceToBePiad(rowData) {
  //   const indexOfItem = this.markedAsPay.indexOf(this.markedAsPay.filter(y => y.invoiceId === rowData.id)[0]);
  //   this.markedAsPay.splice(indexOfItem, 1);
  //   this.invoiceService.holdToBePaidInvoices(this.markedAsPay);
  // }

  // private _canPay(rowData: any): boolean {
  //   return (
  //     rowData.invoiceCanBePaid &&
  //     (!this.miscellaneousService.isSmartriseUser() ||
  //       (this.miscellaneousService.isSmartriseUser() &&
  //         this.allowedCustomerIds.findIndex((x) => x === rowData.customerId) >
  //           -1))
  //   );
  // }

  private _markInvoiceToBePaid(invoice) {
    this.markedAsPay.push(invoice);
    this.invoiceService.holdToBePaidInvoices(this.markedAsPay);
  }

  private _unmarkInvoiceToBePiad(rowData) {
    const indexOfItem = this.markedAsPay.indexOf(
      this.markedAsPay.filter((y) => y.invoiceId === rowData.id)[0]
    );
    this.markedAsPay.splice(indexOfItem, 1);
    this.invoiceService.holdToBePaidInvoices(this.markedAsPay);
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourStatementOfAccount') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      this.joyrideService.startTour({
        steps: ['statementFirstStep'],
        themeColor: guidingTourGlobal.guidingTourThemeColor,
        customTexts: {
          prev: guidingTourGlobal.guidingTourPrevButtonText,
          next: guidingTourGlobal.guidingTourNextButtonText,
          done: guidingTourGlobal.guidingTourDoneButtonText,
        },
      });
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourStatementOfAccount', '1');
    this.runGuidingTour = false;
  }

  onAgedSelected(event) {
    this.aged = event;
    this.source.setPage(1, false);
    this.source.refresh();
  }

  private _getCheckBboxStatus(): string {
    if (this.isSmall) {
      return 'control';
    }
    return 'basic';
  }

  private _markInvoiceToPay(value: boolean, rowData: any) {
    if (value) {
      this._markInvoiceToBePaid({
        invoiceId: rowData.id,
        invoiceNumber: rowData.invoiceNumber,
        pONumbers: rowData.poNumbers,
        paymentAmount: rowData.balance,
        customerId: rowData.customerId,
      });
    } else {
      this._unmarkInvoiceToBePiad(rowData);
    }
  }

  private _generateAgedOptions() {
    return [
      {
        value: 'Current',
        title: 'Current',
      },
      {
        value: 'Over30',
        title: '30 Days Overdue',
      },
      {
        value: 'Over60',
        title: '60 Days Overdue',
      },
      {
        value: 'Over90',
        title: '90 Days Overdue',
      },
      {
        value: 'Over120',
        title: '120 Days Overdue',
      },
    ];
  }


}

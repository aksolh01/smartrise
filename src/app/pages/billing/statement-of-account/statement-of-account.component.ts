import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { AgedRecievablesActionsComponent } from './statement-of-account-actions/statement-of-account-actions.component';
import { NavigationStart, Router } from '@angular/router';
import { NumberTableCellComponent } from '../../../_shared/components/number-table-cell/number-table-cell.component';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { PERMISSIONS } from '../../../_shared/constants';
import { BooleanCellComponent } from '../../../_shared/components/boolean-cell/boolean-cell.component';
import { filter, map } from 'rxjs/operators';
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
import { AccountNameCellComponent } from '../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../services/account-info.service';

@Component({
  selector: 'ngx-statement-of-account',
  templateUrl: './statement-of-account.component.html',
  styleUrls: ['./statement-of-account.component.scss'],
})
export class StatementOfAccountComponent extends BaseComponent implements OnInit, OnDestroy {

  runGuidingTour = true;
  customer: string;
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
        renderComponent: AccountNameCellComponent,
        onComponentInitFunction: (instance: AccountNameCellComponent) => {
          instance.setHeader('Account');
          instance.clicked.subscribe((accountId: number) => {
            this.accountInfoService.showAccountInfo(accountId);
          });
        },
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

  private sub = this.router.events
    .pipe(
      filter((event) => event instanceof NavigationStart),
      map((event) => event as NavigationStart)
    )
    .subscribe(() => this.invoiceService.deleteToBePaidInvoices());

  constructor(
    private permissionService: PermissionService,
    private accountService: AccountService,
    private miscellaneousService: MiscellaneousService,
    private invoiceService: InvoiceService,
    private settingService: SettingService,
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
    this.canMakePayment = this.permissionService.hasPermission(
      PERMISSIONS.MakePayment
    );
    this.showList = true;
    this.markedAsPay = this.invoiceService.releaseToBePaidInvoices();

    this.settingService.getBusinessSettings().subscribe((rep) => {
      this.recordsNumber = rep.numberOfRecords;
      this.initializeSource();
      this.responsiveSubscription =
        this.responsiveService.currentBreakpoint$.subscribe((w) => {
          if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
            if (this.isSmall !== false) {
              this.onReset();
              this.isSmall = false;
            }
          } else if (
            w === ScreenBreakpoint.md ||
            w === ScreenBreakpoint.xs ||
            w === ScreenBreakpoint.sm
          ) {
            if (this.isSmall !== true) {
              this.onReset();
              this.isSmall = true;
            }
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.stopGuidingTour();
    this.joyrideService = null;
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
    this.agedOptions = this._generateAgedOptions();
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    if (this.isImpersonate || !this.canMakePayment) {
      delete this.settings.columns.pay;
    }

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }

      if (field === 'dueDate' || field === 'invoiceDate') {
        return new Date(value);
      }
      return value;
    };
    this.source.serviceErrorCallBack = () => {};
    this.source.injectPipe(
      map((x) => {
        x.data.forEach((item) => {
          const items = this.markedAsPay.filter((x1) => x1.invoiceId === item.id);
          if (items.length > 0) {
            const indexOfInvoice = this.markedAsPay.indexOf(items[0]);
            item.pay = indexOfInvoice > -1;
            if (!item.invoiceCanBePaid) {
              item.pay = false;
              if (indexOfInvoice > -1) {
                this.invoiceService.removeInvoiceByIndex(indexOfInvoice);
                this.markedAsPay.splice(indexOfInvoice, 1);
              }
            }
          } else {
            item.pay = false;
          }
        });

        return x;
      })
    );
    this.source.serviceCallBack = (params) => {
      const sParam = params as AgedRecievablesSearchParams;
      sParam.aged = this.isEmpty(this.aged) ? null : this.aged;

      if (this.isSmall) {
        sParam.customer = this.customer;
        sParam.invoiceNumber = this.invoiceNumber;
        sParam.poNumbers = this.poNumbers;
        sParam.customer = this.customer;
        sParam.invoiceDate = this.invoiceDate;
        sParam.dueDate = this.dueDate;
        sParam.amount = this.amount;
        sParam.balance = this.balance;
      }
      sParam.invoiceDate = this.mockUtcDate(sParam.invoiceDate);
      sParam.dueDate = this.mockUtcDate(sParam.dueDate);

      if (this.miscellaneousService.isSmartriseUser()) {
        return this.invoiceService.getAgedRecievablesBySmartriseUser(
          params as AgedRecievablesSearchParams
        );
      } else {
        const searchParameters =
          sParam as AgedRecievablesByCustomerSearchParams;
        searchParameters.customerId =
          this.multiAccountService.getSelectedAccount();

        return this.invoiceService.getAgedRecievablesByCustomerUser(
          searchParameters as AgedRecievablesByCustomerSearchParams
        );
      }
    };
    this.source.setSort(
      [
        { field: 'dueDate', direction: 'asc' }, // primary sort
      ],
      false
    );
    this.source.dataLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
      setTimeout(
        () => {
          this.startGuidingTour();
        },
        this.isSmall
          ? guidingTourGlobal.smallScreenSuspensionTimeInterval
          : guidingTourGlobal.wideScreenSuspensionTimeInterval
      );
    });
  }

  onReset() {
    if (this.isSmall) {
      this.customer = null;
      this.invoiceNumber = null;
      this.poNumbers = null;
      this.invoiceDate = null;
      this.dueDate = null;
      this.amount = null;
      this.balance = null;
      this.aged = '';

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

  private _canPay(rowData: any): boolean {
    return (
      rowData.invoiceCanBePaid &&
      (!this.miscellaneousService.isSmartriseUser() ||
        (this.miscellaneousService.isSmartriseUser() &&
          this.allowedCustomerIds.findIndex((x) => x === rowData.customerId) >
            -1))
    );
  }

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
}

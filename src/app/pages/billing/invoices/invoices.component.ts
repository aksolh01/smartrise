import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { SettingService } from '../../../services/setting.service';
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
import { AccountNameCellComponent } from '../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../services/account-info.service';

@Component({
  selector: 'ngx-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent extends BaseComponent implements OnInit, OnDestroy {
  customer: string;
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

  constructor(
    private miscellaneousService: MiscellaneousService,
    private invoiceService: InvoiceService,
    private settingService: SettingService,
    private responsiveService: ResponsiveService,
    private router: Router,
    private joyrideService: JoyrideService,
    private selectHelperService: SelectHelperService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnDestroy(): void {
    this.stopGuidingTour();
    this.joyrideService = null;
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

  ngOnInit(): void {
    this.settingService.getBusinessSettings().subscribe(rep => {
      this.recordsNumber = rep.numberOfRecords;
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
    });
  }

  initializeSource() {
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber
    };
    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
return null;
}

      if (field === 'dueDate' || field === 'invoiceDate') {
        return new Date(value);
      }

      // if (field === 'balance') {
      //   return +value;
      // }
      return value;
    };
    this.source.serviceErrorCallBack = (error) => { };
    this.source.serviceCallBack = (params) => {
      const sParam = params as BillingInvoiceParams;
      sParam.aged = this.isEmpty(this.aged) ? null : this.aged;
      if (this.isSmall) {
        sParam.customer = this.customer;
        sParam.invoiceNumber = this.invoiceNumber;
        sParam.jobNumber = this.jobNumber;
        sParam.poNumbers = this.poNumbers;
        sParam.invoiceDate = this.invoiceDate;
        sParam.dueDate = this.dueDate;
        sParam.amount = this.amount;
        sParam.balance = this.balance;
      }
      sParam.invoiceDate = this.mockUtcDate(sParam.invoiceDate);
      sParam.dueDate = this.mockUtcDate(sParam.dueDate);

      if (this.miscellaneousService.isSmartriseUser()) {
        return this.invoiceService.getBillingInvoices(params as BillingInvoiceParams);
      } else {
        const searchParameters = sParam as BillingInvoiceByCustomerUserParams;
        searchParameters.customerId = this.multiAccountService.getSelectedAccount();

        return this.invoiceService.getBillingInvoicesBuCustomerUser(searchParameters as BillingInvoiceByCustomerUserParams);
      }
    };
    this.source.setSort([
      { field: 'invoiceDate', direction: 'asc' }  // primary sort
    ], false);
    this.source.dataLoading.subscribe(isLoading => {
      this.isLoading = isLoading;
      setTimeout(() => {
        this.startGuidingTour();
      }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
  }

  onAgedSelected(event) {
    this.aged = event;
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onReset() {
    if (this.isSmall) {

      this.customer = null;
      this.invoiceNumber = null;
      this.jobNumber = null;
      this.poNumbers = null;
      this.invoiceDate = null;
      this.dueDate = null;
      this.paymentDate = null;
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

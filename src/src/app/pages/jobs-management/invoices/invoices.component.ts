import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpNumberFilterComponent } from '../../../_shared/components/table-filters/cp-number-filter.component';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { InvoiceParams } from '../../../_shared/models/invoiceParams.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponentService } from '../../../services/base-component.service';
import { InvoiceService } from '../../../services/invoice.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { BaseComponent } from '../../base.component';
import { InvoicesActionsComponent } from './invoices-actions/invoices-actions.component';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { IBusinessSettings } from '../../../_shared/models/settings';

@Component({
  selector: 'ngx-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent extends BaseComponent implements OnInit {

  isSmall = false;
  source = new BaseServerDataSource();
  recordsNumber: number;
  responsiveSubscription: any;
  showFilters = false;

  customer: string;
  jobName: string;
  jobNumber: string;
  amount?: number;
  balance?: number;

  settings: any = {
    mode: 'external',
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false,
    },
    pager: {
      perPage: 20,
    },
    columns: {
      customer: {
        title: 'Account',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      jobName: {
        title: 'Job Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Job Name');
        },
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
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
      amount: {
        title: 'Amount',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Amount');
        },
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 0
          }
        }
      },
      balance: {
        title: 'Balance',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Balance');
        },
        filter: {
          type: 'custom',
          component: CpNumberFilterComponent,
          config: {
            min: 0
          }
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: InvoicesActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    }
  };

  isSmartriseUser: boolean;

  onActionsInit(actions: InvoicesActionsComponent) {
    actions.showDetails.subscribe(invoice => {
      this.router.navigateByUrl('pages/jobs-management/invoices/' + invoice.id.toString());
    });
  }

  constructor(
    baseService: BaseComponentService,
    private router: Router,
    private settingService: SettingService,
    private responsiveService: ResponsiveService,
    private invoicesService: InvoiceService,
    private messageService: MessageService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService
  ) {
    super(baseService);
  }

  ngOnInit(): void {
    this.settingService.getBusinessSettings().subscribe(rep => this._onBusinessSettingsReady(rep));

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }
    
    this.source.serviceCallBack = (param) => {
      const invoiceParams = param as InvoiceParams;
      if (this.isSmall) {
        this._fillFilterParameters(invoiceParams);
      }
      return this.invoicesService.getInvoices(invoiceParams);
    };
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();
  }

  private _onBusinessSettingsReady(rep: IBusinessSettings) {
      this.recordsNumber = rep.numberOfRecords || 25;
    this.onRecordsNumberChanged(rep.numberOfRecords);
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

  private _fillFilterParameters(invoiceParams: InvoiceParams) {
    invoiceParams.customer = this.customer;
    invoiceParams.jobNumber = this.jobNumber;
    invoiceParams.jobName = this.jobName;
    invoiceParams.amount = this.amount;
    invoiceParams.balance = this.balance;
  }

  onSearch() {
    this.source.refresh();
  }

  onReset() {
    if (this.isSmall) {

      this._resetFilterParameters();

      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
  }

  private _resetFilterParameters() {
    this.customer = null;
    this.jobName = null;
    this.jobNumber = null;
    this.amount = null;
    this.balance = null;
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

  onRecordsNumberChanged(event) {
    this.source.setPaging(1, event);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}

import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { forkJoin, Subscription } from 'rxjs';
import { BaseComponentService } from '../../../services/base-component.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
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

@Component({
  selector: 'ngx-quoting-tool-list',
  templateUrl: './quoting-tool-list.component.html',
  styleUrls: ['./quoting-tool-list.component.scss']
})
export class QuotingToolListComponent extends BaseComponent implements OnInit {
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
          instance.setHeader('Account');
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
    actions.viewHistory.subscribe((quote: any) => {
      actions.isLoadingActivityHistory = true;
      this.quotingToolService.getQuoteHistory(quote.id).subscribe(history => {
        const ref = this.modalService.show<QuoteActivityHistoryComponent>(QuoteActivityHistoryComponent, {
          initialState: {
          }
        });
        ref.content.quoteName = history.quoteName;
        ref.content.updateHistory(history.history);
        ref.onHidden.subscribe(() => {
          this.source.refresh();
        });
      }, error => {
        this.source.refresh();
      });
    });
    actions.viewPricing.subscribe((quote: any) => {
      const ref = this.modalService.show<RfqDetailsComponent>(RfqDetailsComponent, {
        initialState: {
          quoteId: quote.id
        }
      });
      ref.onHidden.subscribe(() => {
        this.source.refresh();
      });
    });
  }

  constructor(
    private router: Router,
    private quoteService: QuotingToolService,
    private settingService: SettingService,
    private joyrideService: JoyrideService,
    private responsiveService: ResponsiveService,
    private modalService: BsModalService,
    private quotingToolService: QuotingToolService,
    private permissionService: PermissionService,
    private miscellaneousService: MiscellaneousService,
    private multiAccountService: MultiAccountsService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
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
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber || 25
    };

    this.settings.columns.status.filter.config.list = this.statuses.map(x => ({ title: x.description, value: x.value }));
    this.settings.columns.jobStatus.filter.config.list = this.jobStatuses.map(x => ({ title: x.description, value: x.value }));
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();
    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
return null;
}

      if (field === 'quoteCreated') {
        return new Date(value);
      }

      if (field === 'numberOfCars') {
        return +value;
      }
      return value;
    };

    this.source.serviceErrorCallBack = (error) => {
    };

    this.source.serviceCallBack = (params) => {
      const quoteParams = params as QuoteToolParams;
      if (this.isSmall) {
        quoteParams.account = this.account;
        quoteParams.jobName = this.jobName;
        quoteParams.controllerType = this.controllerType;
        quoteParams.status = this.status;
        quoteParams.jobStatus = this.jobStatus;
        quoteParams.creationDate = this.creationDate;
      }

      if (quoteParams.creationDate) {
quoteParams.creationDate = this.mockUtcDate(quoteParams.creationDate);
}

      if (this.miscellaneousService.isSmartriseUser()) {
        return this.quoteService.searchQuotesBySmartriseUsers(quoteParams);
      } else {
        const searchParams = quoteParams as SearchQuotesByCustomerParams;
        searchParams.customerId = this.multiAccountService.getSelectedAccount();

        return this.quoteService.searchQuotesByCustomerUsers(searchParams);
      }
    };
    this.source.dataLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;

      // setTimeout(() => {
      //   this.startGuidingTour();
      // }, this.isSmall ? guidingTourGlobal.smallScreenSuspensionTimeInterval : guidingTourGlobal.wideScreenSuspensionTimeInterval);
    });
    this.source.setSort([
      { field: 'creationDate', direction: 'desc' }  // primary sort
    ], false);
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
      this.quotingToolService.getJobStatuses(),
      this.settingService.getBusinessSettings()]
    ).subscribe(([
      statuses,
      jobStatuses,
      businessSettings
    ]) => {
      this.statuses = statuses;
      this.jobStatuses = jobStatuses;
      if (businessSettings) {
        this.recordsNumber = businessSettings.numberOfRecords || 25;
        this.initializeSource();
        this.isImpersonate = this.miscellaneousService.isImpersonateMode();
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

    this.account = null;
    this.jobName = null;
    this.creationDate = null;
    this.controllerType = null;
    this.status = '';
    this.jobStatus = '';

    if (this.isSmall) {
      this.source.refreshAndGoToFirstPage();
    } else {
      this.source.resetFilters();
    }
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

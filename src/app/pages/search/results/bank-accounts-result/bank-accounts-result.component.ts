import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { AccountTableCellComponent } from '../../../../_shared/components/account-table-cell/account-table-cell.component';
import { CpFilterComponent } from '../../../../_shared/components/table-filters/cp-filter.component';
import { CommonValues, PERMISSIONS, URLs } from '../../../../_shared/constants';
import * as guidingTourGlobal from '../../../guiding.tour.global';
import { BankAccountLast4CellComponent } from '../../../billing/bank-accounts/bank-account-last4-cell/bank-account-last4-cell.component';
import { Ng2TableCellComponent } from '../../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { BankAccountStatusCellComponent } from '../../../billing/bank-accounts/bank-account-status-cell/bank-account-status-cell.component';
import { CpListFilterComponent } from '../../../../_shared/components/table-filters/cp-list-filter.component';
import { BankAccountActionsComponent } from '../../../billing/bank-accounts/bank-account-actions/bank-account-actions.component';
import { Subscription, map, tap } from 'rxjs';
import { BaseServerDataSource } from '../../../../_shared/datasources/base-server.datasource';
import { IEnumValue } from '../../../../_shared/models/enumValue.model';
import { SelectBankAccountVerificationComponent } from '../../../billing/select-bank-account-verification/select-bank-account-verification.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IUserAccountLookup } from '../../../../_shared/models/IUser';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../../services/message.service';
import { ResponsiveService } from '../../../../services/responsive.service';
import { JoyrideService } from 'ngx-joyride';
import { AccountService } from '../../../../services/account.service';
import { BankAccountService } from '../../../../services/bank-account.service';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { PlaidService } from '../../../../services/plaid.service';
import { AccountInfoService } from '../../../../services/account-info.service';
import { BaseComponentService } from '../../../../services/base-component.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { BaseComponent } from '../../../base.component';
import { VerifyBankAccountComponent } from '../../../billing/bank-accounts/verify-bank-account/verify-bank-account.component';
import { allowOnlyNumbers } from '../../../../_shared/functions';
import { BankAccountParams } from '../../../../_shared/models/bank-account.model';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { SearchService } from '../../../../services/search.service';
import { PagerComponent } from '../../../../_shared/components/pager/pager.component';
import { ViewDetailsActionComponent } from '../view-details-action/view-details-action.component';

@Component({
  selector: 'ngx-bank-accounts-result',
  templateUrl: './bank-accounts-result.component.html',
  styleUrls: ['./bank-accounts-result.component.scss']
})
export class BankAccountsResultComponent extends BaseComponent implements OnInit {
  recordsNumber: number;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('pager') pager: PagerComponent;
  @ViewChild('search') search: ElementRef;
  @Input() searchKey: string;
  private _Math = Math;
  public get Math() {
    return this._Math;
  }
  public set Math(value) {
    this._Math = value;
  }
  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading: boolean = true;
  isSmartriseUser: boolean = false;
  isSmall?: boolean = null;
  showFilters: boolean = false;
  runGuidingTour: boolean = true;
  canCreateBankAccount: boolean = true;
  isImpersonate: boolean = true;
  disablePage: boolean = false;
  yesNoList: { value?: boolean; title: string }[];

  showSelectAccount: boolean = this.multiAccountService.hasMultipleAccounts() && this.miscellaneousService.isCustomerUser();

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
      last4: {
        width: '15%',
        title: 'Account Number (last 4 digits)',
        type: 'custom',
        renderComponent: BankAccountLast4CellComponent,
        onComponentInitFunction: (instance: BankAccountLast4CellComponent) => {
          instance.setHeader('Account Number (last 4 digits)');
          instance.setOptions({
            breakWord: true,
            link: 'pages/billing/bank-accounts',
            paramExps: [
              'id'
            ],
            tooltip: 'View Bank Account Details'
          });
        },
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
          config: {
            allowOnlyNumbers: true
          }
        }
      },
      accountHolderName: {
        title: 'Name on Account',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Name on Account');
        },
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      bankName: {
        title: 'Bank Name',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Bank Name');
        },
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
        }
      },
      accountType: {
        title: 'Account Type',
        type: 'custom',
        renderComponent: Ng2TableCellComponent,
        onComponentInitFunction: (instance: Ng2TableCellComponent) => {
          instance.setHeader('Account Type');
        },
        show: false,
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        }
      },
      status: {
        title: 'Status',
        type: 'custom',
        renderComponent: BankAccountStatusCellComponent,
        onComponentInitFunction: (instance: BankAccountStatusCellComponent) => {
          instance.setHeader('Status');
        },
        valuePrepareFunction: this.getEnumDescription.bind(this),
        show: false,
        filter: {
          type: 'custom',
          component: CpListFilterComponent,
          config: {
            selectText: CommonValues.ShowAll,
          },
        }
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: ViewDetailsActionComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };


  responsiveSubscription: Subscription;

  source: BaseServerDataSource;
  accountTypes: { value: any, title: string }[] = [];
  accountStatuses: IEnumValue[];

  account: string;
  accountType: string;
  accountHolderName: string;
  last4: string;
  status: string;
  bankName: string;
  isDefault: string;
  sbavRef: BsModalRef<SelectBankAccountVerificationComponent>;
  plaidExitSub: Subscription;
  plaidSuccessSub: Subscription;
  accountsWithSaveOnlineQuotePermission: any[];
  accounts: IUserAccountLookup[];

  private _isCreatingBankAccount: boolean = false;
  hasMultipleAccounts: boolean = this.multiAccountService.hasMultipleAccounts();

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private joyrideService: JoyrideService,
    private accountService: AccountService,
    private bankAccountService: BankAccountService,
    private miscellaneousService: MiscellaneousService,
    private modelService: BsModalService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
    private route: ActivatedRoute,
    private multiAccountService: MultiAccountsService,
    private searchService: SearchService
  ) {
    super(baseService);
  }

  ngAfterViewInit(): void {
  }

  onActionsInit(actions: ViewDetailsActionComponent) {
    actions.viewDetails.subscribe(data => {
      this.router.navigateByUrl('pages/billing/bank-accounts/' + data.id.toString());
    });
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }

  initializeSource() {

    this._initializePager();
    this._fillTableFilterLists();

    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();

    this.source.convertFilterValue = (field, value) => this._convertFilterValue(field, value);
    this.source.serviceCallBack = (params) => this._getBankAccounts(params).pipe(tap(x => this.searchService.notifyResultSetReady('BankAccounts', x.data.length)));
    this.source.dataLoading.subscribe((result) => this._onDataLoading(result));

    this.source.setSort([
      { field: 'last4', direction: 'asc' }  // primary sort
    ], false);
  }

  private _onDataLoading(result: any) {
    this.isLoading = result;
  }

  private _convertFilterValue(field: string, value: string) {
    if (this.isEmpty(value))
      return null;
    return value;
  }
  private _getBankAccounts(params: any) {
    const bankAccountParams = params as BankAccountParams;

    this._fillSearchParameters(this.searchKey, bankAccountParams);

    return this.bankAccountService.searchAllBankAccounts(bankAccountParams);
  }

  private _fillSearchParameters(searchKey: string, bankAccountParams: BankAccountParams) {
    bankAccountParams.account = searchKey;
    bankAccountParams.accountHolderName = searchKey;
    bankAccountParams.accountType = searchKey;
    bankAccountParams.bankName = searchKey;
    bankAccountParams.last4 = searchKey;
    bankAccountParams.status = searchKey;
  }

  private _fillTableFilterLists() {
    this.settings.columns.status.filter.config.list = this.accountStatuses.map(x => {
      return { title: x.description, value: x.value };
    });
    this.settings.columns.accountType.filter.config.list = this.accountTypes;
  }

  private _initializePager() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber
    };
  }

  async ngOnInit() {
    this.searchService.search$.subscribe(key => {
      this.searchKey = key;
      this.source.refresh();
    });
    await this._loadUserAccounts();
    if (this.accounts.length === 1) {
      this._handleSingleAccount();
    }
    await this._init();
  }

  private _handleSingleAccount() {
    this.showSelectAccount = false;
  }

  private async _init() {
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    this.settings.columns.actionsCol.title = this.isImpersonate ? 'View Details' : 'Actions';
    this.accountTypes = this._getAccountTypes();
    this.accountStatuses = await this.bankAccountService.getAccountStatuses().toPromise();

    this.recordsNumber = 5;
    this.initializeSource();
    this.responsiveSubscription = this.responsiveService.currentBreakpoint$.subscribe(w => this._onScreenSizeChanged(w));


    this.yesNoList = this.populateYesNo();
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

  private _getAccountTypes(): { value: any; title: string }[] {
    return [
      {
        value: 'Individual',
        title: 'Individual'
      },
      {
        value: 'Company',
        title: 'Company'
      }
    ];
  }

  onJobFilterChange() { }

  onSearch() {
    this.source.setPage(1, false);
    this.source.refresh();
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onEdit(event) {
    this.router.navigateByUrl('pages/jobs-management/jobs/' + event.data.id);
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
    this.accountType = '';
    this.accountHolderName = null;
    this.bankName = null;
    this.status = '';
    this.last4 = null;
    this.isDefault = null;
  }

  onRecordsNumberChanged(value: number) {
    this.recordsNumber = value;
    this.source.setPaging(1, value);
  }

  onLoad(value: any) {
    console.log(value);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  ngOnDestroy(): void {
    if (this.responsiveSubscription) {
      this.responsiveSubscription?.unsubscribe();
    }

    if (this.modelService.getModalsCount() > 0) {
      this.modelService.hide();
    }
    this.plaidExitSub?.unsubscribe();
    this.plaidSuccessSub?.unsubscribe();
    this.stopGuidingTour();
    this.joyrideService = null;
    this.accountInfoService.closePopup();
  }

  startGuidingTour() {
    if (localStorage.getItem('GuidingTourBankAccount') === null) {
      this.runGuidingTour = true;
      this.openGuidingTour();
    } else {
      this.runGuidingTour = false;
    }
  }

  openGuidingTour() {
    if (this.joyrideService) {
      if (this.isImpersonate) {
        this.joyrideService.startTour({
          steps: ['bankAccountFirstStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        });
      } else {
        this.joyrideService.startTour({
          steps: ['bankAccountFirstStep', 'bankAccountSecondStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText
          }
        });
      }

    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  ngAfterContentInit(): void {

  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourBankAccount', '1');
    this.runGuidingTour = false;
  }

  private _getAuthorizedAccounts(accounts: IUserAccountLookup[]) {
    return accounts.filter(acc => acc.permissions.some(p => p === PERMISSIONS.ManageBankAccounts));
  }

  private _loadUserAccounts() {
    return this.accountService
      .loadCurrentUser()
      .pipe(
        tap(user => {
          this.accounts = this._getAuthorizedAccounts(user.accounts);
        })
      ).toPromise();
  }
}

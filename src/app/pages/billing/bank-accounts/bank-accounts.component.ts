import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { JoyrideService } from 'ngx-joyride';
import { Subscription } from 'rxjs';
import { BankAccountService } from '../../../services/bank-account.service';
import { BaseComponentService } from '../../../services/base-component.service';
import { MessageService } from '../../../services/message.service';
import { MiscellaneousService } from '../../../services/miscellaneous.service';
import { ResponsiveService } from '../../../services/responsive.service';
import { SettingService } from '../../../services/setting.service';
import { Ng2TableCellComponent } from '../../../_shared/components/ng2-table-cell/ng2-table-cell.component';
import { CpFilterComponent } from '../../../_shared/components/table-filters/cp-filter.component';
import { CpListFilterComponent } from '../../../_shared/components/table-filters/cp-list-filter.component';
import { CommonValues } from '../../../_shared/constants';
import { BaseServerDataSource } from '../../../_shared/datasources/base-server.datasource';
import { BankAccountParams } from '../../../_shared/models/bank-account.model';
import { IEnumValue } from '../../../_shared/models/enumValue.model';
import { ScreenBreakpoint } from '../../../_shared/models/screenBreakpoint';
import { BaseComponent } from '../../base.component';
import * as guidingTourGlobal from '../../guiding.tour.global';
import { BankAccountActionsComponent } from './bank-account-actions/bank-account-actions.component';
import { BankAccountLast4CellComponent } from './bank-account-last4-cell/bank-account-last4-cell.component';
import { BankAccountStatusCellComponent } from './bank-account-status-cell/bank-account-status-cell.component';
import { SelectBankAccountVerificationComponent } from '../select-bank-account-verification/select-bank-account-verification.component';
import { PlaidService } from '../../../services/plaid.service';
import { AccountService } from '../../../services/account.service';
import { allowOnlyNumbers } from '../../../_shared/functions';
import { MultiAccountsService } from '../../../services/multi-accounts-service';
import { AccountNameCellComponent } from '../../../_shared/components/account-name-cell/account-name-cell.component';
import { AccountInfoService } from '../../../services/account-info.service';
import { VerifyBankAccountComponent } from './verify-bank-account/verify-bank-account.component';


@Component({
  selector: 'ngx-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss'],
})
export class BankAccountsComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('search') search: ElementRef;
  recordsNumber: number;

  // set isLoading as true by default to avoid the following exception
  // Expression has changed after it was checked. Previous value: 'false'. Current value: 'true'.
  isLoading = true;
  isSmartriseUser = false;
  isSmall?: boolean = null;
  showFilters = false;
  runGuidingTour = true;
  canCreateBankAccount = true;
  isImpersonate = true;

  yesNoList: { value?: boolean; title: string }[];

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
            paramExps: ['id'],
            tooltip: 'View Bank Account Details',
          });
        },
        show: false,
        filter: {
          type: 'custom',
          component: CpFilterComponent,
          config: {
            allowOnlyNumbers: true,
          },
        },
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
        },
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
        },
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
        },
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
        },
      },
      actionsCol: {
        filter: false,
        sort: false,
        title: 'Actions',
        type: 'custom',
        renderComponent: BankAccountActionsComponent,
        onComponentInitFunction: this.onActionsInit.bind(this),
      },
    },
  };

  responsiveSubscription: Subscription;

  source: BaseServerDataSource;
  accountTypes: { value: any; title: string }[] = [];
  accountStatuses: IEnumValue[];

  customerName: string;
  accountType: string;
  accountHolderName: string;
  last4: string;
  status: string;
  bankName: string;
  isDefault: string;
  sbavRef: BsModalRef<SelectBankAccountVerificationComponent>;
  plaidExitSub: Subscription;
  plaidSuccessSub: Subscription;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responsiveService: ResponsiveService,
    private settingService: SettingService,
    private joyrideService: JoyrideService,
    private accountService: AccountService,
    private bankAccountService: BankAccountService,
    private miscellaneousService: MiscellaneousService,
    private modelService: BsModalService,
    private plaidService: PlaidService,
    private accountInfoService: AccountInfoService,
    baseService: BaseComponentService,
    private route: ActivatedRoute,
    private multiAccountService: MultiAccountsService
  ) {
    super(baseService);
  }

  onActionsInit(actions: BankAccountActionsComponent) {
    actions.showDetails.subscribe((id) => {
      this.router.navigateByUrl('pages/billing/bank-accounts/' + id.toString());
    });
    actions.setDefault.subscribe((id) => {
      this.miscellaneousService.openConfirmModal(
        'Are you sure you want to set this bank account as default?',
        () => {
          actions.disableSetDefault();
          this.bankAccountService.setDefault(id).subscribe(
            () => {
              this.messageService.showSuccessMessage(
                'The account has been successfully set to default.'
              );
              actions.enableSetDefault();
              this.source.refresh();
            },
            () => {
              actions.enableSetDefault();
              this.source.refresh();
            }
          );
        }
      );
    });
    actions.verifyAccount.subscribe((id) => {
      actions.disableVerifyAccount();
      this.bankAccountService.preVerifyBankAccount(id).subscribe(
        (r) => {
          const attempts = r.failedAttempts;
          const last4 = r.last4;
          const isLoading = false;
          let showAttempts = false;
          if (attempts > 0 && attempts < 3) {
            showAttempts = true;
          }
          actions.enableVerifyAccount();
          const ref = this.modelService.show<VerifyBankAccountComponent>(
            VerifyBankAccountComponent,
            {
              initialState: {
                attempts,
                id,
                last4,
                isLoading,
                showAttempts,
              },
            }
          );

          ref.onHide.subscribe(() => {
            this.source.refresh();
          });
        },
        () => {
          actions.enableVerifyAccount();
        }
      );
    });
    actions.edit.subscribe((e) => {
      this.router.navigateByUrl(`pages/billing/bank-accounts/edit/${e.id}`);
    });
  }

  onlyNumbers(event) {
    allowOnlyNumbers(event);
  }

  initializeSource() {
    this.settings.pager = {
      display: true,
      page: 1,
      perPage: this.recordsNumber,
    };

    this.settings.columns.status.filter.config.list = this.accountStatuses.map(
      (x) => ({ title: x.description, value: x.value })
    );
    this.settings.columns.accountType.filter.config.list = this.accountTypes;
    this.isSmartriseUser = this.miscellaneousService.isSmartriseUser();

    if (this.miscellaneousService.isCustomerUser() && this.multiAccountService.hasOneAccount()) {
      delete this.settings.columns.account;
    }

    this.source = new BaseServerDataSource();

    this.source.convertFilterValue = (field, value) => {
      if (this.isEmpty(value)) {
        return null;
      }
      return value;
    };

    this.source.serviceErrorCallBack = () => {};

    this.source.serviceCallBack = (params) => {
      const bankAccountParams = params as BankAccountParams;

      if (this.isSmall) {
        bankAccountParams.customerName = this.customerName;
        bankAccountParams.accountType = this.isEmpty(this.accountType)
          ? null
          : this.accountType;
        bankAccountParams.accountHolderName = this.accountHolderName;
        bankAccountParams.bankName = this.bankName;
        bankAccountParams.status = this.isEmpty(this.status)
          ? null
          : this.status;
        bankAccountParams.last4 = this.last4;
      }

      bankAccountParams.customerId =
        this.multiAccountService.getSelectedAccount();
      return this.bankAccountService.getBankAccounts(bankAccountParams);
    };

    this.source.dataLoading.subscribe((result) => {
      this.isLoading = result;
      setTimeout(
        () => {
          this.startGuidingTour();
        },
        this.isSmall
          ? guidingTourGlobal.smallScreenSuspensionTimeInterval
          : guidingTourGlobal.wideScreenSuspensionTimeInterval
      );
    });

    this.source.setSort(
      [
        { field: 'last4', direction: 'asc' }, // primary sort
      ],
      false
    );
  }

  async ngOnInit() {
    this.isImpersonate = this.miscellaneousService.isImpersonateMode();
    this.settings.columns.actionsCol.title = this.isImpersonate
      ? 'View Details'
      : 'Actions';
    this.accountTypes = this._getAccountTypes();
    this.accountStatuses = await this.bankAccountService
      .getAccountStatuses()
      .toPromise();

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

    this.plaidSuccessSub = this.plaidService.success.subscribe((r) => {
      this.isLoading = true;

      this.bankAccountService
        .addAccountsInfo({
          publicToken: r.public_token,
          customerId: this.multiAccountService.getSelectedAccount(),
          accounts: r.metadata.accounts,
        })
        .subscribe(
          () => {
            this.source.refresh();
            this.messageService.showSuccessMessage(
              r.metadata.accounts.length === 1
                ? 'Bank Account has been added successfully'
                : 'Bank Accounts have been added successfully'
            );
          },
          () => {
            this.isLoading = false;
          }
        );
    });

    this.plaidExitSub = this.plaidService.exit.subscribe(() => {
      this.accountService.checkSession();
    });

    const createBankAccount =
      this.route.snapshot.queryParamMap.get('createBankAccount');
    if (createBankAccount) {
      this.onCreateBankAccount();
    }

    this.yesNoList = this.populateYesNo();

    const receivedRedirectUri =
      this.route.snapshot.queryParamMap.get('oauth_state_id');

    if (receivedRedirectUri != null) {
      console.log('here we go');
      this.plaidService.reInitializePlaidLink();
    }
  }

  onJobFilterChange() {}

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

  onCreateLink() {
    this.bankAccountService.createLink().subscribe((e) => {
      this.sbavRef.content.loading.next(false);
      this.sbavRef.hide();
      this.plaidService.initializePlaidLink(e.linkToken);
    });
  }

  onReset() {
    this.customerName = null;
    this.accountType = '';
    this.accountHolderName = null;
    this.bankName = null;
    this.status = '';
    this.last4 = null;
    this.isDefault = null;

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

    this.modelService.hide();
    this.plaidExitSub.unsubscribe();
    this.plaidSuccessSub.unsubscribe();
    this.plaidService.close();
    this.stopGuidingTour();
    this.joyrideService = null;
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
            done: guidingTourGlobal.guidingTourDoneButtonText,
          },
        });
      } else {
        this.joyrideService.startTour({
          steps: ['bankAccountFirstStep', 'bankAccountSecondStep'],
          themeColor: guidingTourGlobal.guidingTourThemeColor,
          customTexts: {
            prev: guidingTourGlobal.guidingTourPrevButtonText,
            next: guidingTourGlobal.guidingTourNextButtonText,
            done: guidingTourGlobal.guidingTourDoneButtonText,
          },
        });
      }
    }
  }

  stopGuidingTour() {
    if (this.joyrideService && this.joyrideService.isTourInProgress()) {
      this.joyrideService.closeTour();
    }
  }

  onFinishingTour() {
    localStorage.setItem('GuidingTourBankAccount', '1');
    this.runGuidingTour = false;
  }

  onCreateBankAccount() {
    this.sbavRef =
      this.modelService.show<SelectBankAccountVerificationComponent>(
        SelectBankAccountVerificationComponent,
        {
          initialState: {},
        }
      );
    this.sbavRef.content.connect.subscribe(() => {
      this.sbavRef.content.loading.next(true);
      this.onCreateLink();
    });
  }

  private _getAccountTypes(): { value: any; title: string }[] {
    return [
      {
        value: 'Individual',
        title: 'Individual',
      },
      {
        value: 'Company',
        title: 'Company',
      },
    ];
  }
}

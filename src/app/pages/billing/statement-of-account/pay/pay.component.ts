import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IInitiatePaymentResponse } from '../../../../_shared/models/initiate-payment-respponse.model';
import { BaseComponentService } from '../../../../services/base-component.service';
import { InvoiceService } from '../../../../services/invoice.service';
import { MessageService } from '../../../../services/message.service';
import { AccountService } from '../../../../services/account.service';
import { PaymentService } from '../../../../services/payment.service';
import { BaseComponent } from '../../../base.component';
import { TokenService } from '../../../../services/token.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../../../environments/environment';
import { BankAccountService } from '../../../../services/bank-account.service';
import { IActiveBankAccount } from '../../../../_shared/models/bank-account.model';
import { ActiveBankAccountsComponent } from '../active-bank-accounts/active-bank-accounts.component';
import { ResponsiveService } from '../../../../services/responsive.service';
import { ScreenBreakpoint } from '../../../../_shared/models/screenBreakpoint';
import { MiscellaneousService } from '../../../../services/miscellaneous.service';
import { MultiAccountsService } from '../../../../services/multi-accounts-service';
import { StorageConstants } from '../../../../_shared/constants';

@Component({
  selector: 'ngx-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent extends BaseComponent implements OnInit, OnDestroy {

  isLocked: boolean = false;
  SecureToken: string;
  SecureTokenId: string;
  paymentOption: string;
  isCheckingBankAccounts: boolean = false;
  noBankAccounts: boolean = false;
  @ViewChild('payPalForm') payPalForm: HTMLFormElement;

  invs: any[];
  selectedAccount: IActiveBankAccount;
  isSmall: boolean;
  isLoadingActiveBankAccounts: boolean;

  @Input()
  set invoices(invs: any[]) {
    this.invs = invs;
  }

  get invoices(): any[] {
    return this.invs;
  }

  subTotal: number = 0;
  processingFees: number = 0;
  total: number = 0;
  @Output() close = new EventEmitter<any>();

  showBackToStatementOfAccount: boolean = false;
  showWaitMessage: boolean = false;
  isLoading: boolean = false;
  isProccessing: boolean = false;
  modalRef: any;
  ws: WebSocket;
  paypalGatewayUrl = environment.paypalGatewayUrl;
  paypalProcessingFeesPercentage = environment.paypalProcessingFeesPercentage;
  bankAccounts: IActiveBankAccount[] = [];
  stripeLogoAsBase64: string | ArrayBuffer;

  constructor(
    private miscellaneousService: MiscellaneousService,
    private tokenService: TokenService,
    private accountService: AccountService,
    private paymentService: PaymentService,
    private responsiveService: ResponsiveService,
    private invoiceService: InvoiceService,
    private messageService: MessageService,
    private modalService: BsModalService,
    private bankAccountService: BankAccountService,
    private router: Router,
    private multiAccountService: MultiAccountsService,
    baseService: BaseComponentService,
  ) {
    super(baseService);
  }

  ngOnDestroy(): void {
    this.showWaitMessage = false;
    this.modalService.hide();
  }

  ngOnInit(): void {
    this.responsiveService.currentBreakpoint$.subscribe(w => {
      if (w === ScreenBreakpoint.lg || w === ScreenBreakpoint.xl) {
        if (this.isSmall !== false) {
          this.isSmall = false;
        }
      } else if (w === ScreenBreakpoint.md || w === ScreenBreakpoint.xs || w === ScreenBreakpoint.sm) {
        if (this.isSmall !== true) {
          this.isSmall = true;
        }
      }
    });
    this.miscellaneousService.loadImage('stripe-logo.png').subscribe((image) => {
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = () => {
        this.stripeLogoAsBase64 = reader.result;
      };
    });
    this._initializePayments();
  }

  private _initializePayments() {
    this._updateInvoicesTotal();
  }

  private _updateInvoicesTotal() {
    this.subTotal = this.invoices
      .map(x => x.paymentAmount)
      .reduce((prevBalance, currentBalance) => prevBalance + currentBalance, 0);

    //processing fees for Paypal is 3.09%
    //add fees on invoices level.
    //round two decimal digits
    this.processingFees = 0;
    if (this.paymentOption === 'paypal') {
      this.processingFees = this.invoices
        .map(x => +(x.paymentAmount * (this.paypalProcessingFeesPercentage / 100)).toFixed(2))
        .reduce((prevFees, currentFees) => prevFees + currentFees, 0);
    }

    this.total = this.subTotal + this.processingFees;
  }

  onRemoveInvoice(invoice) {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to remove this invoice?', () => {
        this._removeInvoice(invoice);
      });
  }

  private _removeInvoice(invoice: any) {

    if (this.invoices.length == 1) {
      this.messageService.showErrorMessage('You can not remove this invoice, at least one invoice must be selected');
      return;
    }

    const indexOfInvoice = this.invoices.indexOf(invoice);
    this.invoices.splice(indexOfInvoice, 1);
    this._updateInvoicesTotal();
  }

  onSubmit() {
    this.showWaitMessage = true;
    this._startAsyncSubmit();
  }

  private _startAsyncSubmit() {
    Promise.all([
      this._checkSessionExpiry(),
      this._initiatePayment(),
      this._waitForSeconds(3),
    ]).then((values) => {

      const initiatePaymentResult = values[1];

      this.SecureToken = initiatePaymentResult.secureToken;
      this.SecureTokenId = initiatePaymentResult.secureTokenId;

      setTimeout(() => {

        this.invoiceService.deleteToBePaidInvoices();
        this.payPalForm.nativeElement.action = `${this.paypalGatewayUrl}?SECURETOKENID=${this.SecureTokenId}&SECURETOKEN=${this.SecureToken}`;
        this.payPalForm.nativeElement.submit();
        this.showBackToStatementOfAccount = true;
        this.showWaitMessage = false;

      }, 500);

    }, error => {

      if (error.status === 401) {
        this.accountService.logout(true, () => {
          this.router.navigateByUrl('/auth/login');
        });
        return;
      }

      this.isLoading = false;
      this.showWaitMessage = false;
      const invoiceStatuses = error?.error?.failedResult?.invoiceStatuses;
      if (invoiceStatuses) {
        this._addInvoiceMessages(invoiceStatuses);
      } else {
      }
    });
  }

  private _checkSessionExpiry(): any {
    return this.accountService.loadCurrentUser(this.tokenService.getToken()).toPromise();
  }

  private _addInvoiceMessages(invoiceStatuses: any) {
    invoiceStatuses.forEach(i => {
      const invoice = this.invoices.filter(inv => inv.invoiceNumber == i.invoiceNumber);
      if (invoice.length > 0) {
        invoice[0].message = i.errorMessage;
        invoice[0].succeeded = i.succeeded;
      }
    });
  }

  private _initiatePayment(): Promise<IInitiatePaymentResponse> {
    const initiatePaymentResquest: any = {};
    initiatePaymentResquest.invoices = this.invoices;
    initiatePaymentResquest.customerId = +this.invoices[0].customerId;

    return this.paymentService.initiatePaypalPayment(initiatePaymentResquest).toPromise();
  }

  private _waitForSeconds(seconds: number) {

    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), seconds * 1000);
    });
  }

  onClose() {
    this.close.emit();
  }

  changePaymentMethod(event) {
    if (event.target.value === this.paymentOption) {
      return;
    }

    this.paymentOption = event.target.value;
    this._updateInvoicesTotal();

    if (this.paymentOption === 'ach') {
      this._achSelectedLogic();
    }
  }

  private _achSelectedLogic() {
    this.selectedAccount = null;
    this.isCheckingBankAccounts = true;
    this.noBankAccounts = false;

    this.bankAccountService.getActiveBankAccounts(+this.invoices[0].customerId).subscribe(result => {
      if (result.length > 0) {

        const defaultAccount = result.find(x => x.isDefault);
        if (defaultAccount) {
          this.selectedAccount = defaultAccount;
        } else {
          const ref = this.modalService.show<ActiveBankAccountsComponent>(ActiveBankAccountsComponent, {
            initialState: {
              accounts: result
            },
          });
          ref.onHide.subscribe(() => {
            if (ref.content?.selectedAccount) {
              this.selectedAccount = ref.content?.selectedAccount;
            } else {
              this.paymentOption = null;
            }
          });
        }
      }
      this.isCheckingBankAccounts = false;
      this.noBankAccounts = result.length === 0;
      this.bankAccounts = result;
    });
  }

  onSubmitACH() {
    this.miscellaneousService.openConfirmModal(
      'Are you sure you want to proceed?', () => {
        if (!this.isProccessing) {
          this.isProccessing = true;
          this.paymentService.chargeStripeACHPayment({
            bankAccountId: this.selectedAccount.id,
            invoices: this.invoices,
            customerId: +this.invoices[0].customerId
          }).subscribe(r => {
            this.invoiceService.deleteToBePaidInvoices();
            this.isProccessing = false;
            this.messageService.showSuccessMessage('Payment will be approved or declined within 4 business days');
            this.showBackToStatementOfAccount = true;
          }, error => {
            this.isProccessing = false;
            const invoiceStatuses = error?.error?.failedResult?.invoiceStatuses;
            if (invoiceStatuses) {
              this._addInvoiceMessages(invoiceStatuses);
            }
          });
        }
      });
  }

  onChangeBankAccount() {

    if (this.isLoadingActiveBankAccounts) {
      return;
    }

    this.isLoadingActiveBankAccounts = true;
    this.bankAccountService.getActiveBankAccounts(+this.invoices[0].customerId).subscribe(result => {
      this.isLoadingActiveBankAccounts = false;
      this.bankAccounts = result;
      const ref = this.modalService.show<ActiveBankAccountsComponent>(ActiveBankAccountsComponent, {
        initialState: {
          accounts: this.bankAccounts,
          selectedAccount: this.selectedAccount,
        },
      });
      ref.onHide.subscribe(() => {
        if (ref.content?.selectedAccount)
          this.selectedAccount = ref.content?.selectedAccount;
      });
    }, error => {
      this.isLoadingActiveBankAccounts = false;
    });
  }

  goToCreateBankAccount() {
    const accountId = sessionStorage.getItem(StorageConstants.StatementOfAccountSelectedAccount);
    this.router.navigateByUrl(`pages/billing/bank-accounts?createBankAccount=true&accountID=${accountId}`);
  }

  goToBankAccounts() {
    this.router.navigateByUrl('pages/billing/bank-accounts/');
  }

  unSelectPaymentMethod() {
    this.paymentOption = null;
  }
}

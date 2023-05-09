import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountActionsComponent } from './bank-accounts/bank-account-actions/bank-account-actions.component';
import { BankAccountLast4CellComponent } from './bank-accounts/bank-account-last4-cell/bank-account-last4-cell.component';
import { BankAccountStatusCellComponent } from './bank-accounts/bank-account-status-cell/bank-account-status-cell.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { VerifyBankAccountComponent } from './bank-accounts/verify-bank-account/verify-bank-account.component';
import { InvoiceBasicInfoComponent } from './invoice-details/invoice-basic-info/invoice-basic-info.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoicePaymentsComponent } from './invoice-details/invoice-payments/invoice-payments.component';
import { InvoicesActionsComponent } from './invoices/invoices-actions/invoices-actions.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewCreditCardComponent } from './new-credit-card/new-credit-card.component';
import { SelectBankAccountVerificationComponent } from './select-bank-account-verification/select-bank-account-verification.component';
import { ActiveBankAccountActionsComponent } from './statement-of-account/active-bank-accounts/active-bank-account-actions/active-bank-account-actions.component';
import { ActiveBankAccountsComponent } from './statement-of-account/active-bank-accounts/active-bank-accounts.component';
import { PayFilterComponent } from './statement-of-account/pay-filter/pay-filter.component';
import { PayComponent } from './statement-of-account/pay/pay.component';
import {
    AgedRecievablesActionsComponent,
} from './statement-of-account/statement-of-account-actions/statement-of-account-actions.component';
import { StatementOfAccountComponent } from './statement-of-account/statement-of-account.component';

export const routedComponents = [
    StatementOfAccountComponent,
    AgedRecievablesActionsComponent,
    PayFilterComponent,
    PayComponent,
    NewCreditCardComponent,

    InvoicesComponent,
    InvoicesActionsComponent,

    InvoiceDetailsComponent,
    InvoiceBasicInfoComponent,
    InvoicePaymentsComponent,

    BankAccountsComponent,
    BankAccountComponent,
    BankAccountActionsComponent,

    BankAccountDetailsComponent,
    VerifyBankAccountComponent,
    ActiveBankAccountsComponent,
    ActiveBankAccountActionsComponent,
    BankAccountLast4CellComponent,
    BankAccountStatusCellComponent,
    SelectBankAccountVerificationComponent,
];

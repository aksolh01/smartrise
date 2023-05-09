import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatementOfAccountComponent } from './statement-of-account/statement-of-account.component';
import { InvoiceDetailsComponent } from './invoice-details/invoice-details.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { BankAccountsComponent } from './bank-accounts/bank-accounts.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountDetailsComponent } from './bank-account-details/bank-account-details.component';
import { EditBankAccountComponent } from './edit-bank-account/edit-bank-account.component';

const routes: Routes = [
    {
        path: 'invoices',
        data: { title: 'Invoices', breadcrumb: { label: 'Invoices' } },
        children: [
            {
                path: '',
                component: InvoicesComponent,
            },
            {
                path: ':id',
                component: InvoiceDetailsComponent,
                data: {
                    title: 'Invoice Details', breadcrumb: { alias: 'invoiceNumber' }
                },
            },
        ],
    },
    {
        path: 'statement-of-account',
        data: { title: 'Statement Of Account', breadcrumb: { label: 'Statement Of Account' } },
        children: [
            {
                path: '',
                component: StatementOfAccountComponent,
            },
            {
                path: ':id',
                component: InvoiceDetailsComponent,
                data: {
                    title: 'Invoice Details', breadcrumb: { alias: 'invoiceNumber' }
                },
            },
        ]
    },
    {
        path: 'bank-accounts',
        data: { title: 'Bank Accounts', breadcrumb: { label: 'Bank Accounts' } },
        children: [
            {
                path: '',
                component: BankAccountsComponent,
            },
            {
                path: 'add',
                component: BankAccountComponent,
                data: {
                    title: 'Add Bank Account', breadcrumb: { label: 'New Bank Account' }
                },
            },
            {
                path: ':id',
                component: BankAccountDetailsComponent,
                data: {
                    title: 'Bank Account Details', breadcrumb: { alias: 'bankAccount' }
                },
            },
            {
                path: 'edit/:id',
                component: EditBankAccountComponent,
                data: {
                    title: 'Update Bank Account', breadcrumb: { alias: 'bankAccount' }
                },
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BillingRoutingModule { }

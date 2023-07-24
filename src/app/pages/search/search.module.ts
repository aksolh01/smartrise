import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { ResultsComponent } from './results/results.component';
import { RouterModule } from '@angular/router';
import { JobsManagementModule } from '../jobs-management/jobs-management.module';
import { SharedModule } from '../../_shared/shared.module';
import { SearchComponent } from './search/search.component';
import { JobsResultComponent } from './results/jobs-result/jobs-result.component';
import { InvoicesResultComponent } from './results/invoices-result/invoices-result.component';
import { BankAccountsResultComponent } from './results/bank-accounts-result/bank-accounts-result.component';
import { BankAccountService } from '../../services/bank-account.service';
import { QuotesCreatedbyAccountResultComponent } from './results/quotes-createdby-account-result/quotes-createdby-account-result.component';
import { QuotesCreatedbySmartriseResultComponent } from './results/quotes-createdby-smartrise-result/quotes-createdby-smartrise-result.component';
import { QuotingToolService } from '../../services/quoting-tool.service';
import { QuoteService } from '../../services/quote.service';
import { UserActivitiesResultComponent } from './results/user-activities-result/user-activities-result.component';
import { ActivityService } from '../../services/activity.service';
import { SmartriseUsersResultComponent } from './results/smartrise-users-result/smartrise-users-result.component';
import { StatementOfAccountResultComponent } from './results/statement-of-account-result/statement-of-account-result.component';
import { AccountUsersResultComponent } from './results/account-users-result/account-users-result.component';
import { ShipmentsResultComponent } from './results/shipments-result/shipments-result.component';
import { JobFilesResultComponent } from './results/job-files-result/job-files-result.component';
import { AccountsResultComponent } from './results/accounts-result/accounts-result.component';
import { CustomerUsersResultComponent } from './results/customer-users-result/customer-users-result.component';
import { ViewDetailsActionComponent } from './results/view-details-action/view-details-action.component';
import { CompanyInfoResultComponent } from './results/company-info-result/company-info-result.component';


@NgModule({
  declarations: [
    ResultsComponent,
    SearchComponent,
    JobsResultComponent,
    InvoicesResultComponent,
    BankAccountsResultComponent,
    QuotesCreatedbyAccountResultComponent,
    QuotesCreatedbySmartriseResultComponent,
    UserActivitiesResultComponent,
    SmartriseUsersResultComponent,
    StatementOfAccountResultComponent,
    AccountUsersResultComponent,
    ShipmentsResultComponent,
    JobFilesResultComponent,
    AccountsResultComponent,
    CustomerUsersResultComponent,
    ViewDetailsActionComponent,
    CompanyInfoResultComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    JobsManagementModule,
    RouterModule.forChild([
      {
        path: '',
        component: SearchComponent,
        children: [
          {
            path: 'result',
            component: ResultsComponent,
            data: { title: 'Search Results' }
          }
        ],
        data: { title: 'Search Results', breadcrumb: { label: 'Search Results' } },
      },
    ]),
  ],
  providers: [
    BankAccountService,
    QuotingToolService,
    ActivityService,
    QuoteService
  ]
})
export class SearchModule { }

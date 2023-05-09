import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountUsersManagementRoutingModule } from './account-users-management-routing.module';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { JoyrideModule } from 'ngx-joyride';
import { ThemeModule } from '../../@theme/theme.module';
import { AccountsListCellComponent } from './account-users/accounts-list-cell/accounts-list-cell.component';
import { AccountsWithoutMatchingContactsComponent } from './accounts-without-matching-contacts/accounts-without-matching-contacts.component';
import { SearchAccountsLookupComponent } from './search-accounts-lookup/search-accounts-lookup.component';

@NgModule({
  declarations: [...routedComponents, AccountsListCellComponent, AccountsWithoutMatchingContactsComponent, SearchAccountsLookupComponent],
  imports: [
    JoyrideModule.forChild(),
    CommonModule,
    SharedModule,
    ThemeModule,
    AccountUsersManagementRoutingModule
  ]
})
export class AccountUsersManagementModule { }

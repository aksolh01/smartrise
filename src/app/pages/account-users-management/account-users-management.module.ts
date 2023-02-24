import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountUsersManagementRoutingModule } from './account-users-management-routing.module';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { JoyrideModule } from 'ngx-joyride';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  declarations: [...routedComponents],
  imports: [
    JoyrideModule.forChild(),
    CommonModule,
    SharedModule,
    ThemeModule,
    AccountUsersManagementRoutingModule
  ]
})
export class AccountUsersManagementModule { }

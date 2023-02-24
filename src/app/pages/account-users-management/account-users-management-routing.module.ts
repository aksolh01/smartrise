import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountUsersManagementComponent } from './account-users-management.component';
import { AccountUsersComponent } from './account-users/account-users.component';
import { CreateAccountUserComponent } from './create-account-user/create-account-user.component';
import { UpdateAccountUserComponent } from './update-account-user/update-account-user.component';

const routes: Routes = [
  {
    path: '',
    component: AccountUsersManagementComponent,
    children: [
      {
        path: 'account-users',
        children: [
          {
            path: '',
            component: AccountUsersComponent,
            data: { title: 'Account Users', breadcrumb: { label: 'Account Users' } },
          },
          {
            path: 'createuser',
            component: CreateAccountUserComponent,
            data: { title: 'Create User', breadcrumb: { label: 'New User' } },
          },
          {
            path: ':userId',
            component: UpdateAccountUserComponent,
            data: { title: 'Update User', breadcrumb: { alias: 'userName' } },
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountUsersManagementRoutingModule { }

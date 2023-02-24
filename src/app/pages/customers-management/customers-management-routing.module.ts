import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomersManagementComponent } from './customers-management.component';
import { CreateCustomerAccountComponent } from './customers/create-customer-account/create-customer-account.component';
import { UpdateCustomerUserBySmartriseComponent } from './customers/customer-details/customer-admin-users/update-customer-user/update-customer-user.component';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details.component';
import { CustomersListComponent } from './customers/customers-list.component';

const routes: Routes = [
    {
        path: '',
        component: CustomersManagementComponent,
        data: { title: 'CustomersManagement' }
    },
    {
        path: 'customers',
        data: { title: 'Accounts', breadcrumb: { label: 'Accounts' } },
        children: [
            {
                path: '',
                component: CustomersListComponent,
                children: [
                    {
                        path: 'createaccount',
                        component: CreateCustomerAccountComponent,
                        data: { title: 'Create Customer' }
                    },
                ]
            },
            {
                path: ':id',
                component: CustomerDetailsComponent,
                data: { title: 'Account Details', breadcrumb: { alias: 'customerName' } },
            },
            {
                path: ':id/users',
                data: { title: 'Users', breadcrumb: { alias: 'customerName' } },
                children: [
                    {
                        path: ':userId',
                        component: UpdateCustomerUserBySmartriseComponent,
                        data: { title: 'Update User', breadcrumb: { alias: 'userName' } },
                    },
                ]
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomersManagementRoutingModule { }

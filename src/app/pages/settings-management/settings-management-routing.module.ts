import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessSettingsComponent } from './business-settings/business-settings.component';
import { CompanyInfoComponent } from './company-info/company-info.component';
import { CreateCustomerUserComponent } from './customer-users/create-customer-user/create-customer-user.component';
import { CustomerUsersComponent } from './customer-users/customer-users.component';
import { UpdateCustomerUserComponent } from './customer-users/update-customer-user/update-customer-user.component';
import { SettingsManagementComponent } from './settings-management.component';
import { CreateSmartriseUserComponent } from './smartrise-users/create-smartrise-user/create-smartrise-user.component';
import { SmartriseUsersComponent } from './smartrise-users/smartrise-users.component';
import { UpdateSmartriseUserComponent } from './smartrise-users/update-smartrise-user/update-smartrise-user.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';

const routes: Routes = [
    {
        path: '',
        component: SettingsManagementComponent,
        data: { title: 'SettingsManagement' }
    },
    {
        path: 'system-settings',
        data: { breadcrumb: { label: 'System Settings' } },
        children: [
            {
                path: '',
                component: SystemSettingsComponent,
                data: { title: 'System Settings' },
            },
        ],
    },
    {
        path: 'business-settings',
        data: { breadcrumb: { label: 'Business Settings' } },
        children: [
            {
                path: '',
                component: BusinessSettingsComponent,
                data: { title: 'Business Settings' }
            },
        ],
    },
    {
        path: 'smartrise-users',
        data: { breadcrumb: { label: 'Smartrise Users' } },
        children: [
            {
                path: '',
                component: SmartriseUsersComponent,
                data: { title: 'Smartrise Users' }
            },
            {
                path: 'create-smartrise-user',
                component: CreateSmartriseUserComponent,
                data: { title: 'Create User', breadcrumb: { label: 'New User' } }
            },
            {
                path: ':id',
                component: UpdateSmartriseUserComponent,
                data: { title: 'Update User', breadcrumb: { alias: 'userName' } }
            },
        ],
    },
    {
        path: 'customer-users',
        data: { breadcrumb: { label: 'Account Users' } },
        children: [
            {
                path: '',
                component: CustomerUsersComponent,
                data: { title: 'Account Users' }
            },
            {
                path: 'create-customer-user',
                component: CreateCustomerUserComponent,
                data: { title: 'Create User', breadcrumb: { label: 'New User' } }
            },
            {
                path: ':id',
                component: UpdateCustomerUserComponent,
                data: { title: 'Update User', breadcrumb: { alias: 'userName' } }
            },
        ],
    },
    {
        path: 'company-info',
        data: { breadcrumb: { label: 'Company Info' } },
        children: [
            {
                path: '',
                component: CompanyInfoComponent,
                data: { title: 'Company Info' }
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SettingsManagementRoutingModule { }

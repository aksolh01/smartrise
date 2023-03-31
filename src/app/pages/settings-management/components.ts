import { BusinessSettingsComponent } from './business-settings/business-settings.component';
import { CompanyInfoComponent } from './company-info/company-info-details/company-info.component';
import { CompanyActionInfoComponent } from './company-info/company-info-list/company-action-info/company-action-info.component';
import { CompanyInfoListComponent } from './company-info/company-info-list/company-info-list.component';
import { CreateCustomerUserComponent } from './customer-users/create-customer-user/create-customer-user.component';
import { CustomerUserActionsComponent } from './customer-users/customer-user-actions/customer-user-actions.component';
import { CustomerUsersComponent } from './customer-users/customer-users.component';
import { UpdateCustomerUserComponent } from './customer-users/update-customer-user/update-customer-user.component';
import { SettingsManagementComponent } from './settings-management.component';
import { CreateSmartriseUserComponent } from './smartrise-users/create-smartrise-user/create-smartrise-user.component';
import { SmartriseUserActionsComponent } from './smartrise-users/smartrise-user-actions/smartrise-user-actions.component';
import { SmartriseUsersComponent } from './smartrise-users/smartrise-users.component';
import { UpdateSmartriseUserComponent } from './smartrise-users/update-smartrise-user/update-smartrise-user.component';
import { SystemSettingsComponent } from './system-settings/system-settings.component';

const routedSystemSettings = [
    SystemSettingsComponent,
];

const routedBusinessSettings = [
    BusinessSettingsComponent,
];

const routedCustomerUsersSettings = [
    CustomerUsersComponent,
    CreateCustomerUserComponent,
    UpdateCustomerUserComponent,
    CustomerUserActionsComponent,
];

const routedSmartriseUsersSettings = [
    SmartriseUsersComponent,
    CreateSmartriseUserComponent,
    UpdateSmartriseUserComponent,
    SmartriseUserActionsComponent,
];

export const routedComponents = [
    SettingsManagementComponent,

    ...routedSystemSettings,
    ...routedBusinessSettings,
    ...routedCustomerUsersSettings,
    ...routedSmartriseUsersSettings,
    CompanyInfoListComponent,
    CompanyActionInfoComponent,
    CompanyInfoComponent,
];

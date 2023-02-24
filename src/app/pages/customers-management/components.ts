import { CustomersManagementComponent } from "./customers-management.component";
import { CreateCustomerAccountComponent } from "./customers/create-customer-account/create-customer-account.component";
import { CustomerActionsComponent } from "./customers/customer-actions/customer-actions.component";
import { CustomerAdminUsersActionsComponent } from "./customers/customer-details/customer-admin-users/customer-admin-users-actions/customer-admin-users-actions.component";
import { CustomerAdminUsersComponent } from "./customers/customer-details/customer-admin-users/customer-admin-users.component";
import { UpdateCustomerUserBySmartriseComponent } from "./customers/customer-details/customer-admin-users/update-customer-user/update-customer-user.component";
import { CustomerBasicInfoComponent } from "./customers/customer-details/customer-basic-info/customer-basic-info.component";
import { CustomerDetailsComponent } from "./customers/customer-details/customer-details.component";
import { CustomersListComponent } from "./customers/customers-list.component";

export const routedComponents = [
    CustomersListComponent,
    CreateCustomerAccountComponent,
    CustomerDetailsComponent,
    CustomerActionsComponent,
    CustomerBasicInfoComponent,
    CustomerAdminUsersComponent,
    CustomerAdminUsersActionsComponent,
    CustomersManagementComponent,
    UpdateCustomerUserBySmartriseComponent,
];

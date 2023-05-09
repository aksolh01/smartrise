import { NgModule } from '@angular/core';
import { JoyrideModule } from 'ngx-joyride';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { CustomersManagementRoutingModule } from './customers-management-routing.module';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    CustomersManagementRoutingModule,
    SharedModule,
    ThemeModule,
  ],
  declarations: [
    ...routedComponents,
  ],
  providers: [
  ]
})
export class CustomersManagementModule {}

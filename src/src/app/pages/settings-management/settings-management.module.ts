import { NgModule } from '@angular/core';
import { JoyrideModule } from 'ngx-joyride';

import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { SettingsManagementRoutingModule } from './settings-management-routing.module';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    SettingsManagementRoutingModule,
    SharedModule,
    ThemeModule,
  ],
  declarations: [
    ...routedComponents,
    
  ],
})
export class SettingsManagementModule {}

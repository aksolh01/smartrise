import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { routedComponents } from './components';
import { AuditManagementRoutingModule } from './audit-management-routing.module';
import { SharedModule } from '../../_shared/shared.module';
import { JoyrideModule } from 'ngx-joyride';
import { ActivityService } from '../../services/activity.service';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    AuditManagementRoutingModule,
    SharedModule,
    ThemeModule,
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    ActivityService
  ]
})
export class AuditManagementModule {}

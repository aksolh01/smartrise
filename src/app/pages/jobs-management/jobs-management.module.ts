import { NgModule } from '@angular/core';
import { JoyrideModule } from 'ngx-joyride';

import { ThemeModule } from '../../@theme/theme.module';
import { InvoiceService } from '../../services/invoice.service';
import { JobService } from '../../services/job.service';
import { ResourceService } from '../../services/resource.service';
import { ShipmentService } from '../../services/shipment.service';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { JobsManagementRoutingModule } from './jobs-management-routing.module';
import { FillPasscodeComponent } from './jobs/fill-passcode/fill-passcode.component';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    JobsManagementRoutingModule,
    SharedModule,
    ThemeModule,
  ],
  declarations: [
    ...routedComponents,
    FillPasscodeComponent
  ],
  providers: [
    JobService,
    ShipmentService,
    InvoiceService,
    ResourceService
  ]
})
export class JobsManagementModule { }

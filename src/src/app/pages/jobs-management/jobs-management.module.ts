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
import { UploadConfigFileComponent } from './jobs/upload-config-file/upload-config-file.component';
import { JobPasscodesComponent } from './job-passcodes/job-passcodes.component';
import { PasscodeCellComponent } from './jobs/job-details/job-basiic-info/passcode-cell/passcode-cell.component';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    JobsManagementRoutingModule,
    SharedModule,
    ThemeModule,
  ],
  declarations: [
    ...routedComponents,
    FillPasscodeComponent,
    JobPasscodesComponent,
    PasscodeCellComponent
  ],
  providers: [
    JobService,
    ShipmentService,
    InvoiceService,
    ResourceService
  ]
})
export class JobsManagementModule { }

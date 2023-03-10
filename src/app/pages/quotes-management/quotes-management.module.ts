import { NgModule } from '@angular/core';
import { NbCheckboxModule } from '@nebular/theme';
import { JoyrideModule } from 'ngx-joyride';
import { LeaveGuard } from '../../@core/guards/leave.guard';

import { ThemeModule } from '../../@theme/theme.module';
import { ContactService } from '../../services/contact.service';
import { LocationService } from '../../services/location.service';
import { QuoteService } from '../../services/quote.service';
import { QuotingToolService } from '../../services/quoting-tool.service';
import { SharedModule } from '../../_shared/shared.module';
import { routedComponents } from './components';
import { QuotesManagementRoutingModule } from './quotes-management-routing.module';
import { DetailActionsBarComponent } from './quoting-tool-list/detail-actions-bar/detail-actions-bar.component';
import { JobLocationDetailsComponent } from './quoting-tool/custom-fields/quoting-job-location/job-location/job-location.component';
import { JobLocationLookupComponent } from './quoting-tool/custom-fields/quoting-job-location/job-location-lookup/job-location-lookup.component';
import { BuisnessBuilder } from './quoting-tool/business/builder/business-builder';
import { BusinessProfileService } from './quoting-tool/business/business-profile-service';
import { BusinessContext } from './quoting-tool/business/business-context';
import { QuotingToolValidationService } from '../../services/quoting-tool-validation.service';
import { QuotingInputNumberComponent } from './quoting-tool/custom-fields/quoting-input-number/quoting-input-number.component';
import { QuotingInputTextComponent } from './quoting-tool/custom-fields/quoting-input-text/quoting-input-text.component';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    QuotesManagementRoutingModule,
    ThemeModule,
    SharedModule,
    NbCheckboxModule,
  ],
  declarations: [
    ...routedComponents,
    DetailActionsBarComponent,
    JobLocationDetailsComponent,
    JobLocationLookupComponent,
    QuotingInputNumberComponent,
    QuotingInputTextComponent,
  ],
  providers: [
    QuotingToolService,
    QuotingToolValidationService,
    BusinessContext,
    BuisnessBuilder,
    BusinessProfileService,
    QuoteService,
    ContactService,
    LeaveGuard,
    LocationService
  ]
})
export class QuotesManagementModule { }

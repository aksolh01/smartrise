import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NbCardModule, NbIconModule, NbListModule, NbSpinnerModule } from '@nebular/theme';
import { JoyrideModule } from 'ngx-joyride';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeComponent } from './home.component';
import { FavoriteCustomerComponent } from './favorite-customer/favorite-customer.component';
import { RecentJobsComponent } from './recent-jobs/recent-jobs.component';
import { RecentCustomersComponent } from './recent-customers/recent-customers.component';
import { LatestUploadedFilesComponent } from './latest-uploaded-files/latest-uploaded-files.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { LatestFilesActionsComponent } from './latest-uploaded-files/latest-files-actions/latest-files-actions.component';
import { CustomerListItemComponent } from './customer-list-item/customer-list-item.component';
import { ProfileCardV3Component } from './profile-card-v3/profile-card-v3.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../_shared/shared.module';
import { LatestUploadedFilesV2Component } from './latest-uploaded-files-v2/latest-uploaded-files-v2.component';
import { LatestUploadedFilesItemComponent } from './latest-uploaded-files-v2/latest-uploaded-files-item/latest-uploaded-files-item.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JobService } from '../../services/job.service';
import { ImageService } from '../../services/image.service';
import { ResourceService } from '../../services/resource.service';

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    NbSpinnerModule,
    NgbModule,
    NbCardModule,
    NbIconModule,
    ThemeModule,
    NbListModule,
    Ng2SmartTableModule,
    TooltipModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
        data: { title: 'Dashboard', breadcrumb: { label: 'Dashboard', isDashboard: true } },
      },
    ]),
  ],
  declarations: [HomeComponent, FavoriteCustomerComponent, RecentJobsComponent,
    RecentCustomersComponent, LatestUploadedFilesComponent, LatestFilesActionsComponent,
    CustomerListItemComponent, ProfileCardV3Component, LatestUploadedFilesV2Component, LatestUploadedFilesItemComponent],
  exports: [RouterModule],
  providers: [
    JobService,
    ImageService,
    ResourceService,
  ]
})
export class HomeModule { }

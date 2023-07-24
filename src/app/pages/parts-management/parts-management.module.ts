import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartsManagementRoutingModule } from './parts-management-routing.module';
import { PartsListComponent } from './parts-list/parts-list.component';
import { PartDetailsComponent } from './part-details/part-details.component';
import { PartsManagementComponent } from './parts-management/parts-management.component';
import { PartActionsComponent } from './parts-list/part-actions/part-actions.component';
import { SharedModule } from '../../_shared/shared.module';
import { PartService, PartTabService } from '../../services/part.service';
import { JoyrideModule } from 'ngx-joyride';


@NgModule({
  declarations: [
    PartsListComponent,
    PartDetailsComponent,
    PartsManagementComponent,
    PartActionsComponent
  ],
  imports: [
    JoyrideModule.forChild(),
    CommonModule,
    SharedModule,
    PartsManagementRoutingModule
  ],
  providers: [
    PartService,
    PartTabService
  ]
})
export class PartsManagementModule { }

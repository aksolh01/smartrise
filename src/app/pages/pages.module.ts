import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { PagesRoutingModule } from './pages-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { JoyrideModule } from 'ngx-joyride';
import { MenuService } from '../services/menu.service';
import { SharedModule } from '../_shared/shared.module';
import { ImageService } from '../services/image.service';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    Ng2SmartTableModule,
    JoyrideModule.forRoot() ,
    SharedModule,
  ],
  declarations: [PagesComponent],
  providers: [
    MenuService,
    ImageService
  ]
})
export class PagesModule {}

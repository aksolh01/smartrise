import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbTabsetModule,
  NbAccordionModule, NbSelectModule, NbAutocompleteModule, NbSpinnerModule, NbDatepickerModule} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { NotFoundRoutingModule, routedComponents } from './not-found-routing.module';
import { ThemeModule } from '../../@theme/theme.module';
import { SharedModule } from '../../_shared/shared.module';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbSpinnerModule,
    NbDatepickerModule,
    ThemeModule,
    NbTabsetModule,
    NbAccordionModule,
    NotFoundRoutingModule,
    Ng2SmartTableModule,
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class NotFoundModule {}

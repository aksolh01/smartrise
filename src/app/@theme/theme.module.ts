import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import {
  NbActionsModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule,
  NbSidebarModule,
  NbUserModule,
  NbContextMenuModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbThemeModule,
  NbRadioModule,
  NbToggleModule,
  NbCardModule,
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbSecurityModule } from '@nebular/security';

import {
  FooterComponent,
  HeaderComponent,
  LayoutDirectionSwitcherComponent,
  SearchInputComponent,
  SwitcherComponent,
} from './components';
import {
  CapitalizePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
} from './pipes';
import {
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
} from './layouts';
import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';
import { MATERIAL_LIGHT_THEME } from './styles/material/theme.material-light';
import { MATERIAL_DARK_THEME } from './styles/material/theme.material-dark';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { USDatePipe } from './pipes/usa.pipe';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { RouterModule } from '@angular/router';
import { JoyrideModule } from 'ngx-joyride';
import { PortalTitleService } from '../services/portal.title.service';
import { SelectAccountComponent } from './components/select-account/select-account.component';

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule,
  NbRadioModule,
  NbToggleModule,
  NbCardModule,
];
const COMPONENTS = [
  SwitcherComponent,
  LayoutDirectionSwitcherComponent,
  HeaderComponent,
  FooterComponent,
  SearchInputComponent,
  OneColumnLayoutComponent,
  ThreeColumnsLayoutComponent,
  TwoColumnsLayoutComponent,
  SectionHeaderComponent,
];
const PIPES = [
  CapitalizePipe,
  USDatePipe,
  PluralPipe,
  RoundPipe,
  TimingPipe,
  NumberWithCommasPipe,
];

@NgModule({
  imports: [
    JoyrideModule.forChild(),
    CommonModule,
    BsDropdownModule.forRoot(),
    MatRippleModule,
    BreadcrumbModule,
    TooltipModule,
    RouterModule,
    ...NB_MODULES,
  ],
  exports: [CommonModule, MatRippleModule, ...PIPES, ...COMPONENTS],
  declarations: [...COMPONENTS, ...PIPES, SectionHeaderComponent, SelectAccountComponent],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'corporate',
          },
          [
            DEFAULT_THEME,
            COSMIC_THEME,
            CORPORATE_THEME,
            DARK_THEME,
            MATERIAL_LIGHT_THEME,
            MATERIAL_DARK_THEME,
          ],
        ).providers,
        PortalTitleService
      ],
    };
  }
}

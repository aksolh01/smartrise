/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MODAL_CONFIG_DEFAULT_OVERRIDE, ModalModule } from 'ngx-bootstrap/modal';
import {
  NbChatModule,
  NbDatepickerModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NB_DIALOG_CONFIG,
} from '@nebular/theme';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import { SharedModule } from './_shared/shared.module';
import { ErrorInterceptor } from './@core/interceptors/error.interceptor';
import { JwtInterceptor } from './@core/interceptors/jwt.interceptor';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { TokenService } from './services/token.service';
import { SettingService } from './services/setting.service';
import { AccountService } from './services/account.service';
import { TitleService } from './services/title.service';
import { MessageService } from './services/message.service';
import { PermissionService } from './services/permission.service';
import { ResponsiveService } from './services/responsive.service';
import { BaseComponentService } from './services/base-component.service';
import { CustomerService } from './services/customer.service';
import { MiscellaneousService } from './services/miscellaneous.service';
import { GuidingTourService } from './services/guiding.tour.service';
import { JobTabService } from './services/job-tabs.service';
import { RoutingService } from './services/routing.service';
import { BrowserService } from './services/browser-service';
import { PlaidService } from './services/plaid.service';
import { SelectHelperService } from './services/select-helper.service';
import { ScrollingService } from './services/scrolling.servive';
import { MultiAccountsService } from './services/multi-accounts-service';
import { AccountInfoService } from './services/account-info.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    Ng2TelInputModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDateFnsDateModule.forRoot({
      format: 'MM/dd/yyyy'
    }),
    // NbDialogModule.forChild(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    SharedModule,
    ModalModule.forRoot()
  ],
  providers: [
    AccountService,
    TokenService,
    SettingService,
    TitleService,
    MessageService,
    PermissionService,
    ResponsiveService,
    GuidingTourService,
    BrowserService,
    BaseComponentService,
    MiscellaneousService,
    MultiAccountsService,
    SelectHelperService,
    CustomerService,
    JobTabService,
    RoutingService,
    PlaidService,
    ScrollingService,
    AccountInfoService,
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    Title,
    { provide: NB_DIALOG_CONFIG, useValue: { closeOnBackdropClick: false } },
    { provide: MODAL_CONFIG_DEFAULT_OVERRIDE, useValue: { ignoreBackdropClick: true, class: 'centered', animated: true } }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}

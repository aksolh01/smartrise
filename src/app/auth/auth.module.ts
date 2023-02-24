import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbInputModule,
  NbSpinnerModule,
  NbTableModule,
  NbTabsetModule,
} from '@nebular/theme';
import { SharedModule } from '../_shared/shared.module';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AuthRoutingModule } from './auth-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { PolicyComponent } from './policy/policy.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignedinValidationComponent } from './signedin-validation/signedin-validation.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { AskForAccessComponent } from './ask-for-access/ask-for-access.component';
import { Ng2TelInputModule } from 'ng2-tel-input';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { LockAccountComponent } from './lock-account/lock-account.component';
import { IsLoggedInComponent } from './is-logged-in/is-logged-in.component';
import { SuccessfulPaymentComponent } from './successful-payment/successful-payment.component';
import { FailedPaymentComponent } from './failed-payment/failed-payment.component';
import { ImageService } from '../services/image.service';
import { LogoutComponent } from './logout/logout.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    ConfirmComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    PolicyComponent,
    SignedinValidationComponent,
    UnauthorizedComponent,
    ProfileComponent,
    AskForAccessComponent,
    VerificationCodeComponent,
    LockAccountComponent,
    IsLoggedInComponent,
    SuccessfulPaymentComponent,
    FailedPaymentComponent,
    LogoutComponent,
  ],
  imports: [
    CommonModule,
    NbAlertModule,
    NbButtonModule,
    NbTabsetModule,
    NbCheckboxModule,
    NbInputModule,
    NbTableModule,
    NbCardModule,
    NbSpinnerModule,
    Ng2TelInputModule,
    AuthRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule
  ],
  exports: [FormsModule, ReactiveFormsModule],
  providers: [
    ImageService
  ]
})
export class AuthModule {
}

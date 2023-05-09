import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent } from '@nebular/auth';
import { AuthGuard } from '../@core/guards/auth.guard';
import { PreventLoggedInNavigateGuard } from '../@core/guards/prevent-login-navigate.guard';
import { PolicyComponent } from './policy/policy.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignedinValidationComponent } from './signedin-validation/signedin-validation.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { AskForAccessComponent } from './ask-for-access/ask-for-access.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';
import { VerificationCodeGuard } from '../@core/guards/verification-code.gaurd';
import { LockAccountComponent } from './lock-account/lock-account.component';
import { PreventImpersonateGuard } from '../@core/guards/prevent-impersonate.guard';
import { IsLoggedInComponent } from './is-logged-in/is-logged-in.component';
import { PreventLoggedOutNavigateGuard } from '../@core/guards/prevent-logout-navigate.guard';
import { SuccessfulPaymentComponent } from './successful-payment/successful-payment.component';
import { FailedPaymentComponent } from './failed-payment/failed-payment.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  // .. here goes our components routes,
  {
    path: '',
    component: NbAuthComponent, // <---
    children: [
      {
        path: '',
        component: AuthLayoutComponent, // <---
        children: [
          {
            path: 'login',
            component: LoginComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Login' }
          },
          {
            path: 'logout',
            component: LogoutComponent, // <---
            canActivate: [PreventLoggedOutNavigateGuard],
            data: { title: 'Logout' }
          },
          {
            path: 'verification-code',
            component: VerificationCodeComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard, VerificationCodeGuard],
            data: { title: 'Two-Factor Authentication' }
          },
          {
            path: 'lock-account',
            component: LockAccountComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Lock Account' }
          },
          {
            path: 'confirm',
            component: ConfirmComponent, // <---,
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Confirm' }
          },
          {
            path: 'resetpassword',
            component: ResetPasswordComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Reset Password' }
          },
          {
            path: 'changepassword',
            component: ChangePasswordComponent, // <---
            canActivate: [AuthGuard],
            data: { title: 'Change Password' }
          },
          {
            path: 'forgotpassword',
            component: ForgotPasswordComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Forgot Password' }
          },
          {
            path: 'askforaccess',
            component: AskForAccessComponent, // <---
            canActivate: [PreventLoggedInNavigateGuard],
            data: { title: 'Request Access' }
          },
          // {
          //   path: 'profile',
          //   component: ProfileComponent, // <---
          //   canActivate: [AuthGuard, PreventImpersonateGuard],
          //   data: { title: 'Profile' }
          // },
          {
            path: 'policy',
            component: PolicyComponent,
            data: { title: 'Privacy Policy' }
          },
          {
            path: 'signedin-validation',
            component: SignedinValidationComponent, // <---
          },
          {
            path: 'is-logged-in',
            component: IsLoggedInComponent, // <---
            canActivate: [PreventLoggedOutNavigateGuard],
            data: { title: 'Access Denied' }
          },
          {
            path: 'unauthorized',
            component: UnauthorizedComponent, // <---
            data: { title: 'Access Denied' }
          },
          {
            path: 'successful-payment',
            component: SuccessfulPaymentComponent,
            data: { title: 'Successful Payment', breadcrumb: { label: 'Payment Successful' } },
          },
          {
            path: 'failed-payment',
            component: FailedPaymentComponent,
            data: { title: 'Failed Payment', breadcrumb: { label: 'Failed Successful' } },
          },
          {
            path: '', redirectTo: 'login', pathMatch: 'full'
          },
        ],
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../@core/guards/auth.guard';
import { PermissionGuard } from '../@core/guards/permission.guard';
import { PreventImpersonateGuard } from '../@core/guards/prevent-impersonate.guard';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from '../auth/profile/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivateChild: [PermissionGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'jobs-management',
        loadChildren: () => import('./jobs-management/jobs-management.module').then((m) => m.JobsManagementModule),
        data: { breadcrumb: { label: 'Jobs Management', skip: true } },
      },
      {
        path: 'quotes-management',
        loadChildren: () => import('./quotes-management/quotes-management.module').then((m) => m.QuotesManagementModule),
        data: { breadcrumb: { label: 'Quotes Management', skip: 'true' } },
      },
      {
        path: 'customers-management',
        loadChildren: () =>
          import('./customers-management/customers-management.module').then((m) => m.CustomersManagementModule),
        data: { breadcrumb: { label: 'Customers Management', skip: 'true' } },
      },
      {
        path: 'settings-management',
        loadChildren: () =>
          import('./settings-management/settings-management.module').then((m) => m.SettingsManagementModule),
        data: { breadcrumb: { label: 'Settings Management', skip: 'true' } },
      },
      {
        path: 'audit-management',
        loadChildren: () =>
          import('./audit-management/audit-management.module').then((m) => m.AuditManagementModule),
        data: { breadcrumb: { label: 'Audit Management', skip: 'true' } },
      },
      {
        path: 'parts-management',
        loadChildren: () =>
          import('./parts-management/parts-management.module').then((m) => m.PartsManagementModule),
        data: { breadcrumb: { label: 'Parts Management', skip: 'true' } },
      },
      // {
      //   path: 'support-management',
      //   loadChildren: () =>
      //     import('./support-management/support-management.module').then((m) => m.SupportManagementModule),
      //   data: { breadcrumb: { label: 'Support Management', skip: 'true' } },
      // },
      {
        path: 'predictive-maintenance',
        loadChildren: () =>
          import('./predictive-maintenance/predictive-maintenance.module').then((m) => m.PredictiveMaintenanceModule),
        data: { breadcrumb: { label: 'Predictive Maintenance', skip: 'true' } },
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('./not-found/not-found.module').then((m) => m.NotFoundModule),
        data: { breadcrumb: { label: 'Not Found' } },
      },
      {
        path: 'billing',
        loadChildren: () => import('./billing/billing.module').then((m) => m.BillingModule),
        data: { breadcrumb: { label: 'Online Payment', skip: 'true' } },
      },
      {
        path: 'account-users-management',
        loadChildren: () => import('./account-users-management/account-users-management.module').then((m) => m.AccountUsersManagementModule),
        data: { breadcrumb: { label: 'Account Users', skip: 'true' } },
      },
      {
        path: 'edit-profile',
        component: ProfileComponent, // <---
        canActivate: [AuthGuard, PreventImpersonateGuard],
        data: { title: 'Profile' }
      },
      
      {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }

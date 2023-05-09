import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { AlertsListComponent } from './alerts-list/alerts-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { AlertsSettingsComponent } from './alerts-settings/alerts-settings.component';
import { PartsReviewComponent } from './parts-review/parts-review.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { NotificationLogsComponent } from './notification-logs/notification-logs.component';
import { ElevatorMapComponent } from './elevator-map/elevator-map.component';

const routes: Routes = [
    {
        path: 'alert-settings',
        component: AlertsSettingsComponent,
        data: { breadcrumb: { label: 'Alerts Settings' } }
    },
    {
        path: 'parts-review',
        component: PartsReviewComponent,
        data: { breadcrumb: { label: 'Parts' } }
    },
    {
        path: 'jobs-list',
        component: JobsListComponent,
        data: { breadcrumb: { label: 'Jobs' }  }
    },
    {
        path: 'alerts-list',
        component: AlertsListComponent,
        data: { breadcrumb: { label: 'Alerts' }  },
    },
    {
        path: 'predictions',
        component: PredictionsComponent,
        data: { breadcrumb: { label: 'Predictions' }  }
    },
    {
        path: 'alerts-details',
        component: AlertDetailsComponent,
        data: { breadcrumb: { label: 'Alert Details' } }
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        data: { breadcrumb: { label: 'Dashboard ' } }
    },
    {
        path: 'notification-settings',
        component: NotificationSettingsComponent,
        data: { breadcrumb: { label: 'Notification Settings' } }
    },
    {
        path: 'notification-setting',
        component: NotificationSettingComponent,
        data: { breadcrumb: { label: 'Notification Setting' } }
    },
    {
        path: 'notification-logs',
        component: NotificationLogsComponent,
        data: { breadcrumb: { label: 'Notification Logs' } }
    },
    {
        path: 'elevator-map',
        component: ElevatorMapComponent,
        data: { breadcrumb: { label: 'Elevator Map' } }
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PredictiveMaintenanceRoutingModule { }

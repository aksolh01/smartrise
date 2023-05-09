import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbAccordionModule,
  NbAutocompleteModule,
  NbCardModule,
  NbDatepickerModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTreeGridModule
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AlertsSettingsComponent } from './alerts-settings/alerts-settings.component';
import { PredictiveMaintenanceRoutingModule } from './predictive-maintenance-routing.module';
import { MapSeverityComponent } from './map-severity/map-severity.component';
import { SharedModule } from '../../_shared/shared.module';
import { AlertsSettingsActionsComponent } from './alerts-settings/alerts-settings-actions/alerts-settings-actions.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { PartsReviewComponent } from './parts-review/parts-review.component';
import { PartsReviewActionsComponent } from './parts-review/parts-review-actions/parts-review-actions.component';
import { ActualFaultsCountHistoryComponent } from './actual-faults-count-history/actual-faults-count-history.component';
import { JobsListComponent } from './jobs-list/jobs-list.component';
import { JobsListActionsComponent } from './jobs-list/jobs-list-actions/jobs-list-actions.component';
import { FaultsViewComponent } from './jobs-list/faults-view/faults-view.component';
import { AlertsViewComponent } from './jobs-list/alerts-view/alerts-view.component';
import { AlarmsViewComponent } from './jobs-list/alarms-view/alarms-view.component';
import { PredictionsComponent } from './predictions/predictions.component';
import { AlertsListComponent } from './alerts-list/alerts-list.component';
import { AlertsListActionsComponent } from './alerts-list/alerts-list-actions/alerts-list-actions.component';
import { AlertDetailsComponent } from './alert-details/alert-details.component';
import { AlertDetailsSingleComponent } from './alert-details-single/alert-details-single.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlertsPerJobPieChartComponent } from './dashboard/alerts-per-job-pie-chart/alerts-per-job-pie-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AlertsVersusTimeLineChartComponent } from './dashboard/alerts-versus-time-line-chart/alerts-versus-time-line-chart.component';
import { UsaJobsMapComponent } from './dashboard/usa-jobs-map/usa-jobs-map.component';
import { IndexCardComponent } from './dashboard/index-card/index-card.component';
import { AlertsPerPartTypePieChartComponent } from './dashboard/alerts-per-parttype-pie-chart/alerts-per-parttype-pie-chart.component';
import { LastActiveAlertsComponent } from './dashboard/last-active-alerts/last-active-alerts.component';
import { AlertSettingComponent } from './alert-setting/alert-setting.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { NotificationSettingsComponent } from './notification-settings/notification-settings.component';
import { NotificationSettingsActionsComponent } from './notification-settings/notification-settings-actions/notification-settings-actions.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { ElevatorAreaDetailsComponent } from './elevator-map/elevator-area-details/elevator-area-details.component';
import { ElevatorMapComponent } from './elevator-map/elevator-map.component';
import { NotificationLogsComponent } from './notification-logs/notification-logs.component';
import { IndexCardsComponent } from './dashboard/index-cards/index-cards.component';
import { LegendComponent } from './dashboard/usa-jobs-map/legend/legend.component';
import { AlertDetailsTemplateComponent } from './alert-details-template/alert-details-template.component';
import { JobService } from '../../services/job.service';
import { NotificationService } from '../../services/notification.service';
import { PartsService } from '../../services/parts.service';
import { PredictiveMaintenanceService } from '../../services/predictiveMaintenanceService';
import { AlertService } from '../../services/alert.service';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbSpinnerModule,
    NbDatepickerModule,
    NbAccordionModule,
    PredictiveMaintenanceRoutingModule,
    Ng2SmartTableModule,
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
    GoogleMapsModule,
    SharedModule,
    CommonModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'AIzaSyA32mlUv4O09SpU9WPnHJ9IBeIBg5fSRcI'
    // })
  ],
  declarations: [
    AlertsSettingsComponent,
    MapSeverityComponent,
    AlertsSettingsActionsComponent,
    PartsReviewComponent,
    PartsReviewActionsComponent,
    ActualFaultsCountHistoryComponent,
    JobsListComponent,
    JobsListActionsComponent,
    FaultsViewComponent,
    AlertsViewComponent,
    AlarmsViewComponent,
    PredictionsComponent,
    AlertsListComponent,
    AlertsListActionsComponent,
    AlertDetailsComponent,
    AlertDetailsSingleComponent,
    DashboardComponent,
    AlertsPerJobPieChartComponent,
    AlertsVersusTimeLineChartComponent,
    UsaJobsMapComponent,
    LegendComponent,
    IndexCardComponent,
    AlertsPerPartTypePieChartComponent,
    LastActiveAlertsComponent,
    AlertSettingComponent,
    NotificationSettingsComponent,
    NotificationSettingsActionsComponent,
    NotificationSettingComponent,
    NotificationLogsComponent,
    ElevatorMapComponent,
    ElevatorAreaDetailsComponent,
    IndexCardsComponent,
    AlertDetailsTemplateComponent,
  ],
  providers: [
    JobService,
    NotificationService,
    PartsService,
    PredictiveMaintenanceService,
    AlertService,
  ]
})
export class PredictiveMaintenanceModule { }

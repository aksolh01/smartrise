import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditManagementComponent } from './audit-management.component';
import { ViewUserActivitiesComponent } from './view-user-activities/view-user-activities.component';

const routes: Routes = [
    {
        path: '',
        component: AuditManagementComponent,
        data: { title: 'AuditManagement' },
        children: [
            {
                path: 'user-activities',
                data: { breadcrumb: { label: 'User Activities' } },
                children: [
                    {
                        path: '',
                        component: ViewUserActivitiesComponent,
                        data: { title: 'User Activities' },
                    }
                ]
            },
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuditManagementRoutingModule { }
